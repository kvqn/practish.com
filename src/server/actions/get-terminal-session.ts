"use server"

import { ensureAuth } from "../auth"
import { getTerminalSession as _getTerminalSession } from "../utils/problem"

export async function getTerminalSession({
  problemId,
  testcaseId,
}: {
  problemId: number
  testcaseId: number
}) {
  const user = await ensureAuth()

  const session = await _getTerminalSession({
    userId: user.id,
    problemId,
    testcaseId,
  })
  return session
}
