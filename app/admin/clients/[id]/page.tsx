import ClientForm from "@/components/client-form"

interface EditClientPageProps {
  params: Promise<{ id: string }>
}

export default async function EditClientPage({ params }: EditClientPageProps) {
  const { id } = await params

  return (
    <div className="space-y-6">
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold text-[#F4F7F5]">Edit Client</h1>
        <p className="text-[#F4F7F5]/80 mt-2">Update client information</p>
      </div>
      <ClientForm clientId={id} />
    </div>
  )
}
