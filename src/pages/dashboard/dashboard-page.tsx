import { useAppSelector } from '@/store/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Building2, Activity, TrendingUp, Calendar, DollarSign, FileText, UserCheck } from 'lucide-react'

export default function DashboardPage() {
  const user = useAppSelector((state) => state.auth.user)

  // Static dashboard data
  const stats = [
    {
      title: "Total Patients",
      value: "1,234",
      change: "+12.5%",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Active Staff",
      value: "156",
      change: "+5.2%",
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Departments",
      value: "24",
      change: "+2",
      icon: Building2,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "Monthly Revenue",
      value: "$125,430",
      change: "+18.3%",
      icon: DollarSign,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    }
  ]

  const recentActivities = [
    { id: 1, type: "Appointment", description: "New appointment scheduled for Dr. Smith", time: "2 hours ago", status: "completed" },
    { id: 2, type: "Patient", description: "Patient registration completed", time: "4 hours ago", status: "completed" },
    { id: 3, type: "Staff", description: "New staff member added", time: "6 hours ago", status: "pending" },
    { id: 4, type: "Equipment", description: "Equipment maintenance scheduled", time: "1 day ago", status: "completed" },
    { id: 5, type: "Report", description: "Monthly report generated", time: "2 days ago", status: "completed" }
  ]

  const upcomingEvents = [
    { id: 1, title: "Board Meeting", date: "2024-01-15", time: "10:00 AM", location: "Conference Room A" },
    { id: 2, title: "Staff Training", date: "2024-01-16", time: "2:00 PM", location: "Training Hall" },
    { id: 3, title: "Equipment Audit", date: "2024-01-18", time: "9:00 AM", location: "Main Building" }
  ]

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back{user?.name ? `, ${user.name}` : ''}!
        </h1>
        <p className="text-gray-600">Here's what's happening at MediPark Hospital today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      {stat.change}
                    </p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 pb-4 border-b last:border-0">
                  <div className={`p-2 rounded-lg ${
                    activity.status === 'completed' ? 'bg-green-100' : 'bg-yellow-100'
                  }`}>
                    <FileText className={`h-4 w-4 ${
                      activity.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.description}</p>
                    <p className="text-sm text-gray-500 mt-1">{activity.time}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    activity.status === 'completed' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {activity.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="p-4 border rounded-lg hover:bg-primary/30 rounded-t-lg transition-colors">
                  <p className="font-semibold text-gray-900 mb-1">{event.title}</p>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {event.date}
                    </p>
                    <p className="flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      {event.time}
                    </p>
                    <p className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      {event.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Today's Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">47</p>
            <p className="text-sm text-gray-600 mt-2">12 pending, 35 completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Available Beds</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">23</p>
            <p className="text-sm text-gray-600 mt-2">Out of 150 total beds</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pending Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-600">8</p>
            <p className="text-sm text-gray-600 mt-2">Require immediate attention</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
