import { useSession } from "next-auth/react"

export function useUser() {
  const { data: session } = useSession()
  return session?.user
}
