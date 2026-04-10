import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { PengawasanData } from "./types";
import { JENIS_PENGAWASAN_LABELS } from "./types";
import { CHECKLISTS } from "./checklistData";

const STATUS_LABELS: Record<string, string> = {
  selesai: "Selesai",
  tindak_lanjut: "Tindak Lanjut",
  proses: "Proses",
};

const RISIKO_LABELS: Record<string, string> = {
  rendah: "Rendah",
  sedang: "Sedang",
  tinggi: "Tinggi",
};

export function exportAllToPdf(data: PengawasanData[]) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();

  // Title
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Laporan Rekap Pengawasan", pageWidth / 2, 18, { align: "center" });

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Tanggal cetak: ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`, pageWidth / 2, 24, { align: "center" });
  doc.text(`Total data: ${data.length}`, pageWidth / 2, 29, { align: "center" });

  // Summary table
  autoTable(doc, {
    startY: 34,
    head: [["No", "Tanggal", "Nama Perusahaan", "Pemilik", "Jenis Pengawasan", "Petugas", "Temuan", "Risiko", "Status"]],
    body: data.map((d, i) => [
      i + 1,
      d.tanggal,
      d.namaPerusahaan,
      d.namaPemilik,
      JENIS_PENGAWASAN_LABELS[d.jenisPengawasan] || d.jenisPengawasan,
      d.namaPetugas,
      d.jumlahTemuan,
      RISIKO_LABELS[d.tingkatRisiko] || d.tingkatRisiko,
      STATUS_LABELS[d.status] || d.status,
    ]),
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [41, 98, 255], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    margin: { left: 10, right: 10 },
  });

  // Detail pages for each entry
  data.forEach((d) => {
    doc.addPage("a4", "portrait");
    const pw = doc.internal.pageSize.getWidth();
    let y = 18;

    // Header
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Detail Laporan Pengawasan", pw / 2, y, { align: "center" });
    y += 10;

    // Company info
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Informasi Perusahaan", 14, y);
    y += 2;

    autoTable(doc, {
      startY: y,
      body: [
        ["Nama Perusahaan", d.namaPerusahaan],
        ["Pemilik", d.namaPemilik],
        ["Alamat", d.alamat],
        ["Jenis Usaha", d.jenisUsaha],
        ["NIB", d.nib || "-"],
        ["Nomor Kontak", d.nomorKontak || "-"],
      ],
      styles: { fontSize: 9, cellPadding: 2 },
      columnStyles: { 0: { fontStyle: "bold", cellWidth: 40 } },
      theme: "plain",
      margin: { left: 14, right: 14 },
    });

    y = (doc as any).lastAutoTable.finalY + 6;

    // Supervision info
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Detail Pengawasan", 14, y);
    y += 2;

    autoTable(doc, {
      startY: y,
      body: [
        ["Tanggal", d.tanggal],
        ["Jenis Pengawasan", JENIS_PENGAWASAN_LABELS[d.jenisPengawasan] || d.jenisPengawasan],
        ["Petugas", d.namaPetugas],
        ["Jumlah Temuan", String(d.jumlahTemuan)],
        ["Jenis Pelanggaran", d.jenisPelanggaran || "-"],
        ["Tingkat Risiko", RISIKO_LABELS[d.tingkatRisiko] || d.tingkatRisiko],
        ["Status", STATUS_LABELS[d.status] || d.status],
      ],
      styles: { fontSize: 9, cellPadding: 2 },
      columnStyles: { 0: { fontStyle: "bold", cellWidth: 40 } },
      theme: "plain",
      margin: { left: 14, right: 14 },
    });

    y = (doc as any).lastAutoTable.finalY + 6;

    // Checklist
    const sections = CHECKLISTS[d.jenisPengawasan];
    if (sections) {
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Checklist Pemeriksaan", 14, y);
      y += 2;

      const checkRows: string[][] = [];
      sections.forEach((sec, si) => {
        checkRows.push([sec.section, "", ""]);
        sec.items.forEach((item, ii) => {
          const key = `${si}-${ii}`;
          const checked = !!d.checklist[key];
          checkRows.push(["", item, checked ? "Ya" : "Tidak"]);
        });
      });

      autoTable(doc, {
        startY: y,
        head: [["Section", "Item", "Status"]],
        body: checkRows,
        styles: { fontSize: 8, cellPadding: 1.5 },
        headStyles: { fillColor: [41, 98, 255], textColor: 255, fontStyle: "bold" },
        columnStyles: {
          0: { cellWidth: 55, fontStyle: "bold" },
          2: { cellWidth: 20, halign: "center" },
        },
        didParseCell: (data: any) => {
          // Section header row styling
          if (data.section === "body" && data.row.raw[0] !== "" && data.column.index === 0) {
            data.cell.styles.fillColor = [230, 236, 245];
            data.cell.colSpan = 2;
          }
          // Color Ya/Tidak
          if (data.section === "body" && data.column.index === 2) {
            if (data.cell.raw === "Ya") {
              data.cell.styles.textColor = [34, 139, 34];
              data.cell.styles.fontStyle = "bold";
            } else if (data.cell.raw === "Tidak") {
              data.cell.styles.textColor = [200, 50, 50];
            }
          }
        },
        margin: { left: 14, right: 14 },
      });

      y = (doc as any).lastAutoTable.finalY + 6;
    }

    // Rekomendasi
    if (d.rekomendasi.length > 0) {
      if (y > 250) { doc.addPage(); y = 18; }
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Rekomendasi", 14, y);
      y += 2;

      autoTable(doc, {
        startY: y,
        head: [["No", "Rekomendasi"]],
        body: d.rekomendasi.map((r, i) => [i + 1, r]),
        styles: { fontSize: 9, cellPadding: 2 },
        headStyles: { fillColor: [41, 98, 255], textColor: 255, fontStyle: "bold" },
        columnStyles: { 0: { cellWidth: 12, halign: "center" } },
        margin: { left: 14, right: 14 },
      });

      y = (doc as any).lastAutoTable.finalY + 6;
    }

    // Catatan
    if (d.catatan) {
      if (y > 260) { doc.addPage(); y = 18; }
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Catatan", 14, y);
      y += 5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      const lines = doc.splitTextToSize(d.catatan, pw - 28);
      doc.text(lines, 14, y);
    }
  });

  // Footer with page numbers
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(150);
    doc.text(`Halaman ${i} dari ${totalPages}`, doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() - 8, { align: "center" });
    doc.setTextColor(0);
  }

  doc.save(`Laporan_Pengawasan_${new Date().toISOString().slice(0, 10)}.pdf`);
}
