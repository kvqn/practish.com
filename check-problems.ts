import { readdir } from "fs/promises"
import { problemConfig } from "@/server/utils/problem-config"

const BASE_DIR = "./src/app/problems/(problems)"
const problems = await readdir(BASE_DIR)

for (const problem of problems) {
  await problemConfig(problem)
}

console.log("Problems seem good.")
