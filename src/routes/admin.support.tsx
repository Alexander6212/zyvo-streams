import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/support")({ component: SupportAdmin });

const statuses = ["open", "pending", "resolved"] as const;

function SupportAdmin() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-support"],
    queryFn: async () => { const { data, error } = await supabase.from("support_messages").select("*").order("created_at", { ascending: false }); if (error) throw error; return data; },
  });

  const setStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => { const { error } = await supabase.from("support_messages").update({ status }).eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-support"] }); toast.success("Updated"); },
    onError: (e: any) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("support_messages").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-support"] }); toast.success("Deleted"); },
    onError: (e: any) => toast.error(e.message),
  });

  const items = (data ?? []).filter((m: any) =>
    (!filter || m.status === filter) &&
    (!search || `${m.name} ${m.email} ${m.subject ?? ""} ${m.message}`.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div><h1 className="text-2xl font-extrabold">Support messages</h1><p className="text-sm text-muted-foreground">Inbox from the contact form.</p></div>
        <div className="flex gap-2">
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
            <option value="">All</option>{statuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <Input placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
        </div>
      </div>

      <div className="space-y-3">
        {isLoading && <div className="text-sm text-muted-foreground">Loading…</div>}
        {!isLoading && items.length === 0 && <div className="text-sm text-muted-foreground">No messages.</div>}
        {items.map((m: any) => (
          <div key={m.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <div className="font-semibold">{m.subject || "(no subject)"}</div>
                <div className="text-xs text-muted-foreground">From {m.name} &lt;{m.email}&gt; • {new Date(m.created_at).toLocaleString()}</div>
              </div>
              <Badge variant={m.status === "resolved" ? "default" : m.status === "pending" ? "secondary" : "outline"}>{m.status}</Badge>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm">{m.message}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {statuses.map((s) => (
                <Button key={s} size="sm" variant={m.status === s ? "default" : "outline"} onClick={() => setStatus.mutate({ id: m.id, status: s })}>
                  Mark {s}
                </Button>
              ))}
              <Button size="sm" variant="outline" asChild><a href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject || "your message")}`}>Reply by email</a></Button>
              <AlertDialog>
                <AlertDialogTrigger asChild><Button size="sm" variant="destructive"><Trash2 className="h-3.5 w-3.5 mr-1" />Delete</Button></AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader><AlertDialogTitle>Delete this message?</AlertDialogTitle></AlertDialogHeader>
                  <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => del.mutate(m.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
