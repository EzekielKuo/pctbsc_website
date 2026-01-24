import * as React from "react"
import { TextField, TextFieldProps } from "@mui/material"

function Input({ sx, ...props }: TextFieldProps) {
  return (
    <TextField
      size="small"
      sx={{
        "& .MuiOutlinedInput-root": {
          height: "36px",
          "& fieldset": {
            borderWidth: 1,
          },
          "&:hover fieldset": {
            borderWidth: 1,
          },
          "&.Mui-focused fieldset": {
            borderWidth: 2,
          },
        },
        ...sx,
      }}
      {...props}
    />
  )
}

export { Input }
