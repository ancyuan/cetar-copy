import { useData } from "@/lib/DataContext";
import { JENIS_PENGAWASAN_LABELS, JenisPengawasan } from "@/lib/types";
import { Search, Trash2, Edit, X, Check, Loader2, Eye, FileDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { exportAllToPdf } from "@/lib/exportPdf";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Riwayat() {
  const { data, loading, deleteEntry, updateEntry } = useData();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ namaPerusahaan: string; status: "selesai" | "tindak_lanjut" | "proses"; catatan: string }>({
    namaPerusahaan: "", status: "selesai", catatan: "",
  });
  const [busy, setBusy] = useState(false);

  const filtered = data.filter(
    (d) =>
      d.namaPerusahaan.toLowerCase().includes(search.toLowerCase()) ||
      d.namaPetugas.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    setBusy(true);
    try {
      await deleteEntry(id);
      toast.success("Data berhasil dihapus");
    } catch { toast.error("Gagal menghapus data"); }
    setBusy(false);
  };

  const startEdit = (d: any) => {
    setEditingId(d.id);
    setEditForm({ namaPerusahaan: d.namaPerusahaan, status: d.status, catatan: d.catatan });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    setBusy(true);
    try {
      await updateEntry(editingId, editForm);
      toast.success("Data berhasil diperbarui");
      setEditingId(null);
    } catch { toast.error("Gagal memperbarui data"); }
    setBusy(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const handleExportPdf = () => {
    if (filtered.length === 0) {
      toast.error("Tidak ada data untuk di-export");
      return;
    }
    exportAllToPdf(filtered);
    toast.success("PDF berhasil diunduh");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Riwayat Pengawasan</h1>
          <p className="text-sm text-muted-foreground mt-1">Daftar seluruh pengawasan yang telah dilakukan</p>
        </div>
        <button
          onClick={handleExportPdf}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity shrink-0"
        >
          <FileDown className="w-4 h-4" />
          Export PDF
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Cari perusahaan atau petugas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="space-y-3">
        {filtered.map((d) => (
          <div key={d.id} className="bg-card border border-border rounded-xl p-4 animate-slide-up">
            {editingId === d.id ? (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Nama Perusahaan</label>
                  <input
                    value={editForm.namaPerusahaan}
                    onChange={(e) => setEditForm((p) => ({ ...p, namaPerusahaan: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm((p) => ({ ...p, status: e.target.value as "selesai" | "tindak_lanjut" | "proses" }))}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm mt-1"
                  >
                    <option value="selesai">Selesai</option>
                    <option value="proses">Proses</option>
                    <option value="tindak_lanjut">Tindak Lanjut</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Catatan</label>
                  <textarea
                    value={editForm.catatan}
                    onChange={(e) => setEditForm((p) => ({ ...p, catatan: e.target.value }))}
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm mt-1 resize-none"
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={saveEdit} disabled={busy} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium">
                    <Check className="w-3.5 h-3.5" /> Simpan
                  </button>
                  <button onClick={() => setEditingId(null)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-input text-muted-foreground text-xs font-medium">
                    <X className="w-3.5 h-3.5" /> Batal
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{d.namaPerusahaan}</h3>
                    <p className="text-xs text-muted-foreground">{d.namaPemilik} • {d.alamat}</p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${
                      d.status === "selesai"
                        ? "bg-success/10 text-success"
                        : d.status === "tindak_lanjut"
                        ? "bg-warning/10 text-warning"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {d.status === "selesai" ? "Selesai" : d.status === "tindak_lanjut" ? "Tindak Lanjut" : "Proses"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-md">
                    {JENIS_PENGAWASAN_LABELS[d.jenisPengawasan]}
                  </span>
                  <span className="text-xs text-muted-foreground">{d.tanggal}</span>
                  <span className="text-xs text-muted-foreground">Petugas: {d.namaPetugas}</span>
                </div>
                {d.catatan && (
                  <p className="text-xs text-muted-foreground mt-2 border-t border-border pt-2">{d.catatan}</p>
                )}
                <div className="flex gap-2 mt-3 pt-2 border-t border-border">
                  <button onClick={() => navigate(`/laporan/${d.id}`)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-input text-foreground text-xs font-medium hover:bg-secondary transition-colors">
                    <Eye className="w-3.5 h-3.5" /> Detail
                  </button>
                  <button onClick={() => startEdit(d)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-input text-foreground text-xs font-medium hover:bg-secondary transition-colors">
                    <Edit className="w-3.5 h-3.5" /> Edit
                  </button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-destructive/30 text-destructive text-xs font-medium hover:bg-destructive/10 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" /> Hapus
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Data Pengawasan?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Data pengawasan "{d.namaPerusahaan}" akan dihapus permanen dan tidak dapat dikembalikan.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(d.id)} disabled={busy} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          Hapus
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-8">Tidak ada data ditemukan</p>
        )}
      </div>
    </div>
  );
}
