import { useSession } from "next-auth/react"

// TODO: remove this
export function useUser() {
  const { data: session } = useSession()
  return session?.user
}
