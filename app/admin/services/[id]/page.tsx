"use client"

import { use, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ServiceForm } from "@/components/service-form"
import { ServiceDocument } from "@/lib/models/Service"

export default function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [service, setService] = useState<ServiceDocument | null>(null)
  const [loading, setLoading] = useState(true)

  const isNew = resolvedParams.id === "new"

  useEffect(() => {
    if (!isNew) {
      fetchService()
    } else {
      setLoading(false)
    }
  }, [isNew])

  const fetchService = async () => {
    try {
      const response = await fetch(`/api/services/${resolvedParams.id}`)
      const data = await response.json()
      if (data.success) {
        setService(data.data)
      }
    } catch (error) {
      console.error("Error fetching service:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-fade-in-up">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="icon" className="border-[#1F2329] hover:bg-[#1A1D21] text-[#008CE2]">
            <Link href="/admin/services">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-[#F4F7F5]">
              {isNew ? "Add New Service" : "Edit Service"}
            </h1>
            <p className="text-[#F4F7F5]/80 mt-2">Fill in the service details</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-[#F4F7F5] text-center py-12">Loading...</div>
      ) : (
        <ServiceForm 
          initialData={service || undefined} 
          isEdit={!isNew}
        />
      )}
    </div>
  )
}
