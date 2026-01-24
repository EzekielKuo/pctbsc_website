import * as React from "react"
import {
  Card as MuiCard,
  CardContent as MuiCardContent,
  CardHeader as MuiCardHeader,
  Typography,
  Box,
  CardProps,
  CardContentProps,
  CardHeaderProps,
} from "@mui/material"

function Card({ sx, ...props }: CardProps) {
  return (
    <MuiCard
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        borderRadius: 2,
        py: 3,
        ...sx,
      }}
      {...props}
    />
  )
}

function CardHeader({ sx, ...props }: CardHeaderProps) {
  return (
    <MuiCardHeader
      sx={{
        display: "grid",
        gridTemplateRows: "auto auto",
        alignItems: "start",
        gap: 1,
        px: 3,
        ...sx,
      }}
      {...props}
    />
  )
}

function CardTitle({ sx, ...props }: React.ComponentProps<typeof Typography>) {
  return (
    <Typography
      variant="h6"
      component="div"
      sx={{
        lineHeight: 1,
        fontWeight: 600,
        ...sx,
      }}
      {...props}
    />
  )
}

function CardDescription({ sx, ...props }: React.ComponentProps<typeof Typography>) {
  return (
    <Typography
      variant="body2"
      component="div"
      sx={{
        color: "text.secondary",
        ...sx,
      }}
      {...props}
    />
  )
}

function CardAction({ sx, ...props }: React.ComponentProps<typeof Box>) {
  return (
    <Box
      sx={{
        gridColumnStart: 2,
        gridRow: "1 / span 2",
        alignSelf: "start",
        justifySelf: "end",
        ...sx,
      }}
      {...props}
    />
  )
}

function CardContent({ sx, ...props }: CardContentProps) {
  return (
    <MuiCardContent
      sx={{
        px: 3,
        ...sx,
      }}
      {...props}
    />
  )
}

function CardFooter({ sx, ...props }: React.ComponentProps<typeof Box>) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        px: 3,
        ...sx,
      }}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
