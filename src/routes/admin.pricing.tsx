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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/pricing")({ component: PricingAdmin });

type P = { name: string; price: string; currency: string; period: string; description: string; features: string; extra: string; popular: boolean; enabled: boolean; display_order: string };
const empty: P = { name: "", price: "", currency: "£", period: "month", description: "", features: "", extra: "", popular: false, enabled: true, display_order: "0" };

function PricingAdmin() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<P>(empty);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-pricing"],
    queryFn: async () => { const { data, error } = await supabase.from("pricing_plans").select("*").order("display_order"); if (error) throw error; return data; },
  });

  const save = useMutation({
    mutationFn: async () => {
      const payload: any = {
        name: form.name, price: form.price, currency: form.currency, period: form.period,
        description: form.description || null,
        features: form.features.split("\n").map((s) => s.trim()).filter(Boolean),
        extra: form.extra || null, popular: form.popular, enabled: form.enabled,
        display_order: Number(form.display_order) || 0,
      };
      if (editingId) { const { error } = await supabase.from("pricing_plans").update(payload).eq("id", editingId); if (error) throw error; }
      else { const { error } = await supabase.from("pricing_plans").insert(payload); if (error) throw error; }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-pricing"] }); setOpen(false); setForm(empty); setEditingId(null); toast.success("Saved"); },
    onError: (e: any) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("pricing_plans").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-pricing"] }); toast.success("Deleted"); },
    onError: (e: any) => toast.error(e.message),
  });

  const openEdit = (p: any) => {
    setForm({ name: p.name, price: p.price, currency: p.currency, period: p.period, description: p.description ?? "", features: (p.features ?? []).join("\n"), extra: p.extra ?? "", popular: !!p.popular, enabled: !!p.enabled, display_order: String(p.display_order ?? 0) });
    setEditingId(p.id); setOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div><h1 className="text-2xl font-extrabold">Pricing plans</h1><p className="text-sm text-muted-foreground">These drive the public pricing page.</p></div>
        <Button onClick={() => { setForm(empty); setEditingId(null); setOpen(true); }} className="rounded-full bg-gradient-hero border-0 text-primary-foreground shadow-glow"><Plus className="h-4 w-4 mr-1" /> New plan</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading && <div className="text-sm text-muted-foreground">Loading…</div>}
        {(data ?? []).map((p: any) => (
          <div key={p.id} className="relative rounded-2xl border border-border bg-card p-5 shadow-soft">
            {p.popular && <div className="absolute -top-2.5 left-4 rounded-full bg-gradient-hero px-2.5 py-0.5 text-[10px] font-bold text-primary-foreground shadow-glow">BEST VALUE</div>}
            <div className="text-sm font-semibold text-primary">{p.name}</div>
            <div className="mt-1 text-3xl font-extrabold">{p.currency}{p.price}<span className="text-sm font-normal text-muted-foreground"> / {p.period}</span></div>
            {!p.enabled && <Badge variant="secondary" className="mt-2">Disabled</Badge>}
            <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
              {(p.features ?? []).slice(0, 4).map((f: string) => <li key={f}>• {f}</li>)}
            </ul>
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="outline" onClick={() => openEdit(p)}><Pencil className="h-3.5 w-3.5 mr-1" />Edit</Button>
              <AlertDialog>
                <AlertDialogTrigger asChild><Button size="sm" variant="destructive"><Trash2 className="h-3.5 w-3.5" /></Button></AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader><AlertDialogTitle>Delete plan?</AlertDialogTitle></AlertDialogHeader>
                  <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => del.mutate(p.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingId ? "Edit plan" : "New plan"}</DialogTitle></DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2 sm:grid-cols-2">
              <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div><Label>Order</Label><Input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: e.target.value })} /></div>
              <div><Label>Currency</Label><Input value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} /></div>
              <div><Label>Price</Label><Input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
              <div className="sm:col-span-2"><Label>Period</Label><Input value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} placeholder="month / 3 months / year" /></div>
            </div>
            <div><Label>Description</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div><Label>Features (one per line)</Label><Textarea rows={7} value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} /></div>
            <div><Label>Extra device line</Label><Input value={form.extra} onChange={(e) => setForm({ ...form, extra: e.target.value })} /></div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2"><Switch checked={form.popular} onCheckedChange={(v) => setForm({ ...form, popular: v })} /><Label>Best value</Label></div>
              <div className="flex items-center gap-2"><Switch checked={form.enabled} onCheckedChange={(v) => setForm({ ...form, enabled: v })} /><Label>Enabled</Label></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => save.mutate()} disabled={!form.name || !form.price || save.isPending} className="bg-gradient-hero border-0 text-primary-foreground">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
