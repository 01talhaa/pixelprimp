"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Upload, Loader2 } from "lucide-react"
import { TeamMemberDocument } from "@/lib/models/TeamMember"
import { useRouter } from "next/navigation"

interface TeamMemberFormProps {
  initialData?: Partial<TeamMemberDocument>
  isEdit?: boolean
}

export function TeamMemberForm({ initialData, isEdit = false }: TeamMemberFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState<Partial<TeamMemberDocument>>({
    id: initialData?.id || "",
    name: initialData?.name || "",
    role: initialData?.role || "",
    department: initialData?.department || "",
    bio: initialData?.bio || "",
    image: initialData?.image || "",
    linkedin: initialData?.linkedin || "",
    twitter: initialData?.twitter || "",
    email: initialData?.email || "",
    fullBio: initialData?.fullBio || "",
    expertise: initialData?.expertise || [""],
    experience: initialData?.experience || [{ title: "", company: "", period: "", description: "" }],
    education: initialData?.education || [{ degree: "", school: "", year: "" }],
    awards: initialData?.awards || [""],
    projects: initialData?.projects || [""],
  })

  // Image upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('files', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      if (data.success && data.data && data.data[0]) {
        setFormData(prev => ({ ...prev, image: data.data[0] }))
      } else {
        alert('Failed to upload image: ' + (data.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Error uploading image')
    } finally {
      setUploading(false)
    }
  }

  // Auto-generate ID from name
  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      id: isEdit ? prev.id : name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    }))
  }

  // Expertise handlers
  const addExpertise = () => {
    setFormData(prev => ({
      ...prev,
      expertise: [...(prev.expertise || []), ""]
    }))
  }

  const removeExpertise = (index: number) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise?.filter((_, i) => i !== index)
    }))
  }

  const updateExpertise = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise?.map((item, i) => i === index ? value : item)
    }))
  }

  // Experience handlers
  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [...(prev.experience || []), { title: "", company: "", period: "", description: "" }]
    }))
  }

  const removeExperience = (index: number) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience?.filter((_, i) => i !== index)
    }))
  }

  const updateExperience = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience?.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }))
  }

  // Education handlers
  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...(prev.education || []), { degree: "", school: "", year: "" }]
    }))
  }

  const removeEducation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education?.filter((_, i) => i !== index)
    }))
  }

  const updateEducation = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education?.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }))
  }

  // Awards handlers
  const addAward = () => {
    setFormData(prev => ({
      ...prev,
      awards: [...(prev.awards || []), ""]
    }))
  }

  const removeAward = (index: number) => {
    setFormData(prev => ({
      ...prev,
      awards: prev.awards?.filter((_, i) => i !== index)
    }))
  }

  const updateAward = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      awards: prev.awards?.map((item, i) => i === index ? value : item)
    }))
  }

  // Projects handlers
  const addProject = () => {
    setFormData(prev => ({
      ...prev,
      projects: [...(prev.projects || []), ""]
    }))
  }

  const removeProject = (index: number) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects?.filter((_, i) => i !== index)
    }))
  }

  const updateProject = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects?.map((item, i) => i === index ? value : item)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = isEdit ? `/api/team/${formData.id}` : '/api/team'
      const method = isEdit ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        router.push('/admin/team')
        router.refresh()
      } else {
        alert(data.error || 'Failed to save team member')
      }
    } catch (error) {
      console.error('Error saving team member:', error)
      alert('Error saving team member')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <Card className="border-[#1F2329] bg-[#0F1113]/80 shadow-lg shadow-[#008CE2]/20">
        <CardHeader>
          <CardTitle className="text-[#F4F7F5]">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="bg-[#1A1D21] border-[#1F2329] text-[#F4F7F5]"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="id" className="text-[#F4F7F5]">ID (auto-generated)</Label>
              <Input
                id="id"
                value={formData.id}
                className="bg-[#1A1D21] border-[#1F2329] text-[#F4F7F5]/70"
                disabled
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role" className="text-white">Role</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="bg-[#1A1D21] border-[#1F2329] text-[#F4F7F5]"
                placeholder="e.g., Creative Director"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department" className="text-white">Department</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="bg-[#1A1D21] border-[#1F2329] text-[#F4F7F5]"
                placeholder="e.g., Leadership"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="text-white">Short Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="bg-[#1A1D21] border-[#1F2329] text-[#F4F7F5]"
              rows={2}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullBio" className="text-white">Full Bio (Optional)</Label>
            <Textarea
              id="fullBio"
              value={formData.fullBio}
              onChange={(e) => setFormData({ ...formData, fullBio: e.target.value })}
              className="bg-[#1A1D21] border-[#1F2329] text-[#F4F7F5]"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image" className="text-white">Profile Image</Label>
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="bg-[#1A1D21] border-[#1F2329] text-[#F4F7F5]"
                  placeholder="Image URL"
                />
              </div>
              <div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <Button
                  type="button"
                  onClick={() => document.getElementById('image-upload')?.click()}
                  disabled={uploading}
                  className="bg-sky-500 text-white hover:bg-sky-600"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </>
                  )}
                </Button>
              </div>
            </div>
            {formData.image && (
              <div className="mt-2">
                <img src={formData.image} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-[#1A1D21] border-[#1F2329] text-[#F4F7F5]"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin" className="text-white">LinkedIn URL</Label>
              <Input
                id="linkedin"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                className="bg-[#1A1D21] border-[#1F2329] text-[#F4F7F5]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitter" className="text-white">Twitter URL</Label>
              <Input
                id="twitter"
                value={formData.twitter}
                onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                className="bg-[#1A1D21] border-[#1F2329] text-[#F4F7F5]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expertise */}
      <Card className="border-[#1F2329] bg-[#0F1113]/80 shadow-lg shadow-[#008CE2]/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-[#F4F7F5]">Expertise</CardTitle>
            <Button type="button" onClick={addExpertise} size="sm" className="bg-sky-500 text-white hover:bg-sky-600">
              <Plus className="w-4 h-4 mr-2" />
              Add Skill
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {formData.expertise?.map((skill, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={skill}
                onChange={(e) => updateExpertise(index, e.target.value)}
                placeholder="e.g., Creative Strategy & Direction"
                className="bg-[#1A1D21] border-[#1F2329] text-[#F4F7F5]"
              />
              <Button
                type="button"
                onClick={() => removeExpertise(index)}
                size="icon"
                variant="destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Experience */}
      <Card className="border-[#1F2329] bg-[#0F1113]/80 shadow-lg shadow-[#008CE2]/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-[#F4F7F5]">Experience</CardTitle>
            <Button type="button" onClick={addExperience} size="sm" className="bg-sky-500 text-white hover:bg-sky-600">
              <Plus className="w-4 h-4 mr-2" />
              Add Experience
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.experience?.map((exp, index) => (
            <Card key={index} className="border-sky-200 bg-sky-50 p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <h4 className="text-black font-semibold">Experience #{index + 1}</h4>
                  <Button
                    type="button"
                    onClick={() => removeExperience(index)}
                    size="sm"
                    variant="destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    value={exp.title}
                    onChange={(e) => updateExperience(index, 'title', e.target.value)}
                    placeholder="Job Title"
                    className="bg-[#1A1D21] border-[#1F2329] text-[#F4F7F5]"
                  />
                  <Input
                    value={exp.company}
                    onChange={(e) => updateExperience(index, 'company', e.target.value)}
                    placeholder="Company"
                    className="bg-[#1A1D21] border-[#1F2329] text-[#F4F7F5]"
                  />
                </div>
                <Input
                  value={exp.period}
                  onChange={(e) => updateExperience(index, 'period', e.target.value)}
                  placeholder="Period (e.g., 2020 - Present)"
                  className="bg-[#1A1D21] border-[#1F2329] text-[#F4F7F5]"
                />
                <Textarea
                  value={exp.description}
                  onChange={(e) => updateExperience(index, 'description', e.target.value)}
                  placeholder="Description"
                  className="bg-[#1A1D21] border-[#1F2329] text-[#F4F7F5]"
                  rows={2}
                />
              </div>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Education */}
      <Card className="border-[#1F2329] bg-[#0F1113]/80 shadow-lg shadow-[#008CE2]/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-[#F4F7F5]">Education</CardTitle>
            <Button type="button" onClick={addEducation} size="sm" className="bg-sky-500 text-white hover:bg-sky-600">
              <Plus className="w-4 h-4 mr-2" />
              Add Education
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {formData.education?.map((edu, index) => (
            <Card key={index} className="border-sky-200 bg-sky-50 p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <h4 className="text-black font-semibold">Education #{index + 1}</h4>
                  <Button
                    type="button"
                    onClick={() => removeEducation(index)}
                    size="sm"
                    variant="destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <Input
                  value={edu.degree}
                  onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                  placeholder="Degree (e.g., MFA in Digital Media)"
                  className="bg-[#1A1D21] border-[#1F2329] text-[#F4F7F5]"
                />
                <Input
                  value={edu.school}
                  onChange={(e) => updateEducation(index, 'school', e.target.value)}
                  placeholder="School"
                  className="bg-[#1A1D21] border-[#1F2329] text-[#F4F7F5]"
                />
                <Input
                  value={edu.year}
                  onChange={(e) => updateEducation(index, 'year', e.target.value)}
                  placeholder="Year"
                  className="bg-[#1A1D21] border-[#1F2329] text-[#F4F7F5]"
                />
              </div>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Awards */}
      <Card className="border-[#1F2329] bg-[#0F1113]/80 shadow-lg shadow-[#008CE2]/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-[#F4F7F5]">Awards & Recognition</CardTitle>
            <Button type="button" onClick={addAward} size="sm" className="bg-sky-500 text-white hover:bg-sky-600">
              <Plus className="w-4 h-4 mr-2" />
              Add Award
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {formData.awards?.map((award, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={award}
                onChange={(e) => updateAward(index, e.target.value)}
                placeholder="Award title"
                className="bg-[#1A1D21] border-[#1F2329] text-[#F4F7F5]"
              />
              <Button
                type="button"
                onClick={() => removeAward(index)}
                size="icon"
                variant="destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Projects */}
      <Card className="border-[#1F2329] bg-[#0F1113]/80 shadow-lg shadow-[#008CE2]/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-[#F4F7F5]">Project IDs</CardTitle>
            <Button type="button" onClick={addProject} size="sm" className="bg-sky-500 text-white hover:bg-sky-600">
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {formData.projects?.map((project, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={project}
                onChange={(e) => updateProject(index, e.target.value)}
                placeholder="Project ID (e.g., luxury-watch-campaign)"
                className="bg-[#1A1D21] border-[#1F2329] text-[#F4F7F5]"
              />
              <Button
                type="button"
                onClick={() => removeProject(index)}
                size="icon"
                variant="destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={loading}
          className="bg-sky-500 text-white hover:bg-sky-600"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>{isEdit ? 'Update' : 'Create'} Team Member</>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="bg-sky-500 text-white hover:bg-sky-600"
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
