"use client"

import * as React from "react"
import { FormLabel, FormLabelProps } from "@mui/material"

function Label({ sx, ...props }: FormLabelProps) {
  return (
    <FormLabel
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        fontSize: "0.875rem",
        lineHeight: 1,
        fontWeight: 500,
        userSelect: "none",
        ...sx,
      }}
      {...props}
    />
  )
}

export { Label }
