"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, Pencil, Trash2, Search, Eye } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"

interface Project {
  _id: string
  id: string
  title: string
  category: string
  status: "Completed" | "In Progress" | "On Hold"
  duration: number
  budget: string
  images: string[]
  createdAt: string
}

export default function AdminProjectsPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/admin/login")
    } else {
      fetchProjects()
    }
  }, [isAuthenticated, user, router])

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects")
      const data = await response.json()
      
      if (data.success) {
        setProjects(data.data)
      } else {
        toast.error("Failed to fetch projects")
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
      toast.error("An error occurred while fetching projects")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    setDeleting(true)
    try {
      const response = await fetch(`/api/projects/${deleteId}`, {
        method: "DELETE",
      })
      const data = await response.json()

      if (data.success) {
        toast.success("Project deleted successfully")
        setProjects(projects.filter((p) => p._id !== deleteId))
      } else {
        toast.error(data.error || "Failed to delete project")
      }
    } catch (error) {
      console.error("Error deleting project:", error)
      toast.error("An error occurred while deleting the project")
    } finally {
      setDeleting(false)
      setDeleteId(null)
    }
  }

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-500"
      case "In Progress":
        return "bg-blue-500"
      case "On Hold":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black">Projects Management</h1>
          <p className="text-gray-600 mt-2">
            Manage all projects, create new ones, and edit existing projects
          </p>
        </div>
        <Link href="/admin/projects/new">
          <Button size="lg" className="gap-2 bg-sky-500 hover:bg-sky-600 text-white shadow-md">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white border-sky-200 text-black placeholder:text-gray-400 focus:ring-sky-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
        </div>
      ) : (
        <div className="rounded-lg border border-sky-200 bg-white shadow-lg shadow-sky-200/30">
          <Table>
            <TableHeader>
              <TableRow className="border-sky-200 hover:bg-sky-50">
                <TableHead className="w-20 text-black">Image</TableHead>
                <TableHead className="text-black">Title</TableHead>
                <TableHead className="text-black">Category</TableHead>
                <TableHead className="text-black">Status</TableHead>
                <TableHead className="text-black">Duration</TableHead>
                <TableHead className="text-black">Budget</TableHead>
                <TableHead className="text-right text-black">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.length === 0 ? (
                <TableRow className="border-sky-200">
                  <TableCell colSpan={7} className="text-center py-10 text-gray-600">
                    No projects found
                  </TableCell>
                </TableRow>
              ) : (
                filteredProjects.map((project) => (
                  <TableRow key={project._id} className="border-sky-200 hover:bg-sky-50">
                    <TableCell>
                      {project.images && project.images.length > 0 ? (
                        <div className="relative h-12 w-12 overflow-hidden rounded-md">
                          <Image
                            src={project.images[0]}
                            alt={project.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-12 w-12 rounded-md bg-sky-100" />
                      )}
                    </TableCell>
                    <TableCell className="font-medium text-black">{project.title}</TableCell>
                    <TableCell className="text-gray-700">{project.category}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-700">{project.duration} weeks</TableCell>
                    <TableCell className="text-gray-700">{project.budget}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/projects/${project.id}`} target="_blank">
                          <Button variant="ghost" size="icon" title="View on website" className="text-sky-600 hover:text-sky-700 hover:bg-sky-100">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/projects/edit/${project._id}`}>
                          <Button variant="ghost" size="icon" title="Edit project" className="text-sky-600 hover:text-sky-700 hover:bg-sky-100">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Delete project"
                          onClick={() => setDeleteId(project._id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-white border-sky-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-black">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              This action cannot be undone. This will permanently delete the project
              and remove all associated images from Cloudinary.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting} className="border-sky-200 hover:bg-sky-50">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
