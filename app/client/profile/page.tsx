"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Loader2, ArrowLeft, User } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import Link from "next/link"
import { fetchWithAuth, setupAutoRefresh } from "@/lib/client-auth"

interface ClientData {
  _id: string
  name: string
  email: string
  phone?: string
  company?: string
  avatar?: string
}

export default function ClientProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState<ClientData>({
    _id: "",
    name: "",
    email: "",
    phone: "",
    company: "",
    avatar: "",
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    fetchClientData()
    
    // Setup automatic token refresh
    const cleanup = setupAutoRefresh()
    
    // Cleanup on unmount
    return cleanup
  }, [])

  const fetchClientData = async () => {
    try {
      const response = await fetchWithAuth("/api/auth/client/me")
      if (!response.ok) {
        throw new Error("Not authenticated")
      }
      const data = await response.json()
      setFormData(data.client)
    } catch (error) {
      console.error("Error fetching client data:", error)
      toast.error("Please login to continue")
      router.push("/client/login")
    } finally {
      setLoading(false)
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
        
        // Update the profile immediately with the new avatar
        const updateResponse = await fetch(`/api/clients/${formData._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            company: formData.company,
            avatar: data.url,
          }),
        })

        if (updateResponse.ok) {
          // Dispatch custom event to update header
          window.dispatchEvent(new Event('clientUpdated'))
          toast.success("Image uploaded successfully")
        } else {
          throw new Error("Failed to update profile with new image")
        }
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

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`/api/clients/${formData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          avatar: formData.avatar,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update profile")
      }

      // Dispatch custom event to update header
      window.dispatchEvent(new Event('clientUpdated'))
      toast.success("Profile updated successfully")
      router.push("/client/dashboard")
    } catch (error: any) {
      console.error("Error updating profile:", error)
      toast.error(error.message || "Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match")
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }

    setSaving(true)

    try {
      const response = await fetch("/api/auth/client/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to change password")
      }

      toast.success("Password changed successfully")
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error: any) {
      console.error("Error changing password:", error)
      toast.error(error.message || "Failed to change password")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-50">
      {/* Header */}
      <header className="border-b border-sky-200 bg-white/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/client/dashboard"
            className="text-2xl font-bold bg-gradient-to-r from-sky-500 to-sky-600 bg-clip-text text-transparent"
          >
            My Profile
          </Link>
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="border-sky-200 bg-white text-black hover:bg-sky-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl space-y-6">
        {/* Profile Information */}
        <form onSubmit={handleProfileUpdate}>
          <Card className="border-sky-200 bg-white shadow-lg shadow-sky-200/30">
            <CardHeader>
              <CardTitle className="text-black text-xl">Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Profile Image */}
              <div className="flex flex-col items-center gap-4">
                {formData.avatar ? (
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-sky-200">
                    <Image
                      src={formData.avatar}
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-sky-100 flex items-center justify-center border-4 border-sky-200">
                    <User className="w-16 h-16 text-sky-600" />
                  </div>
                )}
                <div className="w-full">
                  <Label htmlFor="avatar" className="text-black">Profile Picture</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="bg-white border-sky-200 text-black"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      disabled={uploading}
                      className="bg-white border-sky-200 hover:bg-sky-50 shrink-0"
                    >
                      {uploading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Max size: 5MB</p>
                </div>
              </div>

              {/* Name */}
              <div>
                <Label htmlFor="name" className="text-black">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your name"
                  required
                  className="bg-white border-sky-200 text-black"
                />
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" className="text-black">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  required
                  className="bg-white border-sky-200 text-black"
                />
              </div>

              {/* Phone */}
              <div>
                <Label htmlFor="phone" className="text-black">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 234 567 8900"
                  className="bg-white border-sky-200 text-black"
                />
              </div>

              {/* Company */}
              <div>
                <Label htmlFor="company" className="text-black">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Your company name"
                  className="bg-white border-sky-200 text-black"
                />
              </div>

              <Button
                type="submit"
                disabled={saving || uploading}
                className="w-full bg-sky-500 text-white hover:bg-sky-600"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardContent>
          </Card>
        </form>

        {/* Change Password */}
        <form onSubmit={handlePasswordChange}>
          <Card className="border-sky-200 bg-white shadow-lg shadow-sky-200/30">
            <CardHeader>
              <CardTitle className="text-black text-xl">Change Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="currentPassword" className="text-black">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="Enter current password"
                  className="bg-white border-sky-200 text-black"
                />
              </div>

              <div>
                <Label htmlFor="newPassword" className="text-black">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="Enter new password"
                  className="bg-white border-sky-200 text-black"
                />
                <p className="text-xs text-gray-600 mt-1">Minimum 6 characters</p>
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-black">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="Confirm new password"
                  className="bg-white border-sky-200 text-black"
                />
              </div>

              <Button
                type="submit"
                disabled={saving || !passwordData.currentPassword || !passwordData.newPassword}
                variant="outline"
                className="w-full border-sky-200 bg-white text-black hover:bg-sky-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Changing...
                  </>
                ) : (
                  "Change Password"
                )}
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}
