export const Shortcut = ({ children }: { children: React.ReactNode }) => {
  return (
    <span className="inline-flex size-4 items-center justify-center rounded-sm bg-muted text-xs text-muted-foreground">
      {children}
    </span>
  )
}

export const ShortcutGroup = ({ children }: { children: React.ReactNode }) => {
  if (typeof children === 'string') {
    const parts = children.split('')
    return (
      <span className="inline-flex items-center gap-0.5">
        {parts.map((part) => (
          <Shortcut key={part}>{part}</Shortcut>
        ))}
      </span>
    )
  }

  return <Shortcut>{children}</Shortcut>
}
