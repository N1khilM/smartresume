export async function processResume(resume: string, jobDescription: string): Promise<string> {
  try {
    const response = await fetch("/api/tailor-resume", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resume,
        jobDescription,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to process resume")
    }

    const data = await response.json()
    return data.tailoredResume
  } catch (error: any) {
    console.error("Error processing resume:", error)
    throw new Error(error.message || "An error occurred while processing your resume")
  }
}
