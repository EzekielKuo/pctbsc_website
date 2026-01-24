import * as React from "react"
import { Button as MuiButton, ButtonProps as MuiButtonProps } from "@mui/material"

type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
type ButtonSize = "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg"

interface ButtonProps extends Omit<MuiButtonProps, "variant" | "size"> {
  variant?: ButtonVariant
  size?: ButtonSize
  asChild?: boolean
}

const variantMap: Record<ButtonVariant, MuiButtonProps["variant"]> = {
  default: "contained",
  destructive: "contained",
  outline: "outlined",
  secondary: "contained",
  ghost: "text",
  link: "text",
}

const sizeMap: Record<ButtonSize, "small" | "medium" | "large"> = {
  default: "medium",
  sm: "small",
  lg: "large",
  icon: "medium",
  "icon-sm": "small",
  "icon-lg": "large",
}

function Button({
  variant = "default",
  size = "default",
  asChild = false,
  sx,
  ...props
}: ButtonProps) {
  const muiVariant = variantMap[variant] || "contained"
  const muiSize = sizeMap[size] || "medium"

  const buttonSx = React.useMemo(() => {
    const baseSx: Record<string, unknown> = {
      ...sx,
    }

    // 處理 variant 特定的樣式
    if (variant === "destructive") {
      baseSx.bgcolor = "error.main"
      baseSx["&:hover"] = {
        ...baseSx["&:hover"],
        bgcolor: "error.dark",
      }
    }

    if (variant === "link") {
      baseSx.textDecoration = "underline"
      baseSx.textUnderlineOffset = "4px"
    }

    // 處理 icon 尺寸
    if (size === "icon") {
      baseSx.minWidth = "36px"
      baseSx.width = "36px"
      baseSx.height = "36px"
      baseSx.padding = 0
    } else if (size === "icon-sm") {
      baseSx.minWidth = "32px"
      baseSx.width = "32px"
      baseSx.height = "32px"
      baseSx.padding = 0
    } else if (size === "icon-lg") {
      baseSx.minWidth = "40px"
      baseSx.width = "40px"
      baseSx.height = "40px"
      baseSx.padding = 0
    }

    return baseSx
  }, [variant, size, sx])

  if (asChild && React.isValidElement(props.children)) {
    return React.cloneElement(props.children as React.ReactElement, {
      ...props,
      variant: muiVariant,
      size: muiSize,
      sx: buttonSx,
    })
  }

  return (
    <MuiButton
      variant={muiVariant}
      size={muiSize}
      sx={buttonSx}
      {...props}
    />
  )
}

export { Button }
