import { mkdir } from "fs/promises"

export async function register() {
  await mkdir(".easyshell/inputs", { recursive: true })
  await mkdir(".easyshell/outputs", { recursive: true })
}
