"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Pencil, Trash2 } from "lucide-react"
import { weekDays, timeSlots, teachers, scheduleEvents } from "@/lib/mockData"
import { getWeekNumber, getDateForDay, getCurrentDay } from "@/lib/utils"
import { updateScheduleEvent, deleteScheduleEvent } from "@/lib/api"

export function CalendarSchedule({ view }: { view: "day" | "week" | "month" | "agenda" }) {
  const [currentDate] = useState(new Date())
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const { toast } = useToast()

  const currentDay = getCurrentDay()

  const handleEventClick = (event: any) => {
    setSelectedEvent(event)
    setIsDialogOpen(true)
    setIsEditMode(false)
  }

  const handleEditClick = () => {
    setIsEditMode(true)
  }

  const handleDeleteClick = async () => {
    try {
      await deleteScheduleEvent(selectedEvent.id)

      toast({
        title: "Lịch học đã được xóa",
        description: `Đã xóa lịch học ${selectedEvent.title}`,
      })

      setIsDialogOpen(false)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Có lỗi xảy ra",
        description: "Không thể xóa lịch học. Vui lòng thử lại sau.",
      })
    }
  }

  const handleSaveClick = async () => {
    try {
      await updateScheduleEvent(selectedEvent.id, selectedEvent)

      toast({
        title: "Lịch học đã được cập nhật",
        description: `Đã cập nhật lịch học ${selectedEvent.title}`,
      })

      setIsEditMode(false)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Có lỗi xảy ra",
        description: "Không thể cập nhật lịch học. Vui lòng thử lại sau.",
      })
    }
  }

  // Hiển thị lịch theo tuần
  if (view === "week") {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">
            Tuần {getWeekNumber(currentDate)}, Tháng {currentDate.getMonth() + 1}/{currentDate.getFullYear()}
          </h3>
          <div className="flex items-center gap-2">
            {teachers.map((teacher) => (
              <div key={teacher.id} className="flex items-center gap-1">
                <div className={`h-3 w-3 rounded-full ${teacher.color?.split(" ")[0]}`}></div>
                <span className="text-xs">{teacher.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-8 rounded-lg border">
          {/* Header - Time slots */}
          <div className="border-r p-2 bg-muted/50">
            <div className="h-10 flex items-center justify-center font-medium">Giờ</div>
          </div>

          {/* Header - Days of week */}
          {[1, 2, 3, 4, 5, 6, 0].map((day) => (
            <div
              key={day}
              className={`border-r p-2 ${day === currentDay ? "bg-blue-50" : "bg-muted/50"} last:border-r-0`}
            >
              <div className="h-10 flex flex-col items-center justify-center">
                <div className="font-medium">{weekDays[day]}</div>
                <div className="text-xs text-muted-foreground">
                  {getDateForDay(currentDate, day).getDate()}/{getDateForDay(currentDate, day).getMonth() + 1}
                </div>
              </div>
            </div>
          ))}

          {/* Time slots */}
          {timeSlots.map((slot, index) => (
            <React.Fragment key={slot}>
              {/* Time slot label */}
              <div className="border-r border-t p-2 bg-muted/20">
                <div className="text-xs text-center">{slot}</div>
              </div>

              {/* Days cells */}
              {[1, 2, 3, 4, 5, 6, 0].map((day) => {
                const eventsForSlot = scheduleEvents.filter(
                  (event) => event.day === day && `${event.startTime} - ${event.endTime}` === slot,
                )

                return (
                  <div
                    key={`${day}-${slot}`}
                    className={`border-r border-t p-2 min-h-[80px] ${day === currentDay ? "bg-blue-50/50" : ""} last:border-r-0`}
                  >
                    {eventsForSlot.map((event) => {
                      const teacher = teachers.find((t) => t.id === event.teacherId)!

                      return (
                        <div
                          key={event.id}
                          className={`rounded-md border p-1 mb-1 cursor-pointer ${teacher.color} hover:shadow-sm transition-shadow`}
                          onClick={() => handleEventClick(event)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="font-medium text-sm">{event.title}</div>
                            <Badge variant="outline" className="text-xs">
                              {event.room}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Avatar className="h-4 w-4">
                              <AvatarImage src={teacher.avatar} alt={teacher.name} />
                              <AvatarFallback className="text-[8px]">
                                {teacher.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs">{teacher.name}</span>
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

        {/* Dialog for event details */}
        {selectedEvent && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{isEditMode ? "Chỉnh sửa lịch học" : "Chi tiết lịch học"}</DialogTitle>
                <DialogDescription>
                  {isEditMode
                    ? "Chỉnh sửa thông tin lịch học"
                    : `Thông tin chi tiết về lịch học ${selectedEvent.title}`}
                </DialogDescription>
              </DialogHeader>

              {isEditMode ? (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                      Tên lớp
                    </Label>
                    <Input
                      id="title"
                      defaultValue={selectedEvent.title}
                      className="col-span-3"
                      onChange={(e) => setSelectedEvent({ ...selectedEvent, title: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="teacher" className="text-right">
                      Giáo viên
                    </Label>
                    <Select
                      defaultValue={selectedEvent.teacherId.toString()}
                      onValueChange={(value) =>
                        setSelectedEvent({ ...selectedEvent, teacherId: Number.parseInt(value) })
                      }
                      className="col-span-3"
                    >
                      <SelectTrigger id="teacher">
                        <SelectValue placeholder="Chọn giáo viên" />
                      </SelectTrigger>
                      <SelectContent>
                        {teachers.map((teacher) => (
                          <SelectItem key={teacher.id} value={teacher.id.toString()}>
                            {teacher.name} - {teacher.subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="room" className="text-right">
                      Phòng học
                    </Label>
                    <Input
                      id="room"
                      defaultValue={selectedEvent.room}
                      className="col-span-3"
                      onChange={(e) => setSelectedEvent({ ...selectedEvent, room: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="day" className="text-right">
                      Ngày học
                    </Label>
                    <Select
                      defaultValue={selectedEvent.day.toString()}
                      onValueChange={(value) => setSelectedEvent({ ...selectedEvent, day: Number.parseInt(value) })}
                      className="col-span-3"
                    >
                      <SelectTrigger id="day">
                        <SelectValue placeholder="Chọn ngày học" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 0].map((day) => (
                          <SelectItem key={day} value={day.toString()}>
                            {weekDays[day]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="startTime" className="text-right">
                      Giờ bắt đầu
                    </Label>
                    <Input
                      id="startTime"
                      type="time"
                      defaultValue={selectedEvent.startTime}
                      className="col-span-3"
                      onChange={(e) => setSelectedEvent({ ...selectedEvent, startTime: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="endTime" className="text-right">
                      Giờ kết thúc
                    </Label>
                    <Input
                      id="endTime"
                      type="time"
                      defaultValue={selectedEvent.endTime}
                      className="col-span-3"
                      onChange={(e) => setSelectedEvent({ ...selectedEvent, endTime: e.target.value })}
                    />
                  </div>
                </div>
              ) : (
                <div className="py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Lớp học</p>
                      <p className="text-lg font-semibold">{selectedEvent.title}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Phòng học</p>
                      <p className="text-lg font-semibold">{selectedEvent.room}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Giáo viên</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={teachers.find((t) => t.id === selectedEvent.teacherId)?.avatar}
                            alt={teachers.find((t) => t.id === selectedEvent.teacherId)?.name}
                          />
                          <AvatarFallback>
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
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Thời gian</p>
                      <p className="text-lg font-semibold">
                        {weekDays[selectedEvent.day]}, {selectedEvent.startTime} - {selectedEvent.endTime}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <DialogFooter>
                {isEditMode ? (
                  <>
                    <Button variant="outline" onClick={() => setIsEditMode(false)}>
                      Hủy
                    </Button>
                    <Button onClick={handleSaveClick} className="bg-red-700 hover:bg-red-800">
                      Lưu thay đổi
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Đóng
                    </Button>
                    <Button variant="destructive" onClick={handleDeleteClick}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Xóa
                    </Button>
                    <Button onClick={handleEditClick} className="bg-red-700 hover:bg-red-800">
                      <Pencil className="mr-2 h-4 w-4" />
                      Chỉnh sửa
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

  // Hiển thị lịch theo ngày (trả về giao diện đơn giản hơn khi không phải view week)
  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center p-8">
          <h3 className="text-lg font-medium mb-2">Chế độ xem theo tuần được kích hoạt</h3>
          <p className="text-muted-foreground">Vui lòng chọn chế độ xem "Tuần" để hiển thị lịch</p>
        </div>
      </CardContent>
    </Card>
  )
}

