import * as React from "react"
import "@/styles/input.css"

function Input({ type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className="r2552esf25_252trewt3er"
      {...props}
    />
  )
}

export { Input }