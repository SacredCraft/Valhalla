export const ValhallaFooter = () => {
  return (
    <footer className="container mt-16 border-t py-6">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} valhalla. All rights reserved.
        </div>
        <nav className="flex items-center gap-6">
          <a
            href="/about"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            About
          </a>
          <a
            href="/privacy"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Privacy Policy
          </a>
          <a
            href="/terms"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Terms of Service
          </a>
          <a
            href="/contact"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Contact
          </a>
        </nav>
      </div>
    </footer>
  )
}
