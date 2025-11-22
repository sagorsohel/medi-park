import { useAppSelector } from '@/store/hooks'

export default function DashboardPage() {
  const user = useAppSelector((state) => state.auth.user)

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="text-muted-foreground mb-6">Only authenticated users can view this route.</p>
      <div className="p-6 border rounded-lg bg-card">
        <h2 className="text-xl font-semibold mb-2">
          Welcome back{user?.name ? `, ${user.name}` : ''}!
        </h2>
        <p className="text-muted-foreground">Replace this section with real widgets and analytics.</p>
        {user && (
          <div className="mt-4 p-4 bg-muted rounded-md">
            <p className="text-sm"><strong>Email:</strong> {user.email}</p>
            <p className="text-sm"><strong>Role:</strong> {user.role}</p>
          </div>
        )}
      </div>
    </div>
  )
}

