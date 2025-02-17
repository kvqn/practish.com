import type { ProblemConfig } from "@/server/utils/problem"
import { readFile } from "fs/promises"

const SLUG = "move-that-file"

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
      "datadir/payload.json": (
        await readFile(`./problems/${SLUG}/testcases/${id}/payload.json`)
      ).toString(),
    },
  }
}

const config: ProblemConfig = {
  id: 4,
  slug: "move-that-file",
  title: "Move That File",
  description: `Move a file from one location to another—because sometimes, things just need to be somewhere else. 🚀`,
  tags: ["Basics"],
  capture_stdout: false,
  capture_stderr: false,
  capture_exit_code: false,
  capture_fs: true,
  testcases: [
    await testcaseConfig({ id: 1, isPublic: true }),

    await testcaseConfig({ id: 2, isPublic: false }),
  ],
}

export default config
