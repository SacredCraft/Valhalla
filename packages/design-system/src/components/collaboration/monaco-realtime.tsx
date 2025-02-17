'use client'

import { useCallback, useEffect, useState } from 'react'
import { EditorProps } from '@monaco-editor/react'
import type { editor } from 'monaco-editor'
import { MonacoBinding } from 'y-monaco'

import { TextEditor } from '@valhalla/design-system/components/layout/text-editor'
import { useResourceContent } from '@valhalla/design-system/resources/providers/resource-content-provider'
import { useResourceCore } from '@valhalla/design-system/resources/providers/resource-core-provider'

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
  const { filePath } = useResourceCore()
  const [cache, setCache] = useState<string | undefined>(content)
  const [editorRef, setEditorRef] = useState<editor.IStandaloneCodeEditor>()
  const [mounted, setMounted] = useState(false)
  const [contentInitialed, setContentInitialed] = useState(false)

  const { provider, user } = useRoom()

  useEffect(() => {
    setContentInitialed(false)
    setCache(content)
  }, [filePath, content])

  const handleOnMount = useCallback((e: editor.IStandaloneCodeEditor) => {
    setEditorRef(e)
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (provider && !contentInitialed) {
      provider.on('synced', () => {
        setContentInitialed(true)
        const type = provider.document.getText('monaco')
        if (type.length > 0) {
          type.delete(0, type.length)
        }
        if (cache) {
          type.insert(0, cache)
        }
      })
    }
  }, [provider, cache, contentInitialed])

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
  }, [editorRef, provider, mounted])

  return (
    <>
      {contentInitialed && (
        <TextEditor
          ref={ref}
          loading={false}
          path={filePath}
          onMount={handleOnMount}
          onChange={(value) => setCache(value)}
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
    </>
  )
}
