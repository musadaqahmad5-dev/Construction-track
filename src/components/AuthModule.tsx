import React, { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile
} from 'firebase/auth';
import { auth, signInWithGoogle } from '../firebase';
import { motion } from 'motion/react';

// Help get our temporal theme class name
function getTemporalTheme() {
  const hr = new Date().getHours();
  if (hr >= 4 && hr < 12) {
    return { bg: 'bg-[#1a1a1a]', text: 'text-neutral-200' };
  } else if (hr >= 12 && hr < 18) {
    return { bg: 'bg-[#0f0f0f]', text: 'text-neutral-300' };
  } else {
    return { bg: 'bg-[#050505]', text: 'text-white/90' };
  }
}

interface AuthModuleProps {
  onGuestMode: () => void;
}

export const AuthModule: React.FC<AuthModuleProps> = ({ onGuestMode }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const theme = getTemporalTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(credential.user, {
          displayName: name || 'Sartorialist'
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      let friendlyMessage = err.message || "An unexpected error occurred.";
      if (err.code === 'auth/wrong-password') {
        friendlyMessage = "Incorrect password. Please try again.";
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

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error("Google sign in error:", err);
      setError(err.message || "Failed to authenticate.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} flex items-center justify-center p-6 selection:bg-white/20 select-none`}>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-sm space-y-12 py-10"
      >
        {/* Editorial Header */}
        <div className="text-center space-y-3">
          <span className="text-[10px] font-mono tracking-[0.25em] text-white/30 uppercase block font-light">
            Vol. XI / Archive Entry
          </span>
          <h2 className="text-4xl font-serif font-light tracking-[-0.03em] text-white">
            Wardrobe Companion
          </h2>
          <p className="text-xs font-serif italic text-white/40 leading-relaxed max-w-xs mx-auto">
            "A printed archive of personal silhouettes."
          </p>
        </div>

        {/* Error Messages (Clean list, no colored badges/glows) */}
        {error && (
          <div className="text-center text-xs text-white/60 font-mono tracking-wide px-4 border-l border-white/20">
            {error}
          </div>
        )}

        {/* Form elements, strictly borderless input fields with simple underline indicator */}
        <form onSubmit={handleSubmit} className="space-y-8 select-all">
          {isSignUp && (
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-white/40 uppercase tracking-[0.15em] block font-light">
                Your signature name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sartorialist"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent border-b border-white/10 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white transition-all font-light"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-white/40 uppercase tracking-[0.15em] block font-light">
              Your email archive
            </label>
            <input
              type="email"
              required
              placeholder="name@companion.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b border-white/10 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white transition-all font-light"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-white/40 uppercase tracking-[0.15em] block font-light">
              Your secret key
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-white/10 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white transition-all font-light"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white hover:bg-neutral-200 text-black py-4 rounded-none font-mono text-xs font-semibold uppercase tracking-[0.2em] cursor-pointer transition-all disabled:opacity-50"
            >
              {loading ? '[ entering... ]' : '[ Enter Archive ]'}
            </button>
          </div>
        </form>

        {/* Dynamic Mode Switcher */}
        <div className="text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/40 hover:text-white transition-colors cursor-pointer"
          >
            {isSignUp ? '[ Standard entry ]' : '[ Register signature ]'}
          </button>
        </div>

        {/* Separator / Alternative ways */}
        <div className="flex justify-center text-[10px] font-mono uppercase tracking-[0.2em] text-white/25 pt-2">
          — OR —
        </div>

        {/* Clean, quiet secondary row */}
        <div className="flex flex-col gap-3 font-mono text-xs max-w-xs mx-auto">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full border border-white/10 hover:border-white/30 text-white/80 py-3 rounded-none text-[10px] uppercase font-semibold tracking-wider cursor-pointer transition-all hover:bg-white/5"
          >
            Google Identity
          </button>

          <button
            onClick={onGuestMode}
            disabled={loading}
            className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white/80 py-3 rounded-none text-[10px] uppercase font-semibold tracking-wider cursor-pointer transition-all"
          >
            Guest Presence
          </button>
        </div>
      </motion.div>
    </div>
  );
};
