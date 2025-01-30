"use server"

import { ensureAuth } from "../auth"
import { db } from "../db"
import { submission_testcases, submissions } from "../db/schema"
import { dockerRunSubmission } from "../utils/docker"
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
      .$returningId()
  )[0]?.id

  if (!submissionId) {
    throw new Error("Failed to create submission")
  }

  const problem = await getProblemInfo(problemSlug)

  for (const testcase of problem.testcases) {
    const createdAt = new Date()
    const output = await dockerRunSubmission({
      submissionId,
      problemSlug,
      testcaseId: testcase.id,
      input,
    })
    const finishedAt = new Date()

    const passed = problem.successLogic({
      stdout: output.stdout,
      stderr: output.stderr,
      exit_code: output.exit_code,
    })

    await db.insert(submission_testcases).values({
      submissionId,
      input,
      testcaseId: testcase.id,
      stdout: output.stdout,
      stderr: output.stderr,
      exitCode: output.exit_code,
      fsZipBase64: output.fs_zip_base64,
      createdAt,
      finishedAt,
      passed,
    })
  }

  return {
    submissionId: submissionId,
  }
}
