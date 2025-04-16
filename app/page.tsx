import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import LandingPage from "@/components/landing-page"

export default async function Home() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    redirect("/dashboard")
  }

  return <LandingPage />
}
