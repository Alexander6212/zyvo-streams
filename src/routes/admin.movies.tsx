import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/movies")({ component: MoviesAdmin });

type M = { id?: string; title: string; description: string; category: string; genre: string; release_year: string; rating: string; poster_url: string; featured: boolean; enabled: boolean };
const empty: M = { title: "", description: "", category: "", genre: "", release_year: "", rating: "", poster_url: "", featured: false, enabled: true };

function MoviesAdmin() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<M>(empty);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-movies"],
    queryFn: async () => {
      const { data, error } = await supabase.from("movies").select("*").order("created_at", { ascending: false });
      if (error) throw error; return data;
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      const payload: any = {
        title: form.title, description: form.description || null, category: form.category || null,
        genre: form.genre || null, release_year: form.release_year ? Number(form.release_year) : null,
        rating: form.rating ? Number(form.rating) : null, poster_url: form.poster_url || null,
        featured: form.featured, enabled: form.enabled,
      };
      if (editingId) { const { error } = await supabase.from("movies").update(payload).eq("id", editingId); if (error) throw error; }
      else { const { error } = await supabase.from("movies").insert(payload); if (error) throw error; }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-movies"] }); setOpen(false); setForm(empty); setEditingId(null); toast.success("Saved"); },
    onError: (e: any) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("movies").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-movies"] }); toast.success("Deleted"); },
    onError: (e: any) => toast.error(e.message),
  });

  const openNew = () => { setForm(empty); setEditingId(null); setOpen(true); };
  const openEdit = (m: any) => {
    setForm({ title: m.title, description: m.description ?? "", category: m.category ?? "", genre: m.genre ?? "", release_year: m.release_year?.toString() ?? "", rating: m.rating?.toString() ?? "", poster_url: m.poster_url ?? "", featured: !!m.featured, enabled: !!m.enabled });
    setEditingId(m.id); setOpen(true);
  };

  const items = (data ?? []).filter((m: any) => !search || m.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div><h1 className="text-2xl font-extrabold">Movies / VOD</h1><p className="text-sm text-muted-foreground">Manage catalog entries.</p></div>
        <div className="flex gap-2">
          <Input placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
          <Button onClick={openNew} className="rounded-full bg-gradient-hero border-0 text-primary-foreground shadow-glow"><Plus className="h-4 w-4 mr-1" /> New</Button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-soft overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left"><tr>
            <th className="p-3">Poster</th><th className="p-3">Title</th><th className="p-3">Genre</th><th className="p-3">Year</th><th className="p-3">Rating</th><th className="p-3">Flags</th><th className="p-3 text-right">Actions</th>
          </tr></thead>
          <tbody>
            {isLoading && <tr><td colSpan={7} className="p-4 text-center text-muted-foreground">Loading…</td></tr>}
            {!isLoading && items.length === 0 && <tr><td colSpan={7} className="p-4 text-center text-muted-foreground">No entries.</td></tr>}
            {items.map((m: any) => (
              <tr key={m.id} className="border-t">
                <td className="p-3">{m.poster_url ? <img src={m.poster_url} alt={m.title} className="h-12 w-8 object-cover rounded" /> : <div className="h-12 w-8 rounded bg-muted" />}</td>
                <td className="p-3 font-medium">{m.title}</td>
                <td className="p-3 text-xs">{m.genre || "—"}</td>
                <td className="p-3 text-xs">{m.release_year || "—"}</td>
                <td className="p-3 text-xs">{m.rating ?? "—"}</td>
                <td className="p-3 space-x-1">
                  {m.featured && <Badge className="bg-gradient-hero text-primary-foreground border-0">Featured</Badge>}
                  {!m.enabled && <Badge variant="secondary">Disabled</Badge>}
                </td>
                <td className="p-3">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button size="sm" variant="outline" onClick={() => openEdit(m)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild><Button size="sm" variant="destructive"><Trash2 className="h-3.5 w-3.5" /></Button></AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader><AlertDialogTitle>Delete movie?</AlertDialogTitle></AlertDialogHeader>
                        <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => del.mutate(m.id)}>Delete</AlertDialogAction></AlertDialogFooter>
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingId ? "Edit movie" : "New movie"}</DialogTitle></DialogHeader>
          <div className="grid gap-4">
            <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div><Label>Description</Label><Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div><Label>Category</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
              <div><Label>Genre</Label><Input value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} /></div>
              <div><Label>Release year</Label><Input type="number" value={form.release_year} onChange={(e) => setForm({ ...form, release_year: e.target.value })} /></div>
              <div><Label>Rating (0-10)</Label><Input type="number" step="0.1" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} /></div>
            </div>
            <div><Label>Poster image URL</Label><Input value={form.poster_url} onChange={(e) => setForm({ ...form, poster_url: e.target.value })} /></div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2"><Switch checked={form.featured} onCheckedChange={(v) => setForm({ ...form, featured: v })} /><Label>Featured</Label></div>
              <div className="flex items-center gap-2"><Switch checked={form.enabled} onCheckedChange={(v) => setForm({ ...form, enabled: v })} /><Label>Enabled</Label></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => save.mutate()} disabled={!form.title || save.isPending} className="bg-gradient-hero border-0 text-primary-foreground">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
