"use server"

import { and, desc, eq, sql } from "drizzle-orm"
import { db } from "../db"
import { ensureAuth } from "../auth"
import { submission_testcases, submissions } from "../db/schema"

export async function getPastSubmissions({ problemId }: { problemId: number }) {
  const { id: userId } = await ensureAuth()

  const past_submissions = await db
    .select({
      id: submissions.id,
      userId: submissions.userId,
      problemId: submissions.problemId,
      passed_testcases: sql<number>`cast(sum(${submission_testcases.passed}) as int)`,
      attempted_testcases: sql<number>`cast(count(${submission_testcases.id}) as int)`,
    })
    .from(submissions)
    .innerJoin(
      submission_testcases,
      eq(submissions.id, submission_testcases.id),
    )
    .where(
      and(eq(submissions.problemId, problemId), eq(submissions.userId, userId)),
    )
    .groupBy(submissions.id)
    .orderBy(desc(submissions.id))

  return past_submissions
}
