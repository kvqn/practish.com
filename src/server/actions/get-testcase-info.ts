"use server"

import { db } from "@/server/db"
import { submission_testcases } from "../db/schema"
import { and, eq } from "drizzle-orm"

export async function getTestcaseInfo({
  submissionId,
  testcaseId,
}: {
  submissionId: number
  testcaseId: number
}) {
  return await db
    .select()
    .from(submission_testcases)
    .where(
      and(
        eq(submission_testcases.submissionId, submissionId),
        eq(submission_testcases.testcaseId, testcaseId),
      ),
    )
    .limit(1)
}
