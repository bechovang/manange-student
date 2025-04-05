import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarSchedule } from "@/components/calendar-schedule"
import { AddScheduleForm } from "@/components/add-schedule-form"

export default function SchedulePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Lịch học</h1>
          <p className="text-muted-foreground">Quản lý lịch học và lịch dạy của giáo viên</p>
        </div>
        <AddScheduleForm />
      </div>

      <Tabs defaultValue="week" className="space-y-4">
        <TabsList>
          <TabsTrigger value="week">Tuần</TabsTrigger>
        </TabsList>
        <TabsContent value="week" className="space-y-4">
          <CalendarSchedule view="week" />
        </TabsContent>
      </Tabs>
    </div>
  )
}

