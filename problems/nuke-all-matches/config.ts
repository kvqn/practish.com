import { getFs } from "@/server/utils/paths"
import type { FsType, ProblemConfig } from "@/server/utils/problem"

const SLUG = "nuke-all-matches"

async function testcaseConfig({
  id,
  isPublic,
}: {
  id: number
  isPublic: boolean
}) {
  const originalFs = await getFs(`./problems/${SLUG}/testcases/${id}`)
  const newFs: FsType = {}
  for (const file in originalFs) {
    if (!file.endsWith(".log")) {
      newFs[file] = originalFs[file]!
    }
  }

  return {
    id: id,
    folder: `${id}`,
    public: isPublic,
    expected_fs: newFs,
  }
}

const config: ProblemConfig = {
  id: 9,
  slug: SLUG,
  title: "Nuke All Matches",
  description: `Some files are just junk, and they’re everywhere! Find them all and wipe them out. 💥`,
  tags: ["Basics"],
  capture_stdout: false,
  capture_stderr: false,
  capture_exit_code: false,
  capture_fs: true,
  testcases: [
    await testcaseConfig({ id: 1, isPublic: true }),
    await testcaseConfig({ id: 2, isPublic: true }),
    await testcaseConfig({ id: 3, isPublic: false }),
  ],
}

export default config
