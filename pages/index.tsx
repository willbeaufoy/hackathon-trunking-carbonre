import { useUser } from "reactfire"

export default function Home() {
  const {data: user} = useUser();

  return (
    <main>
      {user?.email && (<>Hello {user.email}</>)}
      <h1>Home</h1>
    </main>
  )
}