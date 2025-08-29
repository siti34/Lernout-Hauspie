import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Users,
  MessageCircle,
  Calendar,
  FolderOpen,
  DollarSign,
  MessageSquare,
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();

  const dashboardStats = [
    { label: "Applications in Progress", value: "15" },
    { label: "Upcoming Meetings", value: "3" },
    { label: "Tasks Due Today", value: "7" },
  ];

  const customerInteractions = [
    {
      name: "Kia Björkqvist",
      status: "In Review",
      statusColor: "bg-yellow-100 text-yellow-800",
      lastInteraction: "2 days ago",
      nextSteps: "Confirm Info",
    },
    {
      name: "Siti Fatimah Rosli",
      status: "Approved",
      statusColor: "bg-green-100 text-green-800",
      lastInteraction: "1 week ago",
      nextSteps: "Prepare Docs",
    },
    {
      name: "Thao Vu",
      status: "In Review",
      statusColor: "bg-yellow-100 text-yellow-800",
      lastInteraction: "3 days ago",
      nextSteps: "Verify Income",
    },
    {
      name: "Henry Ala-Turkia",
      status: "Denied",
      statusColor: "bg-red-100 text-red-800",
      lastInteraction: "1 week ago",
      nextSteps: "Provide Feedback",
    },
    {
      name: "Kavy Upadhayi",
      status: "In Review",
      statusColor: "bg-yellow-100 text-yellow-800",
      lastInteraction: "5 days ago",
      nextSteps: "Review Credit Report",
    },
  ];

  const sidebarItems = [
    { icon: Users, label: "Customer Profiles", active: true },
    { icon: MessageCircle, label: "Chat/Messaging", active: false },
    { icon: Calendar, label: "Calendar", active: false },
    { icon: FolderOpen, label: "Documents Archive", active: false },
    { icon: DollarSign, label: "Financial Tools", active: false },
  ];

  return (
    <div className="h-full bg-background">
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-80 bg-background border-r flex-shrink-0 hidden lg:flex lg:flex-col">
          <div className="flex flex-col h-full p-4 justify-between">
            {/* Sidebar Content */}
            <div className="space-y-4">
              {/* Header */}
              <div className="py-2">
                <h2 className="text-base font-medium text-foreground">
                  Mortgage Clerk
                </h2>
              </div>

              {/* Navigation Items */}
              <nav className="space-y-2">
                {sidebarItems.map((item, index) => (
                  <button
                    key={index}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      item.active
                        ? "bg-muted text-foreground"
                        : "text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Chat Widget */}
            <div className="flex items-center gap-3">
              <MessageSquare className="h-6 w-6" />
              <div className="bg-background rounded-xl px-4 py-3 border max-w-72">
                <p className="text-sm">Ask OP Aina</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Search Bar */}
          <div className="border-b bg-background p-3 lg:p-4">
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search"
                className="pl-11 bg-muted border-0 focus-visible:ring-1"
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-h-0 overflow-auto">
            <div className="p-4 lg:p-6 space-y-6">
              {/* Dashboard Title */}
              <div>
                <h1 className="text-xl lg:text-2xl font-bold tracking-tight">
                  Dashboard
                </h1>
              </div>

              {/* Dashboard Stats */}
              <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {dashboardStats.map((stat, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="space-y-2">
                        <p className="text-base font-medium text-foreground">
                          {stat.label}
                        </p>
                        <p className="text-2xl font-bold text-foreground">
                          {stat.value}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </section>

              {/* Recent Customer Interactions */}
              <section>
                <div className="space-y-4">
                  <h2 className="text-xl lg:text-2xl font-bold tracking-tight">
                    Recent Customer Interactions
                  </h2>

                  <Card>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-b">
                            <TableHead className="font-medium text-foreground w-[255px]">
                              Customer Name
                            </TableHead>
                            <TableHead className="font-medium text-foreground w-[187px]">
                              Application Status
                            </TableHead>
                            <TableHead className="font-medium text-foreground w-[258px]">
                              Last Interaction
                            </TableHead>
                            <TableHead className="font-medium text-muted-foreground w-[173px]">
                              Next Steps
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {customerInteractions.map((customer, index) => (
                            <TableRow key={index} className="border-b">
                              <TableCell className="font-medium py-6">
                                <button
                                  onClick={() => navigate("/customer-profile")}
                                  className="text-foreground hover:text-primary underline decoration-transparent hover:decoration-current transition-all"
                                >
                                  {customer.name}
                                </button>
                              </TableCell>
                              <TableCell className="py-6">
                                <Badge
                                  variant="secondary"
                                  className={`${customer.statusColor} border-0 font-medium px-4 py-1`}
                                >
                                  {customer.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="py-6 text-muted-foreground">
                                {customer.lastInteraction}
                              </TableCell>
                              <TableCell className="py-6 font-bold text-muted-foreground">
                                {customer.nextSteps}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Toggle */}
      <div className="lg:hidden fixed bottom-4 right-4">
        <Button size="icon" className="rounded-full">
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
