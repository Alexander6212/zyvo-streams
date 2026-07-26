import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings")({ component: SettingsAdmin });

const FIELDS: { key: string; label: string; type?: "textarea" }[] = [
  { key: "site_title", label: "Website title" },
  { key: "site_description", label: "Website description", type: "textarea" },
  { key: "support_email", label: "Support email" },
  { key: "announcement", label: "Homepage announcement banner", type: "textarea" },
  { key: "social_whatsapp", label: "WhatsApp URL" },
  { key: "social_telegram", label: "Telegram URL" },
  { key: "social_facebook", label: "Facebook URL" },
  { key: "social_instagram", label: "Instagram URL" },
];

function SettingsAdmin() {
  const qc = useQueryClient();
  const [values, setValues] = useState<Record<string, string>>({});

  const { data, isLoading } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: async () => { const { data, error } = await supabase.from("site_settings").select("*"); if (error) throw error; return data; },
  });

  useEffect(() => {
    if (data) {
      const v: Record<string, string> = {};
      data.forEach((r: any) => { v[r.key] = typeof r.value === "string" ? r.value : JSON.stringify(r.value); });
      setValues(v);
    }
  }, [data]);

  const save = useMutation({
    mutationFn: async () => {
      const rows = FIELDS.map((f) => ({ key: f.key, value: (values[f.key] ?? "") as any }));
      for (const r of rows) {
        const { error } = await supabase.from("site_settings").upsert({ key: r.key, value: r.value } as any);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-settings"] }); qc.invalidateQueries({ queryKey: ["site-settings"] }); toast.success("Settings saved"); },
    onError: (e: any) => toast.error(e.message),
  });

  if (isLoading) return <div className="text-sm text-muted-foreground">Loading…</div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <div><h1 className="text-2xl font-extrabold">Site settings</h1><p className="text-sm text-muted-foreground">These update the public website.</p></div>
      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-4">
        {FIELDS.map((f) => (
          <div key={f.key}>
            <Label>{f.label}</Label>
            {f.type === "textarea"
              ? <Textarea rows={2} value={values[f.key] ?? ""} onChange={(e) => setValues({ ...values, [f.key]: e.target.value })} />
              : <Input value={values[f.key] ?? ""} onChange={(e) => setValues({ ...values, [f.key]: e.target.value })} />}
          </div>
        ))}
        <Button onClick={() => save.mutate()} disabled={save.isPending} className="bg-gradient-hero border-0 text-primary-foreground">Save changes</Button>
      </div>
    </div>
  );
}
