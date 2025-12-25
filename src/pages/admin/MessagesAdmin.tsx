import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  useContactMessages,
  useMarkMessageRead,
  useDeleteMessage,
} from "@/hooks/useContactMessages";
import { Mail, MailOpen, Trash2, Clock, User, AtSign } from "lucide-react";
import { format } from "date-fns";

export default function MessagesAdmin() {
  const { data: messages, isLoading } = useContactMessages();
  const markRead = useMarkMessageRead();
  const deleteMessage = useDeleteMessage();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleToggleRead = (id: string, currentRead: boolean) => {
    markRead.mutate({ id, read: !currentRead });
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteMessage.mutate(deleteId);
      setDeleteId(null);
    }
  };

  const handleExpandMessage = (id: string, isRead: boolean) => {
    setExpandedId(expandedId === id ? null : id);
    if (!isRead) {
      markRead.mutate({ id, read: true });
    }
  };

  const unreadCount = messages?.filter((m) => !m.read).length || 0;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Messages</h1>
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground mt-1">
            Contact form submissions from visitors
          </p>
        </div>
        {unreadCount > 0 && (
          <Badge variant="default" className="text-sm">
            {unreadCount} unread
          </Badge>
        )}
      </div>

      {!messages || messages.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No messages yet</h3>
            <p className="text-muted-foreground">
              When visitors submit the contact form, their messages will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <Card
              key={message.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                !message.read ? "border-primary/50 bg-primary/5" : ""
              }`}
              onClick={() => handleExpandMessage(message.id, message.read)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    {message.read ? (
                      <MailOpen className="h-5 w-5 text-muted-foreground shrink-0" />
                    ) : (
                      <Mail className="h-5 w-5 text-primary shrink-0" />
                    )}
                    <div className="min-w-0">
                      <CardTitle className="text-lg truncate">
                        {message.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <AtSign className="h-3 w-3" />
                        <span className="truncate">{message.email}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {format(new Date(message.created_at), "MMM d, yyyy h:mm a")}
                    </div>
                    {!message.read && (
                      <Badge variant="default" className="text-xs">
                        New
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p
                  className={`text-muted-foreground ${
                    expandedId === message.id ? "" : "line-clamp-2"
                  }`}
                >
                  {message.message}
                </p>
                {expandedId === message.id && (
                  <div
                    className="flex items-center gap-2 mt-4 pt-4 border-t border-border"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleRead(message.id, message.read)}
                    >
                      {message.read ? (
                        <>
                          <Mail className="h-4 w-4 mr-2" />
                          Mark Unread
                        </>
                      ) : (
                        <>
                          <MailOpen className="h-4 w-4 mr-2" />
                          Mark Read
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <a href={`mailto:${message.email}`}>
                        <AtSign className="h-4 w-4 mr-2" />
                        Reply
                      </a>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeleteId(message.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Message</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this message? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
