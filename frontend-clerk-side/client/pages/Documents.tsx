import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Users,
  MessageCircle,
  Calendar as CalendarIcon,
  FolderOpen,
  DollarSign,
  MessageSquare,
  FileText,
} from "lucide-react";

export default function Documents() {
  const [activeView, setActiveView] = useState<"type" | "customer">("type");

  const sidebarItems = [
    { icon: Users, label: "Customer Profiles", active: false },
    { icon: MessageCircle, label: "Chat/Messaging", active: false },
    { icon: CalendarIcon, label: "Calendar", active: false },
    { icon: FolderOpen, label: "Documents Archive", active: true },
    { icon: DollarSign, label: "Financial Tools", active: false },
  ];

  const internalResources = [
    { title: "Company Guidelines", icon: FileText },
    { title: "Training Materials", icon: FileText },
    { title: "Compliance Documents", icon: FileText },
    { title: "Policy Updates", icon: FileText },
  ];

  // Type view data
  const documentTypes = [
    { type: "Application Form", status: "Archived", action: "View" },
    { type: "Financial Statements", status: "Archived", action: "View" },
    { type: "Correspondence", status: "Viewed - 1", action: "View unopened" },
    { type: "Additional Documents", status: "Archived", action: "View" },
    { type: "ID Verification", status: "Archived", action: "View" },
  ];

  // Customer view data
  const customerDocuments = [
    { customer: "Kia Björkqvist", status: "Archived", action: "View" },
    { customer: "Siti Fatimah Rosli", status: "Archived", action: "View" },
    { customer: "Thao Vu", status: "Viewed - 1", action: "View unopened" },
    { customer: "Henry Ala-Turkia", status: "Archived", action: "View" },
    { customer: "Kavy Upadhayay", status: "Archived", action: "View" },
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
              {/* Page Title */}
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
                  Documents
                </h1>
              </div>

              {/* Internal Resources */}
              <section>
                <h2 className="text-xl lg:text-2xl font-bold tracking-tight mb-3">
                  Internal Resources
                </h2>

                {/* Search Documents */}
                <div className="mb-4">
                  <div className="relative max-w-full">
                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search documents"
                      className="pl-11 bg-muted border-0 focus-visible:ring-1"
                    />
                  </div>
                </div>

                {/* Resource Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {internalResources.map((resource, index) => (
                    <Card
                      key={index}
                      className="border border-border hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <CardContent className="p-4 flex items-center gap-3">
                        <resource.icon className="h-6 w-6 text-foreground flex-shrink-0" />
                        <div className="min-w-0">
                          <h3 className="font-bold text-base leading-5">
                            {resource.title}
                          </h3>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              {/* Customer Documents */}
              <section>
                <h2 className="text-xl lg:text-2xl font-bold tracking-tight mb-3">
                  Customer Documents
                </h2>

                {/* Search Customer Documents */}
                <div className="mb-6">
                  <div className="relative max-w-full">
                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search customer documents"
                      className="pl-11 bg-muted border-0 focus-visible:ring-1"
                    />
                  </div>
                </div>

                {/* View Tabs */}
                <div className="border-b border-border mb-3">
                  <div className="flex gap-8">
                    <button
                      onClick={() => setActiveView("type")}
                      className={`pb-3 border-b-2 transition-colors ${
                        activeView === "type"
                          ? "border-foreground text-foreground font-bold"
                          : "border-transparent text-muted-foreground font-bold hover:text-foreground"
                      }`}
                    >
                      Type view
                    </button>
                    <button
                      onClick={() => setActiveView("customer")}
                      className={`pb-3 border-b-2 transition-colors ${
                        activeView === "customer"
                          ? "border-foreground text-foreground font-bold"
                          : "border-transparent text-muted-foreground font-bold hover:text-foreground"
                      }`}
                    >
                      Customer View
                    </button>
                  </div>
                </div>

                {/* Documents Table */}
                <Card className="border border-border">
                  <CardContent className="p-0">
                    {/* Table Header */}
                    <div className="grid grid-cols-3 bg-background border-b border-border">
                      <div className="p-3 lg:p-4">
                        <h3 className="font-medium text-sm">
                          {activeView === "type"
                            ? "Document Type"
                            : "Document Type"}
                        </h3>
                      </div>
                      <div className="p-3 lg:p-4">
                        <h3 className="font-medium text-sm">Status</h3>
                      </div>
                      <div className="p-3 lg:p-4">
                        <h3 className="font-medium text-sm text-muted-foreground">
                          Actions
                        </h3>
                      </div>
                    </div>

                    {/* Table Body */}
                    <div>
                      {(activeView === "type"
                        ? documentTypes
                        : customerDocuments
                      ).map((item, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-3 border-b border-border last:border-b-0 min-h-[72px]"
                        >
                          <div className="p-3 lg:p-4 flex items-center">
                            <span className="text-sm">
                              {activeView === "type"
                                ? item.type
                                : (item as any).customer}
                            </span>
                          </div>
                          <div className="p-3 lg:p-4 flex items-center">
                            <Badge
                              variant="secondary"
                              className="bg-muted text-foreground border-0 font-medium"
                            >
                              {item.status}
                            </Badge>
                          </div>
                          <div className="p-3 lg:p-4 flex items-center">
                            <button className="text-sm font-bold text-muted-foreground hover:text-foreground">
                              {item.action}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
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
