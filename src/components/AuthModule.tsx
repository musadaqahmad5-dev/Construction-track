import React, { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth, signInWithGoogle } from '../firebase';
import { motion } from 'motion/react';
import { UnifiedFashionOS } from '../engine';
import { Sun, Moon, Sparkle, AlertTriangle } from 'lucide-react';

interface AuthModuleProps {
  onGuestMode: () => void;
}

export const AuthModule: React.FC<AuthModuleProps> = ({ onGuestMode }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Initialize theme from storage
  const [currentTheme, setCurrentTheme] = useState<string>(() => {
    return localStorage.getItem('look_vision_theme') || 'cosmic-dream';
  });

  // Keep body styling synchronized with selected Day/Night theme to prevent "Preview Splitting"
  useEffect(() => {
    const THEME_BG_COLORS: Record<string, string> = {
      'classic-noir': '#09090b',
      'cyber-couture': '#03020c',
      'nordic-editorial': '#0d0c0b',
      'cosmic-dream': '#05050a',
      'solar-day': '#fcfbf9',
    };
    
    const bgColor = THEME_BG_COLORS[currentTheme] || '#05050a';
    document.body.style.backgroundColor = bgColor;
    document.body.style.transition = 'background-color 0.4s ease, color 0.4s ease';
    
    if (currentTheme === 'solar-day') {
      document.body.style.color = '#1c1b1a';
      document.documentElement.classList.add('light-theme');
    } else {
      document.body.style.color = '#ffffff';
      document.documentElement.classList.remove('light-theme');
    }
  }, [currentTheme]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (isSignUp) {
        UnifiedFashionOS.trackEvent('signup_started', { email, name });
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(credential.user, {
          displayName: name || 'Sartorialist'
        });
        UnifiedFashionOS.trackEvent('signup_completed', { email, uid: credential.user.uid });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      let friendlyMessage = err.message || "An unexpected error occurred.";
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        friendlyMessage = "Incorrect email or password. Please verify your credentials or use Guest Mode.";
      } else if (err.code === 'auth/user-not-found') {
        friendlyMessage = "No user found with this email. Please sign up instead.";
      } else if (err.code === 'auth/email-already-in-use') {
        friendlyMessage = "An account already exists under this email address.";
      } else if (err.code === 'auth/weak-password') {
        friendlyMessage = "Password must be at least 6 characters long.";
      } else if (err.code === 'auth/invalid-email') {
        friendlyMessage = "Please enter a valid email address.";
      }
      setError(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address to receive a recovery key.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage("A password recovery link has been dispatched to your email. Check your spam and inbox folders.");
    } catch (err: any) {
      console.error("Reset password error:", err);
      let friendlyMessage = err.message || "Could not dispatch reset email.";
      if (err.code === 'auth/user-not-found') {
        friendlyMessage = "No registered signature exists for this email address.";
      } else if (err.code === 'auth/invalid-email') {
        friendlyMessage = "Please verify your email address format.";
      }
      setError(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      let friendlyMessage = "Failed to authenticate with your Google Identity.";
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        friendlyMessage = "Google sign-in window was closed. Please try again.";
        console.info("Google sign in window closed by user.");
      } else {
        console.error("Google sign in error:", err);
      }
      if (err.code === 'auth/popup-blocked') {
        friendlyMessage = "A popup blocker stopped Google Sign-In. Please allow popups for this boutique domain.";
      } else if (err.code === 'auth/unauthorized-domain') {
        friendlyMessage = "auth/unauthorized-domain";
      } else if (err.message && err.code !== 'auth/popup-closed-by-user') {
        friendlyMessage = err.message;
      }
      setError(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  // Define dynamic style tokens to avoid any hardcoded dark/light values
  const isSolar = currentTheme === 'solar-day';
  const bgClass = isSolar ? 'bg-[#fcfbf9] text-[#1c1b1a]' : 'bg-[#05050a] text-white/90';
  const labelClass = isSolar ? 'text-stone-400' : 'text-white/30';
  const textPrimary = isSolar ? 'text-stone-900' : 'text-white';
  const textSecondary = isSolar ? 'text-stone-500' : 'text-white/45';
  const textAccent = isSolar ? 'text-stone-700' : 'text-white/40';
  const borderClass = isSolar ? 'border-stone-200' : 'border-white/5';
  const inputClass = isSolar 
    ? 'text-stone-900 border-stone-200 placeholder-stone-300 focus:border-stone-900' 
    : 'text-white border-white/10 placeholder-white/15 focus:border-white';
  
  const tabActive = isSolar 
    ? 'bg-stone-900 text-white font-semibold' 
    : 'bg-white/10 text-white font-bold border border-white/5 shadow-sm';
  const tabInactive = isSolar 
    ? 'text-stone-400 hover:text-stone-700' 
    : 'text-zinc-500 hover:text-white/70';

  const buttonPrimary = isSolar 
    ? 'bg-stone-950 hover:bg-stone-800 text-white' 
    : 'bg-white hover:bg-neutral-200 text-black';
  const buttonSecondary = isSolar 
    ? 'border-stone-200 hover:border-stone-400 text-stone-700 hover:bg-stone-50' 
    : 'border-white/10 hover:border-white/30 text-white/80 hover:bg-white/5';

  return (
    <div className={`min-h-screen w-full relative flex flex-col items-center justify-center p-4 sm:p-6 select-none transition-colors duration-300 overflow-y-auto ${bgClass}`}>
      
      {/* Floating Day/Night Mood Switcher (Solar Day vs Lunar Night) */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50">
        <button
          type="button"
          onClick={() => {
            const nextTheme = isSolar ? 'cosmic-dream' : 'solar-day';
            setCurrentTheme(nextTheme);
            localStorage.setItem('look_vision_theme', nextTheme);
          }}
          className={`p-3 rounded-full transition-all border shadow-sm flex items-center justify-center cursor-pointer ${
            isSolar 
              ? 'bg-white border-stone-200 text-stone-900 hover:bg-stone-50' 
              : 'bg-black/40 border-white/10 text-white hover:bg-white/5'
          }`}
          title={isSolar ? "Lunar Night Mood" : "Solar Day Mood"}
          id="temporal-mood-switcher"
        >
          {isSolar ? (
            <Moon className="w-4 h-4 text-indigo-500 fill-indigo-500/20" />
          ) : (
            <Sun className="w-4 h-4 text-amber-400 fill-amber-400/20" />
          )}
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-sm space-y-6 sm:space-y-8 py-8"
      >
        {/* Editorial Header */}
        <div className="text-center space-y-2">
          <span className={`text-[10px] font-mono tracking-[0.25em] uppercase block font-light ${labelClass}`}>
            SARTORIAL SYSTEM GATE / ACCESS PORTAL
          </span>
          <h2 className={`text-4xl font-serif font-light tracking-[-0.03em] ${textPrimary}`}>
            LOOK VISION
          </h2>
          <p className={`text-[11px] sm:text-xs font-serif italic leading-relaxed max-w-xs mx-auto ${textSecondary}`}>
            "Sartorial system and cognitive fashion operating workspace."
          </p>
        </div>

        {/* Elevated Workspace Navigation Tab Grid */}
        <div className={`grid grid-cols-3 gap-1 rounded-lg p-1 max-w-sm mx-auto border bg-black/5 ${borderClass}`}>
          <button 
            type="button"
            onClick={() => { setIsSignUp(false); setIsForgotPassword(false); setError(null); setSuccessMessage(null); }}
            className={`py-2.5 text-[10px] font-mono uppercase tracking-wider rounded transition-all cursor-pointer ${(!isSignUp && !isForgotPassword) ? tabActive : tabInactive}`}
          >
            Access
          </button>
          <button 
            type="button"
            onClick={() => { setIsSignUp(true); setIsForgotPassword(false); setError(null); setSuccessMessage(null); }}
            className={`py-2.5 text-[10px] font-mono uppercase tracking-wider rounded transition-all cursor-pointer ${(isSignUp && !isForgotPassword) ? tabActive : tabInactive}`}
          >
            Register
          </button>
          <button 
            type="button"
            onClick={onGuestMode}
            className="py-2.5 text-[10px] font-mono uppercase tracking-wider rounded transition-all cursor-pointer text-amber-500 hover:text-amber-600 hover:bg-amber-500/5 font-semibold border border-amber-500/20"
          >
            Guest OS ✦
          </button>
        </div>

        {/* Error Messages (Clean list, no colored badges/glows) */}
        {error && (
          <div className="text-center text-xs text-rose-500 font-mono tracking-wide px-4 border-l border-rose-500/30 space-y-2 py-1">
            {error === 'auth/unauthorized-domain' ? (
              <div className={`text-left space-y-3 p-4 rounded border text-stone-700 select-text ${isSolar ? 'bg-stone-100 border-stone-200' : 'bg-neutral-900/60 border-white/10 text-neutral-300'}`}>
                <p className={`font-semibold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-1 ${textPrimary}`}>
                  ⚠️ Domain Authorization Required
                </p>
                <p className="text-[11px] leading-relaxed">
                  Your custom Firebase project <strong className={textPrimary}>fashion-ai-56bd2</strong> has not authorized this preview domain yet.
                </p>
                <p className="text-[11px] leading-relaxed">
                  Please go to your <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-500 underline hover:text-indigo-600 font-bold">Firebase Console</a> &gt; <strong>Authentication</strong> &gt; <strong>Settings</strong> &gt; <strong>Authorized domains</strong>, and add:
                </p>
                <div className={`p-2 rounded text-[10px] font-mono select-all border break-all ${isSolar ? 'bg-white border-stone-200 text-stone-800' : 'bg-black/50 border-white/5 text-white'}`}>
                  {window.location.hostname}
                </div>
                <p className="text-[11px] text-stone-400">
                  After adding this domain, please refresh this page and try again!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div>{error}</div>
                {window.self !== window.top && (
                  <div className={`mt-4 text-left p-4 rounded border text-xs leading-relaxed space-y-3 ${isSolar ? 'bg-stone-100 border-stone-200 text-stone-800' : 'bg-neutral-900/60 border-white/10 text-neutral-300'}`}>
                    <p className="font-semibold uppercase tracking-wider text-center text-amber-500 flex items-center justify-center gap-1">
                      ⚠️ Sandbox Environment Detected
                    </p>
                    <p className="text-[11px]">
                      Authentication popups are often restricted by security policies inside preview frames.
                    </p>
                    <p className="text-[11px]">
                      Please open the application in a standalone browser tab to sign in or register securely:
                    </p>
                    <div className="text-center pt-1">
                      <button
                        type="button"
                        onClick={() => window.open(window.location.href, '_blank')}
                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-[10px] uppercase tracking-wider rounded transition-colors cursor-pointer font-bold"
                      >
                        Open in New Tab ↗
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Success Messages */}
        {successMessage && (
          <div className="text-center text-xs text-emerald-500 font-mono tracking-wide px-4 border-l border-emerald-500/30 py-1 bg-emerald-500/[0.02]">
            <div>{successMessage}</div>
          </div>
        )}

        {/* Form elements, strictly borderless input fields with simple underline indicator */}
        {isForgotPassword ? (
          <form onSubmit={handleResetPassword} className="space-y-6 select-all">
            <div className="space-y-1">
              <label className={`text-[10px] font-mono uppercase tracking-[0.15em] block font-light text-left ${labelClass}`}>
                Your email identity
              </label>
              <input
                type="email"
                required
                placeholder="name@lookvision.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full bg-transparent border-b py-3 text-sm focus:outline-none transition-all font-light ${inputClass}`}
              />
            </div>

            <div className="pt-2 space-y-3">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-none font-mono text-xs font-semibold uppercase tracking-[0.2em] cursor-pointer transition-all disabled:opacity-50 ${buttonPrimary}`}
              >
                {loading ? '[ TRANSMITTING KEY... ]' : '[ SEND RECOVERY LINK ]'}
              </button>

              <button
                type="button"
                onClick={() => { setIsForgotPassword(false); setError(null); setSuccessMessage(null); }}
                className={`w-full py-3 rounded-none font-mono text-[10px] uppercase font-semibold tracking-wider cursor-pointer transition-all border ${buttonSecondary}`}
              >
                [ Back to standard entry ]
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 select-all">
            {isSignUp && (
              <div className="space-y-1">
                <label className={`text-[10px] font-mono uppercase tracking-[0.15em] block font-light text-left ${labelClass}`}>
                  Your signature name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sartorialist"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full bg-transparent border-b py-3 text-sm focus:outline-none transition-all font-light ${inputClass}`}
                />
              </div>
            )}

            <div className="space-y-1">
              <label className={`text-[10px] font-mono uppercase tracking-[0.15em] block font-light text-left ${labelClass}`}>
                Your email identity
              </label>
              <input
                type="email"
                required
                placeholder="name@lookvision.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full bg-transparent border-b py-3 text-sm focus:outline-none transition-all font-light ${inputClass}`}
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className={`text-[10px] font-mono uppercase tracking-[0.15em] block font-light text-left ${labelClass}`}>
                  Your secret key
                </label>
                <button
                  type="button"
                  onClick={() => { setIsForgotPassword(true); setError(null); setSuccessMessage(null); }}
                  className="text-[9px] font-mono uppercase tracking-wider text-amber-500 hover:text-amber-600 transition-colors cursor-pointer"
                >
                  Forgot key?
                </button>
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-transparent border-b py-3 text-sm focus:outline-none transition-all font-light ${inputClass}`}
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-none font-mono text-xs font-semibold uppercase tracking-[0.2em] cursor-pointer transition-all disabled:opacity-50 ${buttonPrimary}`}
              >
                {loading ? '[ INITIALIZING OS... ]' : '[ ACCESS LOOK VISION OS ]'}
              </button>
            </div>
          </form>
        )}

        {/* Dynamic Mode Switcher */}
        {!isForgotPassword && (
          <div className="text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className={`text-[10px] font-mono uppercase tracking-[0.15em] transition-colors cursor-pointer ${textAccent} hover:${textPrimary}`}
            >
              {isSignUp ? '[ Standard entry ]' : '[ Register key signature ]'}
            </button>
          </div>
        )}

        {/* Separator / Alternative ways */}
        <div className={`flex justify-center text-[10px] font-mono uppercase tracking-[0.2em] pt-1 ${isSolar ? 'text-stone-300' : 'text-white/20'}`}>
          — OR —
        </div>

        {/* Clean, quiet secondary row */}
        <div className="flex flex-col gap-3 font-mono text-xs max-w-xs mx-auto">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className={`w-full py-3.5 rounded-none text-[10px] uppercase font-semibold tracking-wider cursor-pointer transition-all border ${buttonSecondary}`}
          >
            Google Identity
          </button>
        </div>
      </motion.div>
    </div>
  );
};
