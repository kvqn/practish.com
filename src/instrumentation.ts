import { mkdir } from "fs/promises"

export async function register() {
  await mkdir(".practish/inputs", { recursive: true })
}
