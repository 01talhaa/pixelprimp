"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash2, Eye } from "lucide-react"
import Link from "next/link"
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
import { TeamMemberDocument } from "@/lib/models/TeamMember"

export default function AdminTeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMemberDocument[]>([])
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTeamMembers()
  }, [])

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch("/api/team")
      const data = await response.json()
      
      if (data.success) {
        setTeamMembers(data.data)
      }
    } catch (error) {
      console.error("Error fetching team members:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    try {
      const response = await fetch(`/api/team/${deleteId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setTeamMembers(teamMembers.filter(m => m.id !== deleteId))
        setDeleteId(null)
      }
    } catch (error) {
      console.error('Error deleting team member:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-fade-in-up">
        <div>
          <h1 className="text-3xl font-bold text-[#F4F7F5]">Team Management</h1>
          <p className="text-[#F4F7F5]/80 mt-2">Manage all your team members</p>
        </div>
        <Button asChild className="bg-[#008CE2] text-white hover:bg-[#06B9D0] shadow-md transition-all duration-300">
          <Link href="/admin/team/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Team Member
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="text-[#F4F7F5] text-center py-12">Loading team members...</div>
      ) : teamMembers.length === 0 ? (
        <Card className="border-[#1F2329] bg-[#0F1113]/80 shadow-lg shadow-[#008CE2]/20 animate-fade-in-up">
          <CardContent className="py-12">
            <p className="text-[#F4F7F5]/70 text-center">No team members found. Create your first team member!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <Card key={member.id} className="border-[#1F2329] bg-[#0F1113]/80 shadow-lg shadow-[#008CE2]/20 hover:shadow-xl hover:shadow-[#06B9D0]/30 hover:scale-[1.02] transition-all duration-300 animate-fade-in-up">
              <CardHeader className="pb-3">
                <CardTitle className="text-[#F4F7F5] text-lg line-clamp-1">{member.name}</CardTitle>
                {member.role && (
                  <p className="text-[#008CE2] text-xs mt-1">{member.role}</p>
                )}
                {member.department && (
                  <p className="text-[#F4F7F5]/70 text-xs">{member.department}</p>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {member.image && (
                  <div className="relative aspect-square rounded-lg overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <p className="text-[#F4F7F5]/70 text-sm line-clamp-2">{member.bio}</p>
                <div className="flex gap-2">
                  <Button asChild size="sm" variant="outline" className="flex-1 bg-[#1A1D21] border-[#1F2329] hover:bg-[#1F2329] text-[#008CE2]">
                    <Link href={`/team/${member.id}`} target="_blank">
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Link>
                  </Button>
                  <Button asChild size="sm" className="flex-1 bg-[#008CE2] text-white hover:bg-[#06B9D0] transition-all duration-300">
                    <Link href={`/admin/team/${member.id}`}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Link>
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => setDeleteId(member.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-[#0F1113] border-[#1F2329]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#F4F7F5]">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-[#F4F7F5]/80">
              This action cannot be undone. This will permanently delete the team member.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[#1F2329] hover:bg-[#1A1D21] text-[#F4F7F5]">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
