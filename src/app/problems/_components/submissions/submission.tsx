"use client"

import { Button } from "@/components/ui/button"
import { getSubmissionInfo } from "@/server/actions/get-submission-info"
import { useEffect, useState } from "react"
import { useSubmissionsContext } from "./submissions-context"
import { IoIosArrowBack } from "react-icons/io"
import { cn, sleep } from "@/lib/utils"

export function Submission({ submissionId }: { submissionId: number }) {
  const [info, setInfo] = useState<Awaited<
    ReturnType<typeof getSubmissionInfo>
  > | null>(null)

  const { setSelectedSubmissionId } = useSubmissionsContext()

  useEffect(() => {
    void (async () => {
      while (true) {
        const info = await getSubmissionInfo({ submissionId })
        setInfo(info)

        let fetchAgain = false
        for (const testcase of info.testcases) {
          if (testcase.status === "pending" || testcase.status === "running") {
            fetchAgain = true
            break
          }
        }
        if (!fetchAgain) break
        await sleep(1000)
      }
    })()
  }, [submissionId])

  if (!info) return <div>loading</div>

  return (
    <div>
      <h2 className="mt-4 text-center text-xl font-bold">
        Attempt #{info.submission.attempt}
      </h2>
      <Button
        variant="secondary"
        onClick={() => setSelectedSubmissionId(null)}
        className="flex items-center gap-2 pl-2"
      >
        <IoIosArrowBack className="m-0 p-0 text-xl" />
        <p>Back</p>
      </Button>
      <div className="flex flex-wrap justify-center gap-4 p-8">
        {info.testcases.map((testcase) => (
          <div
            key={testcase.id}
            className={cn("rounded-xl border px-8 py-4 transition-colors", {
              "border-gray-500 bg-gray-200 hover:bg-gray-300":
                testcase.status === "pending" || testcase.status === "running",
              "border-red-500 bg-red-200 hover:bg-red-300":
                testcase.status === "finished" && !testcase.passed,
              "border-green-500 bg-green-200 hover:bg-green-300":
                testcase.status === "finished" && testcase.passed,
            })}
          >
            <p className="font-semibold">Testcase #{testcase.id}</p>
            <p>
              {testcase.status === "pending"
                ? "Pending"
                : testcase.status === "running"
                  ? "Running"
                  : testcase.passed
                    ? "Passed"
                    : "Failed"}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
