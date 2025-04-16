// Directive to ensure this component is treated as a Client Component in Next.js
"use client"

// Import necessary React hooks and components
import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card" // Shadcn UI Card components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar" // Shadcn UI Avatar components
import { Badge } from "@/components/ui/badge" // Shadcn UI Badge component
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog" // Shadcn UI Dialog components
import { Button } from "@/components/ui/button" // Shadcn UI Button component
import { Input } from "@/components/ui/input" // Shadcn UI Input component
import { Label } from "@/components/ui/label" // Shadcn UI Label component
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select" // Shadcn UI Select components
import { useToast } from "@/components/ui/use-toast" // Shadcn UI Toast hook for notifications
import { Pencil, Trash2 } from "lucide-react" // Icons from lucide-react library

// Import mock data and utility functions from local library files
import { weekDays, timeSlots, teachers, scheduleEvents } from "@/lib/mockData" // Mock data for calendar
import { getWeekNumber, getDateForDay, getCurrentDay } from "@/lib/utils" // Utility functions for date manipulation
import { updateScheduleEvent, deleteScheduleEvent } from "@/lib/api" // Mock API functions for CRUD operations

// Define the structure for the component's props
interface CalendarScheduleProps {
  view: "day" | "week" | "month" | "agenda" // Prop to control the calendar view type
}

/**
 * CalendarSchedule Component
 * Renders a weekly schedule view with event details, editing, and deletion functionality.
 *
 * @param {CalendarScheduleProps} props - The component props.
 * @param {string} props.view - The current view mode ('day', 'week', 'month', 'agenda'). Currently, only 'week' is fully implemented.
 */
export function CalendarSchedule({ view }: CalendarScheduleProps) {
  // State for the current date being displayed (initialized to today)
  const [currentDate] = useState(new Date())
  // State to hold the currently selected event for viewing/editing details
  const [selectedEvent, setSelectedEvent] = useState<any>(null) // Using 'any' for now, consider defining a specific type/interface for events
  // State to control the visibility of the event details dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  // State to toggle between viewing and editing mode within the dialog
  const [isEditMode, setIsEditMode] = useState(false)
  // Hook to display toast notifications
  const { toast } = useToast()

  // Get the current day of the week (0 for Sunday, 1 for Monday, etc.)
  const currentDay = getCurrentDay()

  /**
   * Handles clicking on a schedule event.
   * Sets the selected event, opens the dialog, and ensures it's in view mode.
   * @param {any} event - The clicked event object.
   */
  const handleEventClick = (event: any) => {
    setSelectedEvent(event) // Store the clicked event data
    setIsDialogOpen(true) // Open the dialog
    setIsEditMode(false) // Set dialog to view mode initially
  }

  /**
   * Switches the event details dialog to edit mode.
   */
  const handleEditClick = () => {
    setIsEditMode(true) // Enable edit mode
  }

  /**
   * Handles the deletion of the selected event.
   * Calls the mock API function and shows a success or error toast.
   */
  const handleDeleteClick = async () => {
    if (!selectedEvent) return // Guard clause if no event is selected

    try {
      // Call the mock API to delete the event
      await deleteScheduleEvent(selectedEvent.id)

      // Show success notification
      toast({
        title: "Lịch học đã được xóa", // Title: Schedule deleted
        description: `Đã xóa lịch học ${selectedEvent.title}`, // Description: Deleted schedule [event title]
      })

      // Close the dialog after successful deletion
      setIsDialogOpen(false)
      setSelectedEvent(null) // Clear selected event
    } catch (error) {
      // Show error notification
      console.error("Error deleting event:", error) // Log the error for debugging
      toast({
        variant: "destructive", // Use destructive variant for errors
        title: "Có lỗi xảy ra", // Title: An error occurred
        description: "Không thể xóa lịch học. Vui lòng thử lại sau.", // Description: Could not delete schedule. Please try again later.
      })
    }
  }

  /**
   * Handles saving the changes made to the selected event in edit mode.
   * Calls the mock API function and shows a success or error toast.
   */
  const handleSaveClick = async () => {
    if (!selectedEvent) return // Guard clause if no event is selected

    try {
      // Call the mock API to update the event
      await updateScheduleEvent(selectedEvent.id, selectedEvent)

      // Show success notification
      toast({
        title: "Lịch học đã được cập nhật", // Title: Schedule updated
        description: `Đã cập nhật lịch học ${selectedEvent.title}`, // Description: Updated schedule [event title]
      })

      // Switch back to view mode after successful save
      setIsEditMode(false)
      // Optionally, you might want to refetch or update the local scheduleEvents state here
      // For now, we assume the mock API handles the update implicitly or the data source is refreshed elsewhere.
    } catch (error) {
      // Show error notification
      console.error("Error updating event:", error) // Log the error for debugging
      toast({
        variant: "destructive", // Use destructive variant for errors
        title: "Có lỗi xảy ra", // Title: An error occurred
        description: "Không thể cập nhật lịch học. Vui lòng thử lại sau.", // Description: Could not update schedule. Please try again later.
      })
    }
  }

  // --- Conditional Rendering based on the 'view' prop ---

  // Render the weekly schedule view if 'view' is 'week'
  if (view === "week") {
    return (
      <div className="space-y-4">
        {/* Header Section: Week Number and Teacher Legend */}
        <div className="flex items-center justify-between">
          <h3 className="font-medium">
            {/* Display current week number, month, and year */}
            Tuần {getWeekNumber(currentDate)}, Tháng {currentDate.getMonth() + 1}/{currentDate.getFullYear()}
          </h3>
          {/* Teacher color legend */}
          <div className="flex items-center gap-2">
            {teachers.map((teacher) => (
              <div key={teacher.id} className="flex items-center gap-1">
                {/* Color indicator using Tailwind class from teacher data */}
                <div className={`h-3 w-3 rounded-full ${teacher.color?.split(" ")[0]}`}></div>
                {/* Teacher name */}
                <span className="text-xs">{teacher.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-8 rounded-lg border">
          {/* Top-Left Corner Cell (Empty or Title) */}
          <div className="border-r p-2 bg-muted/50">
            <div className="h-10 flex items-center justify-center font-medium">Giờ</div> {/* Header: Time */}
          </div>

          {/* Header Row: Days of the Week */}
          {/* Map through days [Mon, Tue, Wed, Thu, Fri, Sat, Sun] */}
          {[1, 2, 3, 4, 5, 6, 0].map((day) => (
            <div
              key={day}
              // Apply blue background if it's the current day
              className={`border-r p-2 ${day === currentDay ? "bg-blue-50" : "bg-muted/50"} last:border-r-0`}
            >
              <div className="h-10 flex flex-col items-center justify-center">
                {/* Day name (e.g., "Thứ 2") */}
                <div className="font-medium">{weekDays[day]}</div>
                {/* Date (e.g., "16/4") */}
                <div className="text-xs text-muted-foreground">
                  {getDateForDay(currentDate, day).getDate()}/{getDateForDay(currentDate, day).getMonth() + 1}
                </div>
              </div>
            </div>
          ))}

          {/* Calendar Body: Time Slots and Events */}
          {timeSlots.map((slot) => (
            // Use React.Fragment to avoid adding extra DOM elements for each row
            <React.Fragment key={slot}>
              {/* First Column: Time Slot Label */}
              <div className="border-r border-t p-2 bg-muted/20">
                <div className="text-xs text-center">{slot}</div> {/* e.g., "07:00 - 08:30" */}
              </div>

              {/* Event Cells for each day in the current time slot */}
              {[1, 2, 3, 4, 5, 6, 0].map((day) => {
                // Filter events that match the current day and time slot
                const eventsForSlot = scheduleEvents.filter(
                  (event) => event.day === day && `${event.startTime} - ${event.endTime}` === slot,
                )

                return (
                  <div
                    key={`${day}-${slot}`}
                    // Apply blue background if it's the current day's column
                    className={`border-r border-t p-2 min-h-[80px] ${day === currentDay ? "bg-blue-50/50" : ""} last:border-r-0`}
                  >
                    {/* Render each event found for this specific day and time slot */}
                    {eventsForSlot.map((event) => {
                      // Find the teacher associated with the event
                      // The '!' asserts that a teacher will always be found (potential runtime error if data is inconsistent)
                      const teacher = teachers.find((t) => t.id === event.teacherId)!

                      return (
                        // Event Card - Clickable to open details dialog
                        <div
                          key={event.id}
                          // Apply teacher's color, add hover effect
                          className={`rounded-md border p-1 mb-1 cursor-pointer ${teacher.color} hover:shadow-sm transition-shadow`}
                          onClick={() => handleEventClick(event)} // Attach click handler
                        >
                          {/* Event Title and Room */}
                          <div className="flex items-center justify-between">
                            <div className="font-medium text-sm">{event.title}</div> {/* Class name */}
                            <Badge variant="outline" className="text-xs">
                              {event.room} {/* Room number/name */}
                            </Badge>
                          </div>
                          {/* Teacher Info */}
                          <div className="flex items-center gap-1 mt-1">
                            <Avatar className="h-4 w-4">
                              <AvatarImage src={teacher.avatar} alt={teacher.name} />
                              {/* Fallback initials if image fails */}
                              <AvatarFallback className="text-[8px]">
                                {teacher.name
                                  .split(" ")
                                  .map((n) => n[0]) // Get first letter of each part of the name
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs">{teacher.name}</span> {/* Teacher name */}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </React.Fragment>
          ))}
        </div>

        {/* Event Details Dialog - Rendered conditionally when an event is selected */}
        {selectedEvent && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                {/* Dialog title changes based on mode */}
                <DialogTitle>{isEditMode ? "Chỉnh sửa lịch học" : "Chi tiết lịch học"}</DialogTitle> {/* Edit Schedule / Schedule Details */}
                <DialogDescription>
                  {/* Dialog description changes based on mode */}
                  {isEditMode
                    ? "Chỉnh sửa thông tin lịch học" // Edit schedule information
                    : `Thông tin chi tiết về lịch học ${selectedEvent.title}`} {/* Detailed info about schedule [event title] */}
                </DialogDescription>
              </DialogHeader>

              {/* Dialog Body: Shows either edit form or event details */}
              {isEditMode ? (
                // --- Edit Form ---
                <div className="grid gap-4 py-4">
                  {/* Title Input */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                      Tên lớp {/* Class Name */}
                    </Label>
                    <Input
                      id="title"
                      defaultValue={selectedEvent.title}
                      className="col-span-3"
                      // Update selectedEvent state on change
                      onChange={(e) => setSelectedEvent({ ...selectedEvent, title: e.target.value })}
                    />
                  </div>
                  {/* Teacher Select */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="teacher" className="text-right">
                      Giáo viên {/* Teacher */}
                    </Label>
                    <Select
                      // Use teacherId from selectedEvent as default
                      defaultValue={selectedEvent.teacherId.toString()}
                      // Update teacherId in selectedEvent state
                      onValueChange={(value) =>
                        setSelectedEvent({ ...selectedEvent, teacherId: Number.parseInt(value) })
                      }
                    >
                      <SelectTrigger id="teacher" className="col-span-3">
                        <SelectValue placeholder="Chọn giáo viên" /> {/* Select teacher */}
                      </SelectTrigger>
                      <SelectContent>
                        {/* Populate options from teachers data */}
                        {teachers.map((teacher) => (
                          <SelectItem key={teacher.id} value={teacher.id.toString()}>
                            {teacher.name} - {teacher.subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Room Input */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="room" className="text-right">
                      Phòng học {/* Room */}
                    </Label>
                    <Input
                      id="room"
                      defaultValue={selectedEvent.room}
                      className="col-span-3"
                      onChange={(e) => setSelectedEvent({ ...selectedEvent, room: e.target.value })}
                    />
                  </div>
                  {/* Day Select */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="day" className="text-right">
                      Ngày học {/* Day of Week */}
                    </Label>
                    <Select
                      defaultValue={selectedEvent.day.toString()}
                      onValueChange={(value) => setSelectedEvent({ ...selectedEvent, day: Number.parseInt(value) })}
                    >
                      <SelectTrigger id="day" className="col-span-3">
                        <SelectValue placeholder="Chọn ngày học" /> {/* Select day */}
                      </SelectTrigger>
                      <SelectContent>
                        {/* Populate options using weekDays map */}
                        {[1, 2, 3, 4, 5, 6, 0].map((day) => (
                          <SelectItem key={day} value={day.toString()}>
                            {weekDays[day]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Start Time Input */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="startTime" className="text-right">
                      Giờ bắt đầu {/* Start Time */}
                    </Label>
                    <Input
                      id="startTime"
                      type="time" // HTML5 time input
                      defaultValue={selectedEvent.startTime}
                      className="col-span-3"
                      onChange={(e) => setSelectedEvent({ ...selectedEvent, startTime: e.target.value })}
                    />
                  </div>
                  {/* End Time Input */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="endTime" className="text-right">
                      Giờ kết thúc {/* End Time */}
                    </Label>
                    <Input
                      id="endTime"
                      type="time" // HTML5 time input
                      defaultValue={selectedEvent.endTime}
                      className="col-span-3"
                      onChange={(e) => setSelectedEvent({ ...selectedEvent, endTime: e.target.value })}
                    />
                  </div>
                </div>
              ) : (
                // --- View Details ---
                <div className="py-4">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Display Class Name */}
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Lớp học</p> {/* Class */}
                      <p className="text-lg font-semibold">{selectedEvent.title}</p>
                    </div>
                    {/* Display Room */}
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Phòng học</p> {/* Room */}
                      <p className="text-lg font-semibold">{selectedEvent.room}</p>
                    </div>
                    {/* Display Teacher Info */}
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Giáo viên</p> {/* Teacher */}
                      <div className="flex items-center gap-2 mt-1">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={teachers.find((t) => t.id === selectedEvent.teacherId)?.avatar}
                            alt={teachers.find((t) => t.id === selectedEvent.teacherId)?.name}
                          />
                          <AvatarFallback>
                            {/* Calculate fallback initials */}
                            {teachers
                              .find((t) => t.id === selectedEvent.teacherId)
                              ?.name.split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span>{teachers.find((t) => t.id === selectedEvent.teacherId)?.name}</span>
                      </div>
                    </div>
                    {/* Display Time */}
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Thời gian</p> {/* Time */}
                      <p className="text-lg font-semibold">
                        {/* Format: Day, StartTime - EndTime */}
                        {weekDays[selectedEvent.day]}, {selectedEvent.startTime} - {selectedEvent.endTime}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Dialog Footer: Buttons change based on mode */}
              <DialogFooter>
                {isEditMode ? (
                  // --- Buttons in Edit Mode ---
                  <>
                    <Button variant="outline" onClick={() => setIsEditMode(false)}>
                      Hủy {/* Cancel */}
                    </Button>
                    <Button onClick={handleSaveClick} className="bg-red-700 hover:bg-red-800">
                      Lưu thay đổi {/* Save Changes */}
                    </Button>
                  </>
                ) : (
                  // --- Buttons in View Mode ---
                  <>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Đóng {/* Close */}
                    </Button>
                    <Button variant="destructive" onClick={handleDeleteClick}>
                      <Trash2 className="mr-2 h-4 w-4" /> {/* Delete Icon */}
                      Xóa {/* Delete */}
                    </Button>
                    <Button onClick={handleEditClick} className="bg-red-700 hover:bg-red-800">
                      <Pencil className="mr-2 h-4 w-4" /> {/* Edit Icon */}
                      Chỉnh sửa {/* Edit */}
                    </Button>
                  </>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    )
  }

  // Fallback rendering for views other than 'week'
  // Currently shows a placeholder message prompting the user to select the 'week' view.
  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center p-8">
          <h3 className="text-lg font-medium mb-2">Chế độ xem theo tuần được kích hoạt</h3> {/* Weekly view mode is active */}
          <p className="text-muted-foreground">Vui lòng chọn chế độ xem "Tuần" để hiển thị lịch</p> {/* Please select "Week" view to display the schedule */}
        </div>
      </CardContent>
    </Card>
  )
}
