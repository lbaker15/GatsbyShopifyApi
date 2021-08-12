import * as React from "react"
import { SkipNavContent, SkipNavLink } from "./skip-nav"
import { Header } from "./header"
import { Footer } from "./footer"
import { Seo } from "./seo"

export function Layout({ children }) {
  return (
    <div>

      <SkipNavContent>{children}</SkipNavContent>

    </div>
  )
}
