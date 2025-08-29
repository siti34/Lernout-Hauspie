import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export default function TopBar() {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "px-3 py-2 text-sm font-medium rounded-md transition-colors",
      isActive
        ? "bg-muted text-foreground"
        : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
    );

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="h-14 flex items-center justify-between gap-4">
          {/* Left: Brand */}
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="font-semibold tracking-tight text-foreground"
            >
              Mortgage Clerk
            </Link>
          </div>

          {/* Center: Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/dashboard" className={navLinkClass} end>
              Dashboard
            </NavLink>
            <NavLink to="/customer-profile" className={navLinkClass}>
              Customer Profiles
            </NavLink>
            <NavLink to="/calendar" className={navLinkClass}>
              Calendar
            </NavLink>
            <NavLink to="/documents" className={navLinkClass}>
              Documents
            </NavLink>
          </nav>

          {/* Right: User */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild className="md:hidden">
              <Link to="/dashboard">Dashboard</Link>
            </Button>
            <Button variant="ghost" asChild className="md:hidden">
              <Link to="/customer-profile">Profiles</Link>
            </Button>
            <Button variant="ghost" asChild className="md:hidden">
              <Link to="/calendar">Calendar</Link>
            </Button>
            <Button variant="ghost" asChild className="md:hidden">
              <Link to="/documents">Documents</Link>
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarFallback>OP</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}
