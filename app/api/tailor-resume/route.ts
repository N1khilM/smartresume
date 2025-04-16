import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    // Check authentication
    const supabase = createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Parse request body
    const { resume, jobDescription } = await request.json()

    if (!resume || !jobDescription) {
      return NextResponse.json({ message: "Resume and job description are required" }, { status: 400 })
    }

    // Process with OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert resume tailoring assistant. Your task is to tailor the provided resume to better match the job description. 
          Focus on highlighting relevant skills and experiences, using keywords from the job description, and maintaining a professional tone. 
          Do not fabricate experiences or skills. Format the resume professionally and ensure it is ATS-friendly.`,
        },
        {
          role: "user",
          content: `Here is my resume:
          
          ${resume}
          
          Here is the job description:
          
          ${jobDescription}
          
          Please tailor my resume to better match this job description.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    const tailoredResume = completion.choices[0]?.message?.content || ""

    return NextResponse.json({ tailoredResume })
  } catch (error: any) {
    console.error("Error in tailor-resume API:", error)
    return NextResponse.json(
      { message: error.message || "An error occurred while processing the resume" },
      { status: 500 },
    )
  }
}
