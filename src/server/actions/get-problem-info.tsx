"use server"

import { getProblemInfo as _getProblemInfo } from "../utils/problem"

export async function getProblemInfo(slug: string) {
  const info = await _getProblemInfo(slug)
  return {
    slug: info.slug,
    title: info.title,
    tags: info.tags,
    testcases: info.testcases,
  }
}
