import ClientForm from "@/components/client-form"

export default function NewClientPage() {
  return (
    <div className="space-y-6">
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold text-[#F4F7F5]">Add New Client</h1>
        <p className="text-[#F4F7F5]/80 mt-2">Create a new client account</p>
      </div>
      <ClientForm />
    </div>
  )
}
