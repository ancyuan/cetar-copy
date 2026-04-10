import { JenisPengawasan } from "./types";

export interface ChecklistSection {
  section: string;
  items: string[];
}

const CHECKLIST_TDG: ChecklistSection[] = [
  { section: "Legalitas dan Dokumen Administrasi", items: ["Memiliki TDG yang masih berlaku", "TDG sesuai dengan alamat lokasi gudang", "Memiliki izin usaha perdagangan", "Dokumen NIB aktif", "Dokumen kepemilikan/sewa gudang tersedia"] },
  { section: "Kesesuaian Kegiatan Usaha Gudang", items: ["Jenis barang yang disimpan sesuai izin", "Tidak menyimpan barang terlarang", "Tidak digunakan untuk kegiatan di luar peruntukan", "Tidak menjadi tempat distribusi ilegal"] },
  { section: "Kapasitas dan Kondisi Fisik Gudang", items: ["Luas gudang sesuai data TDG", "Kapasitas penyimpanan sesuai pelaporan", "Bangunan layak dan aman", "Sistem ventilasi memadai", "Sistem keamanan tersedia (CCTV/pengamanan)"] },
  { section: "Administrasi Stok dan Pencatatan", items: ["Memiliki pembukuan stok masuk dan keluar", "Data stok aktual sesuai pembukuan", "Dokumen surat jalan/faktur tersedia", "Laporan stok disampaikan sesuai ketentuan"] },
  { section: "Kesesuaian Penyimpanan Barang", items: ["Barang tertata rapi", "Tidak bercampur dengan barang lain yang tidak sesuai", "Tidak ada barang kedaluwarsa/rusak", "Barang subsidi dipisahkan (jika ada)"] },
  { section: "Indikasi Pelanggaran", items: ["Tidak memiliki TDG", "TDG tidak diperpanjang", "Gudang tidak dilaporkan", "Menyimpan barang melebihi kapasitas", "Indikasi penimbunan barang", "Penyalahgunaan gudang untuk distribusi ilegal"] },
  { section: "Dokumentasi Lapangan", items: ["Foto tampak depan gudang", "Foto papan nama usaha", "Foto kondisi dalam gudang", "Foto stok barang", "Foto dokumen TDG"] },
];

const CHECKLIST_MIRAS: ChecklistSection[] = [
  { section: "Legalitas Perizinan Minuman Beralkohol", items: ["Memiliki SIUP-MB", "Memiliki SKPL", "Lokasi usaha sesuai dengan izin", "Izin masih berlaku"] },
  { section: "Klasifikasi Golongan Minuman Beralkohol", items: ["Golongan A (≤5%)", "Golongan B (>5%–20%)", "Golongan C (>20%–55%)", "Jenis yang dijual sesuai izin usaha", "Tidak menjual di luar golongan yang diizinkan"] },
  { section: "Ketentuan Distribusi", items: ["Barang berasal dari distributor resmi", "Memiliki dokumen asal barang (faktur/surat jalan)", "Tidak terdapat minuman ilegal/tanpa cukai", "Tidak terdapat produk impor tanpa label"] },
  { section: "Kesesuaian Lokasi Penjualan", items: ["Dijual di lokasi yang diperbolehkan", "Tidak dijual bebas di toko kelontong (jika dilarang)", "Memiliki SITU-MB"] },
  { section: "Label", items: ["Label dalam Bahasa Indonesia (untuk impor)", "Mencantumkan kadar alkohol", "Tidak ada kemasan rusak/palsu"] },
  { section: "Administrasi dan Pencatatan", items: ["Memiliki pencatatan stok masuk dan keluar", "Memiliki laporan realisasi impor", "Memiliki laporan realisasi pengadaan dan pendistribusian", "Tidak ada indikasi penimbunan"] },
  { section: "Indikasi Pelanggaran", items: ["Tidak memiliki izin", "Menjual di lokasi yang tidak diperbolehkan", "Tidak memiliki pita cukai", "Produk ilegal/oplosan", "Menjual kepada anak di bawah umur", "Menjual di luar golongan izin"] },
  { section: "Dokumentasi Lapangan", items: ["Foto lokasi usaha", "Foto izin usaha", "Foto stok minuman", "Foto pita cukai", "Foto papan nama usaha"] },
];

const CHECKLIST_BAPOKTING: ChecklistSection[] = [
  { section: "Jenis Komoditas yang Diawasi", items: ["Beras", "Gula", "Minyak goreng", "Tepung terigu", "Daging beku", "Telur", "LPG 3 Kg"] },
  { section: "Kesesuaian Distribusi dan Rantai Pasok", items: ["Memiliki dokumen distribusi (surat jalan, faktur)", "Memiliki TDPUD Bapok", "Memiliki laporan rutin stok dan harga melalui SP2KP", "Memiliki dokumen sertifikasi mutu/keamanan pangan", "Memiliki dokumen pergudangan (SKP-G)", "Distribusi sesuai jalur yang ditetapkan", "Tidak terdapat indikasi penimbunan", "Stok sesuai dengan pencatatan administrasi"] },
  { section: "Kesesuaian Harga", items: ["Harga sesuai HET (Harga Eceran Tertinggi)", "Tidak menjual di atas harga yang ditetapkan", "Harga tercantum secara jelas"] },
  { section: "Penyimpanan dan Kondisi Gudang", items: ["Gudang bersih dan layak", "Barang tidak rusak/kedaluwarsa", "Sistem FIFO diterapkan", "Tidak ada pencampuran barang subsidi dan non-subsidi"] },
  { section: "Label dan Kemasan", items: ["Berat/isi sesuai", "Tidak ada kemasan rusak", "Mencantumkan label sesuai ketentuan"] },
  { section: "Indikasi Pelanggaran", items: ["Penimbunan", "Penjualan di atas HET", "Pengurangan isi/berat", "Distribusi tidak sesuai peruntukan", "Barang subsidi disalahgunakan"] },
  { section: "Dokumentasi", items: ["Foto lokasi", "Foto stok barang", "Foto papan harga", "Foto dokumen distribusi"] },
];

const CHECKLIST_B2: ChecklistSection[] = [
  { section: "Legalitas dan Perizinan", items: ["Memiliki IT-B2, DT-B2, P-B2", "Memiliki izin usaha perdagangan B2", "Terdaftar sebagai distributor resmi", "Memiliki dokumen asal barang (faktur/surat jalan)", "Memiliki sertifikat/izin pengangkutan bahan berbahaya", "Memiliki rekomendasi teknis dari instansi terkait"] },
  { section: "Jenis Barang Berbahaya", items: ["Formalin", "Boraks", "Bahan kimia industri", "Pestisida tertentu", "Bahan pembersih kimia konsentrasi tinggi"] },
  { section: "Kesesuaian Distribusi dan Rantai Pasok", items: ["Distribusi hanya kepada pengguna yang diperbolehkan", "Tidak dijual bebas ke masyarakat umum", "Memiliki daftar pelanggan tetap", "Dokumen distribusi lengkap"] },
  { section: "Label dan Informasi Produk", items: ["Memiliki label bahaya yang jelas", "Mencantumkan simbol bahaya (hazard symbol)", "Mencantumkan petunjuk penggunaan", "Mencantumkan MSDS", "Tidak ada kemasan rusak"] },
  { section: "Penyimpanan dan Keamanan", items: ["Disimpan di ruang khusus", "Tidak bercampur dengan bahan makanan", "Memiliki ventilasi memadai", "Tersedia APAR", "Akses terbatas"] },
  { section: "Administrasi dan Pencatatan", items: ["Memiliki pembukuan stok masuk dan keluar", "Stok aktual sesuai pencatatan", "Memiliki sistem pelaporan berkala", "Tidak ada indikasi penyimpangan distribusi"] },
  { section: "Indikasi Pelanggaran", items: ["Tidak memiliki izin", "Menjual bebas kepada masyarakat umum", "Penyimpanan tidak sesuai standar", "Tidak mencantumkan label bahaya", "Indikasi penyalahgunaan (misal untuk campuran pangan)", "Dokumen distribusi tidak tersedia"] },
  { section: "Dokumentasi Lapangan", items: ["Foto lokasi usaha", "Foto izin usaha", "Foto stok barang", "Foto label bahaya", "Foto kondisi penyimpanan"] },
];

export const CHECKLISTS: Record<JenisPengawasan, ChecklistSection[]> = {
  tdg: CHECKLIST_TDG,
  miras: CHECKLIST_MIRAS,
  bapokting: CHECKLIST_BAPOKTING,
  b2: CHECKLIST_B2,
};
