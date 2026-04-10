import { useData } from "@/lib/DataContext";
import { JENIS_PENGAWASAN_LABELS } from "@/lib/types";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import {
  ClipboardCheck, AlertTriangle, TrendingUp, Building2, Loader2
} from "lucide-react";

const RISK_COLORS = {
  rendah: "hsl(152, 60%, 40%)",
  sedang: "hsl(38, 92%, 50%)",
  tinggi: "hsl(0, 72%, 51%)",
};

export default function Dashboard() {
  const { data: sampleData, loading } = useData();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const totalPengawasan = sampleData.length;
  const totalTemuan = sampleData.reduce((s, d) => s + d.jumlahTemuan, 0);
  const risikoTinggi = sampleData.filter((d) => d.tingkatRisiko === "tinggi").length;
  const selesai = sampleData.filter((d) => d.status === "selesai").length;

  const byJenis = Object.entries(JENIS_PENGAWASAN_LABELS).map(([key, label]) => ({
    name: label.length > 20 ? label.slice(0, 20) + "..." : label,
    jumlah: sampleData.filter((d) => d.jenisPengawasan === key).length,
  }));

  const byRisiko = [
    { name: "Rendah", value: sampleData.filter((d) => d.tingkatRisiko === "rendah").length, color: RISK_COLORS.rendah },
    { name: "Sedang", value: sampleData.filter((d) => d.tingkatRisiko === "sedang").length, color: RISK_COLORS.sedang },
    { name: "Tinggi", value: sampleData.filter((d) => d.tingkatRisiko === "tinggi").length, color: RISK_COLORS.tinggi },
  ];

  const stats = [
    { label: "Total Pengawasan", value: totalPengawasan, icon: ClipboardCheck, color: "bg-primary/10 text-primary" },
    { label: "Total Temuan", value: totalTemuan, icon: AlertTriangle, color: "bg-warning/10 text-warning" },
    { label: "Risiko Tinggi", value: risikoTinggi, icon: TrendingUp, color: "bg-destructive/10 text-destructive" },
    { label: "Selesai", value: selesai, icon: Building2, color: "bg-success/10 text-success" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Ringkasan laporan pengawasan tata niaga</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-card rounded-xl border border-border p-4 animate-slide-up">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-card rounded-xl border border-border p-4 md:p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Per Jenis Pengawasan</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={byJenis}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} allowDecimals={false} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 }} />
              <Bar dataKey="jumlah" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 md:p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Tingkat Risiko</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={byRisiko} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={45} paddingAngle={4} label={({ name, value }) => `${name}: ${value}`}>
                {byRisiko.map((entry, i) => (<Cell key={i} fill={entry.color} />))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-4 md:p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Pengawasan Terbaru</h3>
        <div className="space-y-3">
          {sampleData.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Belum ada data pengawasan</p>}
          {sampleData.slice(0, 5).map((d) => (
            <div key={d.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{d.namaPerusahaan}</p>
                <p className="text-xs text-muted-foreground">
                  {JENIS_PENGAWASAN_LABELS[d.jenisPengawasan]} • {d.tanggal}
                </p>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ml-2 ${
                d.tingkatRisiko === "rendah" ? "bg-success/10 text-success"
                : d.tingkatRisiko === "sedang" ? "bg-warning/10 text-warning"
                : "bg-destructive/10 text-destructive"
              }`}>
                {d.tingkatRisiko.charAt(0).toUpperCase() + d.tingkatRisiko.slice(1)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
