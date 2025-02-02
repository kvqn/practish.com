"use client"
import { useEffect, useState } from "react"
import { getPastSubmissions } from "@/server/actions/get-past-submissions"
import { useProblem } from "../problem-context"
import { useSubmissionsContext } from "./submissions-context"

export function PastSubmissions() {
  const { id: problemId } = useProblem()
  const [pastSubmissions, setPastSubmissions] = useState<
    Awaited<ReturnType<typeof getPastSubmissions>>
  >([])
  const { setSelectedSubmissionId } = useSubmissionsContext()

  useEffect(() => {
    void (async () => {
      setPastSubmissions(await getPastSubmissions({ problemId }))
    })()
  }, [problemId])

  return (
    <div>
      {pastSubmissions.map((submission) => (
        <div
          key={submission.id}
          onClick={() => setSelectedSubmissionId(submission.id)}
        >
          {submission.id} - {submission.status}
        </div>
      ))}
    </div>
  )
}
