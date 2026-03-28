"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import api from "../../services/api";
import AnimatedBackground from "../../components/layout/AnimatedBackground";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";

type FlowState =
  | "login"
  | "mfa"
  | "forgot-password"
  | "reset-otp"
  | "reset-password";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [flowState, setFlowState] = useState<FlowState>("login");
  const [mfaMethod, setMfaMethod] = useState<"email" | "totp">("email");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [tempToken, setTempToken] = useState("");
  const [resetToken, setResetToken] = useState("");
  const { login } = useAuth();
  const navigate = useRouter();
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resending, setResending] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // 3D Tilt & Mouse Glow Setup
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Stagger variants for form items
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  // Countdown timer for resend button
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(
        () => setResendCooldown(resendCooldown - 1),
        1000,
      );
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", { email, password });

      if (response.data.mfaRequired) {
        setTempToken(response.data.tempToken);
        setMfaMethod(response.data.mfaMethod || "email");
        setFlowState("mfa");
        setResendCooldown(60);
        setError("");
      } else {
        setSuccessMessage("Login successful! Redirecting...");
        login(response.data.accessToken, response.data.refreshToken);
        setTimeout(() => navigate.push("/portal"), 1500);
      }
    } catch (err) {
      setError("Invalid credentials");
      console.error("Login failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyMfa = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/verify-mfa", {
        tempToken,
        otp,
        method: mfaMethod,
      });
      setSuccessMessage("Identity verified! Logging in...");
      login(response.data.accessToken, response.data.refreshToken);
      setTimeout(() => navigate.push("/portal"), 1500);
    } catch (err) {
      setError("Invalid code");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      await api.post("/auth/forgot-password", { email });
      setSuccessMessage("If this email exists, you will receive a reset code");
      setFlowState("reset-otp");
      setResendCooldown(60);
    } catch (err) {
      setError("Failed to send reset code");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyResetOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/verify-reset-otp", { email, otp });
      setResetToken(response.data.resetToken);
      setFlowState("reset-password");
      setOtp("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid or expired code");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/reset-password", { resetToken, newPassword });
      setSuccessMessage("Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        setFlowState("login");
        setEmail("");
        setPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setSuccessMessage("");
      }, 2000);
    } catch (err) {
      setError("Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || resending) return;

    setResending(true);
    setError("");
    setSuccessMessage("");

    try {
      if (flowState === "mfa") {
        await api.post("/auth/resend-otp", { tempToken });
        setSuccessMessage("New OTP sent to your email!");
      } else if (flowState === "reset-otp") {
        await api.post("/auth/forgot-password", { email });
        setSuccessMessage("New reset code sent!");
      }
      setResendCooldown(60);
      setOtp("");
    } catch (err) {
      setError("Failed to resend code");
    } finally {
      setResending(false);
    }
  };

  const renderContent = () => {
    switch (flowState) {
      case "login":
        return (
          <motion.form 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            onSubmit={handleLogin} 
            className="space-y-6"
          >
            <motion.div variants={itemVariants} className="relative group">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="peer w-full pl-10 pr-4 py-4 rounded-full bg-white/5 border border-white/10 text-white placeholder-transparent focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all"
                placeholder="Email Address"
                required
              />
              <label
                htmlFor="email"
                className="absolute left-10 top-4 text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-3 peer-focus:left-4 peer-focus:text-xs peer-focus:text-blue-200 peer-[:not(:placeholder-shown)]:-top-3 peer-[:not(:placeholder-shown)]:left-4 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-blue-200 pointer-events-none bg-white/10 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10"
              >
                Email Address
              </label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="peer w-full pl-10 pr-12 py-4 rounded-full bg-white/5 border border-white/10 text-white placeholder-transparent focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all"
                placeholder="Password"
                required
              />
              <label
                htmlFor="password"
                className="absolute left-10 top-4 text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-3 peer-focus:left-4 peer-focus:text-xs peer-focus:text-blue-200 peer-[:not(:placeholder-shown)]:-top-3 peer-[:not(:placeholder-shown)]:left-4 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-blue-200 pointer-events-none bg-white/10 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10"
              >
                Password
              </label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => setFlowState("forgot-password")}
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                Forgot Password?
              </button>
            </motion.div>

            <motion.button
              variants={itemVariants}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-4 rounded-full transition-all shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] animate-shine"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Access Dashboard"
              )}
            </motion.button>
          </motion.form>
        );

      case "forgot-password":
        return (
          <motion.form 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            onSubmit={handleForgotPassword} 
            className="space-y-6"
          >
            <motion.div variants={itemVariants} className="relative group">
              <input
                type="email"
                id="reset-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="peer w-full pl-4 pr-4 py-4 rounded-full bg-white/5 border border-white/10 text-white placeholder-transparent focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all"
                placeholder="Email Address"
                required
              />
              <label
                htmlFor="reset-email"
                className="absolute left-4 top-4 text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-3 peer-focus:left-4 peer-focus:text-xs peer-focus:text-blue-200 peer-[:not(:placeholder-shown)]:-top-3 peer-[:not(:placeholder-shown)]:left-4 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-blue-200 pointer-events-none bg-white/10 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10"
              >
                Email Address
              </label>
              <p className="text-gray-400 text-[10px] md:text-xs mt-2 ml-2">
                We'll send a verification code to reset your password
              </p>
            </motion.div>

            <motion.button
              variants={itemVariants}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-bold py-4 px-4 rounded-full transition-all shadow-lg hover:shadow-orange-500/50 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] animate-shine"
            >
              {loading ? "Sending..." : "Send Reset Code"}
            </motion.button>

            <motion.button
              variants={itemVariants}
              type="button"
              onClick={() => {
                setFlowState("login");
                setError("");
                setSuccessMessage("");
              }}
              className="w-full text-gray-400 hover:text-white text-sm transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to login
            </motion.button>
          </motion.form>
        );

      case "reset-otp":
      case "mfa":
        const isMfa = flowState === "mfa";
        return (
          <motion.form
            variants={containerVariants}
            initial="hidden"
            animate="show"
            onSubmit={isMfa ? handleVerifyMfa : handleVerifyResetOtp}
            className="space-y-6"
          >
            <motion.div variants={itemVariants}>
              <label className="block text-gray-300 text-sm font-bold mb-6 text-center">
                {isMfa
                  ? mfaMethod === "email"
                    ? "Email Verification Code"
                    : "Authenticator Code"
                  : "Reset Verification Code"}
              </label>
              
              <div className="flex justify-center gap-3 md:gap-4 mb-8">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={otp[index] || ""}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(-1);
                      if (val) {
                        const newOtp = otp.split("");
                        newOtp[index] = val;
                        const finalOtp = newOtp.join("");
                        setOtp(finalOtp);
                        
                        // Auto focus next
                        if (index < 5) {
                          const nextInput = document.getElementById(`otp-${index + 1}`);
                          nextInput?.focus();
                        }
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !otp[index] && index > 0) {
                        const prevInput = document.getElementById(`otp-${index - 1}`);
                        prevInput?.focus();
                      }
                    }}
                    className={`w-9 h-9 md:w-14 md:h-14 flex-shrink-0 aspect-square rounded-full bg-white/5 border-2 ${otp.length === index ? 'mfa-input-active' : 'border-white/10'} text-white text-center text-xl md:text-2xl font-bold focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all`}
                    placeholder="•"
                  />
                ))}
              </div>

              <p className="text-gray-400 text-xs mt-3 text-center flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {isMfa
                  ? mfaMethod === "email"
                    ? "Check your email for the 6-digit code"
                    : "Enter code from Google Authenticator"
                  : "Check your email for the reset code"}
              </p>

              {(isMfa && mfaMethod === "email") || !isMfa ? (
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendCooldown > 0 || resending}
                    className="text-sm text-blue-400 hover:text-blue-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-2"
                  >
                    {resending ? (
                      <>
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : resendCooldown > 0 ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Resend in {resendCooldown}s
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Resend Code
                      </>
                    )}
                  </button>
                </div>
              ) : null}
            </motion.div>

            <motion.button
              variants={itemVariants}
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-4 rounded-full transition-all shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] animate-shine"
            >
              {loading ? "Verifying..." : "Verify & Continue"}
            </motion.button>

            <motion.button
              variants={itemVariants}
              type="button"
              onClick={() => {
                setFlowState(isMfa ? "login" : "forgot-password");
                setOtp("");
                setError("");
                setSuccessMessage("");
              }}
              className="w-full text-gray-400 hover:text-white text-sm transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </motion.button>
          </motion.form>
        );

      case "reset-password":
        return (
          <motion.form 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            onSubmit={handleResetPassword} 
            className="space-y-6"
          >
            <motion.div variants={itemVariants} className="relative group">
              <input
                type={showNewPassword ? "text" : "password"}
                id="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="peer w-full pl-4 pr-12 py-4 rounded-full bg-white/5 border border-white/10 text-white placeholder-transparent focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all"
                placeholder="New Password"
                required
                minLength={6}
              />
              <label
                htmlFor="new-password"
                className="absolute left-4 top-4 text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-3 peer-focus:left-4 peer-focus:text-xs peer-focus:text-blue-200 peer-[:not(:placeholder-shown)]:-top-3 peer-[:not(:placeholder-shown)]:left-4 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-blue-200 pointer-events-none bg-white/10 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10"
              >
                New Password
              </label>
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-4 text-gray-400 hover:text-white transition-colors"
              >
                {showNewPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </motion.div>

            <motion.div variants={itemVariants} className="relative group">
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="peer w-full pl-4 pr-4 py-4 rounded-full bg-white/5 border border-white/10 text-white placeholder-transparent focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all"
                placeholder="Confirm Password"
                required
              />
              <label
                htmlFor="confirm-password"
                className="absolute left-4 top-4 text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-3 peer-focus:left-4 peer-focus:text-xs peer-focus:text-blue-200 peer-[:not(:placeholder-shown)]:-top-3 peer-[:not(:placeholder-shown)]:left-4 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-blue-200 pointer-events-none bg-white/10 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10"
              >
                Confirm Password
              </label>
            </motion.div>

            <motion.button
              variants={itemVariants}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 px-4 rounded-full transition-all shadow-lg hover:shadow-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] animate-shine"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </motion.button>
          </motion.form>
        );
    }
  };

  const getTitle = () => {
    switch (flowState) {
      case "login":
        return "Admin Login";
      case "mfa":
        return "Verify Identity";
      case "forgot-password":
        return "Forgot Password";
      case "reset-otp":
        return "Verify Reset Code";
      case "reset-password":
        return "Create New Password";
    }
  };

  const getDescription = () => {
    switch (flowState) {
      case "login":
        return "Sign in to access the admin portal";
      case "mfa":
        return mfaMethod === "email"
          ? "Enter the code sent to your email"
          : "Enter code from your authenticator app";
      case "forgot-password":
        return "Enter your email to receive a reset code";
      case "reset-otp":
        return "Enter the verification code sent to your email";
      case "reset-password":
        return "Choose a strong password for your account";
    }
  };

  const getIcon = () => {
    switch (flowState) {
      case "login":
        return "👤";
      case "mfa":
        return "🔐";
      case "forgot-password":
        return "🔑";
      case "reset-otp":
        return "📧";
      case "reset-password":
        return "🔒";
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-x-hidden">
      <AnimatedBackground />

      <div className="relative z-10 w-full max-w-md mx-4 perspective-1000 rounded-[3rem]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d", borderRadius: '48px' }}
          className="aura-border p-[1px] shadow-2xl relative w-full max-w-lg ml-auto mr-auto"
        >
          {/* Mouse Glow Follower */}
          <motion.div
            style={{
              left: useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]),
              top: useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]),
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-500/20 blur-[80px] rounded-full pointer-events-none z-0"
          />

          <div className="relative z-10 w-full glass-morphism-strong p-10 md:p-12 overflow-hidden" style={{ borderRadius: '48px' }}>
            {/* Header */}
            <div className="text-center mb-6 md:mb-8">
              <motion.div 
                key={flowState}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 mb-4 border border-blue-500/20"
              >
                <span className="text-3xl md:text-4xl">{getIcon()}</span>
              </motion.div>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{getTitle()}</h2>
              <p className="text-gray-400 text-sm mt-2">{getDescription()}</p>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-full mb-6 text-center animate-shake text-sm flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success Message */}
            <AnimatePresence>
              {successMessage && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-green-500/10 border border-green-500/20 text-green-200 px-4 py-3 rounded-full mb-6 text-center text-sm flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {successMessage}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={flowState}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
