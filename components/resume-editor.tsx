"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Save, ArrowLeft, Download, Trash2 } from "lucide-react";
import { processResume } from "@/utils/resume-processor";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Resume {
  id: string;
  title: string;
  original_resume: string;
  job_description: string;
  tailored_resume: string;
  created_at: string;
}

export default function ResumeEditor({
  resume,
  user,
}: {
  resume: Resume;
  user: User;
}) {
  const [title, setTitle] = useState(resume.title);
  const [originalResume, setOriginalResume] = useState(resume.original_resume);
  const [jobDescription, setJobDescription] = useState(resume.job_description);
  const [tailoredResume, setTailoredResume] = useState(resume.tailored_resume);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  const handleReprocess = async () => {
    if (!originalResume || !jobDescription) {
      toast({
        title: "Missing information",
        description: "Please provide both your resume and the job description.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const result = await processResume(originalResume, jobDescription);
      setTailoredResume(result);
      toast({
        title: "Resume reprocessed",
        description: "Your resume has been tailored to the job description.",
      });
    } catch (error: any) {
      toast({
        title: "Processing failed",
        description:
          error.message || "An error occurred while processing your resume.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = async () => {
    if (!title || !originalResume || !jobDescription || !tailoredResume) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields before saving.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("resumes")
        .update({
          title,
          original_resume: originalResume,
          job_description: jobDescription,
          tailored_resume: tailoredResume,
        })
        .eq("id", resume.id)
        .eq("user_id", user.id);

      if (error) throw error;

      toast({
        title: "Resume saved",
        description: "Your changes have been saved successfully.",
      });

      router.refresh();
    } catch (error: any) {
      toast({
        title: "Save failed",
        description:
          error.message || "An error occurred while saving your resume.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("resumes")
        .delete()
        .eq("id", resume.id)
        .eq("user_id", user.id);

      if (error) throw error;

      toast({
        title: "Resume deleted",
        description: "Your resume has been deleted successfully.",
      });

      router.push("/dashboard");
      router.refresh();
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description:
          error.message || "An error occurred while deleting your resume.",
        variant: "destructive",
      });
      setIsDeleting(false);
    }
  };

  const handleDownloadPDF = () => {
    // Create a simple text file for now
    // In a real app, you would use a library like jsPDF to create a proper PDF
    const element = document.createElement("a");
    const file = new Blob([tailoredResume], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${title.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleDownloadPDF}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your tailored resume.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Resume</CardTitle>
          <CardDescription>
            Make changes to your tailored resume.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Resume Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
                className="min-h-[300px]"
                required
              />
            </div>
          </div>
          <Button
            onClick={handleReprocess}
            disabled={isProcessing || !originalResume || !jobDescription}
            variant="outline"
            className="w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Reprocessing...
              </>
            ) : (
              "Reprocess with AI"
            )}
          </Button>

          <div className="space-y-2 mt-4">
            <Label htmlFor="tailored-resume">Tailored Resume</Label>
            <Textarea
              id="tailored-resume"
              value={tailoredResume}
              onChange={(e) => setTailoredResume(e.target.value)}
              className="min-h-[300px]"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave} disabled={isSaving} className="w-full">
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
