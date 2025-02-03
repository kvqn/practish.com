"use server"

import { and, eq, lte } from "drizzle-orm"
import { db } from "../db"
import {
  submission_testcases,
  submissions,
  submissionTestcaseQueue,
} from "../db/schema"

export async function getSubmissionInfo({
  submissionId,
}: {
  submissionId: number
}) {
  const submission = (
    await db
      .select()
      .from(submissions)
      .where(eq(submissions.id, submissionId))
      .limit(1)
  )[0]

  if (!submission) throw new Error("Submission not found")

  const attempt_number = await db.$count(
    submissions,
    and(
      eq(submissions.userId, submission.userId),
      eq(submissions.problemId, submission.problemId),
      lte(submissions.id, submission.id),
    ),
  )

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
        eq(submissionTestcaseQueue.testcaseId, submission_testcases.testcaseId),
        eq(
          submissionTestcaseQueue.submissionId,
          submission_testcases.submissionId,
        ),
      ),
    )
    .where(eq(submissionTestcaseQueue.submissionId, submission.id))

  return {
    submission: {
      ...submission,
      attempt: attempt_number,
    },
    testcases,
  }
}
