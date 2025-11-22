import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 ease-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:scale-[1.02] active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-[#008CE2] text-[#F4F7F5] shadow-lg shadow-[#008CE2]/20 hover:bg-[#06B9D0] hover:shadow-xl hover:shadow-[#06B9D0]/30",
        destructive:
          "bg-[#EF4444] text-[#F4F7F5] shadow-lg shadow-[#EF4444]/20 hover:bg-[#DC2626] hover:shadow-xl hover:shadow-[#EF4444]/30",
        outline:
          "border border-[#1F2329] bg-[#0F1113] text-[#F4F7F5] shadow-xs hover:bg-[#1A1D21] hover:border-[#008CE2]",
        secondary:
          "bg-[#1A1D21] text-[#F4F7F5] shadow-xs hover:bg-[#1F2329]",
        ghost:
          "text-[#F4F7F5] hover:bg-[#1A1D21] hover:text-[#06B9D0]",
        link: "text-[#008CE2] underline-offset-4 hover:underline hover:text-[#06B9D0]",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
