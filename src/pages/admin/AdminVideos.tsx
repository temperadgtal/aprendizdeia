import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useVideoChannels } from "@/hooks/useSiteData";
import {
  VIDEO_CATEGORY_OPTIONS,
  VIDEO_CATEGORY_LABELS,
  type VideoChannel,
  type VideoCategory,
} from "@/lib/site-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Youtube } from "lucide-react";

type Form = { name: string; url: string; category: VideoCategory; description: string };
const empty: Form = { name: "", url: "", category: "noticias", description: "" };

export default function AdminVideos() {
  const { data: channels } = useVideoChannels();
  const qc = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<VideoChannel | null>(null);
  const [form, setForm] = useState<Form>(empty);

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        name: form.name.trim(),
        url: form.url.trim() || null,
        category: form.category,
        description: form.description.trim() || null,
        position: editing?.position ?? (channels?.length ?? 0),
      };
      if (editing) {
        const { error } = await supabase.from("video_channels").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("video_channels").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["video_channels"] });
      setOpen(false);
      toast({ title: editing ? "Canal atualizado" : "Canal criado" });
    },
    onError: (e: any) => toast({ title: "Erro", description: e.message, variant: "destructive" }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("video_channels").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["video_channels"] });
      toast({ title: "Canal removido" });
    },
  });

  const openNew = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (c: VideoChannel) => {
    setEditing(c);
    setForm({ name: c.name, url: c.url ?? "", category: c.category, description: c.description ?? "" });
    setOpen(true);
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Vídeos</h1>
        <Button onClick={openNew} className="rounded-full"><Plus className="mr-1 h-4 w-4" /> Novo canal</Button>
      </header>

      <div className="space-y-3">
        {(channels ?? []).map((c) => (
          <Card key={c.id}>
            <CardContent className="flex items-center justify-between gap-4 p-4">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                  <Youtube className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h3 className="truncate font-semibold">{c.name}</h3>
                  <p className="truncate text-sm text-muted-foreground">{VIDEO_CATEGORY_LABELS[c.category]}</p>
                </div>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button variant="ghost" size="icon" onClick={() => openEdit(c)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => remove.mutate(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {(channels ?? []).length === 0 && <p className="py-8 text-center text-muted-foreground">Nenhum canal ainda.</p>}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Editar canal" : "Novo canal"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Nome</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="space-y-2"><Label>Link do canal</Label><Input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://www.youtube.com/@..." /></div>
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as VideoCategory })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {VIDEO_CATEGORY_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Descrição</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={() => save.mutate()} disabled={!form.name.trim() || save.isPending}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
