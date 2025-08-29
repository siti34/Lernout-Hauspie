import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Users,
  MessageCircle,
  Calendar as CalendarIcon,
  FolderOpen,
  DollarSign,
  MessageSquare,
} from "lucide-react";

export default function Calendar() {
  const sidebarItems = [
    { icon: Users, label: "Customer Profiles", active: false },
    { icon: MessageCircle, label: "Chat/Messaging", active: false },
    { icon: CalendarIcon, label: "Calendar", active: true },
    { icon: FolderOpen, label: "Documents Archive", active: false },
    { icon: DollarSign, label: "Financial Tools", active: false },
  ];

  const calendarEvents = [
    // August 28 (previous month, faded)
    {
      day: 28,
      isPrevMonth: true,
      events: [
        {
          title: "Company all-hands",
          subtitle: "Full day blocker",
          type: "full-day",
        },
      ],
    },
    // August 29 (previous month, faded)
    {
      day: 29,
      isPrevMonth: true,
      events: [{ title: "Loan Negotiation", type: "blue" }],
    },
    // August 30 (previous month, faded)
    {
      day: 30,
      isPrevMonth: true,
      events: [{ title: "Loan Negotiation", type: "blue" }],
    },
    // August 31 (previous month, faded)
    {
      day: 31,
      isPrevMonth: true,
      events: [{ title: "Consultation", type: "blue" }],
    },
    // August 1
    { day: 1, events: [{ title: "13:00 - Loan Negotiation", type: "blue" }] },
    // August 2 (has multiple events)
    {
      day: 2,
      events: [
        { title: "Client Meeting", type: "blue" },
        { title: "Team Meeting", type: "orange" },
        { title: "Partner Meeting", type: "red" },
      ],
    },
    // August 4
    { day: 4, events: [{ title: "15:00 - Loan Negotiation", type: "blue" }] },
    // August 5 (empty)
    { day: 5, events: [] },
    // August 6
    { day: 6, events: [{ title: "13:00 - Consultation", type: "blue" }] },
    // August 7 (empty)
    { day: 7, events: [] },
    // August 8
    { day: 8, events: [{ title: "18:00 - Insurance Dinner", type: "red" }] },
    // August 11 (empty)
    { day: 11, events: [] },
    // August 12
    { day: 12, events: [{ title: "14:00 - Team Check-in", type: "orange" }] },
    // August 13
    { day: 13, events: [{ title: "13:00 - Partner Lunch", type: "red" }] },
    // August 14
    { day: 14, events: [{ title: "15:00 - Loan Negotiation", type: "blue" }] },
    // August 15
    { day: 15, events: [{ title: "15:00 - Loan Negotiation", type: "blue" }] },
    // August 18 (empty)
    { day: 18, events: [] },
    // August 19
    { day: 19, events: [{ title: "14:00 - Team Check-in", type: "orange" }] },
    // August 20 (empty)
    { day: 20, events: [] },
    // August 21
    {
      day: 21,
      events: [
        { title: "All-hands prep", subtitle: "Reading goal", type: "full-day" },
      ],
    },
    // August 22
    {
      day: 22,
      events: [
        {
          title: "Company all-hands",
          subtitle: "Full day blocker",
          type: "full-day",
        },
      ],
    },
  ];

  const getEventBgColor = (type: string) => {
    switch (type) {
      case "blue":
        return "bg-blue-50 text-blue-600";
      case "orange":
        return "bg-orange-50 text-orange-600";
      case "red":
        return "bg-red-50 text-red-600";
      default:
        return "bg-gray-50 text-gray-600";
    }
  };

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
            {/* Title */}
            <div className="p-4 lg:p-6 pb-3">
              <h1 className="text-xl lg:text-2xl font-bold tracking-tight">
                Calendar: August
              </h1>
            </div>

            {/* Calendar Grid */}
            <div className="p-4 lg:p-6 pt-0">
              <div className="grid grid-cols-5 gap-2.5">
                {calendarEvents.map((dayData, index) => (
                  <Card
                    key={index}
                    className="h-[140px] border border-gray-200"
                  >
                    <CardContent className="p-3 h-full flex flex-col justify-between">
                      {/* Day Number */}
                      <div
                        className={`text-xl font-medium ${dayData.isPrevMonth ? "opacity-20" : ""}`}
                      >
                        {dayData.day}
                      </div>

                      {/* Events */}
                      <div
                        className={`space-y-1.5 ${dayData.isPrevMonth ? "opacity-20" : ""}`}
                      >
                        {dayData.events.map((event, eventIndex) => (
                          <div key={eventIndex}>
                            {event.type === "full-day" ? (
                              /* Full day events */
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-black">
                                  {event.title}
                                </div>
                                {event.subtitle && (
                                  <div className="text-sm text-black opacity-40">
                                    {event.subtitle}
                                  </div>
                                )}
                              </div>
                            ) : (
                              /* Timed events with colored backgrounds */
                              <div
                                className={`px-1 py-0.5 rounded text-xs font-medium ${getEventBgColor(event.type)}`}
                              >
                                {event.title}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
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
