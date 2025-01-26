"use client"

import { getProblemInfo } from "@/server/actions/get-problem-info"
import { createContext, useContext, useEffect, useState } from "react"

export const ProblemContext = createContext<{
  slug: string
  title: string
  tags: string[]
  testcases: number
} | null>(null)

export function useProblem() {
  const problem = useContext(ProblemContext)
  if (!problem) throw new Error("useProblem must be used within ProblemContext")
  return problem
}

export function ProblemProvider({
  children,
  slug,
}: {
  children: React.ReactNode
  slug: string
}) {
  const [problem, setProblem] = useState<{
    slug: string
    title: string
    tags: string[]
    testcases: number
  } | null>(null)

  useEffect(() => {
    void (async () => {
      const info = await getProblemInfo(slug)
      setProblem(info)
    })()
  }, [slug])

  if (!problem) return <div>loading</div>

  return (
    <ProblemContext.Provider value={problem}>
      {children}
    </ProblemContext.Provider>
  )
}
