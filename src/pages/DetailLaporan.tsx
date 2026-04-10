import { useParams, useNavigate } from "react-router-dom";
import { useData } from "@/lib/DataContext";
import { JENIS_PENGAWASAN_LABELS, JenisPengawasan } from "@/lib/types";
import { CHECKLISTS } from "@/lib/checklistData";
import { ArrowLeft, Building2, User, MapPin, FileText, Shield, AlertTriangle, CheckCircle2, Loader2, Pencil, Save, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { toast } from "sonner";

const statusConfig = {
  selesai: { label: "Selesai", class: "bg-success/10 text-success border-success/20" },
  tindak_lanjut: { label: "Tindak Lanjut", class: "bg-warning/10 text-warning border-warning/20" },
  proses: { label: "Proses", class: "bg-primary/10 text-primary border-primary/20" },
};

const risikoConfig = {
  rendah: { label: "Rendah", class: "bg-success/10 text-success" },
  sedang: { label: "Sedang", class: "bg-warning/10 text-warning" },
  tinggi: { label: "Tinggi", class: "bg-destructive/10 text-destructive" },
};

function InfoRow({ label, value, icon: Icon }: { label: string; value: string; icon?: any }) {
  return (
    <div className="flex items-start gap-3 py-2">
      {Icon && <Icon className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />}
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground break-words">{value || "-"}</p>
      </div>
    </div>
  );
}

function EditRow({ label, value, onChange, icon: Icon, type = "text" }: { label: string; value: string; onChange: (v: string) => void; icon?: any; type?: string }) {
  return (
    <div className="flex items-start gap-3 py-2">
      {Icon && <Icon className="w-4 h-4 text-muted-foreground mt-2.5 shrink-0" />}
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="h-8 text-sm" />
      </div>
    </div>
  );
}

export default function DetailLaporan() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, loading, updateEntry } = useData();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const item = data.find((d) => d.id === id);

  if (!item) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-muted-foreground">Data tidak ditemukan</p>
        <Button variant="outline" onClick={() => navigate("/riwayat")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
        </Button>
      </div>
    );
  }

  const startEdit = () => {
    setForm({ ...item });
    setEditing(true);
  };

  const cancelEdit = () => {
    setForm(null);
    setEditing(false);
  };

  const saveEdit = async () => {
    if (!form) return;
    setSaving(true);
    try {
      const { id: _, ...updates } = form;
      await updateEntry(item.id, updates);
      toast.success("Data berhasil diperbarui");
      setEditing(false);
      setForm(null);
    } catch {
      toast.error("Gagal menyimpan perubahan");
    } finally {
      setSaving(false);
    }
  };

  const f = form || item;
  const status = statusConfig[f.status as keyof typeof statusConfig] || statusConfig.proses;
  const risiko = risikoConfig[f.tingkatRisiko as keyof typeof risikoConfig] || risikoConfig.rendah;
  const sections = CHECKLISTS[f.jenisPengawasan as JenisPengawasan] || [];

  const updateForm = (key: string, value: any) => setForm((prev: any) => ({ ...prev, [key]: value }));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/riwayat")} className="shrink-0">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-foreground truncate">{f.namaPerusahaan}</h1>
          <p className="text-xs text-muted-foreground">{f.tanggal}</p>
        </div>
        {editing ? (
          <div className="flex gap-2 shrink-0">
            <Button size="sm" variant="outline" onClick={cancelEdit} disabled={saving}>
              <X className="w-4 h-4 mr-1" /> Batal
            </Button>
            <Button size="sm" onClick={saveEdit} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Save className="w-4 h-4 mr-1" />}
              Simpan
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2 shrink-0">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${status.class}`}>
              {status.label}
            </span>
            <Button size="sm" variant="outline" onClick={startEdit}>
              <Pencil className="w-4 h-4 mr-1" /> Edit
            </Button>
          </div>
        )}
      </div>

      {/* Info Perusahaan */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Informasi Perusahaan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {editing ? (
            <>
              <EditRow icon={Building2} label="Nama Perusahaan" value={f.namaPerusahaan} onChange={(v) => updateForm("namaPerusahaan", v)} />
              <EditRow icon={User} label="Pemilik" value={f.namaPemilik} onChange={(v) => updateForm("namaPemilik", v)} />
              <EditRow icon={MapPin} label="Alamat" value={f.alamat} onChange={(v) => updateForm("alamat", v)} />
              <EditRow icon={FileText} label="Jenis Usaha" value={f.jenisUsaha} onChange={(v) => updateForm("jenisUsaha", v)} />
              <EditRow label="NIB" value={f.nib} onChange={(v) => updateForm("nib", v)} />
              <EditRow label="Nomor Kontak" value={f.nomorKontak} onChange={(v) => updateForm("nomorKontak", v)} />
            </>
          ) : (
            <>
              <InfoRow icon={Building2} label="Nama Perusahaan" value={f.namaPerusahaan} />
              <InfoRow icon={User} label="Pemilik" value={f.namaPemilik} />
              <InfoRow icon={MapPin} label="Alamat" value={f.alamat} />
              <InfoRow icon={FileText} label="Jenis Usaha" value={f.jenisUsaha} />
              <InfoRow label="NIB" value={f.nib} />
              <InfoRow label="Nomor Kontak" value={f.nomorKontak} />
            </>
          )}
        </CardContent>
      </Card>

      {/* Info Pengawasan */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Detail Pengawasan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {editing ? (
            <>
              <div className="flex items-start gap-3 py-2">
                <Shield className="w-4 h-4 text-muted-foreground mt-2.5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground mb-1">Jenis Pengawasan</p>
                  <Select value={f.jenisPengawasan} onValueChange={(v) => updateForm("jenisPengawasan", v)}>
                    <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(JENIS_PENGAWASAN_LABELS).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <EditRow icon={User} label="Petugas" value={f.namaPetugas} onChange={(v) => updateForm("namaPetugas", v)} />
              <EditRow icon={AlertTriangle} label="Jumlah Temuan" value={String(f.jumlahTemuan)} onChange={(v) => updateForm("jumlahTemuan", parseInt(v) || 0)} type="number" />
              <EditRow label="Jenis Pelanggaran" value={f.jenisPelanggaran} onChange={(v) => updateForm("jenisPelanggaran", v)} />
              <div className="flex items-start gap-3 py-2">
                <Shield className="w-4 h-4 text-muted-foreground mt-2.5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground mb-1">Tingkat Risiko</p>
                  <Select value={f.tingkatRisiko} onValueChange={(v) => updateForm("tingkatRisiko", v)}>
                    <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rendah">Rendah</SelectItem>
                      <SelectItem value="sedang">Sedang</SelectItem>
                      <SelectItem value="tinggi">Tinggi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-start gap-3 py-2">
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <Select value={f.status} onValueChange={(v) => updateForm("status", v)}>
                    <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="proses">Proses</SelectItem>
                      <SelectItem value="tindak_lanjut">Tindak Lanjut</SelectItem>
                      <SelectItem value="selesai">Selesai</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          ) : (
            <>
              <InfoRow icon={Shield} label="Jenis Pengawasan" value={JENIS_PENGAWASAN_LABELS[f.jenisPengawasan]} />
              <InfoRow icon={User} label="Petugas" value={f.namaPetugas} />
              <InfoRow icon={AlertTriangle} label="Jumlah Temuan" value={String(f.jumlahTemuan)} />
              <InfoRow label="Jenis Pelanggaran" value={f.jenisPelanggaran} />
              <div className="flex items-start gap-3 py-2">
                <Shield className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Tingkat Risiko</p>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${risiko.class}`}>
                    {risiko.label}
                  </span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Checklist dengan keterangan section */}
      {sections.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Checklist Pemeriksaan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sections.map((sec, si) => (
              <div key={si}>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{sec.section}</h4>
                <div className="space-y-1.5 ml-1">
                  {sec.items.map((itemLabel, ii) => {
                    const key = `${si}-${ii}`;
                    const checked = !!f.checklist[key];
                    return (
                      <div key={key} className="flex items-center gap-2">
                        {editing ? (
                          <>
                            <Checkbox
                              checked={checked}
                              onCheckedChange={(c) => updateForm("checklist", { ...f.checklist, [key]: !!c })}
                            />
                            <span className="text-sm text-foreground">{itemLabel}</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className={`w-4 h-4 shrink-0 ${checked ? "text-success" : "text-muted-foreground/40"}`} />
                            <span className={`text-sm ${checked ? "text-foreground" : "text-muted-foreground line-through"}`}>{itemLabel}</span>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Rekomendasi */}
      {(f.rekomendasi?.length > 0 || editing) && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Rekomendasi</CardTitle>
          </CardHeader>
          <CardContent>
            {editing ? (
              <div className="space-y-2">
                {(f.rekomendasi || []).map((r: string, i: number) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center shrink-0">{i + 1}</span>
                    <Input
                      value={r}
                      onChange={(e) => {
                        const updated = [...f.rekomendasi];
                        updated[i] = e.target.value;
                        updateForm("rekomendasi", updated);
                      }}
                      className="h-8 text-sm flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0 text-destructive"
                      onClick={() => updateForm("rekomendasi", f.rekomendasi.filter((_: any, idx: number) => idx !== i))}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => updateForm("rekomendasi", [...(f.rekomendasi || []), ""])}>
                  + Tambah Rekomendasi
                </Button>
              </div>
            ) : (
              <ul className="space-y-2">
                {f.rekomendasi.map((r: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                    {r}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}

      {/* Catatan */}
      {(f.catatan || editing) && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Catatan</CardTitle>
          </CardHeader>
          <CardContent>
            {editing ? (
              <Textarea value={f.catatan || ""} onChange={(e) => updateForm("catatan", e.target.value)} className="text-sm" rows={4} />
            ) : (
              <p className="text-sm text-foreground whitespace-pre-wrap">{f.catatan}</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
