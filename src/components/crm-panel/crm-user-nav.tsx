import { LogOut, User as UserIcon, LayoutGrid, ShieldCheck } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { useNavigate } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function CRMUserNav() {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/accounting/software/login');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-14 w-auto p-0 hover:bg-transparent focus-visible:ring-0">
          <div className="bg-white rounded-xl p-1 shadow-sm border-2 border-slate-100 hover:border-primary/30 transition-all cursor-pointer">
            <div className="flex items-center gap-1">
              <div className="bg-slate-900 rounded-lg p-2 shrink-0">
                <UserIcon className="w-5 h-5 text-white" />
              </div>

              <div className="bg-white rounded-lg px-3 py-1 flex-1 min-w-[120px] text-left">
                <p className="text-sm font-black text-slate-900 leading-none mb-1 truncate">
                  {user?.name || 'Accounting Admin'}
                </p>
                <div className="flex items-center gap-1.5">
                   <ShieldCheck className="h-3 w-3 text-emerald-500" />
                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-wider">
                      Authorized
                   </p>
                </div>
              </div>
            </div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mt-2 rounded-[22px] border-2 border-slate-50 p-2 shadow-2xl" align="end" forceMount>
        <DropdownMenuLabel className="font-normal p-3">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-black leading-none">{user?.name || 'Accounting User'}</p>
            <p className="text-xs font-medium leading-none text-slate-500">
              {user?.email || 'accounting@medipark.com'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-slate-50" />
        <DropdownMenuGroup className="p-1">
          <DropdownMenuItem className="rounded-xl font-bold py-2.5 text-slate-600 focus:bg-slate-50 focus:text-primary transition-colors" onClick={() => navigate('/accounting/software/dashboard')}>
            <LayoutGrid className="mr-3 h-4 w-4" />
            <span>Accounting System</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-slate-50" />
        <DropdownMenuItem onClick={handleLogout} className="rounded-xl font-bold py-2.5 text-red-600 focus:bg-red-50 focus:text-red-700 transition-colors">
          <LogOut className="mr-3 h-4 w-4" />
          <span>Exit System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
