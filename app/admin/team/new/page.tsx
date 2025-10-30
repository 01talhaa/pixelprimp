import { TeamMemberForm } from "@/components/team-member-form"

export default function NewTeamMemberPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black">Add New Team Member</h1>
        <p className="text-gray-600 mt-2">Create a new team member profile</p>
      </div>
      <TeamMemberForm />
    </div>
  )
}
