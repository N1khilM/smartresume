import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link href="/" className="flex items-center justify-center">
          <span className="font-bold text-xl">SmartResume</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/login" className="text-sm font-medium hover:underline underline-offset-4">
            Login
          </Link>
          <Link href="/signup" className="text-sm font-medium hover:underline underline-offset-4">
            Sign Up
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Tailor Your Resume with AI
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  SmartResume helps you customize your resume for each job application using AI, increasing your chances
                  of landing interviews.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/signup">
                  <Button size="lg">Get Started</Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 items-center">
              <div className="space-y-2">
                <h3 className="text-xl font-bold">AI-Powered Tailoring</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Our AI analyzes job descriptions and tailors your resume to highlight relevant skills and experience.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Save Multiple Versions</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Create and save different versions of your resume for various job applications.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Easy Editing</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Edit and refine AI suggestions to create the perfect resume for each opportunity.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} SmartResume. All rights reserved.
        </p>
      </footer>
    </div>
  )
}
