"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
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

interface Client {
  _id: string
  name: string
  email: string
  phone?: string
  company?: string
  avatar?: string
  projects: string[]
  services: string[]
  createdAt: string
}

export default function ClientsPage() {
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      const response = await fetch("/api/clients")
      if (response.ok) {
        const data = await response.json()
        setClients(data)
      }
    } catch (error) {
      console.error("Error fetching clients:", error)
      toast.error("Failed to load clients")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    setDeleting(true)
    try {
      const response = await fetch(`/api/clients/${deleteId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Client deleted successfully")
        setClients(clients.filter((c) => c._id !== deleteId))
        setDeleteId(null)
      } else {
        throw new Error("Failed to delete client")
      }
    } catch (error) {
      console.error("Error deleting client:", error)
      toast.error("Failed to delete client")
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#008CE2]" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-fade-in-up">
        <div>
          <h1 className="text-3xl font-bold text-[#F4F7F5]">Client Management</h1>
          <p className="text-[#F4F7F5]/80 mt-2">Manage client accounts and their projects</p>
        </div>
        <Button
          onClick={() => router.push("/admin/clients/new")}
          className="bg-[#008CE2] text-white hover:bg-[#06B9D0] transition-all duration-300"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Client
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <Card key={client._id} className="border-[#1F2329] bg-[#0F1113]/80 shadow-lg shadow-[#008CE2]/20 hover:shadow-xl hover:shadow-[#06B9D0]/30 hover:scale-[1.02] transition-all duration-300 animate-fade-in-up">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {client.avatar ? (
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#1F2329]">
                      <Image
                        src={client.avatar}
                        alt={client.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[#1A1D21] flex items-center justify-center border-2 border-[#1F2329]">
                      <span className="text-[#008CE2] font-semibold text-lg">
                        {client.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-[#F4F7F5] text-lg">{client.name}</CardTitle>
                    <p className="text-sm text-[#F4F7F5]/70">{client.email}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {client.company && (
                <p className="text-sm text-[#F4F7F5]/70">
                  <span className="font-semibold text-[#F4F7F5]">Company:</span> {client.company}
                </p>
              )}
              {client.phone && (
                <p className="text-sm text-[#F4F7F5]/70">
                  <span className="font-semibold text-[#F4F7F5]">Phone:</span> {client.phone}
                </p>
              )}
              <div className="flex gap-2 text-sm text-[#F4F7F5]/70">
                <span className="font-semibold text-[#F4F7F5]">Projects:</span>
                <span>{client.projects?.length || 0}</span>
              </div>
              <div className="flex gap-2 text-sm text-[#F4F7F5]/70">
                <span className="font-semibold text-[#F4F7F5]">Services:</span>
                <span>{client.services?.length || 0}</span>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/admin/clients/${client._id}`)}
                  className="flex-1 border-[#1F2329] bg-[#1A1D21] text-[#008CE2] hover:bg-[#1F2329]"
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setDeleteId(client._id)}
                  className="flex-1"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {clients.length === 0 && (
        <Card className="border-[#1F2329] bg-[#0F1113]/80 shadow-lg shadow-[#008CE2]/20 animate-fade-in-up">
          <CardContent className="py-12 text-center">
            <p className="text-[#F4F7F5]/70 mb-4">No clients found</p>
            <Button
              onClick={() => router.push("/admin/clients/new")}
              className="bg-[#008CE2] text-white hover:bg-[#06B9D0] transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Client
            </Button>
          </CardContent>
        </Card>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-[#0F1113] border-[#1F2329]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#F4F7F5]">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-[#F4F7F5]/80">
              This action cannot be undone. This will permanently delete the client account and
              remove their data from the server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting} className="border-[#1F2329] hover:bg-[#1A1D21] text-[#F4F7F5]">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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
  )
}
