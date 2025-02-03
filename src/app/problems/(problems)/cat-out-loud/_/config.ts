import type { ProblemConfig } from "@/server/utils/problem"

const config: ProblemConfig = {
  id: 2,
  slug: "cat-out-loud",
  title: "Read a File",
  description: `Bring the contents of any file right into your terminal view. No GUIs allowed! 🖥️`,
  tags: ["Basics"],
  capture_stdout: true,
  capture_stderr: false,
  capture_exit_code: false,
  capture_fs: false,
  successLogic: async ({ stdout, fs }) => {
    if (!fs) throw new Error("fs not captured")
    const expected = fs["notes.txt"]
    return stdout === expected
  },
  testcases: [
    { id: 1, folder: "1", public: true },
    { id: 2, folder: "2", public: true },
    { id: 3, folder: "3", public: false },
  ],
}

export default config
