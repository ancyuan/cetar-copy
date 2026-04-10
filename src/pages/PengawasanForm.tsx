import { useState } from "react";
import { JenisPengawasan, JENIS_PENGAWASAN_LABELS } from "@/lib/types";
import { useData } from "@/lib/DataContext";
import { CheckSquare, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { CHECKLISTS } from "@/lib/checklistData";

export default function PengawasanForm() {
  const { addEntry } = useData();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [jenis, setJenis] = useState<JenisPengawasan | null>(null);
  const [identitas, setIdentitas] = useState({
    namaPerusahaan: "", namaPemilik: "", alamat: "", jenisUsaha: "",
    nib: "", tanggal: "", namaPetugas: "", nomorKontak: "",
  });
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [ringkasan, setRingkasan] = useState({
    jumlahTemuan: "", jenisPelanggaran: "", tingkatRisiko: "",
    rekomendasi: [] as string[], catatan: "",
  });

  const toggleCheck = (key: string) => setChecked((p) => ({ ...p, [key]: !p[key] }));

  const handleSubmit = () => {
    if (!jenis) return;
    addEntry({
      tanggal: identitas.tanggal || new Date().toISOString().slice(0, 10),
      namaPerusahaan: identitas.namaPerusahaan,
      namaPemilik: identitas.namaPemilik,
      alamat: identitas.alamat,
      jenisUsaha: identitas.jenisUsaha,
      nib: identitas.nib,
      namaPetugas: identitas.namaPetugas,
      nomorKontak: identitas.nomorKontak,
      jenisPengawasan: jenis,
      checklist: checked,
      catatan: ringkasan.catatan,
      jumlahTemuan: Number(ringkasan.jumlahTemuan) || 0,
      jenisPelanggaran: ringkasan.jenisPelanggaran || "-",
      tingkatRisiko: (ringkasan.tingkatRisiko as "rendah" | "sedang" | "tinggi") || "rendah",
      rekomendasi: ringkasan.rekomendasi.length ? ringkasan.rekomendasi : ["Pembinaan"],
      status: ringkasan.rekomendasi.includes("Rekomendasi Sanksi") ? "tindak_lanjut"
        : ringkasan.rekomendasi.includes("Teguran") ? "proses" : "selesai",
    });
    toast.success("Data pengawasan berhasil disimpan!");
    navigate("/riwayat");
  };

  // Step 0: Pilih Jenis
  if (step === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pengawasan Baru</h1>
          <p className="text-sm text-muted-foreground mt-1">Pilih jenis pengawasan</p>
        </div>
        <div className="grid gap-3">
          {(Object.entries(JENIS_PENGAWASAN_LABELS) as [JenisPengawasan, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => { setJenis(key); setStep(1); }}
              className="flex items-center justify-between bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-colors text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-foreground">{label}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Step 1: Identitas
  if (step === 1) {
    const fields = [
      { key: "namaPerusahaan", label: "Nama Perusahaan/Usaha", type: "text" },
      { key: "namaPemilik", label: "Nama Pemilik/Penanggung Jawab", type: "text" },
      { key: "alamat", label: "Alamat Usaha", type: "text" },
      { key: "jenisUsaha", label: "Jenis Usaha", type: "text" },
      { key: "nib", label: "NIB (Nomor Induk Berusaha)", type: "text" },
      { key: "tanggal", label: "Tanggal Pengawasan", type: "date" },
      { key: "namaPetugas", label: "Nama Petugas Pengawas", type: "text" },
      { key: "nomorKontak", label: "Nomor Kontak", type: "tel" },
    ];

    return (
      <div className="space-y-6">
        <div>
          <button onClick={() => setStep(0)} className="text-sm text-primary font-medium mb-2 inline-block">← Kembali</button>
          <h1 className="text-2xl font-bold text-foreground">Identitas Pengawasan</h1>
          <p className="text-sm text-muted-foreground mt-1">{jenis && JENIS_PENGAWASAN_LABELS[jenis]}</p>
        </div>
        <div className="space-y-4">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="text-sm font-medium text-foreground block mb-1.5">{f.label}</label>
              <input
                type={f.type}
                value={(identitas as any)[f.key]}
                onChange={(e) => setIdentitas((p) => ({ ...p, [f.key]: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          ))}
        </div>
        <button
          onClick={() => setStep(2)}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          Lanjut ke Checklist
        </button>
      </div>
    );
  }

  // Step 2: Checklist
  if (step === 2 && jenis) {
    const sections = CHECKLISTS[jenis];
    return (
      <div className="space-y-6">
        <div>
          <button onClick={() => setStep(1)} className="text-sm text-primary font-medium mb-2 inline-block">← Kembali</button>
          <h1 className="text-2xl font-bold text-foreground">Checklist Pemeriksaan</h1>
          <p className="text-sm text-muted-foreground mt-1">{JENIS_PENGAWASAN_LABELS[jenis]}</p>
        </div>
        <div className="space-y-5">
          {sections.map((sec, si) => (
            <div key={si} className="bg-card border border-border rounded-xl p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">{sec.section}</h3>
              <div className="space-y-2">
                {sec.items.map((item, ii) => {
                  const key = `${si}-${ii}`;
                  return (
                    <label key={key} className="flex items-start gap-3 cursor-pointer py-1">
                      <input
                        type="checkbox"
                        checked={!!checked[key]}
                        onChange={() => toggleCheck(key)}
                        className="mt-0.5 w-4 h-4 rounded border-input accent-primary"
                      />
                      <span className="text-sm text-foreground leading-snug">{item}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => setStep(3)}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          Lanjut ke Ringkasan
        </button>
      </div>
    );
  }

  // Step 3: Ringkasan & Tindak Lanjut
  return (
    <div className="space-y-6">
      <div>
        <button onClick={() => setStep(2)} className="text-sm text-primary font-medium mb-2 inline-block">← Kembali</button>
        <h1 className="text-2xl font-bold text-foreground">Ringkasan & Tindak Lanjut</h1>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">Jumlah Temuan</label>
          <input
            type="number"
            value={ringkasan.jumlahTemuan}
            onChange={(e) => setRingkasan((p) => ({ ...p, jumlahTemuan: e.target.value }))}
            className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">Jenis Pelanggaran</label>
          <textarea
            value={ringkasan.jenisPelanggaran}
            onChange={(e) => setRingkasan((p) => ({ ...p, jenisPelanggaran: e.target.value }))}
            rows={2}
            className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">Tingkat Risiko</label>
          <div className="flex gap-2">
            {["rendah", "sedang", "tinggi"].map((r) => (
              <button
                key={r}
                onClick={() => setRingkasan((p) => ({ ...p, tingkatRisiko: r }))}
                className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                  ringkasan.tingkatRisiko === r
                    ? r === "rendah" ? "bg-success text-success-foreground border-success"
                    : r === "sedang" ? "bg-warning text-warning-foreground border-warning"
                    : "bg-destructive text-destructive-foreground border-destructive"
                    : "border-input text-muted-foreground hover:border-primary/30"
                }`}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">Rekomendasi</label>
          <div className="space-y-2">
            {["Pembinaan", "Teguran", "Tindak Lanjut", "Rekomendasi Sanksi"].map((r) => (
              <label key={r} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ringkasan.rekomendasi.includes(r)}
                  onChange={() => setRingkasan((p) => ({
                    ...p,
                    rekomendasi: p.rekomendasi.includes(r)
                      ? p.rekomendasi.filter((x) => x !== r)
                      : [...p.rekomendasi, r],
                  }))}
                  className="w-4 h-4 rounded border-input accent-primary"
                />
                <span className="text-sm text-foreground">{r}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">Catatan Tambahan</label>
          <textarea
            value={ringkasan.catatan}
            onChange={(e) => setRingkasan((p) => ({ ...p, catatan: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
      >
        Simpan Pengawasan
      </button>
    </div>
  );
}
