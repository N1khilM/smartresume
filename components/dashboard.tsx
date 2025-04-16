"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { formatDistanceToNow } from "date-fns"
import { Loader2, FileText, Plus, LogOut } from "lucide-react"
import { processResume } from "@/utils/resume-processor"

interface Resume {
  id: string
  title: string
  original_resume: string
  job_description: string
  tailored_resume: string
  created_at: string
}

export default function Dashboard({
  user,
  savedResumes,
}: {
  user: User
  savedResumes: Resume[]
}) {
  const [activeTab, setActiveTab] = useState("create")
  const [title, setTitle] = useState("")
  const [originalResume, setOriginalResume] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [tailoredResume, setTailoredResume] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const handleProcessResume = async () => {
    if (!originalResume || !jobDescription) {
      toast({
        title: "Missing information",
        description: "Please provide both your resume and the job description.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    try {
      const result = await processResume(originalResume, jobDescription)
      setTailoredResume(result)
      toast({
        title: "Resume processed",
        description: "Your resume has been tailored to the job description.",
      })
    } catch (error: any) {
      toast({
        title: "Processing failed",
        description: error.message || "An error occurred while processing your resume.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSaveResume = async () => {
    if (!title || !originalResume || !jobDescription || !tailoredResume) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields and process your resume before saving.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      const { data, error } = await supabase
        .from("resumes")
        .insert({
          user_id: user.id,
          title,
          original_resume: originalResume,
          job_description: jobDescription,
          tailored_resume: tailoredResume,
        })
        .select()

      if (error) throw error

      toast({
        title: "Resume saved",
        description: "Your tailored resume has been saved successfully.",
      })

      router.refresh()
      setActiveTab("saved")
    } catch (error: any) {
      toast({
        title: "Save failed",
        description: error.message || "An error occurred while saving your resume.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">SmartResume Dashboard</h1>
        <Button variant="outline" onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Create New Resume</TabsTrigger>
          <TabsTrigger value="saved">Saved Resumes ({savedResumes.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create a Tailored Resume</CardTitle>
              <CardDescription>Enter your resume and the job description to create a tailored version.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Resume Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Software Engineer - Company XYZ"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="original-resume">Your Resume</Label>
                  <Textarea
                    id="original-resume"
                    value={originalResume}
                    onChange={(e) => setOriginalResume(e.target.value)}
                    placeholder="Paste your current resume here..."
                    className="min-h-[300px]"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="job-description">Job Description</Label>
                  <Textarea
                    id="job-description"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description here..."
                    className="min-h-[300px]"
                    required
                  />
                </div>
              </div>
              <Button
                onClick={handleProcessResume}
                disabled={isProcessing || !originalResume || !jobDescription}
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Tailor Resume with AI"
                )}
              </Button>

              {tailoredResume && (
                <div className="space-y-2 mt-4">
                  <Label htmlFor="tailored-resume">Tailored Resume</Label>
                  <Textarea
                    id="tailored-resume"
                    value={tailoredResume}
                    onChange={(e) => setTailoredResume(e.target.value)}
                    className="min-h-[300px]"
                  />
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveResume} disabled={isSaving || !tailoredResume} className="w-full">
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Resume"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="saved" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedResumes.length > 0 ? (
              savedResumes.map((resume) => (
                <Card key={resume.id}>
                  <CardHeader>
                    <CardTitle className="truncate">{resume.title}</CardTitle>
                    <CardDescription>
                      Created {formatDistanceToNow(new Date(resume.created_at), { addSuffix: true })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 line-clamp-3">{resume.tailored_resume.substring(0, 150)}...</p>
                  </CardContent>
                  <CardFooter>
                    <Link href={`/resume/${resume.id}`} className="w-full">
                      <Button variant="outline" className="w-full">
                        <FileText className="mr-2 h-4 w-4" />
                        View & Edit
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <Card className="col-span-full">
                <CardHeader>
                  <CardTitle>No saved resumes</CardTitle>
                  <CardDescription>You haven&apos;t created any tailored resumes yet.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => setActiveTab("create")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create your first resume
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
