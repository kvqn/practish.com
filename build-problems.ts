import { buildProblem, getProblems } from "@/server/utils/problem"
import { checkProblems } from "check-problems"
import { rm } from "fs/promises"

await checkProblems()

const WORKING_DIR = ".practish"
const PROBLEMS_DIR = "src/app/problems/(problems)"

await rm(WORKING_DIR, { recursive: true, force: true })

const problems = await getProblems()

for (const problem of problems) {
  await buildProblem(problem)
}
