import React from "react"
import { EvaIconFont } from "@watheia/pwa.ui.theme.icon-font"
import { ThemeDocumenter, ThemeDocumenterProps } from "@watheia/pwa.ui.theme.theme-context"

const ICON_MOON_VERSION = "mxd7i0"

export type ThemeCompositionsProps = {} & ThemeDocumenterProps

export const ThemeCompositions = ({ children, ...rest }: ThemeCompositionsProps) => {
  return (
    <ThemeDocumenter {...rest}>
      <EvaIconFont query={ICON_MOON_VERSION} />
      {children}
    </ThemeDocumenter>
  )
}
