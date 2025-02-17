import type { ProblemConfig } from "@/server/utils/problem"
import { readFile } from "fs/promises"

const SLUG = "move-and-rename"

async function testcaseConfig({
  id,
  isPublic,
}: {
  id: number
  isPublic: boolean
}) {
  return {
    id: id,
    folder: `${id}`,
    public: isPublic,
    expected_fs: {
      "index.html": (
        await readFile(`./problems/${SLUG}/testcases/${id}/index.htlm`)
      ).toString(),
    },
  }
}

const config: ProblemConfig = {
  id: 5,
  slug: SLUG,
  title: "Move And Rename",
  description: `Sometimes, files end up in the wrong place with the wrong name.`,
  tags: ["Basics"],
  capture_stdout: false,
  capture_stderr: false,
  capture_exit_code: false,
  capture_fs: true,
  testcases: [await testcaseConfig({ id: 1, isPublic: true })],
}

export default config
