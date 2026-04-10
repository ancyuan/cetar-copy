
-- Create pengawasan table
CREATE TABLE public.pengawasan (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tanggal DATE NOT NULL,
  nama_perusahaan TEXT NOT NULL,
  nama_pemilik TEXT NOT NULL,
  alamat TEXT NOT NULL,
  jenis_usaha TEXT NOT NULL,
  nib TEXT NOT NULL DEFAULT '',
  nama_petugas TEXT NOT NULL,
  nomor_kontak TEXT NOT NULL DEFAULT '',
  jenis_pengawasan TEXT NOT NULL CHECK (jenis_pengawasan IN ('tdg', 'miras', 'bapokting', 'b2')),
  checklist JSONB NOT NULL DEFAULT '{}',
  catatan TEXT NOT NULL DEFAULT '',
  jumlah_temuan INTEGER NOT NULL DEFAULT 0,
  jenis_pelanggaran TEXT NOT NULL DEFAULT '-',
  tingkat_risiko TEXT NOT NULL CHECK (tingkat_risiko IN ('rendah', 'sedang', 'tinggi')),
  rekomendasi TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL CHECK (status IN ('selesai', 'tindak_lanjut', 'proses')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pengawasan ENABLE ROW LEVEL SECURITY;

-- Public access policies (no auth required for this app)
CREATE POLICY "Anyone can view pengawasan" ON public.pengawasan FOR SELECT USING (true);
CREATE POLICY "Anyone can insert pengawasan" ON public.pengawasan FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update pengawasan" ON public.pengawasan FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete pengawasan" ON public.pengawasan FOR DELETE USING (true);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_pengawasan_updated_at
  BEFORE UPDATE ON public.pengawasan
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
