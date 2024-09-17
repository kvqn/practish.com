import { Button } from "@/components/ui/button"
import { getServerUser } from "@/server/auth"
import Link from "next/link"

function Logo() {
  return (
    <div className="text-2xl">
      <span className="font-bold">practi</span>
      <span className="font-bold text-green-500">sh</span>
    </div>
  )
}

export function Navbar() {
  return (
    <div className="py-2 px-4 flex">
      <Logo />
      <div className="ml-auto">
        <User />
      </div>
    </div>
  )
}

async function User() {
  const user = await getServerUser()
  if (user)
    return (
      <div>
        {user.name}
      </div>
    )

  return (
    <Link href="/login">
      <Button>
        Login

      </Button>
    </Link>
  )

}
