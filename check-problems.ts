import { getProblemInfo, getProblems } from "@/server/utils/problem"

export async function checkProblems() {
  const problems = await getProblems()

  for (const problem of problems) {
    await getProblemInfo(problem)
  }

  console.log("Problems seem good.")
}

await checkProblems()
