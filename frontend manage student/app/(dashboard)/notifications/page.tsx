import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NotificationHistory } from "@/components/notification-history"
import { MessageSquare, History } from "lucide-react"
import { SimplifiedNotificationForm } from "@/components/simplified-notification-form"

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Thông báo Zalo</h1>
        <p className="text-muted-foreground">Gửi thông báo đến phụ huynh qua Zalo</p>
      </div>

      <Tabs defaultValue="send" className="space-y-4">
        <TabsList>
          <TabsTrigger value="send">
            <MessageSquare className="mr-2 h-4 w-4" />
            Gửi thông báo
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="mr-2 h-4 w-4" />
            Lịch sử
          </TabsTrigger>
        </TabsList>
        <TabsContent value="send" className="space-y-4">
          <SimplifiedNotificationForm />
        </TabsContent>
        <TabsContent value="history" className="space-y-4">
          <NotificationHistory />
        </TabsContent>
      </Tabs>
    </div>
  )
}

