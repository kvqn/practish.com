"use server"

import { eq } from "drizzle-orm"
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

  const testcases = await db
    .select({
      id: submissionTestcaseQueue.testcaseId,
      status: submissionTestcaseQueue.status,
      passed: submission_testcases.passed,
    })
    .from(submissionTestcaseQueue)
    .leftJoin(
      submission_testcases,
      eq(submissionTestcaseQueue.testcaseId, submission_testcases.testcaseId),
    )
    .where(eq(submissionTestcaseQueue.submissionId, submission.id))

  return {
    submission,
    testcases,
  }
}
