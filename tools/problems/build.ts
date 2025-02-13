import { dockerBuild } from "@/server/utils/docker"
import { getProblemInfo, getProblems } from "@/server/utils/problem"
import { checkProblems } from "./lint"
import { writeFile } from "fs/promises"
import { cp } from "fs/promises"
import { mkdir } from "fs/promises"
import { rm } from "fs/promises"

await checkProblems()

const WORKING_DIR = ".easyshell"
const PROBLEMS_DIR = "src/app/problems/(problems)"

await rm(WORKING_DIR, { recursive: true, force: true })

await dockerBuild({
  tag: "easyshell-base",
  dir: "tools/problems/easyshell-base",
})

const problems = await getProblems()

for (const problem of problems) {
  const info = await getProblemInfo(problem)
  for (const testcase of info.testcases) {
    const tag = `easyshell-${problem}-${testcase.id}`
    await mkdir(`.easyshell/images/${tag}`, {
      recursive: true,
    })

    await cp(
      `./problems/${problem}/testcases/${testcase.folder}`,
      `.easyshell/images/${tag}/home`,
      {
        recursive: true,
      },
    )

    await writeFile(
      `.easyshell/images/${tag}/Dockerfile`,
      `
FROM easyshell-base
COPY home /home

ENTRYPOINT ["/input.sh"]
`,
    )

    await dockerBuild({
      tag: tag,
      dir: `.easyshell/images/${tag}`,
    })
  }
}
