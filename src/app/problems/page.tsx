"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { runInput } from "@/server/actions/run-input"
import { useState } from "react"
import { toast } from "sonner"

export default function Page() {
  const [input, setInput] = useState("")
  return (
    <div>
      <Input
        placeholder="Enter your script"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <Button
        onClick={async () => {
          const resp = await runInput(input)
          if (resp.status == "success") {
            toast.success("success")
          } else {
            toast.error("error")
          }
        }}
      >
        Run
      </Button>
    </div>
  )
}
