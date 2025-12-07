import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import AnimatedBackground from "../../components/layout/AnimatedBackground";

const TotpSetup = () => {
  const navigate = useNavigate();
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    generateTotp();
  }, []);

  const generateTotp = async () => {
    try {
      // Get user info from localStorage or context
      const userEmail = localStorage.getItem("userEmail") || "user@example.com";
      const userId = localStorage.getItem("userId") || "";

      const response = await api.post("/auth/setup-totp", {
        userId,
        email: userEmail,
      });
      setQrCode(response.data.qrCode);
      setSecret(response.data.secret);
    } catch (err) {
      console.error("Failed to generate TOTP:", err);
      setError("Failed to generate QR code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (verifyCode.length !== 6) {
      setError("Please enter a 6-digit code");
      return;
    }

    setVerifying(true);
    setError("");

    try {
      // Verify the code works
      const tempToken = localStorage.getItem("tempToken");
      await api.post("/auth/verify-mfa", { tempToken, otp: verifyCode });

      alert("Google Authenticator setup successful!");
      navigate("/portal");
    } catch (err) {
      setError("Invalid code. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 w-full max-w-2xl p-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl mx-4">
        <h2 className="text-3xl font-bold text-center mb-2 text-white">
          Setup Google Authenticator
        </h2>
        <p className="text-gray-300 text-center mb-8">
          Scan the QR code below with your Google Authenticator app
        </p>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-300 mt-4">Generating QR code...</p>
          </div>
        ) : (
          <>
            {/* QR Code */}
            <div className="bg-white p-6 rounded-xl mb-6 flex justify-center">
              {qrCode ? (
                <img src={qrCode} alt="QR Code" className="w-64 h-64" />
              ) : (
                <div className="w-64 h-64 flex items-center justify-center text-gray-500">
                  Failed to load QR code
                </div>
              )}
            </div>

            {/* Manual Entry */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6">
              <p className="text-gray-300 text-sm mb-2">
                Can't scan? Enter this code manually:
              </p>
              <div className="bg-black/30 rounded p-3 font-mono text-white text-center break-all">
                {secret}
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
              <h3 className="text-white font-semibold mb-2">
                📱 Instructions:
              </h3>
              <ol className="text-gray-300 text-sm space-y-1 list-decimal list-inside">
                <li>Download Google Authenticator from your app store</li>
                <li>Open the app and tap "+" to add an account</li>
                <li>Choose "Scan a QR code" and scan the code above</li>
                <li>Enter the 6-digit code below to verify setup</li>
              </ol>
            </div>

            {/* Verification */}
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-bold mb-2">
                  Verify Setup - Enter Code from App
                </label>
                <input
                  type="text"
                  value={verifyCode}
                  onChange={(e) =>
                    setVerifyCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 text-center tracking-widest text-2xl"
                  placeholder="000000"
                  maxLength={6}
                />
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded text-center">
                  {error}
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => navigate("/login")}
                  className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleVerify}
                  disabled={verifying || verifyCode.length !== 6}
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {verifying ? "Verifying..." : "Complete Setup"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TotpSetup;
