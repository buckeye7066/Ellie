import * as React from "react"
import { cn } from "../../lib/utils"

const Badge = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "bg-purple-100 text-purple-800 hover:bg-purple-200",
    secondary: "bg-pink-100 text-pink-800 hover:bg-pink-200",
    destructive: "bg-red-100 text-red-800 hover:bg-red-200",
    outline: "text-foreground border border-purple-300",
  }

  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  )
})
Badge.displayName = "Badge"

export { Badge }
