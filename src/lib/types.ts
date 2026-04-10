export interface PengawasanData {
  id: string;
  tanggal: string;
  namaPerusahaan: string;
  namaPemilik: string;
  alamat: string;
  jenisUsaha: string;
  nib: string;
  namaPetugas: string;
  nomorKontak: string;
  jenisPengawasan: JenisPengawasan;
  checklist: Record<string, boolean>;
  catatan: string;
  jumlahTemuan: number;
  jenisPelanggaran: string;
  tingkatRisiko: "rendah" | "sedang" | "tinggi";
  rekomendasi: string[];
  status: "selesai" | "tindak_lanjut" | "proses";
}

export type JenisPengawasan = "tdg" | "miras" | "bapokting" | "b2";

export const JENIS_PENGAWASAN_LABELS: Record<JenisPengawasan, string> = {
  tdg: "Pendaftaran Gudang (TDG)",
  miras: "Distribusi Minuman Beralkohol",
  bapokting: "Distribusi Bapokting",
  b2: "Distribusi Barang Berbahaya (B2)",
};
