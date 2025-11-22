"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Briefcase, FolderKanban, Users, TrendingUp, Package } from "lucide-react"
import Link from "next/link"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts"

const COLORS = ['#3b82f6', '#0ea5e9', '#38bdf8', '#f97316']

export default function AdminDashboard() {
  const [services, setServices] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [servicesRes, projectsRes, teamRes] = await Promise.all([
        fetch('/api/services'),
        fetch('/api/projects'),
        fetch('/api/team')
      ])

      const servicesData = await servicesRes.json()
      const projectsData = await projectsRes.json()
      const teamData = await teamRes.json()

      setServices(servicesData.success ? servicesData.data : [])
      setProjects(projectsData.success ? projectsData.data : [])
      setTeamMembers(teamData.success ? teamData.data : [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    {
      title: "Total Services",
      value: services.length,
      icon: Briefcase,
      href: "/admin/services",
      color: "text-[#008CE2]",
    },
    {
      title: "Total Projects",
      value: projects.length,
      icon: FolderKanban,
      href: "/admin/projects",
      color: "text-[#008CE2]",
    },
    {
      title: "Team Members",
      value: teamMembers.length,
      icon: Users,
      href: "/admin/team",
      color: "text-[#008CE2]",
    },
    {
      title: "Total Orders",
      value: 0,
      icon: Package,
      href: "/admin",
      color: "text-orange-500",
    },
  ]

  // Chart data
  const pieData = [
    { name: 'Services', value: services.length, color: '#3b82f6' },
    { name: 'Projects', value: projects.length, color: '#0ea5e9' },
    { name: 'Team', value: teamMembers.length, color: '#38bdf8' },
  ]

  const projectStatusData = [
    { 
      status: 'Completed', 
      count: projects.filter(p => p.status === 'Completed').length 
    },
    { 
      status: 'In Progress', 
      count: projects.filter(p => p.status === 'In Progress').length 
    },
    { 
      status: 'On Hold', 
      count: projects.filter(p => p.status === 'On Hold').length 
    },
  ]

  const monthlyData = [
    { month: 'Jan', projects: 4, services: 2 },
    { month: 'Feb', projects: 6, services: 3 },
    { month: 'Mar', projects: 8, services: 5 },
    { month: 'Apr', projects: 12, services: 6 },
    { month: 'May', projects: 15, services: 8 },
    { month: 'Jun', projects: projects.length, services: services.length },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#F4F7F5]">
          Dashboard Overview
        </h1>
        <p className="text-[#F4F7F5]/80 mt-2">Manage your agency content and data</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="border-[#1F2329] bg-[#0F1113]/80 shadow-lg shadow-[#008CE2]/20 hover:shadow-xl hover:shadow-[#06B9D0]/30 hover:scale-[1.02] transition-all duration-300 cursor-pointer animate-fade-in-up">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#F4F7F5]/70 text-sm">{stat.title}</p>
                    <p className="text-3xl font-bold text-[#F4F7F5] mt-2">
                      {loading ? '...' : stat.value}
                    </p>
                  </div>
                  <stat.icon className={`w-12 h-12 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="border-[#1F2329] bg-[#0F1113]/80 shadow-lg shadow-[#008CE2]/20 animate-fade-in-up">
        <CardHeader>
          <CardTitle className="text-[#F4F7F5]">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button asChild className="h-auto py-6 flex-col gap-2 bg-[#008CE2] text-white hover:bg-[#06B9D0] shadow-md hover:shadow-lg hover:shadow-[#06B9D0]/40 transition-all duration-300">
            <Link href="/admin/services/new">
              <Briefcase className="w-6 h-6" />
              <span>Add New Service</span>
            </Link>
          </Button>
          <Button asChild className="h-auto py-6 flex-col gap-2 bg-[#008CE2] text-white hover:bg-[#06B9D0] shadow-md hover:shadow-lg hover:shadow-[#06B9D0]/40 transition-all duration-300">
            <Link href="/admin/projects/new">
              <FolderKanban className="w-6 h-6" />
              <span>Add New Project</span>
            </Link>
          </Button>
          <Button asChild className="h-auto py-6 flex-col gap-2 bg-[#008CE2] text-white hover:bg-[#06B9D0] shadow-md hover:shadow-lg hover:shadow-[#06B9D0]/40 transition-all duration-300">
            <Link href="/admin/team/new">
              <Users className="w-6 h-6" />
              <span>Add Team Member</span>
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="border-[#1F2329] bg-[#0F1113]/80 shadow-lg shadow-[#008CE2]/20 animate-fade-in-up">
        <CardHeader>
          <CardTitle className="text-[#F4F7F5]">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!loading && services.length > 0 && (
              <div className="flex items-center gap-4 p-4 rounded-lg bg-[#1A1D21] border border-[#1F2329] hover:scale-[1.02] transition-all duration-300">
                <Briefcase className="w-5 h-5 text-[#008CE2]" />
                <div>
                  <p className="text-[#F4F7F5] font-medium">{services.length} Services Available</p>
                  <p className="text-[#F4F7F5]/70 text-sm">Latest: {services[0]?.title || 'N/A'}</p>
                </div>
              </div>
            )}
            {!loading && projects.length > 0 && (
              <div className="flex items-center gap-4 p-4 rounded-lg bg-[#1A1D21] border border-[#1F2329] hover:scale-[1.02] transition-all duration-300">
                <FolderKanban className="w-5 h-5 text-[#008CE2]" />
                <div>
                  <p className="text-[#F4F7F5] font-medium">{projects.length} Projects Completed</p>
                  <p className="text-[#F4F7F5]/70 text-sm">Latest: {projects[0]?.title || 'N/A'}</p>
                </div>
              </div>
            )}
            {!loading && teamMembers.length > 0 && (
              <div className="flex items-center gap-4 p-4 rounded-lg bg-[#1A1D21] border border-[#1F2329] hover:scale-[1.02] transition-all duration-300">
                <Users className="w-5 h-5 text-[#008CE2]" />
                <div>
                  <p className="text-[#F4F7F5] font-medium">{teamMembers.length} Team Members</p>
                  <p className="text-[#F4F7F5]/70 text-sm">Latest: {teamMembers[0]?.name || 'N/A'}</p>
                </div>
              </div>
            )}
            {!loading && services.length === 0 && projects.length === 0 && teamMembers.length === 0 && (
              <div className="flex items-center gap-4 p-4 rounded-lg bg-[#1A1D21] border border-[#1F2329] hover:scale-[1.02] transition-all duration-300">
                <TrendingUp className="w-5 h-5 text-[#008CE2]" />
                <div>
                  <p className="text-[#F4F7F5] font-medium">System initialized</p>
                  <p className="text-[#F4F7F5]/70 text-sm">Admin panel is ready to use</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Distribution Pie Chart */}
        <Card className="border-[#1F2329] bg-[#0F1113]/80 shadow-lg shadow-[#008CE2]/20 hover:scale-[1.02] transition-all duration-300 animate-fade-in-up">
          <CardHeader>
            <CardTitle className="text-[#F4F7F5]">Content Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry: any) => `${entry.name} ${(entry.percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 17, 19, 0.95)', 
                    border: '1px solid #1F2329',
                    borderRadius: '8px',
                    color: '#F4F7F5'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Project Status Bar Chart */}
        <Card className="border-[#1F2329] bg-[#0F1113]/80 shadow-lg shadow-[#008CE2]/20 hover:scale-[1.02] transition-all duration-300 animate-fade-in-up">
          <CardHeader>
            <CardTitle className="text-[#F4F7F5]">Project Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectStatusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(31, 35, 41, 0.5)" />
                <XAxis 
                  dataKey="status" 
                  stroke="#F4F7F5" 
                  tick={{ fill: '#F4F7F5' }}
                />
                <YAxis 
                  stroke="#F4F7F5" 
                  tick={{ fill: '#F4F7F5' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 17, 19, 0.95)', 
                    border: '1px solid #1F2329',
                    borderRadius: '8px',
                    color: '#F4F7F5'
                  }}
                />
                <Bar dataKey="count" fill="#008CE2" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Growth Trend Line Chart */}
        <Card className="border-[#1F2329] bg-[#0F1113]/80 shadow-lg shadow-[#008CE2]/20 hover:scale-[1.02] transition-all duration-300 animate-fade-in-up lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-[#F4F7F5]">Growth Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(31, 35, 41, 0.5)" />
                <XAxis 
                  dataKey="month" 
                  stroke="#F4F7F5" 
                  tick={{ fill: '#F4F7F5' }}
                />
                <YAxis 
                  stroke="#F4F7F5" 
                  tick={{ fill: '#F4F7F5' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 17, 19, 0.95)', 
                    border: '1px solid #1F2329',
                    borderRadius: '8px',
                    color: '#F4F7F5'
                  }}
                />
                <Legend 
                  wrapperStyle={{ color: '#F4F7F5' }}
                  iconType="circle"
                />
                <Line 
                  type="monotone" 
                  dataKey="projects" 
                  stroke="#008CE2" 
                  strokeWidth={3}
                  dot={{ fill: '#008CE2', r: 6 }}
                  activeDot={{ r: 8 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="services" 
                  stroke="#06B9D0" 
                  strokeWidth={3}
                  dot={{ fill: '#06B9D0', r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
