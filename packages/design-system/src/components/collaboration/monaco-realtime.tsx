'use client'

import { useCallback, useEffect, useState } from 'react'
import { EditorProps } from '@monaco-editor/react'
import type { editor } from 'monaco-editor'
import { MonacoBinding } from 'y-monaco'

import { TextEditor } from '@valhalla/design-system/components/layout/text-editor'
import { useResourceContent } from '@valhalla/design-system/resources/providers/resource-content-provider'
import { useResourceCore } from '@valhalla/design-system/resources/providers/resource-core-provider'

import { SaveButton } from '../layout/save-button'
import { MonacoAwareness } from './monaco-awareness'
import { useRoom } from './room'

export const ResourceRealtimeMonacoEditor = ({
  ref,
  ...editorProps
}: EditorProps & {
  ref: React.RefObject<{ getValue: () => string | undefined }>
}) => {
  const {
    resourceContent: { data: resourceContent, isLoading },
  } = useResourceContent() as {
    resourceContent: { data: string; isLoading: boolean }
  }

  if (isLoading) {
    return null
  }

  return <Inner ref={ref} content={resourceContent} {...editorProps} />
}

export const Inner = ({
  ref,
  content,
  ...editorProps
}: EditorProps & {
  content: string
  ref: React.RefObject<{ getValue: () => string | undefined }>
}) => {
  const { filePath, setIsModified } = useResourceCore()
  const [editorRef, setEditorRef] = useState<editor.IStandaloneCodeEditor>()
  const [mounted, setMounted] = useState(false)
  const [contentInitialed, setContentInitialed] = useState(false)
  const [currentContent, setCurrentContent] = useState(content)

  const { provider, user } = useRoom()

  useEffect(() => {
    setContentInitialed(false)
    setCurrentContent(content)
  }, [filePath, content])

  const handleOnMount = useCallback((e: editor.IStandaloneCodeEditor) => {
    setEditorRef(e)
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (provider && !contentInitialed) {
      const handleSync = () => {
        const type = provider.document.getText('monaco')
        if (type.length > 0) {
          type.delete(0, type.length)
        }
        if (currentContent) {
          type.insert(0, currentContent)
        }
        setContentInitialed(true)
      }

      provider.on('synced', handleSync)
      return () => {
        provider.off('synced', handleSync)
      }
    }
  }, [provider, currentContent, contentInitialed])

  useEffect(() => {
    if (mounted && editorRef && provider) {
      const ydoc = provider.document
      const awareness = provider.awareness
      const type = ydoc.getText('monaco')

      let binding: MonacoBinding | undefined
      if (typeof window !== 'undefined') {
        binding = new MonacoBinding(
          type,
          editorRef.getModel()!,
          new Set([editorRef]),
          awareness
        )
      }

      return () => {
        ydoc?.destroy()
        binding?.destroy()
        awareness?.destroy()
      }
    }
  }, [editorRef, provider, mounted, setIsModified, content])

  useEffect(() => {
    if (ref && ref.current && editorRef) {
      ref.current.getValue = () => editorRef.getValue()
    }
  }, [ref, editorRef])

  return (
    <>
      {contentInitialed && (
        <TextEditor
          ref={ref}
          loading={false}
          path={filePath}
          onMount={handleOnMount}
          value={currentContent}
          onChange={(value) => {
            setCurrentContent(value ?? '')
          }}
          {...editorProps}
        />
      )}
      {!contentInitialed && (
        <div className="flex items-center justify-center h-[calc(100vh-6rem)]">
          Loading...
        </div>
      )}
      <MonacoAwareness
        provider={provider}
        username={user.name}
        avatar={user.image ?? null}
      />
      <SaveButton cache={currentContent} />
    </>
  )
}
