"use client"

import { useState, useEffect } from "react"
import { TeamMemberForm } from "@/components/team-member-form"
import { TeamMemberDocument } from "@/lib/models/TeamMember"
import { use } from "react"

export default function EditTeamMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [teamMember, setTeamMember] = useState<TeamMemberDocument | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTeamMember = async () => {
      try {
        const response = await fetch(`/api/team/${id}`)
        const data = await response.json()
        
        if (data.success) {
          setTeamMember(data.data)
        }
      } catch (error) {
        console.error("Error fetching team member:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTeamMember()
  }, [id])

  if (loading) {
    return <div className="text-[#F4F7F5] text-center py-12">Loading...</div>
  }

  if (!teamMember) {
    return <div className="text-[#F4F7F5] text-center py-12">Team member not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold text-[#F4F7F5]">Edit Team Member</h1>
        <p className="text-[#F4F7F5]/80 mt-2">Update team member information</p>
      </div>
      <TeamMemberForm initialData={teamMember} isEdit={true} />
    </div>
  )
}
