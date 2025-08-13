import * as React from "react"
import "@/styles/input.css"

function Input({ type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className="resize-none r2552esf25_252trewt3er border-[#8888881A] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[#0099ff54] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content w-full rounded-md border bg-transparent px-3 py-2 text-base transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
      {...props}
    />
  )
}

export { Input }