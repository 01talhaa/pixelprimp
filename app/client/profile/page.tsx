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
      <div className="min-h-screen flex items-center justify-center bg-[#08090A]">
        <Loader2 className="w-8 h-8 animate-spin text-[#008CE2]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#08090A] via-[#0F1113] to-[#08090A] animate-fade-in-up">
      {/* Header */}
      <header className="border-b border-[#1F2329] bg-[#0F1113]/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm shadow-[#008CE2]/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
                      <Link href="/" className="flex items-center gap-1.5 hover:scale-105 transition-transform duration-300">
            <Image src="/icons/pqrix-white.svg" alt="PixelPrimp logo" width={20} height={20} className="h-5 w-5" />
            <span className="font-semibold tracking-wide">
              <span className="text-[#008CE2]">Pixel</span>
              <span className="text-[#F4F7F5]">Primp</span>
            </span>
          </Link>
            <Link
              href="/client/dashboard"
              className="text-2xl font-bold bg-gradient-to-r from-[#008CE2] to-[#06B9D0] bg-clip-text text-transparent"
            >
              Profile
            </Link>
          </div>
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="border-[#1F2329] bg-[#0F1113] text-[#F4F7F5] hover:bg-[#1A1D21] hover:border-[#008CE2] hover:scale-105 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl space-y-6">
        {/* Profile Information */}
        <form onSubmit={handleProfileUpdate}>
          <Card className="border-[#1F2329] bg-[#0F1113]/80 backdrop-blur-xl shadow-lg shadow-[#008CE2]/20">
            <CardHeader>
              <CardTitle className="text-[#F4F7F5] text-xl">Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Profile Image */}
              <div className="flex flex-col items-center gap-4">
                {formData.avatar ? (
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#008CE2]">
                    <Image
                      src={formData.avatar}
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-[#1A1D21] flex items-center justify-center border-4 border-[#008CE2]">
                    <User className="w-16 h-16 text-[#008CE2]" />
                  </div>
                )}
                <div className="w-full">
                  <Label htmlFor="avatar" className="text-[#F4F7F5]">Profile Picture</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="bg-[#1A1D21] border-[#1F2329] text-[#F4F7F5] transition-all duration-300"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      disabled={uploading}
                      className="bg-[#0F1113] border-[#1F2329] hover:bg-[#1A1D21] hover:border-[#008CE2] hover:scale-105 transition-all duration-300 shrink-0"
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
              </div>

              {/* Name */}
              <div>
                <Label htmlFor="name" className="text-[#F4F7F5]">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your name"
                  required
                  className="bg-[#1A1D21] border-[#1F2329] text-[#F4F7F5] placeholder:text-[#F4F7F5]/50 transition-all duration-300"
                />
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" className="text-[#F4F7F5]">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  required
                  className="bg-[#1A1D21] border-[#1F2329] text-[#F4F7F5] placeholder:text-[#F4F7F5]/50 transition-all duration-300"
                />
              </div>

              {/* Phone */}
              <div>
                <Label htmlFor="phone" className="text-[#F4F7F5]">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 234 567 8900"
                  className="bg-[#1A1D21] border-[#1F2329] text-[#F4F7F5] placeholder:text-[#F4F7F5]/50 transition-all duration-300"
                />
              </div>

              {/* Company */}
              <div>
                <Label htmlFor="company" className="text-[#F4F7F5]">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Your company name"
                  className="bg-[#1A1D21] border-[#1F2329] text-[#F4F7F5] placeholder:text-[#F4F7F5]/50 transition-all duration-300"
                />
              </div>

              <Button
                type="submit"
                disabled={saving || uploading}
                className="w-full bg-[#008CE2] text-white hover:bg-[#06B9D0] hover:scale-105 transition-all duration-300"
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
          <Card className="border-[#1F2329] bg-[#0F1113]/80 backdrop-blur-xl shadow-lg shadow-[#008CE2]/20">
            <CardHeader>
              <CardTitle className="text-[#F4F7F5] text-xl">Change Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="currentPassword" className="text-[#F4F7F5]">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="Enter current password"
                  className="bg-[#1A1D21] border-[#1F2329] text-[#F4F7F5] placeholder:text-[#F4F7F5]/50 transition-all duration-300"
                />
              </div>

              <div>
                <Label htmlFor="newPassword" className="text-[#F4F7F5]">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="Enter new password"
                  className="bg-[#1A1D21] border-[#1F2329] text-[#F4F7F5] placeholder:text-[#F4F7F5]/50 transition-all duration-300"
                />
                <p className="text-xs text-[#F4F7F5]/70 mt-1">Minimum 6 characters</p>
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-[#F4F7F5]">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="Confirm new password"
                  className="bg-[#1A1D21] border-[#1F2329] text-[#F4F7F5] placeholder:text-[#F4F7F5]/50 transition-all duration-300"
                />
              </div>

              <Button
                type="submit"
                disabled={saving || !passwordData.currentPassword || !passwordData.newPassword}
                variant="outline"
                className="w-full border-[#1F2329] bg-[#0F1113] text-[#F4F7F5] hover:bg-[#1A1D21] hover:border-[#008CE2] hover:scale-105 transition-all duration-300"
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
