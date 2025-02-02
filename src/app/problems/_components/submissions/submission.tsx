"use client"

import { getSubmissionInfo } from "@/server/actions/get-submission-info"
import { useEffect, useState } from "react"

export function Submission({ submissionId }: { submissionId: number }) {
  const [info, setInfo] = useState<Awaited<
    ReturnType<typeof getSubmissionInfo>
  > | null>(null)

  useEffect(() => {
    void (async () => {
      const info = await getSubmissionInfo({ submissionId })
      setInfo(info)
    })()
  }, [submissionId])

  if (!info) return <div>loading</div>

  return <div>{JSON.stringify(info)}</div>
}
