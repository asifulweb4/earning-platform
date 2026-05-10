/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */


import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Wallet, 
  History, 
  Bell, 
  User as UserIcon, 
  Menu, 
  X, 
  TrendingUp, 
  ShieldCheck, 
  Zap,
  ArrowRight,
  Loader2,
  DollarSign,
  Smartphone,
  Banknote,
  LogOut,
  HelpCircle,
  BarChart3,
  Trophy,
  Gift,
  Star,
  Info,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence, useSpring, useTransform } from 'motion/react';

// --- Types ---
interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  type: string;
}

interface UserData {
  balance: number;
  completedTasks: any[];
  withdrawals: any[];
  isActive: boolean;
  lastBonusDate?: string;
}

interface Withdrawal {
  id: string;
  amount: number;
  method: string;
  number: string;
  status: 'pending' | 'success';
  timestamp: string;
}

// --- Constants ---
const USER_ID_KEY = 'earnbd_user_id';

// --- Helper Components ---

function CountUp({ value, prefix = "", suffix = "", decimals = 2 }: { value: number, prefix?: string, suffix?: string, decimals?: number }) {
  const [displayValue, setDisplayValue] = useState(value);
  
  useEffect(() => {
    let start = displayValue;
    const end = value;
    if (start === end) return;
    
    const duration = 1000;
    const startTime = performance.now();
    
    const update = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutExpo = 1 - Math.pow(2, -10 * progress);
      const current = start + (end - start) * easeOutExpo;
      
      setDisplayValue(current);
      
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };
    
    requestAnimationFrame(update);
  }, [value]);

  return <span>{prefix}{displayValue.toFixed(decimals)}{suffix}</span>;
}

interface ToastProps {
  key?: React.Key;
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

function Toast({ message, type = 'success', onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />
  };

  const bgColors = {
    success: 'bg-green-50 border-green-100',
    error: 'bg-red-50 border-red-100',
    info: 'bg-blue-50 border-blue-100'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={`fixed bottom-24 md:bottom-8 right-4 left-4 md:left-auto md:w-80 z-[100] p-4 rounded-2xl border shadow-2xl flex items-center gap-3 backdrop-blur-xl ${bgColors[type]}`}
    >
      <div className="shrink-0">{icons[type]}</div>
      <p className="text-sm font-bold text-stone-800">{message}</p>
      <button onClick={onClose} className="ml-auto text-stone-400 hover:text-stone-600 transition-colors">
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

function BackgroundElements() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
          x: [0, 100, 0],
          y: [0, 50, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-orange-100/30 rounded-full blur-[120px]"
      />
      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2],
          rotate: [0, -90, 0],
          x: [0, -100, 0],
          y: [0, -50, 0]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-amber-100/30 rounded-full blur-[120px]"
      />
    </div>
  );
}

function Landing({ onGetStarted }: { onGetStarted: () => void }) {
  const dynamicMessages = [
    "নির্ভরযোগ্য আয়ের নতুন দিগন্ত।",
    "আপনার মেধা কাজে লাগিয়ে আয় করুন।",
    "সহজ কাজ, নিশ্চিত পেমেন্ট।",
    "EarnBD AI এর সাথে শুরু করুন আজই।"
  ];
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % dynamicMessages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] overflow-hidden relative selection:bg-orange-100 font-sans">
      <BackgroundElements />
      
      <nav className="relative z-10 px-6 py-8 md:px-12 flex justify-between items-center max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 group cursor-pointer"
        >
          <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-orange-200 group-hover:rotate-12 transition-transform duration-500">
            <Zap className="fill-current w-7 h-7" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tighter text-stone-900">EarnBD <span className="text-orange-600">AI</span></span>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest leading-none">Bangladesh Premium</span>
          </div>
        </motion.div>
        <motion.button 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onGetStarted}
          className="bg-stone-900 text-white px-8 py-3 rounded-2xl font-bold text-sm hover:bg-orange-600 transition-all shadow-xl shadow-stone-200"
        >
          Login
        </motion.button>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-12 md:pt-24 pb-32 flex flex-col items-center text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8 max-w-4xl"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-stone-100 mb-4">
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500">Live & Paying Since 2024</span>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl md:text-8xl font-black text-stone-900 tracking-tight leading-[0.95]">
            স্মার্ট উপায়ে <br />
            <span className="text-gradient">আয় শুরু করুন</span>
          </motion.h1>
          
          <motion.div variants={itemVariants} className="h-20 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p 
                key={msgIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-lg md:text-2xl text-stone-500 font-medium max-w-2xl mx-auto leading-relaxed"
              >
                {dynamicMessages[msgIndex]} <br className="hidden md:block" />
                সহজ টাস্ক কমপ্লিট করুন এবং সরাসরি বিকাশ বা নগদে পেমেন্ট নিন।
              </motion.p>
            </AnimatePresence>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(234, 88, 12, 0.2)" }}
              whileTap={{ scale: 0.95 }}
              onClick={onGetStarted}
              className="w-full sm:w-auto bg-orange-600 text-white px-10 py-5 rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 hover:bg-stone-900 transition-all shadow-2xl shadow-orange-200 group"
            >
              Get Started <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <div className="flex -space-x-3 items-center">
              {[1, 2, 3, 4].map(i => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + i * 0.1 }}
                  key={i} 
                  className="w-10 h-10 rounded-full border-4 border-white bg-stone-200 overflow-hidden shadow-sm"
                >
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="user" />
                </motion.div>
              ))}
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="pl-6 text-sm font-bold text-stone-400"
              >
                +১২০০ মেম্বার যুক্ত হয়েছে
              </motion.span>
            </div>
          </motion.div>
        </motion.div>

        {/* Feature Cards with Stagger */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 w-full"
        >
          <FeaturePreviewCard 
            icon={<Zap className="w-7 h-7" />} 
            title="Instant Tasks" 
            desc="ক্যাপচা, ম্যাথ পাজল এবং এআই ট্রেইনিং এর মত সহজ কাজ করে আয় করুন।" 
            color="bg-blue-50 text-blue-600"
          />
          <FeaturePreviewCard 
            icon={<Wallet className="w-7 h-7" />} 
            title="Daily Payout" 
            desc="আপনার উপার্জিত অর্থ প্রতিদিন বিকাশ বা নগদে উইথড্র করুন।" 
            color="bg-green-50 text-green-600"
          />
          <FeaturePreviewCard 
            icon={<ShieldCheck className="w-7 h-7" />} 
            title="Safe & Secure" 
            desc="১০০% সিকিউর প্ল্যাটফর্ম। আপনার ডাটা আমাদের কাছে নিরাপদ।" 
            color="bg-purple-50 text-purple-600"
          />
        </motion.div>
      </main>
    </div>
  );
}

function FeaturePreviewCard({ icon, title, desc, color }: { icon: any, title: string, desc: string, color: string }) {
  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="glass p-8 rounded-[2.5rem] text-left space-y-4 transition-all duration-500"
    >
      <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-stone-500 text-sm leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function ActivationPanel({ onActivate, onClose, username }: { onActivate: () => void, onClose: () => void, username: string }) {
  const [loading, setLoading] = useState(false);

  const handlePayAndActivate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/activate', { method: 'POST', headers: { 'x-user-id': username } });
      if (res.ok) {
        onActivate();
        onClose();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, y: 100, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 100, scale: 0.9 }}
        className="bg-white w-full max-w-xl rounded-[2.5rem] p-6 md:p-10 shadow-2xl relative z-10 text-center space-y-5 overflow-y-auto max-h-[95vh]"
      >
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-3 hover:bg-stone-100 rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-stone-400" />
        </button>

        <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-[1.25rem] flex items-center justify-center mx-auto shadow-lg">
          <ShieldCheck className="w-8 h-8" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl md:text-4xl font-black text-stone-900 tracking-tight leading-none">অ্যাকাউন্ট অ্যাক্টিভেশন</h1>
          <p className="text-stone-500 font-medium text-sm md:text-base">কাজটি সম্পন্ন করতে আপনার অ্যাকাউন্টটি অ্যাক্টিভেট করতে হবে।</p>
        </div>

        <div className="bg-orange-50 border border-orange-100 p-5 md:p-6 rounded-[1.5rem] space-y-2">
          <p className="text-stone-400 text-[10px] font-black uppercase tracking-widest leading-none">One-time Activation Fee</p>
          <div className="text-3xl md:text-4xl font-black text-orange-600">৳৫০.০০</div>
          <p className="text-stone-600 text-[10px] md:text-xs font-bold leading-relaxed">
            এককালীন ৫০ টাকা দিয়ে অ্যাকাউন্টটি অ্যাক্টিভেট করুন এবং আজীবন ইনকাম করার সুযোগ পান।
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <p className="text-[10px] text-stone-400 font-black uppercase tracking-tight leading-none">Payment Instructions</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 text-left">
              <p className="text-[8px] text-stone-400 font-black uppercase leading-none mb-1.5">Bkash (Personal)</p>
              <p className="text-[10px] md:text-xs font-black text-stone-800 leading-none">01700-000000</p>
            </div>
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 text-left">
              <p className="text-[8px] text-stone-400 font-black uppercase leading-none mb-1.5">Nagad (Personal)</p>
              <p className="text-[10px] md:text-xs font-black text-stone-800 leading-none">01800-000000</p>
            </div>
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 text-left col-span-2 md:col-span-1">
              <p className="text-[8px] text-stone-400 font-black uppercase leading-none mb-1.5">Reference</p>
              <p className="text-[10px] md:text-xs font-black text-stone-800 leading-none truncate">{username}</p>
            </div>
          </div>
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handlePayAndActivate}
          disabled={loading}
          className="w-full bg-stone-900 text-white py-5 rounded-[2rem] font-black text-lg hover:bg-orange-600 shadow-2xl transition-all flex items-center justify-center gap-3"
        >
          {loading ? <Loader2 className="w-7 h-7 animate-spin" /> : (
            <>
              Confirm Payment & Activate <ArrowRight className="w-6 h-6" />
            </>
          )}
        </motion.button>

        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest leading-relaxed text-center opacity-60">
          পেমেন্ট করার পর ৫-১০ মিনিটের মধ্যে আপনার অ্যাকাউন্ট সক্রিয় হয়ে যাবে।
        </p>
      </motion.div>
    </div>
  );
}

function Auth({ onAuthSuccess, onBack }: { onAuthSuccess: (userId: string) => void, onBack: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const endpoint = isLogin ? '/api/login' : '/api/register';
    
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success) {
        if (isLogin) {
          localStorage.setItem(USER_ID_KEY, data.username);
          onAuthSuccess(data.username);
        } else {
          setIsLogin(true);
          setError('Registration successful! Please login.');
        }
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center p-4 relative overflow-y-auto font-sans">
      <BackgroundElements />
      
      <motion.button 
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={onBack}
        className="absolute top-8 left-8 p-3 bg-white rounded-full shadow-sm hover:bg-stone-100 transition-all z-10 border border-stone-100"
      >
        <X className="w-6 h-6 text-stone-400" />
      </motion.button>

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="bg-white/80 backdrop-blur-3xl w-full max-w-md rounded-[3rem] p-10 md:p-14 shadow-2xl shadow-stone-200/50 border border-white relative z-10 max-h-[95vh] overflow-y-auto"
      >
        <div className="flex flex-col items-center mb-12">
          <motion.div 
            whileHover={{ rotate: 15, scale: 1.1 }}
            className="w-20 h-20 bg-orange-600 rounded-3xl flex items-center justify-center text-white mb-6 shadow-2xl shadow-orange-200 animate-float"
          >
            <Zap className="fill-current w-12 h-12" />
          </motion.div>
          <h1 className="text-4xl font-black text-stone-900 tracking-tight text-center">
            {isLogin ? 'Welcome Back' : 'Get Started'}
          </h1>
          <p className="text-stone-400 text-sm mt-3 font-medium">
            {isLogin ? 'Login to your account' : 'Join the elite earning community'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="space-y-2">
            <label className="text-[11px] font-black text-stone-400 uppercase tracking-widest pl-1">Username</label>
            <div className="relative group">
              <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300 group-focus-within:text-orange-500 transition-colors" />
              <input 
                type="text" 
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-stone-50/50 border border-stone-100 p-5 pl-14 rounded-[1.5rem] outline-none focus:border-orange-500 focus:bg-white transition-all font-bold text-stone-800 placeholder:text-stone-300 shadow-sm focus:shadow-orange-100"
                placeholder="Unique Username"
              />
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-2">
            <label className="text-[11px] font-black text-stone-400 uppercase tracking-widest pl-1">Password</label>
            <div className="relative group">
              <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300 group-focus-within:text-orange-500 transition-colors" />
              <input 
                type="password" 
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-stone-50/50 border border-stone-100 p-5 pl-14 rounded-[1.5rem] outline-none focus:border-orange-500 focus:bg-white transition-all font-bold text-stone-800 placeholder:text-stone-300 shadow-sm focus:shadow-orange-100"
                placeholder="••••••••"
              />
            </div>
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`p-4 rounded-2xl text-[11px] font-black text-center uppercase tracking-wider overflow-hidden ${error.includes('successful') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={loading}
            className="w-full bg-stone-900 text-white py-6 rounded-[1.5rem] font-black text-lg hover:bg-orange-600 shadow-2xl shadow-stone-200 transition-all flex items-center justify-center gap-2 group"
          >
            {loading ? <Loader2 className="w-7 h-7 animate-spin" /> : (
              <>
                {isLogin ? 'Sign In Now' : 'Create Account'}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-10 text-center">
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="text-stone-400 text-xs hover:text-orange-600 font-black uppercase tracking-[0.15em] transition-all"
          >
            {isLogin ? "New here? Create account" : "Have an account? Sign In"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userId, setUserId] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [toasts, setToasts] = useState<{id: string, message: string, type: 'success' | 'error' | 'info'}[]>([]);
  const [showAuth, setShowAuth] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [showActivation, setShowActivation] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);


  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // --- Initialization ---
  useEffect(() => {
    const id = localStorage.getItem(USER_ID_KEY);
    if (id) {
      setUserId(id);
      fetchData(id);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchData = async (id: string) => {
    setLoading(true);
    try {
      const [userRes, tasksRes] = await Promise.all([
        fetch('/api/user', { headers: { 'x-user-id': id } }),
        fetch('/api/tasks')
      ]);
      if (userRes.status === 401) {
        handleLogout();
        return;
      }
      const userData = await userRes.json();
      const tasksData = await tasksRes.json();
      setUserData(userData);
      setTasks(tasksData);
    } catch (err) {
      console.error('Error fetching data:', err);
      addToast('Failed to fetch data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(USER_ID_KEY);
    setUserId(null);
    setUserData(null);
    addToast('Logged out successfully', 'info');
  };

  const handleTaskSubmit = async (taskId: string) => {
    if (!userId) return;
    if (!userData?.isActive) {
      setShowActivation(true);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/tasks/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': userId },
        body: JSON.stringify({ taskId })
      });
      const data = await res.json();
      if (data.success) {
        const task = tasks.find(t => t.id === taskId);
        setUserData(prev => {
          if (!prev) return null;
          return { 
            ...prev, 
            balance: data.newBalance,
            completedTasks: [
              { taskId, timestamp: new Date().toISOString(), reward: task?.reward || 0 },
              ...prev.completedTasks 
            ]
          };
        });
        addToast(`Reward claimed: +৳${task?.reward || 0}`, 'success');
      }
    } catch (err) {
      console.error('Task submission failed:', err);
      addToast('Submission failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClaimBonus = async () => {
    if (!userId) return;
    if (!userData?.isActive) {
      setShowActivation(true);
      return;
    }
    try {
      const res = await fetch('/api/user/daily-bonus', {
        method: 'POST',
        headers: { 'x-user-id': userId }
      });
      const data = await res.json();
      if (data.success) {
        setUserData(prev => prev ? { 
          ...prev, 
          balance: data.newBalance, 
          lastBonusDate: new Date().toDateString(),
          completedTasks: [
            { taskId: 'daily_bonus', timestamp: new Date().toISOString(), reward: data.bonusAmount },
            ...prev.completedTasks 
          ]
        } : null);
        addToast(`Daily bonus claimed: +৳${data.bonusAmount}`, 'success');
      } else {
        addToast(data.error, 'error');
      }
    } catch (err) {
      console.error('Bonus claim failed:', err);
      addToast('Bonus claim failed', 'error');
    }
  };

  const handleWithdraw = async (amount: number, method: string, number: string) => {
    if (!userId) return;
    if (!userData?.isActive) {
      setShowActivation(true);
      return;
    }
    try {
      const res = await fetch('/api/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': userId },
        body: JSON.stringify({ amount, method, number })
      });
      const data = await res.json();
      if (data.success) {
        setUserData(prev => prev ? { 
          ...prev, 
          balance: prev.balance - amount,
          withdrawals: [data.withdrawal, ...prev.withdrawals]
        } : null);
        addToast('Withdrawal request submitted', 'success');
        return true;
      } else {
        addToast(data.error, 'error');
        return false;
      }
    } catch (err) {
      console.error('Withdrawal failed:', err);
      addToast('Withdrawal failed', 'error');
      return false;
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, isNew: true },
    { id: 'leaderboard', label: 'Top Earners', icon: Trophy, isNew: true },
    { id: 'withdraw', label: 'Withdraw', icon: Wallet },
    { id: 'history', label: 'History', icon: History },
    { id: 'admin', label: 'Admin', icon: BarChart3 },
  ];

  if (loading && !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
      </div>
    );
  }

  if (!userId) {
    if (showAuth) {
      return <Auth onAuthSuccess={(id) => { setUserId(id); fetchData(id); }} onBack={() => setShowAuth(false)} />;
    }
    return <Landing onGetStarted={() => setShowAuth(true)} />;
  }


  const todayEarnings = userData?.completedTasks.reduce((acc, curr) => {
    const taskDate = new Date(curr.timestamp).toDateString();
    const today = new Date().toDateString();
    return taskDate === today ? acc + curr.reward : acc;
  }, 0) || 0;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col md:flex-row font-sans selection:bg-orange-100 overflow-hidden">
      {/* --- Sidebar (Desktop) --- */}
      <aside 
        className={`hidden md:flex ${sidebarOpen ? 'w-64' : 'w-20'} glass border-r border-white/40 transition-all duration-300 ease-in-out flex-col z-50 overflow-y-auto overflow-x-hidden m-4 rounded-[2rem] shadow-2xl shadow-stone-200/50`}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white shrink-0">
            <Zap className="fill-current w-6 h-6" />
          </div>
          {sidebarOpen && (
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-stone-800">EarnBD <span className="text-orange-600 text-xs align-top">AI</span></span>
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest leading-none">আনিংস প্লাটফর্ম</span>
            </div>
          )}
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all ${
                activeTab === item.id 
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-200' 
                  : 'text-stone-500 hover:bg-stone-100 hover:text-stone-900'
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-stone-100 space-y-2">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center gap-4 px-3 py-3 rounded-xl text-stone-400 hover:bg-stone-50 transition-all font-medium text-sm"
          >
            {sidebarOpen ? <X className="w-5 h-5 flex-shrink-0" /> : <Menu className="w-5 h-5 mx-auto" />}
            {sidebarOpen && <span>Collapse Sidebar</span>}
          </button>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-3 py-3 rounded-xl text-red-400 hover:bg-red-50 transition-all font-medium text-sm"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative bg-pattern">
        {/* --- Background Glows --- */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-200/20 blur-[120px] rounded-full pointer-events-none" />

        {/* --- Top Nav --- */}
        <header className="h-12 md:h-16 glass border-b border-white/40 flex items-center justify-between px-3 md:px-6 shrink-0 z-40 m-4 rounded-2xl md:rounded-3xl shadow-xl shadow-stone-200/30">
          <div className="flex items-center gap-3 md:gap-4">
            {activeTab !== 'dashboard' && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab('dashboard')}
                className="flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-xl md:rounded-2xl bg-indigo-600 text-white hover:bg-stone-900 transition-all font-black text-[10px] md:text-xs shadow-lg shadow-indigo-100"
              >
                <ArrowLeft className="w-3.5 h-3.5 md:w-4 h-4" /> Back
              </motion.button>
            )}

            <div className="md:hidden w-7 h-7 bg-orange-600 rounded-lg flex items-center justify-center text-white shrink-0">
              <Zap className="fill-current w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-0 md:gap-4 text-stone-500 text-[9px] md:text-sm font-medium">
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3 md:w-4 h-4 text-green-500" />
                <span className="hidden sm:inline">Today's Earnings:</span>
              </div>
              <span className="text-stone-900 font-bold">৳{todayEarnings.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 md:gap-6">
            <div className="relative">
              <Bell className="w-4 h-4 md:w-5 h-5 text-stone-400 cursor-pointer" />
              <div className="absolute -top-1 -right-1 w-1.5 h-1.5 md:w-2 h-2 bg-orange-600 rounded-full" />
            </div>
            <div className="flex items-center gap-2 md:gap-3 pl-3 md:pl-6 border-l border-stone-200">
              <div className="text-right hidden xs:block">
                <p className="text-[10px] text-stone-400 font-medium">Account</p>
                <p className="text-xs md:text-sm font-bold text-stone-900">{userId?.toUpperCase()}</p>
              </div>
              <div 
                className="w-8 h-8 md:w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center border border-stone-200 cursor-pointer relative"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <UserIcon className="w-4 h-4 md:w-5 h-5 text-stone-400" />
                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full right-0 mt-2 w-32 bg-white rounded-xl shadow-xl border border-stone-100 p-2 z-50"
                    >
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLogout();
                          setShowProfileMenu(false);
                        }} 
                        className="w-full flex items-center gap-2 p-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </div>
        </header>

        {/* --- Content Area --- */}
        <div className="flex-1 overflow-y-auto p-3 md:p-6 pb-20 md:pb-8">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div key="dashboard" className="w-full" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <Dashboard userData={userData} setActiveTab={setActiveTab} onClaimBonus={handleClaimBonus} onShowActivation={() => setShowActivation(true)} />
              </motion.div>
            )}
            {activeTab === 'tasks' && (
              <motion.div key="tasks" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <Tasks tasks={tasks} onComplete={(t) => {
                  if (!userData?.isActive) {
                    setShowActivation(true);
                  } else {
                    setActiveTask(t);
                  }
                }} />
              </motion.div>
            )}
            {activeTab === 'leaderboard' && (
              <motion.div key="leaderboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <Leaderboard />
              </motion.div>
            )}
            {activeTab === 'withdraw' && (
              <motion.div key="withdraw" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <Withdraw balance={userData?.balance || 0} onWithdraw={handleWithdraw} />
              </motion.div>
            )}
            {activeTab === 'history' && (
              <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <HistoryPanel withdrawals={userData?.withdrawals || []} history={userData?.completedTasks || []} tasks={tasks} />
              </motion.div>
            )}
            {activeTab === 'admin' && (
              <motion.div key="admin" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <AdminPanel />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* --- Bottom Navigation (Mobile) --- */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-stone-200 flex items-center justify-around px-1 z-50">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center gap-1 min-w-[60px] relative transition-all ${
                activeTab === item.id 
                  ? 'text-orange-600 scale-105' 
                  : 'text-stone-400'
              }`}
            >
              {item.isNew && <span className="absolute top-0 right-4 w-2 h-2 bg-orange-600 rounded-full border-2 border-white" />}
              <item.icon className="w-5 h-5" />
              <span className="text-[9px] font-black uppercase tracking-tighter">{item.label === 'Top Earners' ? 'Earners' : item.label === 'Owner Insights' ? 'Admin' : item.label}</span>
            </button>
          ))}
        </nav>
      </main>

      <AnimatePresence>
        {showActivation && userId && (
          <ActivationPanel 
            username={userId} 
            onActivate={() => fetchData(userId)} 
            onClose={() => setShowActivation(false)} 
          />
        )}
        {activeTask && (
          <TaskSolver 
            task={activeTask} 
            onClose={() => setActiveTask(null)} 
            onSuccess={(id) => {
              handleTaskSubmit(id);
              setActiveTask(null);
            }} 
          />
        )}
      </AnimatePresence>

      <div className="fixed top-0 left-0 w-full z-[100] pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <Toast 
              key={toast.id} 
              message={toast.message} 
              type={toast.type as 'success' | 'error' | 'info'} 
              onClose={() => removeToast(toast.id)} 
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// --- Components ---

function Dashboard({ userData, setActiveTab, onClaimBonus, onShowActivation }: { userData: UserData | null, setActiveTab: (t: string) => void, onClaimBonus: () => void, onShowActivation: () => void }) {
  const isBonusClaimed = userData?.lastBonusDate === new Date().toDateString();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-4 md:space-y-5 max-w-6xl mx-auto"
    >
      <motion.div variants={item} className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="space-y-0.5">
          <h1 className="text-xl md:text-3xl font-black tracking-tight text-stone-900">শুভেচ্ছা! <span className="text-gradient">Welcome.</span></h1>
          <p className="text-stone-500 text-[10px] md:text-sm font-medium">আপনি আজ <span className="text-orange-600 font-bold">{userData?.completedTasks.filter(t => new Date(t.timestamp).toDateString() === new Date().toDateString()).length}টি কাজ</span> সম্পন্ন করেছেন।</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white px-4 py-3 rounded-2xl shadow-sm border border-stone-100 flex items-center gap-4"
          >
            <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center font-bold">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-stone-400">Daily Bonus</p>
              <button 
                onClick={onClaimBonus}
                disabled={isBonusClaimed}
                className={`text-xs font-black uppercase tracking-tight ${isBonusClaimed ? 'text-stone-300' : 'text-orange-600 hover:text-orange-700'}`}
              >
                {isBonusClaimed ? 'Claimed Today' : 'Claim ৳5.00 Now'}
              </button>
            </div>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -5, scale: 1.02 }}
            className="glass px-4 py-2 md:px-5 md:py-3 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-between md:justify-start gap-4 md:gap-5 relative overflow-hidden group"
          >
             <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="flex items-center gap-3 md:gap-4 relative z-10">
               <div className="w-8 h-8 md:w-10 md:h-10 bg-green-500 text-white rounded-xl flex items-center justify-center font-black text-base md:text-lg shadow-lg shadow-green-100">৳</div>
               <div>
                 <p className="text-[9px] md:text-xs font-bold uppercase tracking-wider text-stone-400">Total Balance</p>
                 <p className="text-xl md:text-2xl font-black text-stone-900 tracking-tighter tabular-nums">
                   <CountUp value={userData?.balance || 0} prefix="৳" />
                 </p>
               </div>
             </div>
             <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('withdraw')}
              className="bg-stone-900 text-white px-4 py-2 md:px-6 md:py-2 rounded-lg md:rounded-xl text-xs md:text-sm font-bold shadow-lg shadow-stone-200 hover:bg-orange-600 transition-all"
             >
              Withdraw
             </motion.button>
          </motion.div>
        </div>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
        <StatsCard icon={Zap} label="Tasks Ready" value="12" color="bg-indigo-500 text-white shadow-lg shadow-indigo-200" />
        <StatsCard icon={CheckSquare} label="Completed Today" value={userData?.completedTasks.length.toString() || "0"} color="bg-purple-500 text-white shadow-lg shadow-purple-200" />
        <StatsCard icon={ShieldCheck} label="Trust Score" value="98%" color="bg-pink-500 text-white shadow-lg shadow-pink-200" />
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Featured Task */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="premium-gradient rounded-[2.5rem] p-6 md:p-8 text-white relative overflow-hidden group shadow-2xl shadow-indigo-100"
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 blur-3xl rounded-full animate-pulse-soft" />
          <div className="absolute top-0 right-0 p-4 md:p-6">
            <Zap className="w-16 h-16 md:w-24 md:h-24 text-white/20 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
          </div>
          <div className="relative z-10 space-y-4 md:space-y-6 max-w-sm">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white border border-white/30 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest">
              ✨ Special Opportunity
            </div>
            <h2 className="text-xl md:text-3xl font-black leading-tight tracking-tight">AI ভিশন মডেলকে প্রশিক্ষণ দিন</h2>
            <p className="text-white/80 text-[10px] md:text-xs leading-relaxed font-medium">
              সহজ দৃশ্য বর্ণনা করুন এবং উচ্চতর পুরষ্কার অর্জন করুন। প্রতিটি যাচাইকরণে ৩০ সেকেন্ডের কম সময় লাগে।
            </p>
            <motion.button 
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (!userData?.isActive) {
                  onShowActivation();
                } else {
                  setActiveTab('tasks');
                }
              }}
              className="bg-white text-indigo-600 px-6 py-2.5 md:px-8 md:py-3.5 rounded-xl md:rounded-2xl font-black text-xs md:text-sm flex items-center gap-2 hover:bg-stone-900 hover:text-white transition-all shadow-2xl"
            >
              Start Earning <ArrowRight className="w-4 h-4 md:w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-2 gap-4 md:gap-6">
          <BenefitBox icon={Smartphone} title="মোবাইল ফ্রেন্ডলি" desc="যেকোনো ডিভাইস থেকে আয় করুন।" />
          <BenefitBox icon={ShieldCheck} title="১০০% নির্ভরযোগ্য" desc="প্রতিদিন পেমেন্টের গ্যারান্টি।" />
          <BenefitBox icon={Banknote} title="লোকাল পেমেন্ট" desc="বিকাশ ও নগদ সাপোর্ট।" />
          <BenefitBox icon={HelpCircle} title="হেল্প সেন্টার" desc="২৪/৭ কাস্টমার সাপোর্ট।" />
        </div>
      </motion.div>
    </motion.div>
  );
}

function StatsCard({ icon: Icon, label, value, color }: { icon: any, label: string, value: string, color: string }) {
  return (
    <div className="glass p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-white/40 shadow-xl shadow-stone-200/50 flex items-center gap-3 md:gap-5 group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className={`p-3 md:p-4 rounded-xl md:rounded-2xl ${color} relative z-10 transition-transform group-hover:scale-110`}>
        <Icon className="w-5 h-5 md:w-6 md:h-6" />
      </div>
      <div className="relative z-10">
        <p className="text-[10px] md:text-xs font-bold text-stone-400 uppercase tracking-widest leading-none mb-1 md:mb-2">{label}</p>
        <p className="text-xl md:text-2xl font-black text-stone-900 tabular-nums tracking-tighter">{value}</p>
      </div>
    </div>
  );
}

function BenefitBox({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl border border-stone-200 shadow-sm space-y-2 md:space-y-4">
      <Icon className="w-6 h-6 md:w-8 md:h-8 text-orange-600" />
      <div>
        <h4 className="font-bold text-stone-900 text-xs md:text-base">{title}</h4>
        <p className="text-[10px] md:text-xs text-stone-400 mt-1 leading-relaxed line-clamp-2">{desc}</p>
      </div>
    </div>
  );
}

function Tasks({ tasks, onComplete }: { tasks: Task[], onComplete: (t: Task) => void }) {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-5xl mx-auto pb-10"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
            <Zap className="w-3 h-3" /> Exclusive Marketplace
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-stone-900 tracking-tight">Available Tasks</h1>
          <p className="text-stone-500 text-xs md:text-base font-medium">প্রতিটি সঠিক কাজের জন্য নিশ্চিত পেমেন্ট এবং বোনাস পান।</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-stone-100 shadow-sm">
          <button className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold">All Tasks</button>
          <button className="px-4 py-2 text-stone-500 hover:bg-stone-50 rounded-xl text-xs font-bold transition-all">High Paying</button>
          <button className="px-4 py-2 text-stone-500 hover:bg-stone-50 rounded-xl text-xs font-bold transition-all">Newest</button>
        </div>
      </div>

      <div className="grid gap-4">
        {tasks.map((task, index) => (
          <motion.div 
            key={task.id} 
            variants={item}
            whileHover={{ y: -4, shadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)" }}
            className="group relative glass rounded-[2.5rem] p-5 md:p-6 border border-white/40 transition-all flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden"
          >
            {/* Color Accent Line */}
            <div className={`absolute left-0 top-0 bottom-0 w-2 ${index % 3 === 0 ? 'bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]' : index % 3 === 1 ? 'bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.5)]'}`} />
            
            {/* Hover Background Glow */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none ${index % 3 === 0 ? 'bg-indigo-500' : index % 3 === 1 ? 'bg-purple-500' : 'bg-pink-500'}`} />
            
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 relative z-10 w-full md:w-auto">
              <div className={`w-14 h-14 md:w-16 md:h-16 glass rounded-[1.5rem] flex items-center justify-center text-2xl md:text-3xl shadow-inner group-hover:scale-110 transition-all duration-500 border-white/60`}>
                {task.type === 'image' && '🖼️'}
                {task.type === 'text' && '📝'}
                {task.type === 'math' && '🧮'}
                {task.type === 'logic' && '🧩'}
                {task.type === 'sentiment' && '😊'}
                {task.type === 'translate' && '🌐'}
                {task.type === 'emoji' && '🎭'}
                {task.type === 'color' && '🎨'}
                {task.type === 'geography' && '🌍'}
                {task.type === 'riddle' && '💡'}
                {task.type === 'spelling' && '🐝'}
                {task.type === 'science' && '🧪'}
                {task.type === 'word' && '🔡'}
                {task.type === 'scramble' && '🔀'}
                {task.type === 'vowel' && '🔤'}
                {task.type === 'heritage' && '🏛️'}
                {task.type === 'chrono' && '📅'}
                {task.type === 'binary' && '🔢'}
              </div>
              <div className="text-center md:text-left space-y-1">
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 mb-1">
                  <span className="bg-stone-100 text-stone-500 text-[9px] font-black uppercase px-2 py-0.5 rounded-md tracking-tighter">AI Training</span>
                  <span className="bg-green-50 text-green-600 text-[9px] font-black uppercase px-2 py-0.5 rounded-md tracking-tighter">Instant Credit</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-stone-900 leading-tight group-hover:text-orange-600 transition-colors">{task.title}</h3>
                <p className="text-xs md:text-sm text-stone-400 font-medium line-clamp-1">{task.description}</p>
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-6 md:gap-10 w-full md:w-auto relative z-10 border-t md:border-t-0 pt-4 md:pt-0 border-stone-100">
              <div className="text-left md:text-right">
                <div className="flex items-center gap-1.5 text-stone-400 mb-1">
                  <Star className="w-3 h-3 fill-orange-400 text-orange-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Reward Value</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl md:text-3xl font-black text-stone-900 tracking-tighter group-hover:scale-110 transition-transform origin-right inline-block">৳{task.reward}</span>
                  <span className="text-[10px] font-bold text-stone-400">/task</span>
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onComplete(task)}
                className={`text-white px-8 py-3.5 rounded-2xl font-black text-sm md:text-base shadow-xl transition-all flex items-center gap-2 group/btn ${index % 3 === 0 ? 'bg-indigo-600 hover:bg-stone-900 shadow-indigo-100' : index % 3 === 1 ? 'bg-purple-600 hover:bg-stone-900 shadow-purple-100' : 'bg-pink-600 hover:bg-stone-900 shadow-pink-100'}`}
              >
                Do Task <ArrowRight className="w-4 h-4 md:w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function TaskSolver({ task, onClose, onSuccess }: { task: Task, onClose: () => void, onSuccess: (id: string) => void }) {
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [questionData, setQuestionData] = useState<any>(null);

  useEffect(() => {
    // Generate simple questions based on task type or ID
    if (task.id === '3' || task.id === '8') { // Pattern/Sequence questions
      const start = Math.floor(Math.random() * 10) + 1;
      const step = Math.floor(Math.random() * 5) + 2;
      const sequence = [start, start + step, start + step * 2, start + step * 3];
      setQuestionData({ q: `${sequence[0]}, ${sequence[1]}, ${sequence[2]}, ?`, a: (sequence[2] + step).toString() });
    } else if (task.id === '9') { // Division Master
      const b = Math.floor(Math.random() * 10) + 1;
      const ans = Math.floor(Math.random() * 10) + 1;
      const a = b * ans;
      setQuestionData({ q: `${a} ÷ ${b} = ?`, a: ans.toString() });
    } else if (task.type === 'math') {
      const a = Math.floor(Math.random() * 20) + 1;
      const b = Math.floor(Math.random() * 10) + 1;
      const ops = ['+', '-', '*'];
      const op = ops[Math.floor(Math.random() * ops.length)];
      let ans = 0;
      if (op === '+') ans = a + b;
      if (op === '-') ans = a - b;
      if (op === '*') ans = a * b;
      setQuestionData({ q: `${a} ${op} ${b} = ?`, a: ans.toString() });
    } else if (task.type === 'translate') {
      const questions = [
        { q: "Translate 'I love my country' to Bangla", a: "আমি আমার দেশকে ভালোবাসি" },
        { q: "Translate 'How are you?' to Bangla", a: "আপনি কেমন আছেন?" },
        { q: "Translate 'Success takes time' to Bangla", a: "সাফল্য সময় নেয়" }
      ];
      setQuestionData(questions[Math.floor(Math.random() * questions.length)]);
    } else if (task.type === 'emoji') {
      const questions = [
        { q: "🦁👑 (Movie Name?)", a: "Lion King" },
        { q: "🦇🕶️ (Superhero?)", a: "Batman" },
        { q: "🧊🚢 (Famous Movie?)", a: "Titanic" },
        { q: "蜘蛛🕸️ (Superhero?)", a: "Spider-Man" }
      ];
      setQuestionData(questions[Math.floor(Math.random() * questions.length)]);
    } else if (task.type === 'color') {
      const colors = [
        { q: "What color do you get by mixing Red and Blue?", a: "Purple" },
        { q: "What color is the sky on a clear day?", a: "Blue" },
        { q: "What color is #FF0000?", a: "Red" }
      ];
      setQuestionData(colors[Math.floor(Math.random() * colors.length)]);
    } else if (task.type === 'geography') {
      const questions = [
        { q: "What is the capital of Bangladesh?", a: "Dhaka" },
        { q: "What is the capital of France?", a: "Paris" },
        { q: "What is the capital of Japan?", a: "Tokyo" }
      ];
      setQuestionData(questions[Math.floor(Math.random() * questions.length)]);
    } else if (task.type === 'riddle') {
      const questions = [
        { q: "What has legs but cannot walk?", a: "Table" },
        { q: "What has an eye but cannot see?", a: "Needle" },
        { q: "What comes down but never goes up?", a: "Rain" }
      ];
      setQuestionData(questions[Math.floor(Math.random() * questions.length)]);
    } else if (task.type === 'spelling') {
      const questions = [
        { q: "Find the correct spelling: (Acommodate, Accommodate, Acomodate)", a: "Accommodate" },
        { q: "Find the correct spelling: (Success, Sucess, Succes)", a: "Success" }
      ];
      setQuestionData(questions[Math.floor(Math.random() * questions.length)]);
    } else if (task.type === 'science') {
      const questions = [
        { q: "What is H2O?", a: "Water" },
        { q: "Which planet is known as the Red Planet?", a: "Mars" },
        { q: "What do bees collect from flowers?", a: "Nectar" }
      ];
      setQuestionData(questions[Math.floor(Math.random() * questions.length)]);
    } else if (task.type === 'word') {
      const words = ["EARN", "TASK", "SMART", "COIN"];
      const word = words[Math.floor(Math.random() * words.length)];
      setQuestionData({ q: `Reverse the word: '${word}'`, a: word.split('').reverse().join('') });
    } else if (task.type === 'scramble') {
      const sentences = [
        { q: "love country I my", a: "I love my country" },
        { q: "best Policy is Honesty", a: "Honesty is the best policy" },
        { q: "AI future the is", a: "AI is the future" }
      ];
      setQuestionData(sentences[Math.floor(Math.random() * sentences.length)]);
    } else if (task.type === 'vowel') {
      const words = ["APPLE", "EDUCATION", "SMART", "BANANA"];
      const word = words[Math.floor(Math.random() * words.length)];
      const vowels = word.match(/[AEIOU]/gi)?.length || 0;
      setQuestionData({ q: `How many vowels in '${word}'?`, a: vowels.toString() });
    } else if (task.type === 'heritage') {
      const questions = [
        { q: "What is the national flower of Bangladesh?", a: "Water Lily" },
        { q: "Which river is the longest in Bangladesh?", a: "Meghna" },
        { q: "What is the capital of Bengal during Mughal rule?", a: "Dhaka" }
      ];
      setQuestionData(questions[Math.floor(Math.random() * questions.length)]);
    } else if (task.type === 'chrono') {
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const today = new Date().getDay();
      setQuestionData({ q: `If today is ${days[today]}, what was yesterday?`, a: days[(today + 6) % 7] });
    } else if (task.type === 'binary') {
      const bins = [
        { q: "Convert binary '101' to Decimal", a: "5" },
        { q: "Convert binary '110' to Decimal", a: "6" },
        { q: "Convert binary '111' to Decimal", a: "7" }
      ];
      setQuestionData(bins[Math.floor(Math.random() * bins.length)]);
    } else if (task.type === 'logic') {
      const questions = [
        { q: "If 1=5, 2=10, 3=15, 4=20, then 5=?", a: "25" },
        { q: "Which word is the odd one out? (Apple, Banana, Carrot, Grapes)", a: "Carrot" },
        { q: "Cow is to Milk as Hen is to ___?", a: "Egg" },
        { q: "I have keys but no locks. I have a space but no room. What am I?", a: "Keyboard" }
      ];
      setQuestionData(questions[Math.floor(Math.random() * questions.length)]);
    } else {
      setQuestionData({ q: task.description, a: 'OK' });
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer) return setError('Please provide an answer');
    
    if (questionData && answer.toLowerCase().trim() !== questionData.a.toLowerCase().trim() && task.type !== 'image' && task.type !== 'text') {
      return setError('Wrong answer, try again!');
    }

    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1000)); // Simulate validation
    onSuccess(task.id);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 50 }}
        className="bg-white w-full max-w-md rounded-[2.5rem] p-6 md:p-8 shadow-2xl relative overflow-y-auto max-h-[95vh] space-y-6"
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-stone-400 hover:text-stone-900 transition-all z-[110]">
          <X className="w-6 h-6" />
        </button>

        <div className="space-y-4 md:space-y-6">
          <div className="space-y-1">
            <div className="text-orange-600 font-black text-[9px] uppercase tracking-[0.2em]">Active Task</div>
            <h2 className="text-xl md:text-2xl font-black text-stone-900 tracking-tight leading-none pr-8">{task.title}</h2>
          </div>

          <div className="bg-stone-50/50 p-4 md:p-6 rounded-[1.5rem] border border-stone-100 text-center space-y-2 shadow-inner">
            <p className="text-stone-400 text-[10px] md:text-xs font-medium">{task.description}</p>
            {questionData && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-xl md:text-3xl font-black text-stone-900 tracking-tighter py-1"
              >
                {questionData.q}
              </motion.div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest pl-2">Your Answer</label>
              <input 
                autoFocus
                type="text" 
                value={answer}
                onChange={e => { setAnswer(e.target.value); setError(''); }}
                placeholder={task.type === 'math' ? "বক্সে উত্তর লিখুন..." : "আপনার উত্তর টাইপ করুন..."}
                className="w-full bg-stone-50/50 border border-stone-100 p-5 rounded-[1.5rem] outline-none focus:border-orange-500 focus:bg-white transition-all font-bold text-lg shadow-sm"
              />
              <AnimatePresence>
                {error && (
                  <motion.p 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="text-red-500 text-xs font-black pl-2 uppercase tracking-wide"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              disabled={submitting}
              className="w-full bg-stone-900 text-white py-6 rounded-[1.5rem] font-black text-xl hover:bg-orange-600 shadow-2xl shadow-stone-200 transition-all flex items-center justify-center gap-2"
            >
              {submitting ? <Loader2 className="w-7 h-7 animate-spin" /> : 'Submit Answer'}
            </motion.button>
          </form>

          <p className="text-center text-[10px] text-stone-400 font-bold uppercase tracking-widest">সঠিক উত্তর দিলেই আপনার ব্যালেন্স এ ৳{task.reward} এড হবে।</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Leaderboard() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/leaderboard').then(r => r.json()).then(d => {
      setData(d);
      setLoading(false);
    });
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 md:space-y-8 max-w-4xl mx-auto"
    >
      <motion.div variants={item} className="text-center space-y-2">
        <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-[1.5rem] flex items-center justify-center mx-auto mb-4 animate-float shadow-xl shadow-orange-100">
          <Trophy className="w-8 h-8" />
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-stone-900 tracking-tight">Hall of <span className="text-gradient">Fame</span></h1>
        <p className="text-stone-500 text-sm md:text-base font-medium">আমাদের সেরা আয়কারীদের তালিকা - আপনিও এখানে পৌঁছাতে পারেন!</p>
      </motion.div>

      <motion.div variants={item} className="bg-white rounded-[2.5rem] md:rounded-[3rem] border border-stone-200 overflow-hidden shadow-2xl shadow-stone-200/50">
        <div className="grid grid-cols-12 gap-4 px-6 md:px-10 py-6 border-b border-stone-100 text-[10px] font-black text-stone-400 uppercase tracking-widest bg-stone-50/50">
          <div className="col-span-2">Rank</div>
          <div className="col-span-6">User</div>
          <div className="col-span-4 text-right">Balance</div>
        </div>
        
        <div className="divide-y divide-stone-50">
          {loading ? (
             Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="px-6 md:px-10 py-8 flex items-center justify-between animate-pulse">
                   <div className="w-10 h-10 bg-stone-100 rounded-full" />
                   <div className="flex-1 ml-6 space-y-2">
                     <div className="w-32 h-4 bg-stone-100 rounded-full" />
                     <div className="w-16 h-3 bg-stone-50 rounded-full" />
                   </div>
                   <div className="w-20 h-6 bg-stone-100 rounded-full" />
                </div>
             ))
          ) : data.map((user, i) => (
            <motion.div 
              key={i} 
              whileHover={{ backgroundColor: "rgba(250, 250, 249, 0.8)", x: 10 }}
              className={`grid grid-cols-12 gap-4 px-6 md:px-10 py-6 items-center transition-all ${i === 0 ? 'bg-orange-50/20' : ''}`}
            >
              <div className="col-span-2 font-black text-lg md:text-2xl italic text-stone-300">
                {i + 1 === 1 ? '🥇' : i + 1 === 2 ? '🥈' : i + 1 === 3 ? '🥉' : `#${i + 1}`}
              </div>
              <div className="col-span-6 flex items-center gap-3 md:gap-5">
                <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400 shrink-0 font-black text-sm shadow-inner">
                  {user.userId[0].toUpperCase()}
                </div>
                <div>
                  <h4 className="font-black text-stone-900 text-sm md:text-lg leading-tight">{user.userId}</h4>
                  <p className="text-[10px] text-stone-400 uppercase font-black tracking-[0.1em]">{user.tasksDone} Tasks Done</p>
                </div>
              </div>
              <div className="col-span-4 text-right">
                <p className="text-xl md:text-2xl font-black text-stone-900 tabular-nums">
                  <CountUp value={user.balance} prefix="৳" />
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={item} className="bg-stone-900 rounded-[2.5rem] p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl">
        <Star className="absolute -left-6 -bottom-6 w-32 h-32 text-white/5 animate-pulse-soft" />
        <div className="relative z-10 text-center md:text-left space-y-2">
          <h3 className="text-2xl md:text-3xl font-black italic tracking-tight">তালিকার শীর্ষে যেতে চান?</h3>
          <p className="text-stone-400 text-sm md:text-base font-medium">প্রতিদিন বেশি বেশি টাস্ক সম্পন্ন করুন এবং এগিয়ে থাকুন।</p>
        </div>
        <div className="relative z-10 shrink-0">
           <motion.button 
             whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(234, 88, 12, 0.3)" }}
             whileTap={{ scale: 0.95 }}
             className="bg-orange-600 text-white px-10 py-4 rounded-2xl font-black text-sm md:text-base uppercase tracking-tighter transition-all"
           >
             Start Working Now
           </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Withdraw({ balance, onWithdraw }: { balance: number, onWithdraw: (a: number, m: string, n: string) => Promise<boolean> }) {
  const [amount, setAmount] = useState('20');
  const [method, setMethod] = useState('Bkash');
  const [number, setNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (balance < parseInt(amount)) return;
    if (!number || number.length < 11) return;
    
    setLoading(true);
    const ok = await onWithdraw(parseInt(amount), method, number);
    if (ok) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
    setLoading(false);
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-2xl mx-auto space-y-6 md:space-y-10"
    >
      <motion.div variants={item} className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-2">
          <Wallet className="w-3.5 h-3.5" /> Fast Payouts
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-stone-900 tracking-tight leading-none">Cash <span className="text-gradient">Out</span></h1>
        <p className="text-stone-500 text-xs md:text-base font-medium">আপনার উপার্জিত অর্থ নিরাপদে মোবাইল ওয়ালেটে স্থানান্তর করুন।</p>
      </motion.div>

      <motion.div variants={item} className="glass p-6 md:p-12 rounded-[3rem] md:rounded-[4rem] border border-white/40 shadow-2xl shadow-indigo-100 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
          <Banknote className="w-40 h-40 -rotate-12" />
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          <div className="grid grid-cols-2 gap-3 md:gap-5 bg-stone-100/50 p-2 rounded-[2rem]">
            {['Bkash', 'Nagad'].map(m => (
              <motion.button
                key={m}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setMethod(m)}
                className={`flex items-center justify-center gap-3 py-4 md:py-5 rounded-[1.5rem] text-sm md:text-lg font-black transition-all ${
                  method === m ? 'bg-white shadow-xl text-stone-900' : 'text-stone-400 hover:text-stone-600'
                }`}
              >
                {m === 'Bkash' ? <div className="w-7 h-7 rounded-full bg-[#E2136E] flex items-center justify-center text-[12px] text-white font-bold">b</div> : <div className="w-7 h-7 rounded-full bg-[#F6921E] flex items-center justify-center text-[12px] text-white font-bold">n</div>}
                {m}
              </motion.button>
            ))}
          </div>

          <div className="space-y-3">
            <label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-stone-400 pl-4">Wallet Number</label>
            <div className="relative group">
              <input 
                type="tel" 
                placeholder="01XXXXXXXXX" 
                value={number}
                onChange={e => setNumber(e.target.value)}
                className="w-full bg-white/50 border border-white/60 p-5 rounded-[1.8rem] outline-none focus:border-indigo-500 focus:bg-white transition-all font-mono tracking-[0.2em] text-lg md:text-xl shadow-inner placeholder:text-stone-300"
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-400 group-focus-within:text-indigo-600 transition-colors">
                <Smartphone className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-stone-400 pl-4">Amount (BDT)</label>
            <div className="relative group">
              <input 
                type="number" 
                min="20"
                max={balance}
                step="1"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full bg-white/50 border border-white/60 p-5 rounded-[1.8rem] outline-none focus:border-indigo-500 focus:bg-white transition-all font-black text-2xl md:text-3xl shadow-inner tracking-tighter"
              />
              <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-stone-400 text-lg">BDT</span>
            </div>
            <div className="flex justify-between items-center px-4">
              <p className="text-[10px] md:text-xs text-stone-400 font-bold">Available: <span className="text-indigo-600">৳{balance.toFixed(2)}</span></p>
              <p className="text-[10px] md:text-xs text-stone-400 font-bold italic">Min: 20 BDT</p>
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02, shadow: "0 20px 40px rgba(99, 102, 241, 0.3)" }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={loading || balance < parseInt(amount) || number.length < 11}
            className="w-full premium-gradient text-white py-6 md:py-7 rounded-[2rem] font-black text-lg md:text-2xl shadow-2xl disabled:opacity-30 disabled:hover:scale-100 transition-all flex items-center justify-center gap-4 group/btn"
          >
            {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : success ? <><CheckCircle2 className="w-8 h-8" /> Transfer Success!</> : <><Banknote className="w-7 h-7 md:w-8 md:h-8 group-hover/btn:rotate-12 transition-transform" /> Request Payout Now</>}
          </motion.button>
        </form>
      </motion.div>

      <motion.div variants={item} className="glass border-white/40 p-6 md:p-8 rounded-[2.5rem] flex items-center gap-5 md:gap-7 relative overflow-hidden group shadow-xl">
        <div className="absolute inset-0 bg-indigo-50/50 group-hover:bg-indigo-100/50 transition-colors" />
        <div className="w-14 h-14 md:w-16 md:h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-100 relative z-10">
          <ShieldCheck className="w-8 h-8 md:w-10 md:h-10" />
        </div>
        <div className="relative z-10">
          <h4 className="font-black text-stone-900 text-sm md:text-lg mb-1">Instant Verification</h4>
          <p className="text-[11px] md:text-sm text-stone-500 font-medium leading-relaxed max-w-md">আপনার প্রত্যাহার ২-৪ ঘন্টার মধ্যে প্রক্রিয়া করা হবে। যাচাইকৃত নিরাপত্তা ব্যবস্থা আপনার তহবিল নিশ্চিত করে।</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function HistoryPanel({ withdrawals, history, tasks }: { withdrawals: Withdrawal[], history: any[], tasks: Task[] }) {
  const item = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl">
      <div className="space-y-6">
        <h2 className="text-2xl font-black text-stone-900 tracking-tight">Task History</h2>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[2rem] border border-stone-200 divide-y divide-stone-100 h-[400px] md:h-[600px] overflow-y-auto shadow-xl shadow-stone-100"
        >
          {history.length > 0 ? history.map((h, i) => {
            const task = tasks.find(t => t.id === h.taskId);
            return (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-6 flex items-center justify-between gap-4 hover:bg-stone-50 transition-colors"
              >
                <div className="overflow-hidden">
                  <h4 className="font-black text-stone-800 text-sm md:text-base truncate">{task?.title || 'Unknown Task'}</h4>
                  <p className="text-[10px] md:text-xs text-stone-400 font-bold uppercase tracking-widest">{new Date(h.timestamp).toLocaleString()}</p>
                </div>
                <span className="text-green-600 font-black text-sm md:text-lg shrink-0">+ ৳{h.reward}</span>
              </motion.div>
            );
          }) : (
            <div className="p-20 text-center text-stone-300 font-bold uppercase text-xs tracking-widest">No completed tasks yet</div>
          )}
        </motion.div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-black text-stone-900 tracking-tight">Withdrawals</h2>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[2rem] border border-stone-200 divide-y divide-stone-100 h-[400px] md:h-[600px] overflow-y-auto shadow-xl shadow-stone-100"
        >
          {withdrawals.length > 0 ? withdrawals.map((w, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-6 flex items-center justify-between gap-4 hover:bg-stone-50 transition-colors"
            >
              <div className="overflow-hidden">
                <div className="flex items-center gap-3 mb-1">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${w.status === 'pending' ? 'bg-orange-400 animate-pulse' : 'bg-green-500'}`} />
                  <h4 className="font-black text-stone-800 text-sm md:text-base truncate">{w.method} - {w.number}</h4>
                </div>
                <p className="text-[10px] md:text-xs text-stone-400 font-bold uppercase tracking-widest">{new Date(w.timestamp).toLocaleString()}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-stone-900 font-black text-sm md:text-lg">৳{w.amount}</p>
                <p className={`text-[9px] font-black uppercase tracking-[0.15em] ${w.status === 'pending' ? 'text-orange-500' : 'text-green-600'}`}>{w.status}</p>
              </div>
            </motion.div>
          )) : (
            <div className="p-20 text-center text-stone-300 font-bold uppercase text-xs tracking-widest">No withdrawals requested yet</div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function AdminPanel() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchStats = () => {
    fetch('/api/admin/stats').then(r => r.json()).then(setStats);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleCompletePayout = async (withdrawalId: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/withdraw/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ withdrawalId })
      });
      if (res.ok) {
        fetchStats();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-4xl space-y-8"
    >
      <motion.div variants={item} className="bg-stone-900 text-white p-8 md:p-14 rounded-[3rem] shadow-2xl shadow-stone-300 space-y-8 md:space-y-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 md:p-10 opacity-10">
          <TrendingUp className="w-32 h-32 md:w-64 md:h-64 rotate-12" />
        </div>
        
        <div className="relative z-10 space-y-2">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight">Owner Business <span className="text-orange-500">Insights</span></h1>
          <p className="text-stone-400 text-sm md:text-base font-medium max-w-xl">প্ল্যাটফর্মের লাভ এবং পেমেন্ট ট্র্যাক করুন। আনিংস কন্ট্রোল প্যানেল।</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 relative z-10">
          <div className="bg-white/5 p-4 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-white/10 backdrop-blur-md">
            <p className="text-stone-500 text-[10px] md:text-xs font-black uppercase tracking-widest mb-1 md:mb-2">Total Users</p>
            <p className="text-2xl md:text-5xl font-black tabular-nums">
              <CountUp value={stats?.totalUsers || 0} decimals={0} />
            </p>
          </div>
          <div className="bg-white/5 p-4 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-white/10 backdrop-blur-md">
            <p className="text-stone-500 text-[10px] md:text-xs font-black uppercase tracking-widest mb-1 md:mb-2">Total Net Profit</p>
            <p className="text-2xl md:text-5xl font-black tabular-nums">
              <CountUp value={stats?.totalEarnings || 0} prefix="৳" />
            </p>
          </div>
          <div className="bg-white/5 p-4 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-white/10 backdrop-blur-md col-span-2 md:col-span-1">
            <p className="text-stone-500 text-[10px] md:text-xs font-black uppercase tracking-widest mb-1 md:mb-2">Active Payouts</p>
            <p className="text-2xl md:text-5xl font-black tabular-nums">
              <CountUp value={stats?.pendingWithdrawals?.length || 0} decimals={0} />
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div variants={item} className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-stone-900 tracking-tight">Manage Payouts</h2>
          <span className="bg-orange-100 text-orange-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Live Requests</span>
        </div>
        
        <div className="bg-white border border-stone-100 rounded-[2.5rem] overflow-hidden divide-y divide-stone-50 shadow-xl shadow-stone-100">
          {stats?.pendingWithdrawals?.length > 0 ? stats.pendingWithdrawals.map((w: any, idx: number) => (
            <motion.div 
              key={w.id} 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-orange-50/20"
            >
              <div className="flex items-center gap-5">
                <div className={`w-14 h-14 flex items-center justify-center rounded-2xl text-white font-black text-lg shadow-lg ${w.method === 'Bkash' ? 'bg-pink-500' : 'bg-orange-500'}`}>
                  {w.method[0]}
                </div>
                <div>
                  <h4 className="font-black text-stone-900 text-lg">{w.number}</h4>
                  <p className="text-xs text-stone-400 font-bold uppercase tracking-tight">Method: {w.method} | User: {w.userId}</p>
                </div>
              </div>
              <div className="flex items-center justify-between md:justify-end gap-10 border-t md:border-t-0 pt-4 md:pt-0 border-stone-100">
                <div className="text-left md:text-right">
                  <p className="text-[10px] text-stone-400 font-black uppercase tracking-widest">Payable</p>
                  <p className="text-2xl font-black text-stone-900">৳{w.amount}</p>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCompletePayout(w.id)}
                  disabled={loading}
                  className="bg-stone-900 text-white px-8 py-3 rounded-2xl text-sm font-black uppercase tracking-tight hover:bg-green-600 transition-all flex items-center gap-2 shadow-xl"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Payment'}
                </motion.button>
              </div>
            </motion.div>
          )) : (
            <div className="p-24 text-center text-stone-300 space-y-4">
              <Wallet className="w-16 h-16 mx-auto opacity-10" />
              <p className="font-bold uppercase tracking-[0.2em] text-xs">No pending withdrawal requests.</p>
            </div>
          )}
        </div>
      </motion.div>

      <motion.div variants={item} className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-stone-100 space-y-4 shadow-xl shadow-stone-100/50">
        <h3 className="text-xl font-black flex items-center gap-3 text-stone-900 leading-none tracking-tight"><BarChart3 className="text-orange-600 w-7 h-7" /> Platform Governance</h3>
        <p className="text-sm text-stone-500 font-medium leading-relaxed">
          মালিক হিসেবে আপনি অ্যাপের সকল আয় এবং ব্যবহারকারীদের পেমেন্ট রিকোয়েস্ট এখান থেকে নিয়ন্ত্রণ করতে পারবেন। ব্যবহারকারীরা যখনই টাকা তোলার জন্য আবেদন করবেন, তা এখানে জমা হবে। আপনি আপনার বিকাশ/নগদ থেকে টাকা পাঠিয়ে "Confirm Payment" এ ক্লিক করলেই ব্যবহারকারীর পেমেন্ট রেকর্ড আপডেট হয়ে যাবে।
        </p>
      </motion.div>
    </motion.div>
  );
}

