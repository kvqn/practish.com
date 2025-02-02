"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { newSubmission } from "@/server/actions/new-submission"
import { useState } from "react"
import { useProblem } from "../problem-context"
import { useSubmissionsContext } from "./submissions-context"

export function SubmitPrompt() {
  const [input, setInput] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const { id: problemId } = useProblem()
  const { setSelectedSubmissionId } = useSubmissionsContext()

  async function handleSubmit() {
    setSubmitting(true)
    const resp = await newSubmission({
      problemId,
      input,
    })
    setSelectedSubmissionId(resp.submissionId)
    setSubmitting(false)
  }

  return (
    <div className="flex">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={submitting}
      />
      <Button disabled={submitting} onClick={handleSubmit}>
        Submit
      </Button>
    </div>
  )
}
