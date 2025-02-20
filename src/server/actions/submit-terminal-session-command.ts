"use server"

import { and, eq, isNull } from "drizzle-orm"
import { db } from "../db"
import { terminalSessions } from "../db/schema"
import { ensureAuth } from "../auth"
import { getProblemSlugFromId } from "../utils/problem"
import { insertTerminalSessionLog } from "../db/queries"
import type { getTerminalSession } from "./get-terminal-session"
import { containerManagerExec } from "../utils/container-manager"

export async function submitTerminalSessionCommand({
  sessionId,
  command,
}: {
  sessionId: number
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

  const container_name = `easyshell-${problemSlug}-${terminalSession[0].testcaseId}-${sessionId}`
  console.log("container_name", container_name)

  const startedAt = new Date()
  const { stdout, stderr } = await containerManagerExec({
    containerName: container_name,
    command,
  })
  const finishedAt = new Date()

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
