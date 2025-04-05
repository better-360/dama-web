import React, { useState } from "react";
import { Lock, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../../store/hooks";
import { loginWithEmail } from "../../../../http/requests/auth";
import { saveUserTokens } from "../../../../utils/storage";
import { login } from "../../../../store/slices/userSlice";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const loginData = await loginWithEmail(email, password);
      // Only store serializable data
      const { tokens, user } = loginData;
      saveUserTokens(tokens);
      dispatch(login({ user, tokens }));
      navigate("/admin/applications", { replace: true });
    } catch (error: any) {
      console.error(
        "Login error:",
        JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error)))
      );

      if (error.code === "auth/invalid-email") {
        setError("Geçersiz e-posta adresi.");
      } else if (error.code === "auth/wrong-password") {
        setError("Hatalı şifre.");
      } else {
        setError("Giriş başarısız. Lütfen bilgilerinizi kontrol edin.");
      }
    }
  };
  return (
    <div className="min-h-screen bg-[#E2E0D6]/10 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#292A2D]">DAMA Advisors</h1>
            <p className="mt-2 text-gray-600">Yönetim Paneli</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                E-posta
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#292A2D] focus:border-transparent"
                  placeholder="E-posta adresiniz"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Şifre
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#292A2D] focus:border-transparent"
                  placeholder="Şifreniz"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#292A2D] hover:bg-[#292A2D]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#292A2D]"
            >
              Giriş Yap
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} DAMA Advisors. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
