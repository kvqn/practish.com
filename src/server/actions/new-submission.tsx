"use server"

import { ensureAuth } from "../auth"
import { db } from "../db"
import { submissions, submissionTestcaseQueue } from "../db/schema"
import { getProblemInfo, getProblemSlugFromId } from "../utils/problem"

export async function newSubmission({
  problemId,
  input,
}: {
  problemId: number
  input: string
}) {
  const user = await ensureAuth()
  const problemSlug = await getProblemSlugFromId(problemId)
  if (!problemSlug) {
    throw new Error("Problem not found")
  }

  const submissionId = (
    await db
      .insert(submissions)
      .values({
        problemId: problemId,
        userId: user.id,
      })
      .returning({ id: submissions.id })
  )[0]?.id

  if (!submissionId) {
    throw new Error("Failed to create submission")
  }

  const problem = await getProblemInfo(problemSlug)
  // TODO: parallelize this
  for (const testcase of problem.testcases) {
    await db.insert(submissionTestcaseQueue).values({
      submissionId: submissionId,
      testcaseId: testcase.id,
      input: input,
      status: "pending",
    })
  }

  return {
    submissionId: submissionId,
  }
}
