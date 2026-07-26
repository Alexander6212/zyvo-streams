import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/channels")({ component: ChannelsAdmin });

type C = { name: string; logo_url: string; category: string; country: string; status: string; featured: boolean };
const empty: C = { name: "", logo_url: "", category: "", country: "", status: "active", featured: false };

function ChannelsAdmin() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<C>(empty);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-channels"],
    queryFn: async () => { const { data, error } = await supabase.from("channels").select("*").order("name"); if (error) throw error; return data; },
  });

  const save = useMutation({
    mutationFn: async () => {
      const payload: any = { name: form.name, logo_url: form.logo_url || null, category: form.category || null, country: form.country || null, status: form.status, featured: form.featured };
      if (editingId) { const { error } = await supabase.from("channels").update(payload).eq("id", editingId); if (error) throw error; }
      else { const { error } = await supabase.from("channels").insert(payload); if (error) throw error; }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-channels"] }); setOpen(false); setForm(empty); setEditingId(null); toast.success("Saved"); },
    onError: (e: any) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("channels").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-channels"] }); toast.success("Deleted"); },
    onError: (e: any) => toast.error(e.message),
  });

  const openEdit = (c: any) => { setForm({ name: c.name, logo_url: c.logo_url ?? "", category: c.category ?? "", country: c.country ?? "", status: c.status, featured: !!c.featured }); setEditingId(c.id); setOpen(true); };

  const items = (data ?? []).filter((c: any) => !search || c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div><h1 className="text-2xl font-extrabold">Channels</h1><p className="text-sm text-muted-foreground">Manage TV channel entries.</p></div>
        <div className="flex gap-2">
          <Input placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
          <Button onClick={() => { setForm(empty); setEditingId(null); setOpen(true); }} className="rounded-full bg-gradient-hero border-0 text-primary-foreground shadow-glow"><Plus className="h-4 w-4 mr-1" /> New</Button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-soft overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left"><tr>
            <th className="p-3">Logo</th><th className="p-3">Name</th><th className="p-3">Category</th><th className="p-3">Country</th><th className="p-3">Status</th><th className="p-3 text-right">Actions</th>
          </tr></thead>
          <tbody>
            {isLoading && <tr><td colSpan={6} className="p-4 text-center text-muted-foreground">Loading…</td></tr>}
            {!isLoading && items.length === 0 && <tr><td colSpan={6} className="p-4 text-center text-muted-foreground">No channels.</td></tr>}
            {items.map((c: any) => (
              <tr key={c.id} className="border-t">
                <td className="p-3">{c.logo_url ? <img src={c.logo_url} alt={c.name} className="h-8 w-8 object-cover rounded" /> : <div className="h-8 w-8 rounded bg-muted" />}</td>
                <td className="p-3 font-medium">{c.name} {c.featured && <Badge className="ml-1 bg-gradient-hero text-primary-foreground border-0">Featured</Badge>}</td>
                <td className="p-3 text-xs">{c.category || "—"}</td>
                <td className="p-3 text-xs">{c.country || "—"}</td>
                <td className="p-3"><Badge variant={c.status === "active" ? "default" : "secondary"}>{c.status}</Badge></td>
                <td className="p-3">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button size="sm" variant="outline" onClick={() => openEdit(c)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild><Button size="sm" variant="destructive"><Trash2 className="h-3.5 w-3.5" /></Button></AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader><AlertDialogTitle>Delete channel?</AlertDialogTitle></AlertDialogHeader>
                        <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => del.mutate(c.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editingId ? "Edit channel" : "New channel"}</DialogTitle></DialogHeader>
          <div className="grid gap-4">
            <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><Label>Logo URL</Label><Input value={form.logo_url} onChange={(e) => setForm({ ...form, logo_url: e.target.value })} /></div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div><Label>Category</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
              <div><Label>Country</Label><Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} /></div>
            </div>
            <div><Label>Status</Label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                <option value="active">Active</option><option value="disabled">Disabled</option>
              </select>
            </div>
            <div className="flex items-center gap-2"><Switch checked={form.featured} onCheckedChange={(v) => setForm({ ...form, featured: v })} /><Label>Featured</Label></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => save.mutate()} disabled={!form.name || save.isPending} className="bg-gradient-hero border-0 text-primary-foreground">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
