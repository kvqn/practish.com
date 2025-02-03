"use server"

import { and, desc, eq, sql } from "drizzle-orm"
import { db } from "../db"
import { ensureAuth } from "../auth"
import {
  submission_testcases,
  submissions,
  submissionTestcaseQueue,
} from "../db/schema"

export async function getPastSubmissions({ problemId }: { problemId: number }) {
  const { id: userId } = await ensureAuth()

  // TODO: optimize these queries

  const past_submissions = await Promise.all(
    (
      await db
        .select({
          id: submissions.id,
          submittedAt: submissions.submittedAt,
        })
        .from(submissions)
        .where(
          and(
            eq(submissions.problemId, problemId),
            eq(submissions.userId, userId),
          ),
        )
        .orderBy(desc(submissions.submittedAt))
    ).map(async (submission) => {
      const testcases = await db
        .select({
          id: submissionTestcaseQueue.testcaseId,
          status: submissionTestcaseQueue.status,
          passed: submission_testcases.passed,
        })
        .from(submissionTestcaseQueue)
        .leftJoin(
          submission_testcases,
          and(
            eq(
              submissionTestcaseQueue.submissionId,
              submission_testcases.submissionId,
            ),
            eq(
              submissionTestcaseQueue.testcaseId,
              submission_testcases.testcaseId,
            ),
          ),
        )
        .where(eq(submissionTestcaseQueue.submissionId, submission.id))

      let running = false
      for (const testcase of testcases) {
        if (testcase.passed === null) {
          running = true
          break
        }
      }

      let passed

      if (!running) {
        passed = true
        for (const testcase of testcases) {
          if (!testcase.passed) {
            passed = false
            break
          }
        }
      }

      const resp = {
        ...submission,
        status: running
          ? ("running" as const)
          : passed
            ? ("passed" as const)
            : ("failed" as const),
      }

      return resp
    }),
  )

  /*
{
  id: number,
  status: "passed" | "failed" | "pending",
  }
  */

  console.log("past_submissions", past_submissions)
  return past_submissions
}
