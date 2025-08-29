import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Edit,
  MessageCircle,
  Circle,
  CheckCircle,
  Clock,
  FileText,
  AlertTriangle,
  TrendingUp,
  Shield,
  Play,
  MessageSquare,
} from "lucide-react";

export default function CustomerProfile() {
  const [selectedCustomer, setSelectedCustomer] = useState("kia-bjorkqvist");

  const customers = [
    {
      id: "kia-bjorkqvist",
      name: "Kia Björkqvist",
      status: "Application in review",
      active: true,
    },
    {
      id: "siti-fatimah",
      name: "Siti Fatimah Rosli",
      status: "Application in review",
      active: false,
    },
    {
      id: "thao-vu",
      name: "Thao Vu",
      status: "Application in review",
      active: false,
    },
    {
      id: "henry-ala",
      name: "Henry Ala-Turkia",
      status: "Application in review",
      active: false,
    },
    {
      id: "kavy-upadhaya",
      name: "Kavy Upadhaya",
      status: "Application in review",
      active: false,
    },
  ];

  const currentCustomer = customers.find((c) => c.id === selectedCustomer);

  const personalInfo = {
    fullName: "Kia Björkqvist",
    dateOfBirth: "July 12, 1988",
    contactNumber: "+358 (40) 123-4567",
    emailAddress: "kia.bjorkqvist@gmail.com",
    address: "Otakaari 1, 02150, Espoo, Finland",
    socialSecurityNumber: "020498B6332",
  };

  const mortgageInfo = {
    loanAmount: "250,000",
    downPayment: "300,000",
    preliminaryInterestRate: "4.5%",
    loanTerm: "30 years",
    propertyPrice: "Fixed-rate",
    propertyAddress: "Otakaari 2, 02150, Espoo, Finland",
  };

  const applicationProgress = [
    {
      step: "Application Received",
      date: "August 15, 2025",
      status: "completed",
      icon: Circle,
    },
    {
      step: "Documents Verified",
      date: "August 20, 2025",
      status: "completed",
      icon: CheckCircle,
    },
    {
      step: "Review Process",
      date: "August 25, 2025",
      status: "in-progress",
      icon: Search,
    },
    {
      step: "Result Pending",
      date: "August 1, 2025",
      status: "pending",
      icon: Clock,
    },
  ];

  const recommendedActions = [
    {
      title: "Document Verification",
      description: "Verify income documents",
      type: "info" as const,
      icon: FileText,
    },
    {
      title: "Missing Documents",
      description: "Cross-check with other records",
      type: "warning" as const,
      icon: AlertTriangle,
    },
  ];

  const upsellingOpportunities = [
    {
      title: "Credit Card Opportunities",
      description:
        "The client has an active investment portfolio under a competitor bank",
      estValue: "Est. Value:",
      icon: TrendingUp,
    },
    {
      title: "Home Insurance",
      description:
        "Attained property does not include a comprehensive insurance yet",
      estValue: "Est. Value:",
      icon: Shield,
    },
  ];

  const requiredDocuments = [
    {
      name: "Spouse's ID",
      type: "Identification",
      deadline: "2 days ago",
      additionalInfo:
        "Missing information. Resubmission request sent 11/08/2025",
      overdue: true,
    },
    {
      name: "Spouse's Proof of Income",
      type: "Income Identification",
      deadline: "14/08/2025",
      additionalInfo: "",
      overdue: false,
    },
  ];

  const submittedDocuments = [
    {
      name: "Bank Statements",
      type: "Asset Verification",
      submissionDate: "12/08/2025",
      status: "Verified",
      summary: "Bank statements successfully verified",
    },
    {
      name: "Tax Returns (Last 2 Years)",
      type: "Income Verification",
      submissionDate: "11/08/2025",
      status: "Rejected",
      summary: "Tax returns submitted, awaiting verification",
    },
    {
      name: "Credit Report",
      type: "Credit History",
      submissionDate: "11/08/2025",
      status: "Verified",
      summary: "Credit report successfully verified",
    },
  ];

  const transcripts = [
    {
      title: "Loan signing meeting",
      date: "August 18, 2025, 2:00 PM",
    },
    {
      title: "Loan negotiation meeting",
      date: "August 15, 2025, 11:30 AM",
    },
    {
      title: "Check-in with the insurance provider",
      date: "August 12, 2025, 9:00 AM",
    },
    {
      title: "First consultation meeting",
      date: "August 10, 2025, 3:00 PM",
    },
  ];

  const chatHistory = [
    {
      title: "Confirmation of Real Estate Insurance",
      date: "10/08/2025, 10:30",
      preview: "Clerk: Sure, I can help you with that.",
    },
    {
      title: "Document Issues",
      date: "12/08/2025, 10:31",
      preview: "Agent: Please, re-submit the following documents:",
    },
  ];

  return (
    <div className="h-full bg-background">
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-80 border-r bg-background flex-shrink-0 hidden lg:flex lg:flex-col">
          {/* Search */}
          <div className="p-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search"
                className="pl-11 bg-muted border-0 focus-visible:ring-1"
              />
            </div>
          </div>

          {/* Customer List */}
          <div className="flex-1 overflow-auto">
            {customers.map((customer) => (
              <button
                key={customer.id}
                onClick={() => setSelectedCustomer(customer.id)}
                className={`w-full p-4 text-left hover:bg-muted/50 transition-colors ${
                  customer.active ? "bg-muted" : "bg-background"
                }`}
              >
                <div className="space-y-1">
                  <p
                    className={`font-medium leading-none ${
                      customer.active
                        ? "text-foreground font-bold"
                        : "text-foreground"
                    }`}
                  >
                    {customer.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {customer.status}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Chat Widget */}
          <div className="p-4">
            <div className="flex items-center gap-3">
              <MessageCircle className="h-6 w-6" />
              <div className="bg-background rounded-xl px-4 py-3 border max-w-72">
                <p className="text-sm">Ask OP Aina</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          {/* Header */}
          <div className="border-b bg-background">
            <div className="p-4 lg:p-6">
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
                {currentCustomer?.name.toUpperCase() || "KIA BJÖRKQVIST"}
              </h1>
            </div>

            {/* Sub Navigation */}
            <div className="px-4 lg:px-6">
              <Tabs defaultValue="ai-overview" className="w-full">
                <TabsList className="h-auto p-0 bg-transparent">
                  <TabsTrigger
                    value="profile"
                    className="border-b-2 border-transparent data-[state=active]:border-foreground rounded-none bg-transparent px-0 py-3 mr-8 text-muted-foreground"
                  >
                    <span className="font-bold">Profile</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="ai-overview"
                    className="border-b-2 border-transparent data-[state=active]:border-foreground rounded-none bg-transparent px-0 py-3 mr-8"
                  >
                    <span className="font-bold">AI Overview</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="documents"
                    className="border-b-2 border-transparent data-[state=active]:border-foreground rounded-none bg-transparent px-0 py-3 mr-8 text-muted-foreground"
                  >
                    <span className="font-bold">Documents</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="transcripts"
                    className="border-b-2 border-transparent data-[state=active]:border-foreground rounded-none bg-transparent px-0 py-3 mr-8 text-muted-foreground"
                  >
                    <span className="font-bold">Transcripts</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="chat-history"
                    className="border-b-2 border-transparent data-[state=active]:border-foreground rounded-none bg-transparent px-0 py-3 text-muted-foreground"
                  >
                    <span className="font-bold">Chat History</span>
                  </TabsTrigger>
                </TabsList>

                {/* AI Overview Tab */}
                <TabsContent value="ai-overview" className="mt-0">
                  <div className="p-4 lg:p-6 space-y-8 h-full min-h-0 overflow-auto">
                    {/* Application Progress */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Application Progress</CardTitle>
                        <div className="space-y-2">
                          <Progress value={60} className="h-2" />
                          <p className="text-sm text-muted-foreground">
                            60% Complete
                          </p>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          {applicationProgress.map((step, index) => (
                            <div key={index} className="flex items-start gap-4">
                              <div className="flex flex-col items-center">
                                <div
                                  className={`p-2 rounded-full ${
                                    step.status === "completed"
                                      ? "bg-primary text-primary-foreground"
                                      : step.status === "in-progress"
                                        ? "bg-blue-100 text-blue-600"
                                        : "bg-muted text-muted-foreground"
                                  }`}
                                >
                                  <step.icon className="h-4 w-4" />
                                </div>
                                {index < applicationProgress.length - 1 && (
                                  <div className="w-px h-8 bg-border mt-2" />
                                )}
                              </div>
                              <div className="flex-1 space-y-1">
                                <p className="font-medium">{step.step}</p>
                                <p className="text-sm text-muted-foreground">
                                  {step.date}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Recommended Actions */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Recommended Actions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {recommendedActions.map((action, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-4 p-4 rounded-lg border"
                            >
                              <div
                                className={`p-3 rounded-lg ${
                                  action.type === "warning"
                                    ? "bg-red-100 text-red-600"
                                    : "bg-blue-100 text-blue-600"
                                }`}
                              >
                                <action.icon className="h-5 w-5" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">{action.title}</p>
                                <p className="text-sm text-muted-foreground">
                                  {action.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Upselling Potential */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Upselling Potential</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {upsellingOpportunities.map((opportunity, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-4 rounded-lg border"
                            >
                              <div className="flex items-center gap-4">
                                <div className="p-3 rounded-lg bg-muted">
                                  <opportunity.icon className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium">
                                    {opportunity.title}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {opportunity.description}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">
                                  {opportunity.estValue}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Documents Tab */}
                <TabsContent value="documents" className="mt-0">
                  <div className="p-4 lg:p-6 space-y-8 h-full min-h-0 overflow-auto">
                    {/* Required Documents */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Required Documents</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Document Name</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Deadline</TableHead>
                              <TableHead>Additional Information</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {requiredDocuments.map((doc, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">
                                  {doc.name}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                  {doc.type}
                                </TableCell>
                                <TableCell>
                                  {doc.overdue ? (
                                    <Badge variant="destructive">
                                      {doc.deadline}
                                    </Badge>
                                  ) : (
                                    <span>{doc.deadline}</span>
                                  )}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                  {doc.additionalInfo}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>

                    {/* Submitted Documents */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Submitted Documents</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Document Name</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Submission Date</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Summary</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {submittedDocuments.map((doc, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">
                                  {doc.name}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                  {doc.type}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                  {doc.submissionDate}
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant={
                                      doc.status === "Verified"
                                        ? "default"
                                        : "destructive"
                                    }
                                    className={
                                      doc.status === "Verified"
                                        ? "bg-green-100 text-green-800"
                                        : ""
                                    }
                                  >
                                    {doc.status}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                  {doc.summary}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Transcripts Tab */}
                <TabsContent value="transcripts" className="mt-0">
                  <div className="p-4 lg:p-6 h-full min-h-0 overflow-auto">
                    <div className="space-y-6">
                      {transcripts.map((transcript, index) => (
                        <div key={index} className="flex items-start gap-4">
                          <div className="flex flex-col items-center">
                            <div className="p-2 rounded-full bg-primary text-primary-foreground">
                              <Play className="h-4 w-4" />
                            </div>
                            {index < transcripts.length - 1 && (
                              <div className="w-px h-8 bg-border mt-4" />
                            )}
                          </div>
                          <div className="flex-1 space-y-1 py-2">
                            <p className="font-medium">{transcript.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {transcript.date}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* Chat History Tab */}
                <TabsContent value="chat-history" className="mt-0">
                  <div className="p-4 lg:p-6 space-y-6 h-full min-h-0 overflow-auto">
                    <Card>
                      <CardContent className="p-4">
                        <div className="bg-muted rounded-lg p-4">
                          <p className="text-sm">Start a new message thread</p>
                        </div>
                      </CardContent>
                    </Card>

                    {chatHistory.map((chat, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="space-y-2">
                                <p className="font-medium">{chat.title}</p>
                                <p className="text-sm text-muted-foreground">
                                  {chat.date}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {chat.preview}
                                </p>
                              </div>
                            </div>
                            <Button variant="secondary" size="sm">
                              Open Chat
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Profile Tab */}
                <TabsContent value="profile" className="mt-0">
                  <div className="p-4 lg:p-6 space-y-8 h-full min-h-0 overflow-auto">
                    {/* Personal Information */}
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                          <CardTitle className="text-xl">
                            Personal Information
                          </CardTitle>
                        </div>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-6">
                            <div className="space-y-1 border-t pt-4">
                              <p className="text-sm text-muted-foreground">
                                Full Name
                              </p>
                              <p className="text-sm">{personalInfo.fullName}</p>
                            </div>
                            <div className="space-y-1 border-t pt-4">
                              <p className="text-sm text-muted-foreground">
                                Contact Number
                              </p>
                              <p className="text-sm">
                                {personalInfo.contactNumber}
                              </p>
                            </div>
                            <div className="space-y-1 border-t pt-4">
                              <p className="text-sm text-muted-foreground">
                                Address
                              </p>
                              <p className="text-sm">{personalInfo.address}</p>
                            </div>
                          </div>
                          <div className="space-y-6">
                            <div className="space-y-1 border-t pt-4">
                              <p className="text-sm text-muted-foreground">
                                Date of Birth
                              </p>
                              <p className="text-sm">
                                {personalInfo.dateOfBirth}
                              </p>
                            </div>
                            <div className="space-y-1 border-t pt-4">
                              <p className="text-sm text-muted-foreground">
                                Email Address
                              </p>
                              <p className="text-sm">
                                {personalInfo.emailAddress}
                              </p>
                            </div>
                            <div className="space-y-1 border-t pt-4">
                              <p className="text-sm text-muted-foreground">
                                Social Security Number
                              </p>
                              <p className="text-sm">
                                {personalInfo.socialSecurityNumber}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Mortgage Information */}
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                          <CardTitle className="text-xl">
                            Mortgage Information
                          </CardTitle>
                        </div>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-6">
                            <div className="space-y-1 border-t pt-4">
                              <p className="text-sm text-muted-foreground">
                                Loan Amount
                              </p>
                              <p className="text-sm">
                                {mortgageInfo.loanAmount}
                              </p>
                            </div>
                            <div className="space-y-1 border-t pt-4">
                              <p className="text-sm text-muted-foreground">
                                Preliminary Interest Rate
                              </p>
                              <p className="text-sm">
                                {mortgageInfo.preliminaryInterestRate}
                              </p>
                            </div>
                            <div className="space-y-1 border-t pt-4">
                              <p className="text-sm text-muted-foreground">
                                Property Price
                              </p>
                              <p className="text-sm">
                                {mortgageInfo.propertyPrice}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-6">
                            <div className="space-y-1 border-t pt-4">
                              <p className="text-sm text-muted-foreground">
                                Down Payment
                              </p>
                              <p className="text-sm">
                                {mortgageInfo.downPayment}
                              </p>
                            </div>
                            <div className="space-y-1 border-t pt-4">
                              <p className="text-sm text-muted-foreground">
                                Loan Term
                              </p>
                              <p className="text-sm">{mortgageInfo.loanTerm}</p>
                            </div>
                            <div className="space-y-1 border-t pt-4">
                              <p className="text-sm text-muted-foreground">
                                Property Address
                              </p>
                              <p className="text-sm">
                                {mortgageInfo.propertyAddress}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
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
