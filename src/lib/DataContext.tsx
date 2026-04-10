import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { PengawasanData, JenisPengawasan } from "./types";
import { supabase } from "@/integrations/supabase/client";

interface DataContextType {
  data: PengawasanData[];
  loading: boolean;
  addEntry: (entry: Omit<PengawasanData, "id">) => Promise<void>;
  updateEntry: (id: string, entry: Partial<Omit<PengawasanData, "id">>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const DataContext = createContext<DataContextType>({
  data: [], loading: true,
  addEntry: async () => {}, updateEntry: async () => {}, deleteEntry: async () => {}, refresh: async () => {},
});

function rowToData(row: any): PengawasanData {
  return {
    id: row.id,
    tanggal: row.tanggal,
    namaPerusahaan: row.nama_perusahaan,
    namaPemilik: row.nama_pemilik,
    alamat: row.alamat,
    jenisUsaha: row.jenis_usaha,
    nib: row.nib,
    namaPetugas: row.nama_petugas,
    nomorKontak: row.nomor_kontak,
    jenisPengawasan: row.jenis_pengawasan as JenisPengawasan,
    checklist: (row.checklist as Record<string, boolean>) || {},
    catatan: row.catatan,
    jumlahTemuan: row.jumlah_temuan,
    jenisPelanggaran: row.jenis_pelanggaran,
    tingkatRisiko: row.tingkat_risiko,
    rekomendasi: row.rekomendasi || [],
    status: row.status,
  };
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<PengawasanData[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const { data: rows, error } = await supabase
      .from("pengawasan")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && rows) setData(rows.map(rowToData));
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const addEntry = async (entry: Omit<PengawasanData, "id">) => {
    const { error } = await supabase.from("pengawasan").insert({
      tanggal: entry.tanggal,
      nama_perusahaan: entry.namaPerusahaan,
      nama_pemilik: entry.namaPemilik,
      alamat: entry.alamat,
      jenis_usaha: entry.jenisUsaha,
      nib: entry.nib,
      nama_petugas: entry.namaPetugas,
      nomor_kontak: entry.nomorKontak,
      jenis_pengawasan: entry.jenisPengawasan,
      checklist: entry.checklist as any,
      catatan: entry.catatan,
      jumlah_temuan: entry.jumlahTemuan,
      jenis_pelanggaran: entry.jenisPelanggaran,
      tingkat_risiko: entry.tingkatRisiko,
      rekomendasi: entry.rekomendasi,
      status: entry.status,
    });
    if (error) throw error;
    await refresh();
  };

  const updateEntry = async (id: string, entry: Partial<Omit<PengawasanData, "id">>) => {
    const update: any = {};
    if (entry.tanggal !== undefined) update.tanggal = entry.tanggal;
    if (entry.namaPerusahaan !== undefined) update.nama_perusahaan = entry.namaPerusahaan;
    if (entry.namaPemilik !== undefined) update.nama_pemilik = entry.namaPemilik;
    if (entry.alamat !== undefined) update.alamat = entry.alamat;
    if (entry.jenisUsaha !== undefined) update.jenis_usaha = entry.jenisUsaha;
    if (entry.nib !== undefined) update.nib = entry.nib;
    if (entry.namaPetugas !== undefined) update.nama_petugas = entry.namaPetugas;
    if (entry.nomorKontak !== undefined) update.nomor_kontak = entry.nomorKontak;
    if (entry.jenisPengawasan !== undefined) update.jenis_pengawasan = entry.jenisPengawasan;
    if (entry.checklist !== undefined) update.checklist = entry.checklist;
    if (entry.catatan !== undefined) update.catatan = entry.catatan;
    if (entry.jumlahTemuan !== undefined) update.jumlah_temuan = entry.jumlahTemuan;
    if (entry.jenisPelanggaran !== undefined) update.jenis_pelanggaran = entry.jenisPelanggaran;
    if (entry.tingkatRisiko !== undefined) update.tingkat_risiko = entry.tingkatRisiko;
    if (entry.rekomendasi !== undefined) update.rekomendasi = entry.rekomendasi;
    if (entry.status !== undefined) update.status = entry.status;

    const { error } = await supabase.from("pengawasan").update(update).eq("id", id);
    if (error) throw error;
    await refresh();
  };

  const deleteEntry = async (id: string) => {
    const { error } = await supabase.from("pengawasan").delete().eq("id", id);
    if (error) throw error;
    await refresh();
  };

  return (
    <DataContext.Provider value={{ data, loading, addEntry, updateEntry, deleteEntry, refresh }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
