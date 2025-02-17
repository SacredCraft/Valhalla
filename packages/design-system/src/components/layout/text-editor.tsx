import { useImperativeHandle, useRef, useState } from 'react'
import { Editor, EditorProps, OnChange, OnMount } from '@monaco-editor/react'
import { editor } from 'monaco-editor'

import { useIsMobile } from '@valhalla/design-system/hooks/use-mobile'
import { useTheme } from '@valhalla/design-system/hooks/use-theme'
import { useResourceContent } from '@valhalla/design-system/resources/providers/resource-content-provider'
import { useResourceCore } from '@valhalla/design-system/resources/providers/resource-core-provider'

export function TextEditor({
  ref,
  onChange,
  ...editorProps
}: {
  ref: React.RefObject<{ getValue: () => string | undefined }>
} & EditorProps) {
  const { fileName, setIsModified } = useResourceCore()
  const {
    resourceContent: { data: resourceContent, isLoading },
  } = useResourceContent({
    encoding: 'utf-8',
  }) as {
    resourceContent: { data: string | undefined | null; isLoading: boolean }
  }

  if (isLoading) return null

  return (
    <MonacoEditor
      ref={ref}
      defaultValue={resourceContent?.toString()}
      fileName={fileName}
      onChange={(value, ev) => {
        setIsModified(true)
        onChange?.(value, ev)
      }}
      {...editorProps}
    />
  )
}

export const MonacoEditor = ({
  ref,
  defaultValue,
  fileName,
  onChange,
}: {
  ref: React.RefObject<{ getValue: () => string | undefined }>
  defaultValue: string | undefined
  fileName: string
  onChange?: OnChange
}) => {
  const [code, setCode] = useState<string | undefined>(defaultValue)
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const isMobile = useIsMobile()
  const { resolvedTheme } = useTheme()

  const editorOptions = {
    fontFamily: 'JetBrains Mono',
    fontWeight: '500',
    wordWrap: 'on',
    minimap: {
      enabled: isMobile ? true : false,
    },
  } as editor.IStandaloneEditorConstructionOptions

  const onMount: OnMount = (editor) => {
    editorRef.current = editor
    editorRef.current?.focus()
  }

  useImperativeHandle(ref, () => ({
    getValue: () => editorRef.current?.getValue(),
  }))

  return (
    <Editor
      height="calc(100svh - 84px)"
      path={fileName}
      theme={resolvedTheme === 'dark' ? 'vs-dark' : 'light'}
      onMount={onMount}
      value={code}
      onChange={(value, ev) => {
        setCode(value)
        onChange?.(value, ev)
      }}
      options={editorOptions}
    />
  )
}
