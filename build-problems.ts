import { dockerBuild } from "@/server/utils/docker"
import {
  buildProblem,
  getProblemInfo,
  getProblems,
} from "@/server/utils/problem"
import { checkProblems } from "check-problems"
import { writeFile } from "fs/promises"
import { cp } from "fs/promises"
import { mkdir } from "fs/promises"
import { rm } from "fs/promises"

await checkProblems()

const WORKING_DIR = ".practish"
const PROBLEMS_DIR = "src/app/problems/(problems)"

await rm(WORKING_DIR, { recursive: true, force: true })

await dockerBuild({
  tag: "practish-base",
  dir: "tools/practish-base",
})

const problems = await getProblems()

for (const problem of problems) {
  const info = await getProblemInfo(problem)
  for (const testcase of info.testcases) {
    const tag = `practish-${problem}-${testcase.id}`
    await mkdir(`.practish/images/${tag}`, {
      recursive: true,
    })

    await cp(
      `./src/app/problems/(problems)/${problem}/_/testcases/${testcase.folder}`,
      `.practish/images/${tag}/home`,
      {
        recursive: true,
      },
    )

    await writeFile(
      `.practish/images/${tag}/Dockerfile`,
      `
FROM practish-base
COPY home /home

ENTRYPOINT ["/input.sh"]
`,
    )

    await dockerBuild({
      tag: tag,
      dir: `.practish/images/${tag}`,
    })
  }
}
