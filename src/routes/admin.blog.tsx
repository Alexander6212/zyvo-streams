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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/admin/blog")({ component: BlogAdmin });

type Post = {
  id?: string; title: string; slug: string; excerpt: string; content: string;
  featured_image: string; category: string; tags: string; author: string;
  published: boolean; seo_title: string; seo_description: string;
};

const empty: Post = { title: "", slug: "", excerpt: "", content: "", featured_image: "", category: "", tags: "", author: "", published: false, seo_title: "", seo_description: "" };

function slugify(s: string) { return s.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""); }

function BlogAdmin() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Post>(empty);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-posts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      const payload: any = {
        title: form.title,
        slug: form.slug || slugify(form.title),
        excerpt: form.excerpt || null,
        content: form.content,
        featured_image: form.featured_image || null,
        category: form.category || null,
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        author: form.author || null,
        published: form.published,
        published_at: form.published ? new Date().toISOString() : null,
        seo_title: form.seo_title || null,
        seo_description: form.seo_description || null,
        created_by: user?.id ?? null,
      };
      if (editingId) {
        const { error } = await supabase.from("blog_posts").update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("blog_posts").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-posts"] }); setOpen(false); setForm(empty); setEditingId(null); toast.success("Saved"); },
    onError: (e: any) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("blog_posts").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-posts"] }); toast.success("Deleted"); },
    onError: (e: any) => toast.error(e.message),
  });

  const togglePublish = useMutation({
    mutationFn: async (p: any) => {
      const { error } = await supabase.from("blog_posts").update({ published: !p.published, published_at: !p.published ? new Date().toISOString() : p.published_at }).eq("id", p.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-posts"] }),
    onError: (e: any) => toast.error(e.message),
  });

  const openNew = () => { setForm(empty); setEditingId(null); setOpen(true); };
  const openEdit = (p: any) => {
    setForm({
      title: p.title, slug: p.slug, excerpt: p.excerpt ?? "", content: p.content ?? "",
      featured_image: p.featured_image ?? "", category: p.category ?? "", tags: (p.tags ?? []).join(", "),
      author: p.author ?? "", published: !!p.published, seo_title: p.seo_title ?? "", seo_description: p.seo_description ?? "",
    });
    setEditingId(p.id); setOpen(true);
  };

  const posts = (data ?? []).filter((p: any) => !search || p.title.toLowerCase().includes(search.toLowerCase()) || (p.slug ?? "").includes(search.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold">Blog</h1>
          <p className="text-sm text-muted-foreground">Create, edit and publish blog posts.</p>
        </div>
        <div className="flex gap-2">
          <Input placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
          <Button onClick={openNew} className="rounded-full bg-gradient-hero border-0 text-primary-foreground shadow-glow"><Plus className="h-4 w-4 mr-1" /> New post</Button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-soft overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left"><tr>
            <th className="p-3">Title</th><th className="p-3">Slug</th><th className="p-3">Category</th><th className="p-3">Status</th><th className="p-3">Updated</th><th className="p-3 text-right">Actions</th>
          </tr></thead>
          <tbody>
            {isLoading && <tr><td colSpan={6} className="p-4 text-center text-muted-foreground">Loading…</td></tr>}
            {!isLoading && posts.length === 0 && <tr><td colSpan={6} className="p-4 text-center text-muted-foreground">No posts.</td></tr>}
            {posts.map((p: any) => (
              <tr key={p.id} className="border-t">
                <td className="p-3 font-medium">{p.title}</td>
                <td className="p-3 text-xs text-muted-foreground">{p.slug}</td>
                <td className="p-3 text-xs">{p.category || "—"}</td>
                <td className="p-3">
                  <Badge variant={p.published ? "default" : "secondary"} className={p.published ? "bg-gradient-hero text-primary-foreground border-0" : ""}>
                    {p.published ? "Published" : "Draft"}
                  </Badge>
                </td>
                <td className="p-3 text-xs text-muted-foreground">{new Date(p.updated_at).toLocaleDateString()}</td>
                <td className="p-3">
                  <div className="flex items-center justify-end gap-1.5">
                    {p.published && (
                      <Button size="sm" variant="ghost" asChild><a href={`/blog/${p.slug}`} target="_blank" rel="noopener"><Eye className="h-3.5 w-3.5" /></a></Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => togglePublish.mutate(p)}>{p.published ? "Unpublish" : "Publish"}</Button>
                    <Button size="sm" variant="outline" onClick={() => openEdit(p)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild><Button size="sm" variant="destructive"><Trash2 className="h-3.5 w-3.5" /></Button></AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader><AlertDialogTitle>Delete post?</AlertDialogTitle><AlertDialogDescription>This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                        <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => del.mutate(p.id)}>Delete</AlertDialogAction></AlertDialogFooter>
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingId ? "Edit post" : "New post"}</DialogTitle></DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2 sm:grid-cols-2">
              <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: form.slug || slugify(e.target.value) })} /></div>
              <div><Label>Slug</Label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })} /></div>
            </div>
            <div><Label>Excerpt</Label><Textarea rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} /></div>
            <div><Label>Content (Markdown or HTML)</Label><Textarea rows={10} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} /></div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div><Label>Featured image URL</Label><Input value={form.featured_image} onChange={(e) => setForm({ ...form, featured_image: e.target.value })} /></div>
              <div><Label>Category</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div><Label>Tags (comma-separated)</Label><Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} /></div>
              <div><Label>Author</Label><Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} /></div>
            </div>
            <div><Label>SEO title</Label><Input value={form.seo_title} onChange={(e) => setForm({ ...form, seo_title: e.target.value })} /></div>
            <div><Label>SEO description</Label><Textarea rows={2} value={form.seo_description} onChange={(e) => setForm({ ...form, seo_description: e.target.value })} /></div>
            <div className="flex items-center gap-2"><Switch checked={form.published} onCheckedChange={(v) => setForm({ ...form, published: v })} /><Label>Published</Label></div>
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
