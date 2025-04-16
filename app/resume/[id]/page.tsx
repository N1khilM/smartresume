import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import ResumeEditor from "@/components/resume-editor"

export default async function ResumePage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Fetch resume data
  const { data: resume } = await supabase
    .from("resumes")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", session.user.id)
    .single()

  if (!resume) {
    redirect("/dashboard")
  }

  return <ResumeEditor resume={resume} user={session.user} />
}
