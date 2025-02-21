"use client"

import { PastSubmissions } from "./past-submissions"
import { Submission } from "./submission"
import { useSubmissionsContext } from "./submissions-context"
import { SubmitPrompt } from "./submit-prompt"

export function Submissions() {
  const { selectedSubmissionId } = useSubmissionsContext()
  if (!selectedSubmissionId)
    return (
      <div className="flex h-full flex-col gap-4">
        <SubmitPrompt />
        <PastSubmissions />
      </div>
    )

  if (selectedSubmissionId)
    return <Submission submissionId={selectedSubmissionId} />
}
