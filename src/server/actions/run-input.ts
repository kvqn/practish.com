"use server"

import { createTempFile } from "../utils/temp-file"
import { $ } from "execa"

export async function runInput(input: string) {
  const filePath = await createTempFile(input)
  try {
    console.log("running shit")
    const resp = await $`docker run --rm -v ${filePath}:/app/input.sh test`
    console.log("success", resp)
    return {
      status: "success" as const,
    }
  } catch (error) {
    console.log("error", error)
    return {
      status: "error" as const,
    }
  }
}
