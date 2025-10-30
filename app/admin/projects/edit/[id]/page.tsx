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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black">Edit Project</h1>
        <p className="text-gray-600 mt-2">
          Update the project details
        </p>
      </div>

      <ProjectForm projectId={projectId} />
    </div>
  )
}
