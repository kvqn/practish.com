import type { ProblemConfig } from "@/server/utils/problem"

const config: ProblemConfig = {
  id: 1,
  slug: "hello-world",
  title: "Hello World",
  tags: ["hello", "world"],
  capture_stdout: true,
  capture_stderr: false,
  capture_exit_code: false,
  capture_fs: false,
  successLogic: ({ stdout }) => stdout === "Hello, World!\n",
  testcases: [
    { id: 1, folder: "1", public: true },
    { id: 2, folder: "2", public: true },
    { id: 3, folder: "3", public: false },
  ],
}

export default config
