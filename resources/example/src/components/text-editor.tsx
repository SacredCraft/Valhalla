import { useRef } from 'react'

import { ResourceRealtimeMonacoEditor } from '@valhalla/design-system/components/collaboration/monaco-realtime'
import { Room } from '@valhalla/design-system/components/collaboration/room'

export default function TextEditor() {
  const ref = useRef<{ getValue: () => string | undefined }>({
    getValue: () => undefined,
  })
  return (
    <Room>
      <ResourceRealtimeMonacoEditor ref={ref} />
    </Room>
  )
}
