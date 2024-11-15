import { ReactLenis } from 'lenis/react'

const ValhallaSmoothScroll = ({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof ReactLenis>) => {
  return (
    <ReactLenis root options={{ autoRaf: true, duration: 0.5 }} {...props}>
      {children}
    </ReactLenis>
  )
}

export { ValhallaSmoothScroll }
