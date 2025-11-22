import { TeamMemberForm } from "@/components/team-member-form"

export default function NewTeamMemberPage() {
  return (
    <div className="space-y-6">
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold text-[#F4F7F5]">Add New Team Member</h1>
        <p className="text-[#F4F7F5]/80 mt-2">Create a new team member profile</p>
      </div>
      <TeamMemberForm />
    </div>
  )
}
