"use client"

import { useAuth } from "@/lib/auth"
import { useRouter, useParams } from "next/navigation"
import { useEffect } from "react"
import ProjectForm from "@/components/project-form"

export default function EditProjectPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/admin/login")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.role !== "admin") {
    return null
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-3xl font-bold text-[#F4F7F5]">Edit Project</h1>
        <p className="text-[#F4F7F5]/80 mt-2">
          Update the project details
        </p>
      </div>

      <ProjectForm projectId={projectId} />
    </div>
  )
}
