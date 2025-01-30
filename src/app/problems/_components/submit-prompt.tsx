"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { newSubmission } from "@/server/actions/new-submission"
import { useState } from "react"
import { useProblem } from "./problem-context"

export function SubmitPrompt() {
  const [input, setInput] = useState("")
  const [disabled, setDisabled] = useState(false)
  const { id: problemId } = useProblem()

  async function handleSubmit() {
    setDisabled(true)
    const resp = await newSubmission({
      problemId,
      input,
    })
  }

  return (
    <div className="flex">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={disabled}
      />
      <Button disabled={disabled}>Submit</Button>
    </div>
  )
}
