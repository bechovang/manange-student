"use client"

import React, { useState, useEffect } from "react"
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
import { Checkbox } from "@/components/ui/checkbox"
//import { useToast } from "@/components/ui/use-toast"
import { Pencil, Trash2 } from "lucide-react"
import { weekDays, timeSlots } from "./const"  // ------------------------------------------------
import {fallBackTeachers, fallBackSchedules } from "./fall-back-data"  // ------------------------------------------------
import {teacher, scheduleEvent } from "./types"  // ------------------------------------------------
import { getWeekNumber, getDateForDay, getCurrentDay } from "@/lib/utils" // -----------------------------------------------
import { updateScheduleEvent, deleteScheduleEvent } from "./api" // -----------------------------------------------

import { toast } from "react-hot-toast" // Thay đổi từ useToast sang react-hot-toast //---------------------------------------------------
import Cookies from "js-cookie" 
import { useRouter } from "next/navigation"
import axios from "axios"

// Define time slots
const TIME_SLOTS = [
  { id: "slot1", label: "07:00 - 08:30", start: "07:00", end: "08:30" },
  { id: "slot2", label: "08:30 - 10:00", start: "08:30", end: "10:00" },
  { id: "slot3", label: "10:00 - 11:30", start: "10:00", end: "11:30" },
  { id: "slot4", label: "13:30 - 15:00", start: "13:30", end: "15:00" },
  { id: "slot5", label: "15:30 - 17:00", start: "15:30", end: "17:00" },
  { id: "slot6", label: "17:00 - 18:30", start: "17:00", end: "18:30" },
  { id: "slot7", label: "18:00 - 19:30", start: "18:00", end: "19:30" },
  { id: "slot8", label: "19:30 - 21:00", start: "19:30", end: "21:00" },
]

// Define weekday mapping from frontend to backend format
const WEEKDAY_MAPPING = {
  "2": "mon",
  "3": "tue",
  "4": "wed",
  "5": "thu", 
  "6": "fri",
  "7": "sat",
  "cn": "sun"
}

export function CalendarSchedule({ view }: { view: "day" | "week" | "month" | "agenda" }) {

  const [teachers, setTeachers] = useState<teacher[]>([]);
  const [scheduleEvents, setScheduleEvents] = useState<scheduleEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true)
  
  // Hàm để lấy danh sách gv từ API 
  const fetchTeachers = async () => {
    try {
      setLoading(true)
      const accessToken = Cookies.get('accessToken')
      console.log('Access Token:', accessToken); // Kiểm tra trong console
      if (!accessToken) {
        console.error('No access token found');
        // router.push('/login'); // Bỏ comment nếu muốn chuyển hướng
        return;
      }

        const response = await axios.get('http://localhost:8080/api/schedule/teachers', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json' // Thêm header này nếu cần
          }
        })
        setTeachers(response.data)
        setError(null)
      } catch (error: any) {
        console.error('Error fetching Teachers:', error);
  
        if (error.response) {
          // Lỗi từ phía server
          console.error('Status:', error.response.status);
          console.error('Data:', error.response.data);
          
          if (error.response.status === 403) {
            toast.error('Bạn không có quyền truy cập. Vui lòng đăng nhập lại.');
            // router.push('/login'); // Bỏ comment nếu muốn chuyển hướng
          }
        }
        
        setError('Không thể tải dữ liệu. Đang sử dụng dữ liệu mẫu.');
        setTeachers(fallBackTeachers);
      } finally {
        setLoading(false)
      }
  }
  const fetchSchedule = async () => {
    try {
      setLoading(true)
      const accessToken = Cookies.get('accessToken')
      console.log('Access Token:', accessToken); // Kiểm tra trong console
      if (!accessToken) {
        console.error('No access token found');
        // router.push('/login'); // Bỏ comment nếu muốn chuyển hướng
        return;
      }

        const response = await axios.get('http://localhost:8080/api/schedule', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json' // Thêm header này nếu cần
          }
        })
        setScheduleEvents(response.data)
        setError(null)
      } catch (error: any) {
        console.error('Error fetching schedule:', error);
        
        if (error.response) {
          // Lỗi từ phía server
          console.error('Status:', error.response.status);
          console.error('Data:', error.response.data);
          
          if (error.response.status === 403) {
            toast.error('Bạn không có quyền truy cập. Vui lòng đăng nhập lại.');
            // router.push('/login'); // Bỏ comment nếu muốn chuyển hướng
          }
        }
        
        setError('Không thể tải dữ liệu. Đang sử dụng dữ liệu mẫu.');
        setScheduleEvents(fallBackSchedules);
      } finally {
        setLoading(false)
      }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null); // Reset error state trước khi fetch
        
        // Sử dụng các hàm API đã được định nghĩa
        const [teachersData, schedulesData] = await Promise.all([
          fetchTeachers(),
          fetchSchedule()
        ]);
  
        //setTeachers(teachersData);
        //setScheduleEvents(schedulesData);
      } catch (err) {
        const errorMessage = 
          err instanceof Error 
            ? err.message 
            : typeof err === 'string' 
              ? err 
              : 'Đã xảy ra lỗi khi tải dữ liệu';
        
        setError(errorMessage);
        console.error("Fetch error:", err);
        
        // Sử dụng dữ liệu fallback khi API lỗi
        setTeachers(fallBackTeachers);
        setScheduleEvents(fallBackSchedules);
        
        // Hiển thị thông báo sử dụng dữ liệu mẫu
        toast.error("Đang hiển thị dữ liệu mẫu. API đã bị lỗi.", {
          duration: 5000,
        });
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, []);

  // For selected weekdays and timeslot in edit mode
  const [selectedDay, setSelectedDay] = useState<string | undefined>();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);

  // Các hàm xử lý sự kiện sử dụng API
  const handleDeleteClick = async () => {
    if (!selectedEvent) return;
    
    try {
      await deleteScheduleEvent(selectedEvent.id);
      setScheduleEvents(prev => prev.filter(e => e.id !== selectedEvent.id));
      
      toast.success(`Xóa thành công lịch học ${selectedEvent.title}`);
      setIsDialogOpen(false);
      setIsDialogOpen(false);
    } catch (error) {
      const errorMessage = 
        error instanceof Error 
          ? error.message 
          : typeof error === 'string' 
            ? error 
            : 'Đã xảy ra lỗi khi xóa';
      
      // Thay đổi toast thành react-hot-toast
      toast.error(errorMessage);
    }
  };

  const handleSaveClick = async () => {
    if (!selectedEvent) return;
    
    try {
      // If we're using the new day selection and time slot methods
      if (selectedDay && selectedTimeSlot) {
        // Find the selected time slot
        const timeSlot = TIME_SLOTS.find(slot => slot.id === selectedTimeSlot);
        if (!timeSlot) {
          toast.error("Vui lòng chọn khung giờ");
          return;
        }
        
        // Map the selectedDay to backend weekday format
        const weekdayMapping: Record<string, string> = {
          "2": "mon", "3": "tue", "4": "wed", "5": "thu", 
          "6": "fri", "7": "sat", "cn": "sun"
        };
        
        const weekday = weekdayMapping[selectedDay];
        if (!weekday) {
          toast.error("Ngày không hợp lệ");
          return;
        }
        
        // Map front-end day to back-end day for UI display
        const dayMap: Record<string, number> = {
          "2": 1, "3": 2, "4": 3, "5": 4, "6": 5, "7": 6, "cn": 0
        };
        
        const eventToUpdate = {...selectedEvent};
        
        // Update both weekday (for backend) and day (for frontend display)
        eventToUpdate.weekday = weekday; // Backend format (mon, tue, etc.)
        eventToUpdate.day = dayMap[selectedDay]; // Frontend format (0-6)
        eventToUpdate.startTime = timeSlot.start;
        eventToUpdate.endTime = timeSlot.end;
        
        console.log("Sending update with weekday:", weekday);
        
        // Update the event
        const updatedEvent = await updateScheduleEvent(selectedEvent.id, eventToUpdate);
        setScheduleEvents(prev => 
          prev.map(e => e.id === updatedEvent.id ? updatedEvent : e)
        );
        
        toast.success(`Đã cập nhật lịch học ${updatedEvent.title}`);
        setIsEditMode(false);
      } else {
        // Original implementation for backward compatibility
        const updatedEvent = await updateScheduleEvent(selectedEvent.id, selectedEvent);
        setScheduleEvents(prev => 
          prev.map(e => e.id === updatedEvent.id ? updatedEvent : e)
        );
        
        toast.success(`Đã cập nhật lịch học ${updatedEvent.title}`);
        setIsEditMode(false);
      }
    } catch (error) {
      const errorMessage = 
        error instanceof Error 
          ? error.message 
          : typeof error === 'string' 
            ? error 
            : 'Đã xảy ra lỗi khi cập nhật';
      
      // Thay đổi toast thành react-hot-toast
      toast.error(errorMessage);
    }
  };

  const [currentDate] = useState(new Date())
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)

  const currentDay = getCurrentDay()

  const handleEventClick = (event: any) => {
    setSelectedEvent(event)
    setIsDialogOpen(true)
    setIsEditMode(false)
    
    // Reset selected days and time slot
    setSelectedDay(undefined);
    setSelectedTimeSlot(null);
  }

  const handleEditClick = () => {
    setIsEditMode(true)
    
    // Initialize selected days and time slot based on current event
    if (selectedEvent) {
      // Map day number back to string format
      const dayMap: Record<number, string> = {
        0: "cn", 1: "2", 2: "3", 3: "4", 4: "5", 5: "6", 6: "7"
      };
      
      const dayString = dayMap[selectedEvent.day];
      if (dayString) {
        setSelectedDay(dayString);
      }
      
      // Find matching time slot
      const timeSlot = TIME_SLOTS.find(
        slot => slot.start === selectedEvent.startTime && slot.end === selectedEvent.endTime
      );
      
      if (timeSlot) {
        setSelectedTimeSlot(timeSlot.id);
      }
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
              className={`border-r p-2 ${day === currentDay ? "bg-blue-100" : "bg-muted/50"} last:border-r-0`}
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
                      const teacher = teachers.find((t) => t.id === event.teacherId);
                      // Use default color if teacher not found
                      const defaultStyle = "bg-blue-100 text-blue-800 border-blue-200";

                      return (
                        <div
                          key={event.id}
                          className={`rounded-md border p-1 mb-1 cursor-pointer ${teacher?.color || defaultStyle}  hover:shadow-sm transition-shadow`}
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
                              <AvatarImage src={teacher?.avatar} alt={teacher?.name || 'Teacher'} />
                              <AvatarFallback className="text-[8px]">
                                {teacher?.name
                                  ? teacher.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")
                                  : "T"}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs">{teacher?.name || 'Unknown Teacher'}</span>
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
                    >
                      <SelectTrigger id="teacher" className="col-span-3">
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
                  <div className="grid grid-cols-4 items-start gap-4">
                    <div className="text-right pt-2">
                      <Label htmlFor="day">Ngày học</Label>
                    </div>
                    <div className="col-span-3">
                      <Select
                        value={selectedDay}
                        onValueChange={setSelectedDay}
                      >
                        <SelectTrigger id="day" className="w-full">
                          <SelectValue placeholder="Chọn ngày học" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2">Thứ 2</SelectItem>
                          <SelectItem value="3">Thứ 3</SelectItem>
                          <SelectItem value="4">Thứ 4</SelectItem>
                          <SelectItem value="5">Thứ 5</SelectItem>
                          <SelectItem value="6">Thứ 6</SelectItem>
                          <SelectItem value="7">Thứ 7</SelectItem>
                          <SelectItem value="cn">Chủ nhật</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="timeSlot" className="text-right">
                      Khung giờ
                    </Label>
                    <Select
                      value={selectedTimeSlot || undefined}
                      onValueChange={setSelectedTimeSlot}
                    >
                      <SelectTrigger id="timeSlot" className="col-span-3">
                        <SelectValue placeholder="Chọn khung giờ" />
                      </SelectTrigger>
                      <SelectContent>
                        {TIME_SLOTS.map((slot) => (
                          <SelectItem key={slot.id} value={slot.id}>
                            {slot.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                            alt={teachers.find((t) => t.id === selectedEvent.teacherId)?.name || 'Teacher'}
                          />
                          <AvatarFallback>
                            {teachers
                              .find((t) => t.id === selectedEvent.teacherId)
                              ?.name?.split(" ")
                              .map((n) => n[0])
                              .join("") || "T"}
                          </AvatarFallback>
                        </Avatar>
                        <span>{teachers.find((t) => t.id === selectedEvent.teacherId)?.name || 'Unknown Teacher'}</span>
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
