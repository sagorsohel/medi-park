import { useAppSelector } from "@/store/hooks";
import { Users, CreditCard, Share2, TrendingUp, UserCheck, Clock, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router";

export default function CRMDashboardPage() {
  const { user } = useAppSelector((state) => state.auth);

  const stats = [
    {
      title: "Active Investors",
      value: "1,284",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
      change: "+12.5%",
      href: "/accounting/software/investor"
    },
    {
      title: "Shared Capital",
      value: "৳ 45.2M",
      icon: Share2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      change: "+8.2%",
      href: "/accounting/software/share-manage"
    },
    {
      title: "Pending Installments",
      value: "42",
      icon: Clock,
      color: "text-orange-600",
      bg: "bg-orange-50",
      change: "-5.4%",
      href: "/accounting/software/installment-rules"
    },
    {
      title: "Growth",
      value: "+24.8%",
      icon: TrendingUp,
      color: "text-purple-600",
      bg: "bg-purple-50",
      change: "+1.2%",
      href: "/accounting/software/dashboard"
    }
  ];

  return (
    <div className="space-y-8 p-1 sm:p-6 lg:p-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Accounting Dashboard</h1>
          <p className="text-slate-500 font-medium">Welcome back, {user?.name || "Accounting Admin"}!</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 bg-white px-4 py-2 rounded-xl border-2 border-slate-100/50 shadow-sm">
          <UserCheck className="h-4 w-4 text-emerald-500" />
          Last synced: Today, 11:32 AM
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, i) => (
          <Link to={stat.href} key={i}>
            <Card className="group border-2 border-slate-100 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 rounded-[22px] overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
                <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-widest">{stat.title}</CardTitle>
                <div className={`${stat.bg} ${stat.color} p-2.5 rounded-xl group-hover:scale-110 transition-transform`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="text-3xl font-black text-slate-900 mb-1">{stat.value}</div>
                <div className={`text-xs font-bold ${stat.change.startsWith('+') ? 'text-emerald-500' : 'text-orange-500'}`}>
                  {stat.change} <span className="text-slate-400 font-medium ml-1">v/s last month</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
         {/* Recent Investors Card */}
         <Card className="border-2 border-slate-100 rounded-[22px] overflow-hidden bg-white shadow-sm">
           <CardHeader className="border-b-2 border-slate-50/80 p-6 flex flex-row items-center justify-between">
             <CardTitle className="text-lg font-black text-slate-900 tracking-tight">Recent Investors</CardTitle>
             <Link to="/accounting/software/investor" className="text-sm font-bold text-primary hover:underline">View All</Link>
           </CardHeader>
           <CardContent className="p-0">
             <div className="divide-y divide-slate-50">
               {[1, 2, 3].map((item) => (
                 <div key={item} className="flex items-center gap-4 p-5 hover:bg-slate-50/50 transition-colors">
                   <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                      <Users className="h-6 w-6 text-slate-400" />
                   </div>
                   <div className="flex-1 min-w-0">
                     <p className="text-sm font-bold text-slate-900 truncate">Investor #{item}042</p>
                     <p className="text-xs font-medium text-slate-500">Gold Tier Associate</p>
                   </div>
                   <div className="text-right">
                     <p className="text-sm font-bold text-slate-900">৳ 250,000</p>
                     <p className="text-[10px] font-black text-emerald-500 uppercase">Completed</p>
                   </div>
                 </div>
               ))}
             </div>
           </CardContent>
         </Card>

         {/* Share Distribution Snapshot */}
         <Card className="border-2 border-slate-100 rounded-[22px] overflow-hidden bg-white shadow-sm">
           <CardHeader className="border-b-2 border-slate-50/80 p-6 flex flex-row items-center justify-between">
             <CardTitle className="text-lg font-black text-slate-900 tracking-tight">Security Check</CardTitle>
             <ShieldCheck className="h-5 w-5 text-emerald-500" />
           </CardHeader>
           <CardContent className="p-8 flex flex-col items-center justify-center text-center space-y-4">
             <div className="h-24 w-24 rounded-full bg-primary/5 flex items-center justify-center">
                <CreditCard className="h-10 w-10 text-primary" />
             </div>
             <div className="space-y-1">
               <h3 className="font-black text-slate-900">System is Secure</h3>
               <p className="text-sm text-slate-500 font-medium">All shares and transactions are encrypted <br/>and backed up to the main server.</p>
             </div>
             <Link to="/accounting/software/share-manage">
              <button className="bg-slate-900 text-white rounded-xl px-6 py-2.5 text-sm font-bold shadow-lg hover:shadow-slate-200 transition-all active:scale-95">
                Audit Transaction Log
              </button>
             </Link>
           </CardContent>
         </Card>
      </div>
    </div>
  );
}

