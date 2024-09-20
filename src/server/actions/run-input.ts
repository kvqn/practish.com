"use server"

import { createTempFile } from "../utils/temp-file"
import { $, ExecaError } from "execa"

export async function runInput(input: string, slug: string) {
  const filePath = await createTempFile(input)
  try {
    console.log("running shit")
    const resp =
      await $`docker run --rm -v ${filePath}:/app/input.sh practish-run-${slug}`
    console.log("success", resp)
    return {
      status: "success" as const,
    }
  } catch (error) {
    console.log("error", error)
    if (error instanceof ExecaError) {
      return {
        status: "error" as const,
        message: error.stdout,
      }
    }
    return {
      status: "error" as const,
    }
  }
}
