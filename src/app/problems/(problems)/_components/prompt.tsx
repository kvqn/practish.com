"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { runInput } from "@/server/actions/run-input"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

export function Prompt() {
  const pathname = usePathname()
  const parts = pathname.split("/")
  if (parts.length === 0) throw new Error("unexpected pathname")
  const slug = parts[parts.length - 1]
  if (!slug) throw new Error("unexpected pathname")

  const [input, setInput] = useState("")
  const [running, setRunning] = useState(false)
  const [response, setResponse] = useState<ResponseType | null>(null)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Input
          placeholder={slug}
          className="font-geist-mono"
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
          }}
        />
        <Button
          onClick={async () => {
            setRunning(true)
            const resp = await runInput(input, slug)
            setResponse(resp)
            if (resp.status === "success") {
              toast.success("Success")
            } else {
              toast.error("Error")
            }
            setRunning(false)
          }}
          disabled={running}
        >
          {running ? "Running" : "Run"}
        </Button>
      </div>
      {response && (
        <div className="rounded-xl border-2 border-neutral-400 bg-neutral-200 p-2 font-geist-mono text-neutral-500">
          <RenderResponse response={response} />
        </div>
      )}
    </div>
  )
}

type ResponseType =
  | { status: "success" }
  | { status: "error"; message?: string }
function RenderResponse({ response }: { response: ResponseType }) {
  if (response.status === "success") {
    return <div>Success</div>
  }
  if (!response.message) {
    return <div>Error</div>
  }
  return <div>Error: {response.message}</div>
}
