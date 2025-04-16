import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import Dashboard from "@/components/dashboard"

export default async function DashboardPage() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Fetch saved resumes
  const { data: savedResumes } = await supabase
    .from("resumes")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })

  return <Dashboard user={session.user} savedResumes={savedResumes || []} />
}
