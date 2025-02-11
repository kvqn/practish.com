"use server"

import { and, eq, isNull } from "drizzle-orm"
import { db } from "../db"
import { terminalSessions } from "../db/schema"
import { ensureAuth } from "../auth"
import { getProblemSlugFromId } from "../utils/problem"
import { z } from "zod"
import { insertTerminalSessionLog } from "../db/queries"
import type { getTerminalSession } from "./get-terminal-session"

const ContainerIoResponseSchema = z.object({
  stdout: z.string(),
  stderr: z.string(),
})

export async function submitTerminalSessionCommand({
  sessionId,
  command,
}: {
  sessionId: string
  command: string
}): Promise<Awaited<ReturnType<typeof getTerminalSession>>["logs"][0]> {
  const user = await ensureAuth()

  const terminalSession = await db
    .select()
    .from(terminalSessions)
    .where(
      and(
        eq(terminalSessions.id, sessionId),
        eq(terminalSessions.userId, user.id),
        isNull(terminalSessions.deletedAt),
      ),
    )
    .limit(1)
  if (!terminalSession[0]) {
    throw new Error("Session not found")
  }

  const problemSlug = await getProblemSlugFromId(terminalSession[0].problemId)
  if (!problemSlug) {
    throw new Error("Problem not found")
  }

  const container_name = `practish-${problemSlug}-${terminalSession[0].testcaseId}-${sessionId}`
  console.log("container_name", container_name)

  const startedAt = new Date()
  const resp = await fetch(`http://localhost:4000/${container_name}`, {
    method: "POST",
    body: command,
  })
  const finishedAt = new Date()

  const { stdout, stderr } = ContainerIoResponseSchema.parse(await resp.json())

  const logId = await insertTerminalSessionLog({
    sessionId,
    stdin: command,
    stdout,
    stderr,
    startedAt,
    finishedAt,
  })

  return { id: logId, stdin: command, stdout, stderr, startedAt, finishedAt }
}
