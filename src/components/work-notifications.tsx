import { Link } from "@tanstack/react-router";
import { Bell, Check, WalletCards } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type WorkNotification = Tables<"work_notifications">;

export function WorkNotifications({ user }: { user: User }) {
  const [notifications, setNotifications] = useState<WorkNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = useCallback(async () => {
    const { data } = await supabase
      .from("work_notifications")
      .select("*")
      .eq("recipient_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);
    setNotifications(data ?? []);
    setLoading(false);
  }, [user.id]);

  useEffect(() => {
    void loadNotifications();
    const channel = supabase
      .channel(`work-notifications-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "work_notifications",
          filter: `recipient_id=eq.${user.id}`,
        },
        () => void loadNotifications(),
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [loadNotifications, user.id]);

  const unreadCount = notifications.filter((item) => !item.is_read).length;

  const markRead = async (id: string) => {
    setNotifications((current) =>
      current.map((item) => (item.id === id ? { ...item, is_read: true } : item)),
    );
    await supabase.from("work_notifications").update({ is_read: true }).eq("id", id);
  };

  const markAllRead = async () => {
    setNotifications((current) => current.map((item) => ({ ...item, is_read: true })));
    await supabase
      .from("work_notifications")
      .update({ is_read: true })
      .eq("recipient_id", user.id)
      .eq("is_read", false);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Work notifications">
          <Bell />
          {unreadCount > 0 ? (
            <span className="absolute right-0 top-0 grid min-h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-bold leading-none text-destructive-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[min(22rem,calc(100vw-2rem))] p-0">
        <div className="flex items-center justify-between border-b border-border p-4">
          <div>
            <p className="font-semibold">Work updates</p>
            <p className="text-xs text-muted-foreground">Applications, approvals and payments</p>
          </div>
          {unreadCount > 0 ? (
            <Button variant="ghost" size="sm" onClick={markAllRead}>
              <Check /> Mark read
            </Button>
          ) : null}
        </div>
        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <p className="p-6 text-center text-sm text-muted-foreground">Loading updates…</p>
          ) : notifications.length === 0 ? (
            <div className="p-7 text-center">
              <WalletCards className="mx-auto h-6 w-6 text-muted-foreground" />
              <p className="mt-2 text-sm font-medium">No work updates yet</p>
            </div>
          ) : (
            notifications.map((item) => (
              <Link
                key={item.id}
                to="/work/my"
                onClick={() => void markRead(item.id)}
                className={cn(
                  "block border-b border-border/60 p-4 transition-colors last:border-0 hover:bg-muted/50",
                  !item.is_read && "bg-primary/5",
                )}
              >
                <div className="flex gap-3">
                  <span
                    className={cn(
                      "mt-1 h-2 w-2 shrink-0 rounded-full",
                      item.is_read ? "bg-muted-foreground/30" : "bg-primary",
                    )}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.message}</p>
                    <p className="mt-2 text-[11px] text-muted-foreground">
                      {new Intl.DateTimeFormat("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(new Date(item.created_at))}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
        <div className="border-t border-border p-2">
          <Button asChild variant="ghost" size="sm" className="w-full">
            <Link to="/work/my">Open My Work</Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}