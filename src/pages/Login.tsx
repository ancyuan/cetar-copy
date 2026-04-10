import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ClipboardList, Eye, EyeOff, Loader as Loader2 } from "lucide-react";
import { toast } from "sonner";

type Mode = "login" | "register";

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Email dan password wajib diisi");
      return;
    }
    if (mode === "register" && !name) {
      toast.error("Nama petugas wajib diisi");
      return;
    }
    setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } },
        });
        if (error) throw error;
        toast.success("Akun berhasil dibuat. Silakan login.");
        setMode("login");
        setPassword("");
        setName("");
      }
    } catch (err: any) {
      const msg = err?.message || "Terjadi kesalahan";
      if (msg.includes("Invalid login credentials")) {
        toast.error("Email atau password salah");
      } else if (msg.includes("User already registered")) {
        toast.error("Email sudah terdaftar");
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-lg">
            <ClipboardList className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Pengawasan Tata Niaga</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === "login" ? "Masuk ke akun petugas Anda" : "Daftarkan akun petugas baru"}
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex rounded-xl bg-secondary p-1 mb-6">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === "login"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Masuk
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === "register"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Daftar
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">
                  Nama Petugas
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masukkan nama lengkap"
                  className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
                />
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="petugas@example.com"
                autoComplete="email"
                className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === "register" ? "Min. 6 karakter" : "Masukkan password"}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  className="w-full px-3 py-2.5 pr-10 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === "login" ? "Masuk" : "Daftar Akun"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
