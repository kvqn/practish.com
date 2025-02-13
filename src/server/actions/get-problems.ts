"use server"

import { getProblems as _getProblems } from "@/server/utils/problem"

export async function getProblems() {
  return await _getProblems()
}
