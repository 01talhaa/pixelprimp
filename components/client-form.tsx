"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Loader2 } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

interface ClientFormData {
  name: string
  email: string
  password?: string
  phone: string
  company: string
  avatar: string
  projects: string[]
  services: string[]
}

interface ClientFormProps {
  clientId?: string
  initialData?: Partial<ClientFormData>
}

export default function ClientForm({ clientId, initialData }: ClientFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState<ClientFormData>({
    name: "",
    email: "",
    password: "",
    phone: "",
    company: "",
    avatar: "",
    projects: [],
    services: [],
    ...initialData,
  })

  // Load client data if editing
  useEffect(() => {
    if (clientId && !initialData) {
      fetchClient()
    }
  }, [clientId])

  const fetchClient = async () => {
    try {
      const response = await fetch(`/api/clients/${clientId}`)
      if (response.ok) {
        const data = await response.json()
        setFormData({
          ...data,
          password: "", // Don't populate password field
        })
      }
    } catch (error) {
      console.error("Error fetching client:", error)
      toast.error("Failed to load client data")
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB")
      return
    }

    setUploading(true)
    const formDataToUpload = new FormData()
    formDataToUpload.append("file", file)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataToUpload,
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "Upload failed")
      }

      if (data.url) {
        setFormData({ ...formData, avatar: data.url })
        toast.success("Image uploaded successfully")
      } else {
        throw new Error("No URL returned from upload")
      }
    } catch (error: any) {
      console.error("Error uploading image:", error)
      toast.error(error.message || "Failed to upload image")
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = clientId ? `/api/clients/${clientId}` : "/api/clients"
      const method = clientId ? "PUT" : "POST"

      // Prepare data
      const dataToSend: any = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        avatar: formData.avatar,
        projects: formData.projects,
        services: formData.services,
      }

      // Only include password if it's provided (for create or update)
      if (formData.password) {
        dataToSend.password = formData.password
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save client")
      }

      toast.success(clientId ? "Client updated successfully" : "Client created successfully")
      router.push("/admin/clients")
      router.refresh()
    } catch (error: any) {
      console.error("Error saving client:", error)
      toast.error(error.message || "Failed to save client")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <Card className="border-[#1F2329] bg-[#0F1113]/80 shadow-lg shadow-[#008CE2]/20 animate-fade-in-up">
        <CardHeader>
          <CardTitle className="text-[#F4F7F5]">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-[#F4F7F5]">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Client name"
              required
              className="bg-[#1A1D21] border-[#1F2329] text-[#F4F7F5] placeholder:text-[#F4F7F5]/50"
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-[#F4F7F5]">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="client@example.com"
              required
              className="bg-[#1A1D21] border-[#1F2329] text-[#F4F7F5] placeholder:text-[#F4F7F5]/50"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-[#F4F7F5]">
              Password {!clientId && "*"} {clientId && "(Leave empty to keep current)"}
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter password"
              required={!clientId}
              className="bg-[#1A1D21] border-[#1F2329] text-[#F4F7F5] placeholder:text-[#F4F7F5]/50"
            />
            <p className="text-xs text-[#F4F7F5]/70 mt-1">Minimum 6 characters</p>
          </div>

          <div>
            <Label htmlFor="phone" className="text-[#F4F7F5]">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 234 567 8900"
              className="bg-[#1A1D21] border-[#1F2329] text-[#F4F7F5] placeholder:text-[#F4F7F5]/50"
            />
          </div>

          <div>
            <Label htmlFor="company" className="text-[#F4F7F5]">Company</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="Company name"
              className="bg-[#1A1D21] border-[#1F2329] text-[#F4F7F5] placeholder:text-[#F4F7F5]/50"
            />
          </div>
        </CardContent>
      </Card>

      {/* Profile Image */}
      <Card className="border-[#1F2329] bg-[#0F1113]/80 shadow-lg shadow-[#008CE2]/20 animate-fade-in-up delay-100">
        <CardHeader>
          <CardTitle className="text-[#F4F7F5]">Profile Image</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.avatar && (
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-[#008CE2]">
              <Image
                src={formData.avatar}
                alt="Profile"
                fill
                className="object-cover"
              />
            </div>
          )}
          <div>
            <Label htmlFor="avatar" className="text-[#F4F7F5]">Upload Image</Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="avatar"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="bg-[#1A1D21] border-[#1F2329] text-[#F4F7F5]"
              />
              <Button
                type="button"
                variant="outline"
                disabled={uploading}
                className="bg-[#1A1D21] border-[#1F2329] hover:bg-[#0F1113] hover:border-[#008CE2]"
              >
                {uploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-[#F4F7F5]/70 mt-1">Max size: 5MB</p>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={loading}
          size="lg"
          className="bg-[#008CE2] text-[#F4F7F5] hover:bg-[#06B9D0] shadow-lg shadow-[#008CE2]/30 hover:scale-105 transition-all duration-300"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : clientId ? (
            "Update Client"
          ) : (
            "Create Client"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="border-[#1F2329] bg-[#0F1113] text-[#F4F7F5] hover:bg-[#1A1D21] hover:border-[#008CE2]"
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
