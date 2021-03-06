import React from "react"
import { Theme } from "@watheia/pwa.ui.theme.theme-provider"
import { ThemedText, themedText } from "./themed-text"

export const ThemedTextExample = () => (
  <Theme>
    <ThemedText>text</ThemedText>
  </Theme>
)

export const UsingThemedTextClassName = () => (
  <Theme>
    <span className={themedText}>text</span>
  </Theme>
)
