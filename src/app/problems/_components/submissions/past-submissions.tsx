"use client"
import { useEffect, useState } from "react"
import { getPastSubmissions } from "@/server/actions/get-past-submissions"
import { useProblem } from "../problem-context"
import { useSubmissionsContext } from "./submissions-context"
import { cn } from "@/lib/utils"
import { FaXmark, FaCheck } from "react-icons/fa6"
import { ImSpinner3 } from "react-icons/im"
import moment from "moment"

export function PastSubmissions() {
  const { id: problemId } = useProblem()
  const [pastSubmissions, setPastSubmissions] = useState<
    Awaited<ReturnType<typeof getPastSubmissions>>
  >([])
  const { setSelectedSubmissionId } = useSubmissionsContext()

  useEffect(() => {
    void (async () => {
      const past_submissions = await getPastSubmissions({ problemId })
      console.log(past_submissions)
      setPastSubmissions(past_submissions)
    })()
  }, [problemId])

  return (
    <div className="flex flex-col gap-4 p-4">
      <h3 className="text-center font-semibold">Past Submissions</h3>
      {pastSubmissions.map((submission, idx) => (
        <button
          key={submission.id}
          onClick={() => setSelectedSubmissionId(submission.id)}
          className={cn(
            "flex items-center gap-2 rounded border p-2 transition-colors",
            {
              "border-gray-500 bg-gray-200 text-gray-800 hover:bg-gray-300":
                submission.status === "running",
              "border-green-500 bg-green-200 text-green-800 hover:bg-green-300":
                submission.status === "passed",
              "border-red-500 bg-red-200 text-red-800 hover:bg-red-300":
                submission.status === "failed",
            },
          )}
        >
          {submission.status === "passed" ? (
            <FaCheck />
          ) : submission.status === "failed" ? (
            <FaXmark />
          ) : (
            <ImSpinner3 className="animate-spin" />
          )}
          <p>Attempt #{pastSubmissions.length - idx}</p>
          <p className="flex-grow text-right">
            {moment(submission.submittedAt).fromNow()}
          </p>
        </button>
      ))}
    </div>
  )
}
