"use client"

import { createContext, useContext, useState } from "react"

const SubmissionsContext = createContext<{
  selectedSubmissionId: number | null
  setSelectedSubmissionId: (id: number | null) => void
} | null>(null)

export function useSubmissionsContext() {
  const ctx = useContext(SubmissionsContext)
  if (!ctx) {
    throw new Error(
      "useSubmissionsContext must be used within a SubmissionsProvider",
    )
  }
  return ctx
}

export function SubmissionsContextProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<
    number | null
  >(null)
  return (
    <SubmissionsContext.Provider
      value={{
        selectedSubmissionId,
        setSelectedSubmissionId,
      }}
    >
      {children}
    </SubmissionsContext.Provider>
  )
}
