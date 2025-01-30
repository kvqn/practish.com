"use client"
import { useEffect, useState } from "react"
import { getPastSubmissions } from "@/server/actions/get-past-submissions"
import { useProblem } from "./problem-context"

export function PastSubmissions() {
  const { id: problemId } = useProblem()
  const [pastSubmissions, setPastSubmissions] = useState<
    Awaited<ReturnType<typeof getPastSubmissions>>
  >([])

  useEffect(() => {
    void (async () => {
      setPastSubmissions(await getPastSubmissions({ problemId }))
    })()
  }, [problemId])

  return <div>{JSON.stringify(pastSubmissions)}</div>
}
