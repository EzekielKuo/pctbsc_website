"use client"

import * as React from "react"
import { Checkbox as MuiCheckbox, CheckboxProps } from "@mui/material"
import { CheckIcon } from "lucide-react"

function Checkbox({ sx, ...props }: CheckboxProps) {
  return (
    <MuiCheckbox
      sx={{
        padding: 0.5,
        "& .MuiSvgIcon-root": {
          fontSize: 16,
        },
        ...sx,
      }}
      checkedIcon={<CheckIcon style={{ width: "14px", height: "14px" }} />}
      {...props}
    />
  )
}

export { Checkbox }
