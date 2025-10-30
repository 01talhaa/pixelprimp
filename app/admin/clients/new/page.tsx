import ClientForm from "@/components/client-form"

export default function NewClientPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black">Add New Client</h1>
        <p className="text-gray-600 mt-2">Create a new client account</p>
      </div>
      <ClientForm />
    </div>
  )
}
