"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Upload, Loader2 } from "lucide-react"
import { ServiceDocument } from "@/lib/models/Service"
import { useRouter } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ServiceFormProps {
  initialData?: Partial<ServiceDocument>
  isEdit?: boolean
}

export function ServiceForm({ initialData, isEdit = false }: ServiceFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState<Partial<ServiceDocument>>({
    id: initialData?.id || "",
    icon: initialData?.icon || "Code",
    title: initialData?.title || "",
    tagline: initialData?.tagline || "",
    description: initialData?.description || "",
    longDescription: initialData?.longDescription || "",
    features: initialData?.features || [""],
    process: initialData?.process || [{ step: "", description: "" }],
    packages: initialData?.packages || [{ 
      name: "", 
      price: "", 
      duration: "", 
      revisions: "", 
      features: [""],
      popular: false 
    }],
    stats: initialData?.stats?.map(stat => ({
      ...stat,
      icon: stat.icon || "Award"
    })) || [{ icon: "Award", label: "", value: "" }],
    pricing: initialData?.pricing || "",
    color: initialData?.color || "from-blue-500/20 to-cyan-500/20",
    image: initialData?.image || "",
  })

  // Image upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('files', file)  // Changed from 'file' to 'files'

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

  // Auto-generate ID from title
  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      id: isEdit ? prev.id : title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    }))
  }

  // Features handlers
  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...(prev.features || []), ""]
    }))
  }

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index)
    }))
  }

  const updateFeature = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.map((f, i) => i === index ? value : f)
    }))
  }

  // Process handlers
  const addProcessStep = () => {
    setFormData(prev => ({
      ...prev,
      process: [...(prev.process || []), { step: "", description: "" }]
    }))
  }

  const removeProcessStep = (index: number) => {
    setFormData(prev => ({
      ...prev,
      process: prev.process?.filter((_, i) => i !== index)
    }))
  }

  const updateProcessStep = (index: number, field: 'step' | 'description', value: string) => {
    setFormData(prev => ({
      ...prev,
      process: prev.process?.map((p, i) => 
        i === index ? { ...p, [field]: value } : p
      )
    }))
  }

  // Package handlers
  const addPackage = () => {
    setFormData(prev => ({
      ...prev,
      packages: [...(prev.packages || []), { 
        name: "", 
        price: "", 
        duration: "", 
        revisions: "", 
        features: [""],
        popular: false 
      }]
    }))
  }

  const removePackage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      packages: prev.packages?.filter((_, i) => i !== index)
    }))
  }

  const updatePackage = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      packages: prev.packages?.map((p, i) => 
        i === index ? { ...p, [field]: value } : p
      )
    }))
  }

  const addPackageFeature = (packageIndex: number) => {
    setFormData(prev => ({
      ...prev,
      packages: prev.packages?.map((p, i) => 
        i === packageIndex ? { ...p, features: [...p.features, ""] } : p
      )
    }))
  }

  const removePackageFeature = (packageIndex: number, featureIndex: number) => {
    setFormData(prev => ({
      ...prev,
      packages: prev.packages?.map((p, i) => 
        i === packageIndex 
          ? { ...p, features: p.features.filter((_, fi) => fi !== featureIndex) } 
          : p
      )
    }))
  }

  const updatePackageFeature = (packageIndex: number, featureIndex: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      packages: prev.packages?.map((p, i) => 
        i === packageIndex 
          ? { ...p, features: p.features.map((f, fi) => fi === featureIndex ? value : f) } 
          : p
      )
    }))
  }

  // Stats handlers
  const addStat = () => {
    setFormData(prev => ({
      ...prev,
      stats: [...(prev.stats || []), { icon: "Award", label: "", value: "" }]
    }))
  }

  const removeStat = (index: number) => {
    setFormData(prev => ({
      ...prev,
      stats: prev.stats?.filter((_, i) => i !== index)
    }))
  }

  const updateStat = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      stats: prev.stats?.map((s, i) => 
        i === index ? { ...s, [field]: value } : s
      )
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = isEdit 
        ? `/api/services/${formData.id}`
        : '/api/services'
      
      const method = isEdit ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/admin/services')
        router.refresh()
      } else {
        alert('Failed to save service')
      }
    } catch (error) {
      console.error('Error saving service:', error)
      alert('Error saving service')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card className="border-[#1F2329] bg-[#0F1113]/80 shadow-lg shadow-[#008CE2]/20">
        <CardHeader>
          <CardTitle className="text-[#F4F7F5]">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-[#F4F7F5]">Service Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
                className="bg-[#1A1D21] border-[#1F2329] text-[#F4F7F5]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="id" className="text-[#F4F7F5]">Service ID (URL)</Label>
              <Input
                id="id"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                required
                disabled={isEdit}
                className="bg-[#1A1D21] border-[#1F2329] text-[#F4F7F5]"
                placeholder="auto-generated-from-title"
              />
              <p className="text-xs text-gray-400">
                URL: /services/{formData.id || 'service-id'}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tagline" className="text-[#F4F7F5]">Tagline</Label>
            <Input
              id="tagline"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              required
              className="bg-[#1A1D21] border-[#1F2329] text-[#F4F7F5]"
              placeholder="Short catchy tagline"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-[#F4F7F5]">Short Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              className="bg-[#1A1D21] border-[#1F2329] text-[#F4F7F5]"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="longDescription" className="text-[#F4F7F5]">Long Description</Label>
            <Textarea
              id="longDescription"
              value={formData.longDescription}
              onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
              className="bg-[#1A1D21] border-[#1F2329] text-[#F4F7F5]"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="icon" className="text-[#F4F7F5]">Icon Name</Label>
              <Input
                id="icon"
                value={formData.icon || "Code"}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="bg-[#1A1D21] border-[#1F2329] text-[#F4F7F5]"
                placeholder="Code"
              />
              <p className="text-xs text-[#F4F7F5]/70">
                Enter any Lucide icon name (e.g., Code, Zap, Globe, Smartphone, Database, Users, Award, Clock, Calendar, MapPin, ShoppingCart, Heart, Star, TrendingUp, CheckCircle, etc.)
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pricing" className="text-[#F4F7F5]">Pricing Text</Label>
              <Input
                id="pricing"
                value={formData.pricing}
                onChange={(e) => setFormData({ ...formData, pricing: e.target.value })}
                className="bg-[#1A1D21] border-[#1F2329] text-[#F4F7F5]"
                placeholder="Starting ৳ 8,500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color" className="text-[#F4F7F5]">Color Gradient</Label>
              <Select
                value={formData.color || "from-blue-500/20 to-cyan-500/20"}
                onValueChange={(value) => setFormData({ ...formData, color: value })}
              >
                <SelectTrigger className="bg-[#1A1D21] border-[#1F2329] text-[#F4F7F5]">
                  <SelectValue placeholder="Select gradient" />
                </SelectTrigger>
                <SelectContent className="bg-white border-sky-200">
                  <SelectItem value="from-blue-500/20 to-cyan-500/20" className="text-[#F4F7F5]">Blue to Cyan</SelectItem>
                  <SelectItem value="from-purple-500/20 to-violet-500/20" className="text-[#F4F7F5]">Purple to Violet</SelectItem>
                  <SelectItem value="from-pink-500/20 to-rose-500/20" className="text-[#F4F7F5]">Pink to Rose</SelectItem>
                  <SelectItem value="from-lime-500/20 to-green-500/20" className="text-[#F4F7F5]">Lime to Green</SelectItem>
                  <SelectItem value="from-indigo-500/20 to-sky-500/20" className="text-[#F4F7F5]">Indigo to Sky</SelectItem>
                  <SelectItem value="from-orange-500/20 to-amber-500/20" className="text-[#F4F7F5]">Orange to Amber</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image" className="text-[#F4F7F5]">Service Image</Label>
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="bg-[#1A1D21] border-[#1F2329] text-[#F4F7F5]"
                  placeholder="Image URL or upload below"
                />
              </div>
              <div className="relative">
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
                <Button
                  type="button"
                  variant="outline"
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
                <img
                  src={formData.image}
                  alt="Preview"
                  className="h-32 w-auto rounded-lg border border-sky-200"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card className="border-[#1F2329] bg-[#0F1113]/80 shadow-lg shadow-[#008CE2]/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-[#F4F7F5]">Features</CardTitle>
            <Button type="button" size="sm" onClick={addFeature} className="bg-sky-500 hover:bg-sky-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Feature
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {formData.features?.map((feature, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={feature}
                onChange={(e) => updateFeature(index, e.target.value)}
                placeholder="Feature description"
                className="bg-[#1A1D21] border-[#1F2329] text-[#F4F7F5]"
              />
              <Button 
                type="button" 
                size="icon" 
                variant="destructive" 
                onClick={() => removeFeature(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Process Steps */}
      <Card className="border-[#1F2329] bg-[#0F1113]/80 shadow-lg shadow-[#008CE2]/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-[#F4F7F5]">Process Steps</CardTitle>
            <Button type="button" size="sm" onClick={addProcessStep} className="bg-sky-500 hover:bg-sky-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Step
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.process?.map((step, index) => (
            <div key={index} className="p-4 border border-[#1F2329] rounded-lg space-y-3 bg-[#0F1113]/80">
              <div className="flex items-center justify-between">
                <span className="text-[#F4F7F5] font-medium">Step {index + 1}</span>
                <Button 
                  type="button" 
                  size="sm" 
                  variant="destructive" 
                  onClick={() => removeProcessStep(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <Input
                value={step.step}
                onChange={(e) => updateProcessStep(index, 'step', e.target.value)}
                placeholder="Step name"
                className="bg-[#1A1D21] border-[#1F2329] text-[#F4F7F5]"
              />
              <Textarea
                value={step.description}
                onChange={(e) => updateProcessStep(index, 'description', e.target.value)}
                placeholder="Step description"
                className="bg-[#1A1D21] border-[#1F2329] text-[#F4F7F5]"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Packages */}
      <Card className="border-[#1F2329] bg-[#0F1113]/80 shadow-lg shadow-[#008CE2]/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-[#F4F7F5]">Pricing Packages</CardTitle>
            <Button type="button" size="sm" onClick={addPackage} className="bg-sky-500 hover:bg-sky-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Package
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {formData.packages?.map((pkg, packageIndex) => (
            <div key={packageIndex} className="p-4 border border-[#1F2329] rounded-lg space-y-4 bg-[#0F1113]/80">
              <div className="flex items-center justify-between">
                <span className="text-[#F4F7F5] font-medium">Package {packageIndex + 1}</span>
                <Button 
                  type="button" 
                  size="sm" 
                  variant="destructive" 
                  onClick={() => removePackage(packageIndex)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  value={pkg.name}
                  onChange={(e) => updatePackage(packageIndex, 'name', e.target.value)}
                  placeholder="Package name"
                  className="bg-[#1A1D21] border-[#1F2329] text-[#F4F7F5]"
                />
                <Input
                  value={pkg.price}
                  onChange={(e) => updatePackage(packageIndex, 'price', e.target.value)}
                  placeholder="৳ 0"
                  className="bg-[#1A1D21] border-[#1F2329] text-[#F4F7F5]"
                />
                <Input
                  value={pkg.duration}
                  onChange={(e) => updatePackage(packageIndex, 'duration', e.target.value)}
                  placeholder="4 Weeks"
                  className="bg-[#1A1D21] border-[#1F2329] text-[#F4F7F5]"
                />
                <Input
                  value={pkg.revisions}
                  onChange={(e) => updatePackage(packageIndex, 'revisions', e.target.value)}
                  placeholder="2 revisions"
                  className="bg-[#1A1D21] border-[#1F2329] text-[#F4F7F5]"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={pkg.popular || false}
                  onChange={(e) => updatePackage(packageIndex, 'popular', e.target.checked)}
                  className="rounded"
                />
                <Label className="text-[#F4F7F5]">Mark as Popular</Label>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-[#F4F7F5]">Package Features</Label>
                  <Button 
                    type="button" 
                    size="sm" 
                    variant="outline"
                    onClick={() => addPackageFeature(packageIndex)}
                    className="border-[#1F2329] hover:bg-[#1A1D21]"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Feature
                  </Button>
                </div>
                {pkg.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex gap-2">
                    <Input
                      value={feature}
                      onChange={(e) => updatePackageFeature(packageIndex, featureIndex, e.target.value)}
                      placeholder="Feature"
                      className="bg-[#1A1D21] border-[#1F2329] text-[#F4F7F5]"
                    />
                    <Button 
                      type="button" 
                      size="icon" 
                      variant="destructive"
                      onClick={() => removePackageFeature(packageIndex, featureIndex)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Stats */}
      <Card className="border-[#1F2329] bg-[#0F1113]/80 shadow-lg shadow-[#008CE2]/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-[#F4F7F5]">Stats</CardTitle>
            <Button type="button" size="sm" onClick={addStat} className="bg-sky-500 hover:bg-sky-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Stat
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {formData.stats?.map((stat, index) => (
            <div key={index} className="grid grid-cols-[150px_1fr_1fr_auto] gap-2">
              <Input
                value={stat.icon || "Award"}
                onChange={(e) => updateStat(index, 'icon', e.target.value)}
                placeholder="Icon name"
                className="bg-[#1A1D21] border-[#1F2329] text-[#F4F7F5]"
              />
              <Input
                value={stat.label || ""}
                onChange={(e) => updateStat(index, 'label', e.target.value)}
                placeholder="Label"
                className="bg-[#1A1D21] border-[#1F2329] text-[#F4F7F5]"
              />
              <Input
                value={stat.value || ""}
                onChange={(e) => updateStat(index, 'value', e.target.value)}
                placeholder="Value"
                className="bg-[#1A1D21] border-[#1F2329] text-[#F4F7F5]"
              />
              <Button 
                type="button" 
                size="icon" 
                variant="destructive" 
                onClick={() => removeStat(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" disabled={loading} size="lg" className="bg-sky-500 hover:bg-sky-600 text-white shadow-md">
          {loading ? "Saving..." : isEdit ? "Update Service" : "Create Service"}
        </Button>
      </div>
    </form>
  )
}
