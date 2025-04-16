import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import LoginForm from "@/components/login-form";

export default async function LoginPage() {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Sign in to SmartResume</h1>
          <p className="mt-2 text-gray-600">
            Tailor your resume to job descriptions using AI
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
