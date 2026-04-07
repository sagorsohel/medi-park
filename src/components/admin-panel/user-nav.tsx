import { LogOut, User as UserIcon, Settings, UserCircle } from "lucide-react";
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

export function UserNav() {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-14 w-auto p-0 hover:bg-transparent focus-visible:ring-0">
          <div className="bg-white rounded-lg p-1 shadow-sm border border-gray-200/50 hover:border-primary/30 transition-colors">
            <div className="flex items-center gap-1">
              {/* Avatar Icon Section */}
              <div className="bg-primary/10 rounded-lg p-2 shrink-0">
                <UserIcon className="w-6 h-6 text-primary" />
              </div>

              {/* User Info Section */}
              <div className="bg-white rounded-lg px-3 py-2 flex-1 min-w-[120px] text-left">
                <p className="text-sm font-bold text-gray-900 leading-none mb-1 truncate">
                  {user?.name || 'Admin'}
                </p>
                <p className="text-xs text-gray-500 leading-none truncate">
                  {user?.email || 'admin@example.com'}
                </p>
              </div>
            </div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name || 'Admin'}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email || 'admin@example.com'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate('/admin/profile')}>
            <UserCircle className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
