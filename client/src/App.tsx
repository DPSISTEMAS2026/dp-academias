// Version: 1.0.1 - Automatic Sync Implemented
import React, { useState, useEffect, useRef } from 'react';
import {
  Users,
  CreditCard,
  QrCode,
  TrendingUp,
  Search,
  Plus,
  Settings,
  LogOut,
  Award,
  Play,
  Info,
  X, Menu,
  Bell,
  Calendar,
  Clock,
  DollarSign,
  Mail,
  Lock,
  ChevronLeft,
  Camera,
  Monitor,
  Phone,
  Ticket
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Browser } from '@capacitor/browser';
import { App as CapApp } from '@capacitor/app';

// ─── Splash Screen ───────────────────────────────────────────────────────────
const SplashScreen: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2600);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: 'linear-gradient(135deg, #020408 0%, #050d0a 50%, #02090a 100%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: '2rem', overflow: 'hidden'
      }}
    >
      {/* Background ambient glow */}
      <div style={{
        position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(0,105,112,0.22) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', top: '30%', left: '30%',
        width: '300px', height: '300px',
        background: 'radial-gradient(circle, rgba(56,189,248,0.05) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none'
      }} />

      {/* Logo container */}
      <motion.div
        initial={{ scale: 0.4, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}
      >
        {/* Logo glow ring */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '170px', height: '170px',
            background: 'radial-gradient(circle, rgba(0,105,112,0.35) 0%, transparent 70%)',
            borderRadius: '50%', pointerEvents: 'none'
          }}
        />
        {/* Logo image */}
        <motion.img
          src={BRAND.logoMark}
          alt="DP Sistemas"
          animate={{ rotate: [0, 2, -2, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          style={{
            width: '150px', height: '142px',
            objectFit: 'contain',
            position: 'relative', zIndex: 2
          }}
        />

        {/* Brand text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          style={{ textAlign: 'center' }}
        >
          <div style={{
            fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.5px',
            color: '#fff', lineHeight: 1.1
          }}>
            DP <span style={{ color: '#1aa3ab' }}>SISTEMAS</span>
          </div>
          <div style={{
            fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.25em',
            color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginTop: '0.3rem'
          }}>
            {BRAND.product}
          </div>
        </motion.div>
      </motion.div>

      {/* Progress bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        style={{ width: '180px', position: 'relative' }}
      >
        <div style={{
          width: '100%', height: '3px',
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '10px', overflow: 'hidden'
        }}>
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2, ease: 'easeInOut', delay: 0.2 }}
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #006970, #1aa3ab)',
              borderRadius: '10px',
              boxShadow: '0 0 10px rgba(0,105,112,0.55)'
            }}
          />
        </div>
      </motion.div>

      {/* Bottom tagline */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        style={{
          position: 'absolute', bottom: '3rem',
          fontSize: '0.65rem', color: 'rgba(255,255,255,0.2)',
          letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600
        }}
      >
            DP Sistemas • Automatizaciones
      </motion.div>
    </motion.div>
  );
};
// ─────────────────────────────────────────────────────────────────────────────

import type {
  Belt,
  UserRole,
  ViewMode,
  Video,
  Student,
  PlanFees,
  AutomationConfig,
  ClassSlot
} from './types';
import { BRAND, avatarSrc, appPath } from './brand';

function isAuthRoute() {
  const p = window.location.pathname.replace(/\/+$/, '') || '/';
  return p === appPath('/acceso') || p === appPath('/login');
}

function goAuthUrl() {
  const next = appPath('/acceso');
  if ((window.location.pathname.replace(/\/+$/, '') || '/') !== next) {
    window.history.pushState({}, '', next);
  }
}

function goHomeUrl() {
  const next = appPath('/') || '/';
  if (window.location.pathname !== next) {
    window.history.pushState({}, '', next);
  }
}
import { MpLogo } from './MpLogo';
import ProductLanding from './ProductLanding';
import StudentFile from './StudentFile';
import SchedulePanel from './SchedulePanel';
import AttendancePanel from './AttendancePanel';
import StudentAccess from './StudentAccess';
import PaymentsPanel from './PaymentsPanel';
import GradesPanel from './GradesPanel';
import EventsPanel from './EventsPanel';
import EventPublic, { OpenEventsCard } from './EventPublic';
import LibraryPanel from './LibraryPanel';
import StudentLibrary from './StudentLibrary';
import DashboardPanel from './DashboardPanel';
import PanelTabs from './PanelTabs';
import './panel-shell.css';
import { DEFAULT_SLOTS, defaultCapacity, groupByDay, isOpenMat, timesOverlap } from './data/schedule';
import { planLabel, planWeeklyMax } from './data/plans';
import { currentRankLabel, formatShortDate, withProgress } from './data/grades';
import { calculateIBJJFCategory } from './data/ibjjf';
import BeltPath from './BeltPath';
import { demoAlert } from './demo';
import ModuleBoundary from './ModuleBoundary';
import DemoGuide from './DemoGuide.tsx';

// Este origen (localhost:5173) corrió antes la app de Ranas. Sin esto,
// localStorage restaura alumnos, fotos y sesión de esa academia.
const DP_STORAGE_VERSION = 'dp-demo-v2';
if (typeof window !== 'undefined' && localStorage.getItem('__dp_storage_version') !== DP_STORAGE_VERSION) {
  localStorage.clear();
  sessionStorage.clear();
  localStorage.setItem('__dp_storage_version', DP_STORAGE_VERSION);
}

// Detect environment: Capacitor native apps run on localhost bridge.
const _isCapacitor = typeof window !== 'undefined' && (
  !!(window as any).Capacitor || 
  window.location.href.includes('capacitor://') || 
  (window.location.hostname === 'localhost' && window.location.port === '')
);
let API_URL: string = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL
  : 'http://localhost:3002';

const getFallbackAvatarUrl = (_name?: string) => BRAND.mascotAvatar;

const studentPhoto = (student?: { avatar?: string | null } | null) => avatarSrc(student?.avatar, API_URL);

const newsItems = [
  {
    title: "Torneo Interacademias: 120 cupos abiertos",
    body: "Inscribe alumnos o invita a otras academias. Categorías por edad, peso y grado, con pago de inscripción en línea.",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200",
    link: "",
    label: "Eventos",
    date: "24 Oct, 2026",
    stats: [
      { label: 'Cupos', text: '120' },
      { label: 'Inscripción', text: '$15.000' },
      { label: 'Sede', text: 'Centro' },
      { label: 'Organiza', text: 'Academia Demo' }
    ]
  },
  {
    title: "Nuevo horario de Jiu Jitsu y Kickboxing",
    body: "Cambias horarios y cupos en el panel: el horario se actualiza y queda listo para una historia de Instagram.",
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200",
    link: "",
    label: "Horarios",
    date: "18 Ago, 2026",
    stats: [
      { label: 'Sedes', text: '3' },
      { label: 'Disciplinas', text: 'BJJ · KB · MMA' },
      { label: 'App', text: 'Alumno' },
      { label: 'Redes', text: 'Instagram' }
    ]
  },
  {
    title: "Biblioteca técnica: Armbar desde guardia",
    body: "Publica videos y PDFs por cinturón. El alumno ve su progreso y el profesor hace seguimiento.",
    img: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1200",
    link: "",
    label: "Material",
    date: "12 Ago, 2026",
    stats: [
      { label: 'Formato', text: 'Video' },
      { label: 'Grados', text: 'Blanco y Azul' },
      { label: 'Duración', text: '06:24' },
      { label: 'Sedes', text: 'Todas' }
    ]
  }
];


const VIDEO_CATEGORIES = [
  'Técnicas',
  'Reglamento',
  'Preparación'
];

const App: React.FC = () => {
  const [isSplashVisible, setIsSplashVisible] = useState(() => {
    if (typeof window !== 'undefined' && isAuthRoute()) return false;
    const shown = sessionStorage.getItem('splashShown');
    if (!shown) { sessionStorage.setItem('splashShown', '1'); return true; }
    return false;
  });
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window !== 'undefined' && isAuthRoute()) return 'auth';
    return (localStorage.getItem('viewMode') as ViewMode) || 'landing';
  });
  const [noticeData, setNoticeData] = useState({ 
    subject: '', 
    message: ''
  });
  const [role, setRole] = useState<UserRole>(() => localStorage.getItem('role') as UserRole || 'guest');
  const [activeSedeId, setActiveSedeId] = useState<number | null>(() => {
    const s = localStorage.getItem('activeSedeId');
    return s && s !== 'null' ? Number(s) : null;
  });
  const [sedes, setSedes] = useState<any[]>([]);
  const [classSlots, setClassSlots] = useState<ClassSlot[]>(DEFAULT_SLOTS);
  const [savingSchedule, setSavingSchedule] = useState(false);
  const [currentUser, setCurrentUser] = useState<Student | null>(() => {
    try {
      const u = localStorage.getItem('currentUser');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  });
  const [multiStudentAuthOptions, setMultiStudentAuthOptions] = useState<Student[]>([]);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // PWA States and Logic
  const [isIOSStandalone, setIsIOSStandalone] = useState<boolean>(false);

  useEffect(() => {
    // Detect if running inside old iOS standalone Home Screen bookmark
    const isStandalone = typeof window !== 'undefined' && 
      (window.navigator as any).standalone === true;
    if (isStandalone) {
      setIsIOSStandalone(true);
    }
  }, []);

  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay() || 7;
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - day + 1);
    return d.getTime();
  };


  const getYouTubeID = (url: string) => {
    if (!url) return null;
    const str = url.trim();
    // Intento primario preciso (Añadido soporte para youtube.com/live/)
    const match = str.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts|live)\/|.*[?&]v=)|youtu\.be\/)([^\"&?\/\s]{11})/);
    if (match && match[1]) return match[1];
    
    // Fallback Agresivo: Busca cualquier cadena de 11 caracteres típica de YouTube (alfanuméricos + - y _)
    const looseMatch = str.match(/(?:\/|v=)([a-zA-Z0-9_-]{11})(?:[?&#]|$)/);
    if (looseMatch && str.includes('youtu')) return looseMatch[1];
    
    return null;
  };

  const handleBookClass = (day: string, time: string, name: string) => {
    if (!currentUser) return;
    const currentWeekStart = getWeekStart(new Date());
    const scheduled = currentUser.scheduledClasses || [];
    const slot = classSlots.find((s) => s.day === day && s.startTime === time && s.name === name);
    const openMat = isOpenMat(name);
    
    const isBooked = scheduled.some(c => c.day === day && c.time === time && c.timestamp >= currentWeekStart);
    
    let newScheduled = [];
    if (isBooked) {
      newScheduled = scheduled.filter(c => !(c.day === day && c.time === time && c.timestamp >= currentWeekStart));
    } else {
      const enrolled = students.filter((st) =>
        (st.scheduledClasses || []).some((sc) => sc.timestamp >= currentWeekStart && sc.day === day && sc.time === time)
      ).length;
      const cap = slot?.capacity ?? null;
      if (cap && cap > 0 && enrolled >= cap) {
        alert('Esta clase está completa.');
        return;
      }

      if (slot) {
        const overlapsOwn = scheduled.some((c) => {
          if (c.timestamp < currentWeekStart || c.day !== day) return false;
          const other = classSlots.find((s) => s.day === c.day && s.startTime === c.time);
          if (!other) return c.time === time;
          return timesOverlap(slot.startTime, slot.endTime, other.startTime, other.endTime);
        });
        if (overlapsOwn) {
          alert('Ya tienes otra clase en ese horario.');
          return;
        }
      }

      let planMax = planWeeklyMax(currentUser.plan);

      const thisWeekPlan = scheduled.filter((c) => c.timestamp >= currentWeekStart && !isOpenMat(c.name));

      if (!openMat && thisWeekPlan.length >= planMax) {
        alert(`Tu plan permite ${planMax} clases por semana. El Open Mat no gasta ese cupo.`);
        return;
      }

      newScheduled = [...scheduled, { timestamp: new Date().getTime(), day, time, name }];
    }
    handleUpdateStudent({ ...currentUser, scheduledClasses: newScheduled as any[] });
  };

  const handleLogout = () => {
    localStorage.clear();
    localStorage.setItem('__dp_storage_version', DP_STORAGE_VERSION);
    setViewMode('landing');
    goHomeUrl();
    setRole('guest');
    setCurrentUser(null);
    setNoticeData({ subject: '', message: '' });
    setIsNoticeDismissed(false);
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (viewMode === 'auth') goAuthUrl();
    if (viewMode === 'landing') goHomeUrl();
    if (viewMode === 'app' && isAuthRoute()) goHomeUrl();
  }, [viewMode]);

  useEffect(() => {
    const onPop = () => {
      if (isAuthRoute()) setViewMode('auth');
      else if (viewMode !== 'app') setViewMode('landing');
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [viewMode]);
  const [, setActiveNews] = useState(0);
  const [playingVideo, setPlayingVideo] = useState<Video | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'attendance' | 'students' | 'payments' | 'settings' | 'videos' | 'website' | 'communications' | 'schedule' | 'grades' | 'events'>(() => localStorage.getItem('activeTab') as any || 'dashboard');

  useEffect(() => {
    localStorage.setItem('viewMode', viewMode);
    localStorage.setItem('role', role);
    localStorage.setItem('activeTab', activeTab);
    if (activeSedeId !== null) {
      localStorage.setItem('activeSedeId', activeSedeId.toString());
    } else {
      localStorage.removeItem('activeSedeId');
    }
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [viewMode, role, currentUser, activeTab, activeSedeId]);
  const [liveNews, setLiveNews] = useState(newsItems);
  const [liveHeroVideos, setLiveHeroVideos] = useState<string[]>([]);
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [studentFilterAge, setStudentFilterAge] = useState<'ALL' | 'KIDS' | 'ADULTS'>('ALL');
  const [studentFilterPayment, setStudentFilterPayment] = useState<'ALL' | 'PAID' | 'PENDING'>('ALL');
  const [studentFilterBelt, setStudentFilterBelt] = useState<Belt | 'ALL'>('ALL');
  const [studentFilterIBJJFCategory, setStudentFilterIBJJFCategory] = useState<string>('ALL');
  const [liveGallery, setLiveGallery] = useState([
    { img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200', size: 'large' as const },
    { img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800', size: 'small' as const },
    { img: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800', size: 'small' as const },
    { img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800', size: 'tall' as const },
    { img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800', size: 'wide' as const },
  ]);
  const [isAddingGallery, setIsAddingGallery] = useState(false);
  const [newGalleryData, setNewGalleryData] = useState<{ img: string, size: 'small' | 'wide' | 'tall' | 'large' }>({ img: '', size: 'small' });

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showStudentAccess, setShowStudentAccess] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [isGeneratingPayment, setIsGeneratingPayment] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentModalTarget, setPaymentModalTarget] = useState<Student | Student[] | null>(null);

  
  const handleManualPayment = async (studentId: string, customDate?: string) => {
    try {
      const student = students.find(s => s.id === studentId);
      if (!student) return;

      const finalDate = customDate || new Date().toISOString().split('T')[0];
      const finalMonth = finalDate.substring(0, 7);
      
      const newHistoryEntry = {
        date: finalDate,
        amount: Number(student.monthlyFee) || 0,
        status: 'Completado' as 'Completado' | 'Pendiente',
        method: 'Manual',
        transaction_id: `MANUAL_${finalDate.replace(/-/g, '')}_${student.monthlyFee}`
      };

      const updatedHistory = [...(Array.isArray(student.history) ? student.history : []), newHistoryEntry];

      const response = await fetch(`${API_URL}/api/students/${studentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          isPaid: true, 
          lastPaymentDate: finalDate, 
          lastPaymentMonth: finalMonth,
          history: updatedHistory
        })
      });

      if (response.ok) {
        setStudents(prev => prev.map(s => s.id === studentId ? { 
          ...s, 
          isPaid: true, 
          lastPaymentDate: finalDate, 
          lastPaymentMonth: finalMonth,
          history: updatedHistory
        } : s));
        
        if (selectedStudent?.id === studentId) {
          setSelectedStudent(prev => prev ? { ...prev, isPaid: true, lastPaymentDate: finalDate, lastPaymentMonth: finalMonth, history: updatedHistory } : null);
        }
      }
    } catch (e) {
      console.error("Error updating payment:", e);
    }
  };
  const [videos, setVideos] = useState<Video[]>([]);
  const [isAddingVideo, setIsAddingVideo] = useState(false);
  const [newVideoData, setNewVideoData] = useState<Omit<Video, 'id'>>({ title: '', description: '', url: '', thumbnail: '', targetAudience: 'BOTH', category: VIDEO_CATEGORIES[0] });
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [rawImageForCrop, setRawImageForCrop] = useState<string | null>(null);
  const [cropZoom, setCropZoom] = useState<number>(1);
  const [cropOffset, setCropOffset] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const [isCroppingSave, setIsCroppingSave] = useState<boolean>(false);
  const [isDraggingCrop, setIsDraggingCrop] = useState<boolean>(false);
  const [dragStartCrop, setDragStartCrop] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const [cropImageObj, setCropImageObj] = useState<HTMLImageElement | null>(null);
  // Admin-specific: which student the admin is editing the avatar for
  const [adminCropTargetStudent, setAdminCropTargetStudent] = useState<Student | null>(null);
  // Lightbox: show full-size photo of a student
  const [photoLightboxStudent, setPhotoLightboxStudent] = useState<Student | null>(null);

  useEffect(() => {
    if (!rawImageForCrop) {
      setCropImageObj(null);
      setCropZoom(1);
      setCropOffset({ x: 0, y: 0 });
      return;
    }
    const img = new Image();
    img.src = rawImageForCrop;
    img.onload = () => {
      setCropImageObj(img);
    };
  }, [rawImageForCrop]);

  const clampOffset = (x: number, y: number, zoomVal: number) => {
    if (!cropImageObj) return { x: 0, y: 0 };
    const C = 250;
    const imgW = cropImageObj.naturalWidth || cropImageObj.width;
    const imgH = cropImageObj.naturalHeight || cropImageObj.height;
    const s0 = C / Math.min(imgW, imgH);
    const W = imgW * s0 * zoomVal;
    const H = imgH * s0 * zoomVal;
    
    const maxOffsetX = Math.max(0, (W - C) / 2);
    const maxOffsetY = Math.max(0, (H - C) / 2);
    
    return {
      x: Math.max(-maxOffsetX, Math.min(maxOffsetX, x)),
      y: Math.max(-maxOffsetY, Math.min(maxOffsetY, y))
    };
  };

  const handleZoomChange = (newZoom: number) => {
    setCropZoom(newZoom);
    setCropOffset(prev => clampOffset(prev.x, prev.y, newZoom));
  };

  const handleDragStart = (clientX: number, clientY: number) => {
    if (!cropImageObj) return;
    setIsDraggingCrop(true);
    setDragStartCrop({ x: clientX - cropOffset.x, y: clientY - cropOffset.y });
  };

  const handleDragMove = (clientX: number, clientY: number) => {
    if (!isDraggingCrop || !cropImageObj) return;
    const newX = clientX - dragStartCrop.x;
    const newY = clientY - dragStartCrop.y;
    setCropOffset(clampOffset(newX, newY, cropZoom));
  };

  const handleDragEnd = () => {
    setIsDraggingCrop(false);
  };
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSendingNotice, setIsSendingNotice] = useState(false);
  const [isAddingNews, setIsAddingNews] = useState(false);
  const [newNewsData, setNewNewsData] = useState({ 
    title: '', 
    body: '', 
    img: '', 
    link: '#', 
    label: 'Noticias del Dojo', 
    date: new Date().toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' }),
    stats: [{ label: 'Evento', text: '' }]
  });
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [, setIsEditingStudent] = useState(false);
  const [studentNewPassword, setStudentNewPassword] = useState('');

  // Body scroll lock effect for iOS / Web to prevent background scroll and WebKit crashes
  useEffect(() => {
    const isAnyModalOpen = !!(
      selectedStudent ||
      showPaymentModal ||
      isAddingStudent ||
      isSendingNotice ||
      photoLightboxStudent ||
      isAddingVideo ||
      isAddingNews ||
      isAddingGallery ||
      rawImageForCrop ||
      showStudentAccess
    );
    if (isAnyModalOpen) {
      document.documentElement.classList.add('modal-open');
      document.body.classList.add('modal-open');
      return () => {
        document.documentElement.classList.remove('modal-open');
        document.body.classList.remove('modal-open');
      };
    }
  }, [
    selectedStudent,
    showPaymentModal,
    isAddingStudent,
    isSendingNotice,
    photoLightboxStudent,
    isAddingVideo,
    isAddingNews,
    isAddingGallery,
    rawImageForCrop,
    showStudentAccess
  ]);

  // Password recovery state
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryStatus, setRecoveryStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [recoveryMessage, setRecoveryMessage] = useState('');

  const [isNoticeDismissed, setIsNoticeDismissed] = useState(false);
  const [isSendingBirthdays, setIsSendingBirthdays] = useState(false);
  const [categorySavedSuccess, setCategorySavedSuccess] = useState(false);
  const [commTab, setCommTab] = useState<'aviso' | 'cumple' | 'preview'>('aviso');
  const [webTab, setWebTab] = useState<'hero' | 'news' | 'gallery'>('hero');
  const [settingsTab, setSettingsTab] = useState<'ninos' | 'adultos' | 'claves'>('claves');

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveNews(prev => (prev + 1) % liveNews.length);
    }, 15000);
    return () => clearInterval(timer);
  }, [liveNews.length]);

  // API Data Loading (Scoped by Sede)
  const fetchDataForSede = async (sedeId: number | null) => {
    const queryParams = sedeId ? `?sedeId=${sedeId}` : '';

    // Carga ultrarrápida e independiente de videos (< 1 seg)
    fetch(`${API_URL}/api/videos${queryParams}`)
      .then(res => res.json())
      .then(videosData => {
        if (Array.isArray(videosData)) setVideos(videosData);
      })
      .catch(e => console.error("Error cargando videos:", e));

    fetch(`${API_URL}/api/schedule${queryParams}`)
      .then(res => res.json())
      .then(scheduleData => {
        if (Array.isArray(scheduleData) && scheduleData.length) {
          setClassSlots(scheduleData.map((s: ClassSlot) => ({
            ...s,
            capacity: s.capacity === undefined ? defaultCapacity(s.name) : s.capacity,
          })));
        }
      })
      .catch(() => setClassSlots(DEFAULT_SLOTS));

    // Carga independiente de notificaciones
    fetch(`${API_URL}/api/global-notice${queryParams}`)
      .then(res => res.json())
      .then(noticeDataResult => {
        if (noticeDataResult && noticeDataResult.subject) {
          setNoticeData(noticeDataResult);
          setIsNoticeDismissed(false);
        } else {
          setNoticeData({ subject: '', message: '' });
        }
      })
      .catch(() => setNoticeData({ subject: '', message: '' }));

    // Carga paralela de resto de datos del sistema
    try {
      const [studentsRes, newsRes, galleryRes, heroVideosRes, feesRes, automationRes, discountCatRes, sedesRes] = await Promise.all([
        fetch(`${API_URL}/api/students${queryParams}`),
        fetch(`${API_URL}/api/news${queryParams}`),
        fetch(`${API_URL}/api/gallery${queryParams}`),
        fetch(`${API_URL}/api/hero-videos`),
        fetch(`${API_URL}/api/fees${queryParams}`),
        fetch(`${API_URL}/api/automation${queryParams}`),
        fetch(`${API_URL}/api/discount-categories${queryParams}`),
        fetch(`${API_URL}/api/sedes`)
      ]);

      const studentsData = await studentsRes.json().catch(() => []);
      const newsData = await newsRes.json().catch(() => null);
      const galleryData = await galleryRes.json().catch(() => null);
      const heroVideosData = await heroVideosRes.json().catch(() => null);
      const feesData = await feesRes.json().catch(() => null);
      const automationData = await automationRes.json().catch(() => null);
      const discountCatData = await discountCatRes.json().catch(() => null);
      const sedesData = await sedesRes.json().catch(() => []);

      setStudents(studentsData || []);
      setSedes(sedesData || []);
      if (newsData !== null) setLiveNews(newsData);
      if (galleryData !== null) setLiveGallery(galleryData);
      if (heroVideosData !== null) setLiveHeroVideos(heroVideosData);
      if (feesData !== null) setFees(feesData);
      if (automationData !== null) setAutomation(automationData);
      if (discountCatData !== null) setDiscountCategories(discountCatData);

      // Sync currentUser with fresh data from server (e.g. admin changed payment status)
      const cachedUser = localStorage.getItem('currentUser');
      if (cachedUser) {
        const cached = JSON.parse(cachedUser);
        const fresh = (studentsData || []).find((s: Student) => String(s.id) === String(cached.id));
        if (fresh) {
          setCurrentUser(fresh);
          localStorage.setItem('currentUser', JSON.stringify(fresh));
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchDataForSede(activeSedeId);
  }, [activeSedeId]);

  // Fix 2: Detectar retorno desde Mercado Pago y refrescar datos
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentStatus = params.get('payment');
    if (paymentStatus === 'success') {
      // Limpiar URL sin recargar página
      window.history.replaceState({}, '', window.location.pathname);
      // Refrescar datos desde el servidor para que el estado de pago se actualice
      fetchDataForSede(activeSedeId);
      alert('✅ ¡Pago realizado con éxito! Tu estado ha sido actualizado.');
    } else if (paymentStatus === 'failure') {
      window.history.replaceState({}, '', window.location.pathname);
      alert('❌ El pago no se pudo completar. Por favor intenta nuevamente.');
    } else if (paymentStatus === 'pending') {
      window.history.replaceState({}, '', window.location.pathname);
      alert('⏳ Tu pago está pendiente de confirmación. Te notificaremos cuando se acredite.');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sincronizar datos de la sede activa en localStorage para su uso en la carga (Splash Screen)
  useEffect(() => {
    if (sedes.length > 0) {
      const targetId = role === 'student' ? (currentUser?.sedeId || currentUser?.sede_id || 1) : (activeSedeId || 1);
      const activeSede = sedes.find(s => s.id === Number(targetId));
      if (activeSede) {
        localStorage.setItem('activeSedeName', activeSede.name);
        localStorage.setItem('activeSedeAddress', activeSede.address || '');
      }
    }
  }, [sedes, activeSedeId, role, currentUser]);

  // Si es una sede secundaria, no permitir estar en Biblioteca (videos) ni Sitio Web (website)
  useEffect(() => {
    const isSecondarySede = role === 'admin' && activeSedeId !== 1;
    if (isSecondarySede && ['videos', 'website'].includes(activeTab)) {
      setActiveTab('dashboard');
    }
  }, [activeSedeId, role, activeTab]);

  // Detectar cuando el usuario vuelve a la app desde Mercado Pago (Capacitor in-app browser)
  // Cierra el browser y refresca los datos automáticamente
  useEffect(() => {
    if (!_isCapacitor) return;
    let listener: any;
    CapApp.addListener('appStateChange', ({ isActive }) => {
      if (isActive) {
        Browser.close().catch(() => {});
        fetchDataForSede(activeSedeId);
      }
    }).then(l => { listener = l; });
    return () => {
      if (listener) listener.remove();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSedeId]);



  const handleSaveSchedule = async (slots: ClassSlot[]) => {
    setSavingSchedule(true);
    try {
      const queryParams = activeSedeId ? `?sedeId=${activeSedeId}` : '';
      const response = await fetch(`${API_URL}/api/schedule${queryParams}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slots })
      });
      if (response.ok) {
        const saved = await response.json().catch(() => slots);
        setClassSlots(Array.isArray(saved) && saved.length ? saved : slots);
      } else {
        alert('No se pudo guardar el horario.');
      }
    } catch (e) {
      console.error(e);
      alert('Error de conexión al guardar el horario.');
    } finally {
      setSavingSchedule(false);
    }
  };

  const syncWebsite = async (type: 'news' | 'gallery' | 'hero-videos', data: any) => {
    try {
      const endpoint = type === 'hero-videos' ? 'hero-videos' : type;
      const queryParams = (type !== 'hero-videos' && activeSedeId) ? `?sedeId=${activeSedeId}` : '';
      await fetch(`${API_URL}/api/${endpoint}${queryParams}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (e) {
      console.error(`Error syncing ${type}:`, e);
    }
  };

  const handleUpdateStudent = async (updatedStudent: Student) => {
    try {
      // Only send fields that exist in the Supabase table
      const payload: any = { id: updatedStudent.id };
      if (updatedStudent.name !== undefined) payload.name = updatedStudent.name;
      if (updatedStudent.email !== undefined) payload.email = updatedStudent.email;
      if (updatedStudent.phone !== undefined) payload.phone = updatedStudent.phone;
      if (updatedStudent.password !== undefined) payload.password = updatedStudent.password;
      if (updatedStudent.belt !== undefined) payload.belt = updatedStudent.belt;
      if (updatedStudent.classesAttended !== undefined) payload.classesAttended = updatedStudent.classesAttended;
      if (updatedStudent.classesToNextBelt !== undefined) payload.classesToNextBelt = updatedStudent.classesToNextBelt;
      if (updatedStudent.isPaid !== undefined) payload.isPaid = updatedStudent.isPaid;
      if (updatedStudent.plan !== undefined) payload.plan = updatedStudent.plan;
      if (updatedStudent.monthlyFee !== undefined) payload.monthlyFee = updatedStudent.monthlyFee;
      if (updatedStudent.birthDate !== undefined) payload.birthDate = updatedStudent.birthDate;
      if (updatedStudent.avatar !== undefined) payload.avatar = updatedStudent.avatar;
      if (updatedStudent.history !== undefined) payload.history = updatedStudent.history;
      if (updatedStudent.lastPaymentDate !== undefined) payload.lastPaymentDate = updatedStudent.lastPaymentDate;
      if (updatedStudent.lastPaymentMonth !== undefined) payload.lastPaymentMonth = updatedStudent.lastPaymentMonth;
      if (updatedStudent.scheduledClasses !== undefined) payload.scheduledClasses = updatedStudent.scheduledClasses;
      if (updatedStudent.joinDate !== undefined) payload.joinDate = updatedStudent.joinDate;
      if (updatedStudent.lastGrade !== undefined) payload.lastGrade = updatedStudent.lastGrade;
      if (updatedStudent.graduationDate !== undefined) payload.graduationDate = updatedStudent.graduationDate;
      if (updatedStudent.weight !== undefined) payload.weight = updatedStudent.weight;
      if (updatedStudent.gender !== undefined) payload.gender = updatedStudent.gender;
      if (updatedStudent.sedeId !== undefined) payload.sedeId = updatedStudent.sedeId;
      if (updatedStudent.sede_id !== undefined) payload.sedeId = updatedStudent.sede_id;
      if (updatedStudent.progress !== undefined) payload.progress = updatedStudent.progress;
      const prevStudent = students.find((s) => String(s.id) === String(updatedStudent.id));
      payload.ficha = {
        tutorName: updatedStudent.tutorName ?? prevStudent?.tutorName ?? '',
        tutorEmail: updatedStudent.tutorEmail ?? prevStudent?.tutorEmail ?? '',
        tutorPhone: updatedStudent.tutorPhone ?? prevStudent?.tutorPhone ?? '',
        tutorRelation: updatedStudent.tutorRelation ?? prevStudent?.tutorRelation ?? '',
        emergencyName: updatedStudent.emergencyName ?? prevStudent?.emergencyName ?? '',
        emergencyPhone: updatedStudent.emergencyPhone ?? prevStudent?.emergencyPhone ?? '',
        emergencyRelation: updatedStudent.emergencyRelation ?? prevStudent?.emergencyRelation ?? '',
        allergies: updatedStudent.allergies ?? prevStudent?.allergies ?? '',
        discipline: updatedStudent.discipline ?? prevStudent?.discipline ?? '',
      };

      const response = await fetch(`${API_URL}/api/students/${updatedStudent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        const resData = await response.json().catch(() => ({}));
        const mergedStudent = { 
          ...students.find(s => String(s.id) === String(updatedStudent.id)), 
          ...updatedStudent,
          ...resData 
        };
        setStudents(prev => prev.map(s => String(s.id) === String(updatedStudent.id) ? mergedStudent : s));
        if (selectedStudent && String(selectedStudent.id) === String(updatedStudent.id)) {
          setSelectedStudent(mergedStudent);
        }
        setIsEditingStudent(false);
        if (currentUser && String(currentUser.id) === String(updatedStudent.id)) {
          setCurrentUser(mergedStudent);
          localStorage.setItem('currentUser', JSON.stringify(mergedStudent));
        }
      } else {
        const errData = await response.json().catch(() => ({}));
        console.error('Server error:', errData);
        alert('❌ Error al guardar los cambios. Revisa la consola.');
      }
    } catch (error) {
      console.error("Error updating student:", error);
      alert('❌ Error de conexión al guardar.');
    }
  };



  const handleDeleteStudent = async (_studentId: string) => {
    demoAlert('students');
  };


  const handleGenericImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => callback(reader.result as string);
    reader.readAsDataURL(file);
  };

  // Helper: saber si un alumno ya pagó en el mes actual
  const hasAlreadyPaidThisMonth = (student: Student): boolean => {
    const currentMonth = new Date().toISOString().substring(0, 7); // "2026-07"
    // Bloquear si pagó este mes O si tiene pagos adelantados a meses futuros
    return !!(student.isPaid && student.lastPaymentMonth &&
      student.lastPaymentMonth.substring(0, 7) >= currentMonth);
  };


  const handleCreatePaymentLink = async (studentsOrStudent: Student | Student[]) => {
    const isGroup = Array.isArray(studentsOrStudent);
    const studentsToPay = isGroup ? studentsOrStudent : [studentsOrStudent];

    // Guard: verificar si ya pagó este mes o tiene adelantos
    const alreadyPaid = studentsToPay.filter(s => hasAlreadyPaidThisMonth(s));
    if (alreadyPaid.length > 0) {
      const s = alreadyPaid[0];
      alert(`✅ ${s.name} ya tiene sus pagos al día hasta ${s.lastPaymentMonth}. No es necesario volver a pagar.`);
      return;
    }

    setIsGeneratingPayment(true);
    try {
      const amount = studentsToPay.reduce((acc: number, s: Student) => acc + (s.monthlyFee || 40000), 0);
      if (amount <= 0) {
        alert("⚠️ No hay mensualidades asignadas o el monto es cero.");
        return;
      }

      const response = await fetch(`${API_URL}/api/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student: !isGroup ? {
            id: (studentsOrStudent as Student).id,
            name: (studentsOrStudent as Student).name,
            email: (studentsOrStudent as Student).email || "test_user_123@testuser.com",
            sedeId: (studentsOrStudent as Student).sedeId || (studentsOrStudent as Student).sede_id
          } : undefined,
          students: isGroup ? studentsToPay.map(s => ({
            id: s.id,
            name: s.name,
            email: s.email || "test_user_123@testuser.com",
            monthlyFee: s.monthlyFee || 40000,
            sedeId: s.sedeId || s.sede_id
          })) : undefined,
          amount,
          withSurcharge: true
        })
      });

      const data = await response.json();

      if (data.init_point) {
        // Redirigir de inmediato
        if (_isCapacitor) {
          await Browser.open({ url: data.init_point, presentationStyle: 'popover' });
        } else {
          if (isIOSStandalone) {
            alert("💡 Estás ingresando desde un marcador de inicio de iPhone. Serás redirigido a Safari para procesar tu pago de forma segura.");
          }
          // En Web y PWA, usar window.location.href directamente para evitar que Android/iOS abra múltiples apps
          window.location.href = data.init_point;
        }
        setShowPaymentModal(false);
      } else if (response.status === 400 && data.error) {
        alert(`⚠️ ${data.error}`);
      } else {
        alert("❌ Error: No se pudo generar el link de pago. Verifica tu conexión.");
      }
    } catch (error) {
      alert("❌ Error de red: No se pudo contactar al servidor de pagos.");
    } finally {
      setIsGeneratingPayment(false);
    }
  };

  const openPaymentModal = (target: Student | Student[]) => {
    setPaymentModalTarget(target);
    setShowPaymentModal(true);
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setIsGeneratingPayment(false);
  };

  const MP_COMMISSION_RATE = 0.03212;
  const MP_IVA = 0.19;
  const getEffectiveRate = () => MP_COMMISSION_RATE * (1 + MP_IVA);
  const getSurcharge = (baseAmount: number) => {
    const rate = getEffectiveRate();
    const charged = Math.ceil(baseAmount / (1 - rate));
    return { charged, surcharge: charged - baseAmount, rate };
  };
  const [newStudentData, setNewStudentData] = useState({ name: '', email: '', phone: '', birthDate: '', documentId: '', belt: 'WHITE' as Belt, plan: '3', monthlyFee: 40000, discountCategory: '', discountPercentage: 0, sedeId: '' });
  const [discountCategories, setDiscountCategories] = useState<string[]>(['Convenio Bomberos', 'Profesor', 'Becados']);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const [fees, setFees] = useState<PlanFees>({
    adults: { '1': 20000, '1x': 20000, '2': 25000, '3': 35000, '4': 40000, 'Ilimitado': 45000 },
    kids: { '1': 18000, '1x': 18000, '2': 25000, '3': 35000, '4': 40000, 'Ilimitado': 45000 }
  });

  const handleSaveFees = async (updatedFees: PlanFees) => {
    try {
      const queryParams = activeSedeId ? `?sedeId=${activeSedeId}` : '';
      await fetch(`${API_URL}/api/fees${queryParams}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFees)
      });
    } catch (e) {
      console.error("Error saving fees:", e);
    }
  };

  const handleOpenAddStudent = () => {
    setNewStudentData({
      name: '',
      email: '',
      phone: '',
      birthDate: '',
      documentId: '',
      belt: 'WHITE' as Belt,
      plan: '3',
      monthlyFee: fees.adults['3'] || 40000,
      discountCategory: '',
      discountPercentage: 0,
      sedeId: activeSedeId ? activeSedeId.toString() : ''
    });
    setIsAddingStudent(true);
  };



  const handleUploadAvatar = () => {
    if (!currentUser) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        setAdminCropTargetStudent(null); // ensure we're editing currentUser
        setRawImageForCrop(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  // Admin function: upload avatar for any specific student
  const handleAdminUploadAvatar = (student: Student) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        setAdminCropTargetStudent(student);
        setRawImageForCrop(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const handleSaveCrop = async () => {
    // Determine who we're saving for: admin editing a student, or currentUser editing themselves
    const targetStudent = adminCropTargetStudent || currentUser;
    if (!cropImageObj || !targetStudent) return;
    setIsCroppingSave(true);
    try {
      const imgW = cropImageObj.naturalWidth || cropImageObj.width;
      const imgH = cropImageObj.naturalHeight || cropImageObj.height;
      if (!imgW || !imgH) throw new Error('Invalid image dimensions');

      const C = 250; // UI Cropper viewport size
      const s0 = C / Math.min(imgW, imgH);
      const scale = s0 * cropZoom;
      
      const W = imgW * scale;
      const H = imgH * scale;
      
      const left = (C - W) / 2 + cropOffset.x;
      const top = (C - H) / 2 + cropOffset.y;

      // Source rectangle in original image coordinates
      const sx = -left / scale;
      const sy = -top / scale;
      const sWidth = C / scale;
      const sHeight = C / scale;

      const TARGET_SIZE = 800;
      const canvas = document.createElement('canvas');
      canvas.width = TARGET_SIZE;
      canvas.height = TARGET_SIZE;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context error');

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Draw exact cropped source box to 800x800 destination
      ctx.drawImage(cropImageObj, sx, sy, sWidth, sHeight, 0, 0, TARGET_SIZE, TARGET_SIZE);
      
      // Lossless PNG format for crisp 100% sharp text, logos and edges with 0 JPEG blur/pixelation
      const base64Image = canvas.toDataURL('image/png');
      
      const updatedStudent = { ...targetStudent, avatar: base64Image } as Student;
      
      const saveResponse = await fetch(`${API_URL}/api/students/${targetStudent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar: base64Image })
      });

      if (saveResponse.ok) {
        // Update students list
        setStudents(prev => prev.map(s => s.id === targetStudent.id ? updatedStudent : s));
        // If we edited the currently logged-in student, update currentUser too
        if (currentUser?.id === targetStudent.id) {
          setCurrentUser(updatedStudent);
        }
        // If admin was editing a selected student, update selectedStudent view
        if (adminCropTargetStudent && selectedStudent?.id === targetStudent.id) {
          setSelectedStudent(updatedStudent);
        }
        setRawImageForCrop(null);
        setAdminCropTargetStudent(null);
        alert('✅ Foto de perfil actualizada con éxito.');
      } else {
        alert('❌ Error al guardar la foto de perfil en el servidor.');
      }
    } catch (error) {
      console.error('Error saving cropped avatar:', error);
      alert('❌ Error al procesar la imagen.');
    } finally {
      setIsCroppingSave(false);
    }
  };

  const [automation, setAutomation] = useState<AutomationConfig>({ reminderDay: 5, reminderEnabled: true, mercadoPago: true, transfer: true, whatsappTemplate: "Hola {nombre}...", emailTemplate: "Hola {nombre}..." });

  const handleSaveAutomation = async (updatedAutomation: AutomationConfig) => {
    try {
      const queryParams = activeSedeId ? `?sedeId=${activeSedeId}` : '';
      await fetch(`${API_URL}/api/automation${queryParams}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedAutomation)
      });
    } catch (e) {
      console.error("Error saving automation:", e);
    }
  };
  const calculateAge = (birthDateStr: string | null) => {
    if (!birthDateStr) return 0;
    const parts = birthDateStr.split('-');
    if (parts.length < 3) return 0;
    const birthDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const beltLabels: Record<Belt, string> = { WHITE: 'Blanco', BLUE: 'Azul', PURPLE: 'Morado', BROWN: 'Marrón', BLACK: 'Negro', GRAY: 'Gris' };
  const planLabels: Record<string, string> = { '1': 'Clase Individual', '1x': '1x Semana', '2': '2x Semana', '3': '3x Semana', '4': '4x Semana', 'Ilimitado': 'Plan Libre' };
  const formatCLP = (amount: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(amount);

  // Formatea una fecha YYYY-MM-DD → DD/MM/YYYY (o texto corto de mes si se pide)
  const formatDate = (dateStr: string | null | undefined, style: 'numeric' | 'long' | 'short' = 'numeric'): string => {
    if (!dateStr) return 'N/A';
    try {
      // Parsear asegurando hora fija para evitar desfase de zona horaria
      const [y, m, d] = dateStr.split('-').map(Number);
      if (!y || !m || !d) return dateStr;
      const date = new Date(y, m - 1, d);
      if (style === 'numeric') return `${String(d).padStart(2,'0')}/${String(m).padStart(2,'0')}/${y}`;
      if (style === 'short') return date.toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' });
      return date.toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch { return dateStr; }
  };


  const handleLogin = async (studentToLogin?: Student) => {
    if (studentToLogin) {
      setRole('student');
      setCurrentUser(studentToLogin);
      const sId = studentToLogin.sedeId || studentToLogin.sede_id || 1;
      setActiveSedeId(sId);
      localStorage.setItem('activeSedeId', sId.toString());
      setViewMode('app');
      setMultiStudentAuthOptions([]);
      fetchDataForSede(sId);
      return;
    }

    try {
      setIsLoggingIn(true);
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, password: authPassword })
      });
      const data = await response.json();

      if (response.ok && data.success) {
        if (data.role === 'superadmin') {
          setRole('superadmin');
          localStorage.setItem('role', 'superadmin');
          setActiveSedeId(null);
          localStorage.removeItem('activeSedeId');
          setViewMode('app');
          fetchDataForSede(null);
        } else if (data.role === 'admin_sede' || data.role === 'admin') {
          setRole('admin');
          localStorage.setItem('role', 'admin');
          const sId = data.sedeId || 1;
          setActiveSedeId(sId);
          localStorage.setItem('activeSedeId', sId.toString());
          setViewMode('app');
          fetchDataForSede(sId);
        } else if (data.role === 'student') {
          const loggedStudent = data.student;
          
          // Si hay múltiples alumnos con el mismo correo, mostrar el modal
          const matchingStudents = students.filter(s => s.email && s.email.trim().toLowerCase() === authEmail.trim().toLowerCase());
          if (matchingStudents.length > 1) {
            setMultiStudentAuthOptions(matchingStudents);
          } else {
            setRole('student');
            localStorage.setItem('role', 'student');
            setCurrentUser(loggedStudent);
            localStorage.setItem('currentUser', JSON.stringify(loggedStudent));
            const sId = loggedStudent.sedeId || loggedStudent.sede_id || 1;
            setActiveSedeId(sId);
            localStorage.setItem('activeSedeId', sId.toString());
            setViewMode('app');
            fetchDataForSede(sId);
          }
        }
      } else {
        alert(data.error || 'Correo o contraseña incorrecta');
      }
    } catch (e) {
      console.error('Error logging in:', e);
      alert('Error de conexión al iniciar sesión');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRecoverPassword = async () => {
    if (!recoveryEmail.trim()) return;
    setRecoveryStatus('loading');
    setRecoveryMessage('');
    try {
      const res = await fetch(`${API_URL}/api/recover-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: recoveryEmail.trim() })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setRecoveryStatus('success');
        setRecoveryMessage(data.message || 'Si el correo está registrado, recibirás un email con tus datos de acceso.');
      } else {
        setRecoveryStatus('error');
        setRecoveryMessage(data.error || 'Error al procesar la solicitud.');
      }
    } catch (e) {
      setRecoveryStatus('error');
      setRecoveryMessage('Error de conexión. Verifica tu internet e intenta nuevamente.');
    }
  };

  const handleUpdateStudentPassword = async () => {
    if (!studentNewPassword || !currentUser) return;
    const updated = { ...currentUser, password: studentNewPassword };
    try {
      await fetch(`${API_URL}/api/students/${currentUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: studentNewPassword })
      });
      setCurrentUser(updated);
      setStudents(prev => prev.map(s => s.id === updated.id ? updated : s));
      setStudentNewPassword('');
      alert('✅ Contraseña actualizada exitosamente.');
    } catch (e) {
      console.error('Error updating password:', e);
      alert('❌ Error al actualizar la contraseña.');
    }
  };

  const handleAddStudent = async () => {
    if (!newStudentData.name || !newStudentData.email || !newStudentData.phone) {
      alert("Por favor completa los campos principales (Nombre, Correo, Teléfono).");
      return;
    }

    const finalSedeId = role === 'superadmin'
      ? (newStudentData.sedeId ? Number(newStudentData.sedeId) : (activeSedeId || null))
      : (activeSedeId || 1);

    if (!finalSedeId) {
      alert("Por favor selecciona una Sede para el nuevo alumno.");
      return;
    }

    const existingStudentSameEmail = students.find(s => s.email && s.email.trim().toLowerCase() === newStudentData.email.trim().toLowerCase());
    const generatedPassword = existingStudentSameEmail?.password || Math.random().toString(36).slice(-6).toUpperCase();
    
    let finalPlan = newStudentData.plan;
    let finalFee = newStudentData.monthlyFee;

    if (newStudentData.discountPercentage > 0 && newStudentData.discountCategory) {
        finalPlan = `${finalPlan} (Desc. ${newStudentData.discountPercentage}% - ${newStudentData.discountCategory})`;
        finalFee = Math.round(newStudentData.monthlyFee * (1 - newStudentData.discountPercentage / 100));
    }

    const newStudent = { 
      name: newStudentData.name, 
      email: newStudentData.email, 
      phone: newStudentData.phone, 
      birthDate: newStudentData.birthDate, 
      documentId: newStudentData.documentId, 
      belt: newStudentData.belt, 
      plan: finalPlan, 
      monthlyFee: finalFee, 
      classesAttended: 0, 
      classesToNextBelt: 40, 
      isPaid: false, 
      history: [], 
      lastPaymentMonth: '', 
      password: generatedPassword,
      sedeId: finalSedeId
    };

    try {
      const response = await fetch(`${API_URL}/api/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent)
      });
      if (response.ok) {
        const savedStudent = await response.json();
        setStudents([...students, savedStudent]);
        setNewStudentData({ name: '', email: '', phone: '', birthDate: '', documentId: '', belt: 'WHITE' as Belt, plan: '3', monthlyFee: 40000, discountCategory: '', discountPercentage: 0, sedeId: '' });
        setIsAddingStudent(false);
        if (existingStudentSameEmail) {
          alert(`✅ Familiar registrado con éxito.\nSe asignó automáticamente la misma clave de acceso para vincular las cuentas.`);
        } else {
          alert(`✅ Alumno registrado con éxito.\n\nClave provisional: ${generatedPassword}`);
        }
      } else {
        const errData = await response.json().catch(() => ({}));
        alert(`❌ Error al registrar alumno: ${errData.error || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error("Error adding student:", error);
      alert("❌ Error de conexión al registrar alumno.");
    }
  };

  const handleSendMassNotice = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/broadcast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noticeData)
      });
      if (response.ok) {
        alert('✅ Mensaje enviado exitosamente. Los alumnos lo verán al entrar al portal.');
        setIsSendingNotice(false);
      } else {
        alert('❌ Error al enviar el mensaje.');
      }
    } catch (e) {
      console.error("Error broadcast:", e);
      alert('❌ Error de conexión.');
    }
  };

  const handleSendPaymentReminder = async (student: Student) => {
    try {
      const response = await fetch(`${API_URL}/api/students/${student.id}/send-payment-reminder`, {
        method: 'POST',
      });
      if (response.ok) {
        alert(`✅ Recordatorio de cobra enviado a ${student.name}`);
      } else {
        alert('❌ Error al enviar el recordatorio');
      }
    } catch (error) {
      console.error("Error sending payment reminder:", error);
      alert('❌ Error de red al intentar enviar');
    }
  };

  const handleSendBirthdayGreetings = async () => {
    try {
      setIsSendingBirthdays(true);
      const queryParams = activeSedeId ? `?sedeId=${activeSedeId}` : '';
      const res = await fetch(`${API_URL}/api/admin/check-birthdays${queryParams}`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert(`🎂 ¡Operación exitosa!\n\n${data.message}`);
      } else {
        alert('❌ Hubo un problema al procesar los saludos.');
      }
    } catch (e) {
      console.error("Error sending birthdays:", e);
      alert('❌ Error de conexión con el servidor.');
    } finally {
      setIsSendingBirthdays(false);
    }
  };

  const handleGeneratePasswordsForAll = async () => {
    if (!confirm("¿Deseas generar contraseñas automáticas para TODOS los alumnos que aún no tienen una clave?")) return;
    try {
      const queryParams = activeSedeId ? `?sedeId=${activeSedeId}` : '';
      const response = await fetch(`${API_URL}/api/admin/generate-passwords${queryParams}`, { method: 'POST' });
      const result = await response.json();
      if (result.success) {
        alert(`✅ Se generaron claves para ${result.count} alumnos correctamente en el servidor.`);
        // Recargar datos para ver las claves reflejadas
        window.location.reload(); 
      }
    } catch (e) {
      alert("Error al generar las claves.");
    }
  };

  const handleSendCredentialsByEmail = async (group: 'ALL' | 'KIDS' | 'ADULTS') => {
    if (!confirm(`¿Deseas enviar un correo de bienvenida y credenciales a todo el grupo ${group === 'ALL' ? 'TODOS' : group}?`)) return;
    try {
      const queryParams = activeSedeId ? `?sedeId=${activeSedeId}` : '';
      const response = await fetch(`${API_URL}/api/admin/send-credentials${queryParams}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ageGroup: group })
      });
      const result = await response.json();
      if (result.success) {
        alert(`✅ Emails enviados: ${result.message}`);
      } else {
        alert("Error: " + result.error);
      }
    } catch (e) {
      alert("Error al enviar correos.");
    }
  };


  const handleAddVideo = async () => {
    try {
      let videoThumbnail = 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800'; 
      
      const videoId = getYouTubeID(newVideoData.url);
      if (videoId) {
           videoThumbnail = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
      }

      const payload = { ...newVideoData, thumbnail: videoThumbnail };

      const queryParams = activeSedeId ? `?sedeId=${activeSedeId}` : '';
      const response = await fetch(`${API_URL}/api/videos${queryParams}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        const savedVideo = await response.json();
        setVideos([...videos, savedVideo]);
        setIsAddingVideo(false);
        setNewVideoData({ title: '', description: '', url: '', thumbnail: '', targetAudience: 'BOTH', category: VIDEO_CATEGORIES[0] });
      }
    } catch (error) {
      console.error("Error adding video:", error);
    }
  };

  // ── Splash Screen gate ──────────────────────────────────────────────────────
  const eventSlug = typeof window !== 'undefined'
    ? window.location.pathname.match(new RegExp(`^${appPath('/evento')}/([^/]+)`))?.[1]
    : null;
  if (eventSlug) {
    return <EventPublic slug={decodeURIComponent(eventSlug)} apiUrl={API_URL} />;
  }

  if (isSplashVisible) {
    return (
      <AnimatePresence>
        <SplashScreen onFinish={() => setIsSplashVisible(false)} />
      </AnimatePresence>
    );
  }
  // ────────────────────────────────────────────────────────────────────────────

  if (viewMode === 'landing') {
    return <ProductLanding onEnter={() => setViewMode('auth')} apiUrl={API_URL} />;
  }

  // --- RENDERING AUTH PAGE ---
  if (viewMode === 'auth') {
    return (
      <motion.div
        key="auth"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: window.innerWidth < 1024 ? 'column' : 'row', position: 'relative', overflowX: 'hidden', background: '#000' }}>
        {/* Decorative Background for Mobile */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.4 }}>
          <div style={{ position: 'absolute', top: '20%', left: '10%', width: '300px', height: '300px', background: 'var(--logo-green)', filter: 'blur(100px)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: '20%', right: '10%', width: '300px', height: '300px', background: 'var(--logo-green)', filter: 'blur(100px)', borderRadius: '50%', opacity: 0.5 }} />
        </div>

        {/* Left Side: Branding (Hidden on small mobile if needed, but here we stack) */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }} 
          animate={{ opacity: 1, x: 0 }}
          style={{ 
            width: window.innerWidth < 1024 ? '100%' : '45%', 
            padding: window.innerWidth < 1024 ? '3rem 2rem 1rem' : '6rem 8rem', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: window.innerWidth < 1024 ? 'center' : 'center',
            alignItems: window.innerWidth < 1024 ? 'center' : 'flex-start',
            position: 'relative',
            zIndex: 1,
            color: '#fff',
            background: 'linear-gradient(135deg, #000, #0a0a0a)'
          }}
        >
          <div style={{ position: 'relative', display: 'inline-flex', marginBottom: window.innerWidth < 1024 ? '0' : '2.5rem' }}>
            <img src={BRAND.logoMark} alt="DP Sistemas" style={{ width: window.innerWidth < 1024 ? '132px' : '112px', height: window.innerWidth < 1024 ? '124px' : '106px', objectFit: 'contain', display: 'block' }} />
          </div>
          <div className="desktop-only" style={{ width: '100%', textAlign: 'inherit', display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: 'var(--logo-green)', fontWeight: 900, letterSpacing: '0.4em', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '1.5rem', display: 'block', marginTop: '2.5rem' }}>DP Sistemas y Automatizaciones</span>
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', color: '#fff', marginBottom: '2rem', lineHeight: 1, letterSpacing: '-2px' }}>
              Entra a la<br />
              <span style={{ color: 'var(--logo-green)' }}>demo.</span>
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.6)', maxWidth: '400px', lineHeight: 1.6, fontWeight: 500 }}>
              Acceso habilitado por 24 horas a un correo específico, después de la reunión.
            </p>
          </div>
        </motion.div>

        {/* Right Side: Traditional Login Form */}
        <div style={{ width: window.innerWidth < 1024 ? '100%' : '55%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: window.innerWidth < 1024 ? '1rem' : '2rem', position: 'relative', zIndex: 1 }}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass"
            style={{ 
              width: '100%', 
              maxWidth: '450px', 
              padding: window.innerWidth < 768 ? '2.5rem' : '4rem', 
              borderRadius: '3rem', 
              background: 'rgba(255,255,255,0.03)', 
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(40px)',
              boxShadow: '0 50px 100px rgba(0,0,0,0.5)'
            }}
          >
            <div style={{ marginBottom: window.innerWidth < 1024 ? '1.5rem' : '3rem' }}>
              <button 
                onClick={() => setViewMode('landing')}
                className="desktop-only"
                style={{ background: 'none', border: 'none', color: 'var(--logo-green)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '0.85rem', marginBottom: '1.5rem', padding: 0 }}
              >
                <ChevronLeft size={16} /> Volver al inicio
              </button>
              <h2 style={{ fontSize: window.innerWidth < 1024 ? '1.8rem' : '2.5rem', color: '#fff', letterSpacing: '-1px', marginBottom: '0.2rem' }}>Acceso</h2>
              <p className="desktop-only" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem', fontWeight: 500 }}>Ingresa tus credenciales para continuar</p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Correo Electrónico</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--logo-green)' }} />
                  <input 
                    type="email" 
                    placeholder="nombre@ejemplo.com" 
                    value={authEmail}
                    onChange={e => setAuthEmail(e.target.value)}
                    required
                    style={{ 
                      width: '100%', 
                      padding: '1.2rem 1.2rem 1.2rem 3.5rem', 
                      background: 'rgba(255,255,255,0.05)', 
                      border: '1px solid rgba(255,255,255,0.1)', 
                      borderRadius: '1.2rem', 
                      color: '#fff', 
                      fontSize: '1rem', 
                      outline: 'none',
                      transition: 'border-color 0.3s'
                    }} 
                    onFocus={(e) => e.target.style.borderColor = 'var(--logo-green)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Contraseña</label>
                  <button type="button" onClick={() => { setRecoveryEmail(authEmail); setRecoveryStatus('idle'); setRecoveryMessage(''); setShowRecoveryModal(true); }} style={{ background: 'none', border: 'none', color: 'var(--logo-green)', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', padding: 0 }}>¿Olvidaste tu contraseña?</button>
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--logo-green)' }} />
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={authPassword}
                    onChange={e => setAuthPassword(e.target.value)}
                    required
                    style={{ 
                      width: '100%', 
                      padding: '1.2rem 1.2rem 1.2rem 3.5rem', 
                      background: 'rgba(255,255,255,0.05)', 
                      border: '1px solid rgba(255,255,255,0.1)', 
                      borderRadius: '1.2rem', 
                      color: '#fff', 
                      fontSize: '1rem', 
                      outline: 'none',
                      letterSpacing: '0.1em'
                    }} 
                    onFocus={(e) => e.target.style.borderColor = 'var(--logo-green)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginTop: '0.5rem' }}>
                <input type="checkbox" id="remember" style={{ accentColor: 'var(--logo-green)' }} />
                <label htmlFor="remember" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer' }}>Recordarme en este equipo</label>
              </div>

              <button 
                type="submit"
                className="btn-primary"
                disabled={isLoggingIn}
                style={{ 
                  marginTop: '1.5rem', 
                  padding: '1.5rem', 
                  justifyContent: 'center', 
                  background: 'var(--logo-green)', 
                  width: '100%', 
                  fontSize: '1rem',
                  borderRadius: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.8rem',
                  cursor: isLoggingIn ? 'wait' : 'pointer'
                }}
              >
                {isLoggingIn ? (
                  <><span className="premium-spinner" style={{ width: '18px', height: '18px', borderTopColor: '#fff', borderRightColor: 'rgba(255,255,255,0.6)' }} /> Iniciando...</>
                ) : (
                  'Iniciar Sesión'
                )}
              </button>
            </form>

            <div style={{ marginTop: '2.5rem', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
                ¿Aún no eres parte de la manada? <br />
                <a href="#contact" onClick={() => setViewMode('landing')} style={{ color: 'var(--logo-green)', fontWeight: 800, textDecoration: 'none' }}>Únete hoy mismo</a>
              </p>
            </div>
            
            {/* Multi-Student Selection Modal */}
            <AnimatePresence>
              {multiStudentAuthOptions.length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(15px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}
                >
                  <motion.div initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }}
                    style={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '2.5rem', padding: '3rem 2.5rem', width: '100%', maxWidth: '420px', color: '#fff', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
                  >
                    <h3 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '0.8rem', textAlign: 'center', color: '#fff' }}>¿Quién va a entrenar?</h3>
                    <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', fontSize: '0.9rem', marginBottom: '2.5rem' }}>Hemos detectado varias cuentas con este correo.</p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                      {multiStudentAuthOptions.map(opt => (
                        <button key={opt.id} onClick={() => handleLogin(opt)}
                          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--logo-green)', borderRadius: '1.2rem', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.2rem', cursor: 'pointer', textAlign: 'left', color: '#fff', transition: 'all 0.3s' }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(5, 168, 106, 0.1)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                        >
                          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--logo-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.2rem', border: '2px solid #fff', boxShadow: '0 0 20px rgba(22,196,122,0.3)' }}>
                            {opt.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 900, fontSize: '1.1rem', color: '#fff', marginBottom: '2px' }}>{opt.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>{beltLabels[opt.belt || 'WHITE']} · {opt.plan?.toString().includes('ilimi') ? 'Plan Ilimitado' : `${opt.plan?.[0] || 2} Clases`}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                    
                    <button onClick={() => setMultiStudentAuthOptions([])} style={{ width: '100%', padding: '1rem', background: 'transparent', border: 'none', color: '#ef4444', fontWeight: 800, marginTop: '1.5rem', cursor: 'pointer' }}>
                      Cancelar
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Password Recovery Modal */}
            <AnimatePresence>
              {showRecoveryModal && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(15px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}
                  onClick={(e) => e.target === e.currentTarget && setShowRecoveryModal(false)}
                >
                  <motion.div initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 50 }}
                    style={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '2.5rem', padding: '3rem 2.5rem', width: '100%', maxWidth: '420px', color: '#fff', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
                  >
                    {recoveryStatus === 'success' ? (
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ width: '70px', height: '70px', background: 'rgba(5,168,106,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', border: '2px solid var(--logo-green)' }}>
                          <Mail size={30} style={{ color: 'var(--logo-green)' }} />
                        </div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '1rem', color: '#fff' }}>¡Correo enviado!</h3>
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '2rem' }}>{recoveryMessage}</p>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginBottom: '2rem' }}>Revisa tu bandeja de entrada y también la carpeta de spam.</p>
                        <button onClick={() => setShowRecoveryModal(false)}
                          style={{ width: '100%', padding: '1.2rem', background: 'var(--logo-green)', border: 'none', borderRadius: '1.2rem', color: '#fff', fontWeight: 900, fontSize: '1rem', cursor: 'pointer' }}
                        >Volver al Login</button>
                      </div>
                    ) : (
                      <>
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                          <div style={{ width: '60px', height: '60px', background: 'rgba(5,168,106,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                            <Lock size={24} style={{ color: 'var(--logo-green)' }} />
                          </div>
                          <h3 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '0.5rem', color: '#fff' }}>Recuperar Contraseña</h3>
                          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', lineHeight: 1.5 }}>Ingresa tu correo electrónico y te enviaremos tus datos de acceso.</p>
                        </div>

                        {recoveryStatus === 'error' && (
                          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', padding: '1rem', borderRadius: '1rem', marginBottom: '1.5rem' }}>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#ef4444', fontWeight: 600 }}>❌ {recoveryMessage}</p>
                          </div>
                        )}

                        <div style={{ marginBottom: '1.5rem' }}>
                          <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.6rem' }}>Correo Electrónico</label>
                          <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--logo-green)' }} />
                            <input
                              type="email"
                              placeholder="nombre@ejemplo.com"
                              value={recoveryEmail}
                              onChange={e => setRecoveryEmail(e.target.value)}
                              onKeyDown={e => e.key === 'Enter' && handleRecoverPassword()}
                              autoFocus
                              style={{ width: '100%', padding: '1.2rem 1.2rem 1.2rem 3.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '1.2rem', color: '#fff', fontSize: '1rem', outline: 'none' }}
                              onFocus={(e) => e.target.style.borderColor = 'var(--logo-green)'}
                              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
                            />
                          </div>
                        </div>

                        <button
                          onClick={handleRecoverPassword}
                          disabled={recoveryStatus === 'loading' || !recoveryEmail.trim()}
                          style={{ width: '100%', padding: '1.3rem', background: recoveryStatus === 'loading' ? 'rgba(5,168,106,0.5)' : 'var(--logo-green)', border: 'none', borderRadius: '1.2rem', color: '#fff', fontWeight: 900, fontSize: '1rem', cursor: recoveryStatus === 'loading' ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', transition: 'all 0.3s' }}
                        >
                          {recoveryStatus === 'loading' ? (
                            <><span className="premium-spinner" style={{ width: '16px', height: '16px', borderTopColor: '#fff', borderRightColor: 'rgba(255,255,255,0.6)' }} /> Enviando...</>
                          ) : (
                            <><Mail size={18} /> Enviar Credenciales</>
                          )}
                        </button>

                        <button onClick={() => setShowRecoveryModal(false)}
                          style={{ width: '100%', padding: '1rem', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', fontWeight: 800, marginTop: '1rem', cursor: 'pointer', fontSize: '0.9rem' }}
                        >Cancelar</button>
                      </>
                    )}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    );
  }




  if (viewMode === 'app' && role === 'student' && currentUser) {
    return (
      <motion.div
        key="app-student"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        style={{ background: 'var(--panel-bg)', minHeight: '100vh', color: 'var(--panel-text)', overflowX: 'hidden' }}>
        {/* Waiver / Terms Modal Check */}
        {currentUser && !currentUser.terms_accepted && (
          <AcceptTermsModal student={currentUser} onAccept={async () => {
             const updated = { ...currentUser, terms_accepted: true };
             setCurrentUser(updated);
             localStorage.setItem('currentUser', JSON.stringify(updated));
             setStudents(prev => prev.map(s => String(s.id) === String(updated.id) ? updated : s));
             try {
               await fetch(`${API_URL}/api/students/${currentUser.id}/accept-terms`, { method: 'POST' });
             } catch(e) { console.error("Sync error:", e); }
          }} />
        )}

        {/* BG Orbs */}
        <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(5,168,106,0.12) 0%, transparent 70%)', filter: 'blur(80px)', opacity: 'var(--panel-orb-opacity)' }} />
          <div style={{ position: 'absolute', bottom: '10%', left: '-5%', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(5,168,106,0.08) 0%, transparent 70%)', filter: 'blur(60px)', opacity: 'var(--panel-orb-opacity)' }} />
        </div>
        <div style={{ maxWidth: '480px', margin: '0 auto', padding: '2rem 1.5rem 8rem', position: 'relative', zIndex: 1 }}>

          {/* Header */}
          <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                type="button"
                className="dp-avatar-btn"
                style={{ width: '52px', height: '52px' }}
                onClick={() => {
                  setPhotoLightboxStudent(currentUser);
                }}
                aria-label="Ver foto de perfil"
              >
                <img src={studentPhoto(currentUser)} alt="" />
              </button>
              <div>
                <div style={{ fontSize: '0.6rem', fontWeight: 900, color: 'var(--logo-green)', letterSpacing: '0.3em', textTransform: 'uppercase' }}>Bienvenido</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.5px', marginBottom: '4px' }}>{currentUser?.name?.split(' ')[0]}</div>
                <div className={`belt-badge belt-${currentUser?.belt || 'WHITE'}`} style={{ fontSize: '0.55rem', padding: '0.2rem 0.5rem', display: 'inline-block' }}>{beltLabels[currentUser?.belt || 'WHITE']}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <motion.button whileTap={{ scale: 0.88 }} onClick={handleLogout} style={{ width: '40px', height: '40px', borderRadius: '11px', background: 'var(--panel-card)', border: '1px solid var(--panel-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--panel-muted)' }}>
                <LogOut size={17} />
              </motion.button>
            </div>
          </motion.header>

          {/* Main Views */}
          <AnimatePresence>
            {activeTab === 'dashboard' && (
              <motion.div key="dashboard" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                {noticeData.subject && !isNoticeDismissed && (
                  <motion.div 
                    initial={{ opacity: 0, y: -15, scale: 0.98 }} 
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    style={{ 
                      background: 'linear-gradient(135deg, rgba(0,105,112,0.1) 0%, rgba(26,163,171,0.14) 100%)', 
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      border: '1.5px solid rgba(0,105,112,0.28)', 
                      boxShadow: '0 12px 28px -8px rgba(0,105,112,0.18)',
                      padding: '1.1rem 1.4rem', 
                      borderRadius: '1.4rem', 
                      marginBottom: '1.8rem', 
                      position: 'relative', 
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem'
                    }}
                  >
                    {/* Glowing ambient background */}
                    <div style={{ position: 'absolute', top: '-40px', left: '-20px', width: '120px', height: '120px', background: '#006970', filter: 'blur(45px)', opacity: 0.18, pointerEvents: 'none' }} />

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: 1, minWidth: 0, position: 'relative', zIndex: 1 }}>
                      <div style={{ 
                        background: 'linear-gradient(135deg, #006970, #1aa3ab)', 
                        padding: '0.7rem', 
                        borderRadius: '14px', 
                        color: '#fff',
                        boxShadow: '0 4px 14px rgba(0,105,112,0.35)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Bell size={20} fill="#fff" />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.15rem' }}>
                          <span style={{ fontSize: '0.65rem', fontWeight: 900, color: '#006970', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            Aviso de la academia
                          </span>
                        </div>
                        <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 900, color: 'var(--text-main)', lineHeight: 1.3 }}>
                          {noticeData.subject}
                        </h4>
                        <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.45, wordBreak: 'break-word' }}>
                          {(noticeData.message ?? '').split(/(\*\*.*?\*\*)/g).map((part: string, index: number) => 
                            part.startsWith('**') && part.endsWith('**') ? 
                              <strong key={index} style={{ color: '#006970', fontWeight: 800 }}>{part.slice(2, -2)}</strong> : 
                              part
                          )}
                        </p>
                      </div>
                    </div>

                    <button 
                      onClick={() => setIsNoticeDismissed(true)}
                      title="Cerrar aviso"
                      style={{ 
                        background: 'rgba(255,255,255,0.08)', 
                        border: '1px solid rgba(255,255,255,0.15)', 
                        color: 'var(--text-main)', 
                        padding: '7px', 
                        borderRadius: '50%', 
                        cursor: 'pointer', 
                        zIndex: 10, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <X size={16} />
                    </button>
                  </motion.div>
                )}
                {(() => {
                  const rawAge = calculateAge(currentUser?.birthDate || null);
                  const isAdult = typeof rawAge === 'number' ? (rawAge === 0 ? true : rawAge >= 18) : true;
                  const familyMembers = students.filter(s => s.email && currentUser?.email && s.email.trim().toLowerCase() === currentUser.email.trim().toLowerCase());
                  const familyUnpaid = familyMembers.filter(s => !s.isPaid);
                  const shouldShowIndividualPayment = isAdult || familyMembers.length <= 1;

                  return (
                    <>
                      {isAdult && familyUnpaid.length > 1 && (
                        <motion.div 
                          whileTap={{ scale: 0.98 }}
                          onClick={() => openPaymentModal(familyUnpaid)}
                          style={{ background: 'var(--panel-card)', border: '2px solid var(--logo-green)', borderRadius: '1.2rem', padding: '1.5rem', marginBottom: '1.2rem', textAlign: 'center', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '0.5rem', boxShadow: '0 10px 30px rgba(5,168,106,0.15)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', color: 'var(--logo-green)', fontWeight: 900, fontSize: '1.1rem' }}>
                            <Users size={24} /> PAGO FAMILIAR PENDIENTE
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--panel-muted)' }}>
                            Tienes {familyUnpaid.length} mensualidades pendientes en tu grupo familiar.
                          </div>
                          <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--panel-text)' }}>
                            Total: {formatCLP(familyUnpaid.reduce((acc, s) => acc + (s.monthlyFee || 40000), 0))}
                          </div>
                          <div style={{ fontSize: '0.65rem', color: 'var(--logo-green)', fontWeight: 800, textTransform: 'uppercase', marginTop: '0.5rem', letterSpacing: '0.1em' }}>Toca aquí para pagar todo junto</div>
                        </motion.div>
                      )}
                      
                      {isAdult && familyMembers.length > 1 && (
                        <motion.section initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.05 }}
                          style={{ marginBottom: '1.2rem', padding: '1.2rem', background: 'var(--panel-card)', border: '1px solid var(--panel-border)', borderRadius: '1.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem', paddingBottom: '0.8rem', borderBottom: '1px solid var(--panel-border-light)' }}>
                            <div style={{ width: '40px', height: '40px', background: 'var(--panel-green-bg)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--logo-green)' }}>
                              <Users size={20} />
                            </div>
                            <div>
                              <h4 style={{ fontSize: '0.9rem', fontWeight: 900, color: 'var(--panel-text)' }}>Gestión Familiar</h4>
                              <p style={{ fontSize: '0.7rem', color: 'var(--panel-muted)' }}>Tienes {familyMembers.length} alumnos bajo tu cargo.</p>
                            </div>
                          </div>
                          
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            {familyMembers.map(member => (
                              <div key={member.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.8rem 1rem', background: member.isPaid ? 'var(--panel-surface)' : 'rgba(239,68,68,0.03)', borderRadius: '1rem', border: `1px solid ${member.isPaid ? 'var(--panel-border-light)' : 'rgba(239,68,68,0.1)'}` }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: member.isPaid ? 'var(--logo-green)' : '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.75rem', fontWeight: 900 }}>
                                    {member.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--panel-text)' }}>{member.name}</div>
                                    <div style={{ fontSize: '0.65rem', color: 'var(--panel-muted)' }}>{formatCLP(member.monthlyFee || 40000)} / mes</div>
                                  </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                  <div style={{ fontSize: '0.65rem', fontWeight: 900, color: member.isPaid ? 'var(--logo-green)' : '#ef4444' }}>
                                    {member.isPaid ? 'PAGADO' : 'PENDIENTE'}
                                  </div>
                                  <div style={{ fontSize: '0.55rem', color: 'var(--panel-muted)', fontWeight: 600 }}>{new Date().toLocaleDateString('es-CL', { month: 'long', year: 'numeric', timeZone: 'America/Santiago' }).replace(/^./, c => c.toUpperCase())}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.section>
                      )}

                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        style={{ display: 'grid', gridTemplateColumns: shouldShowIndividualPayment ? '1fr 1fr' : '1fr', gap: '0.9rem', marginBottom: '1.2rem' }}>
                        
                        {shouldShowIndividualPayment && (
                          <motion.div 
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              if (currentUser?.isPaid) return;
                              openPaymentModal(currentUser!);
                            }}
                            style={{ 
                              background: currentUser?.isPaid ? 'var(--panel-green-bg)' : 'var(--panel-red-bg)', 
                              border: `1px solid ${currentUser?.isPaid ? 'var(--panel-green-border)' : 'var(--panel-red-border)'}`, 
                              borderRadius: '1.1rem', 
                              padding: '1.3rem', 
                              textAlign: 'center',
                              cursor: currentUser?.isPaid ? 'default' : 'pointer',
                              position: 'relative'
                            }}>
                            <CreditCard size={22} style={{ color: currentUser?.isPaid ? 'var(--logo-green)' : '#ef4444', marginBottom: '0.6rem' }} />
                            <div style={{ fontSize: '0.6rem', color: 'var(--panel-muted)', fontWeight: 800, letterSpacing: '0.1em', marginBottom: '0.2rem' }}>MENSUALIDAD {new Date().toLocaleDateString('es-CL', { month: 'long' }).toUpperCase()}</div>
                            <div style={{ fontWeight: 900, color: currentUser?.isPaid ? 'var(--logo-green)' : '#ef4444', fontSize: '0.85rem' }}>{currentUser?.isPaid ? 'Al día' : 'Pendiente'}</div>
                            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--panel-text)', marginTop: '4px' }}>{formatCLP(currentUser?.monthlyFee || 0)}</div>
                            <div style={{ fontSize: '0.58rem', fontWeight: 700, color: 'var(--panel-muted)', marginTop: '4px' }}>
                              {planLabel(currentUser?.plan)}{planWeeklyMax(currentUser?.plan) < 99 ? ` · ${planWeeklyMax(currentUser?.plan)} por semana` : ''}
                            </div>
                            {!currentUser?.isPaid && <div style={{ fontSize: '0.55rem', color: '#ef4444', fontWeight: 800, marginTop: '4px' }}>PAGAR MENSUALIDAD</div>}
                          </motion.div>
                        )}
                  <div style={{ background: 'var(--panel-purple-bg)', border: '1px solid var(--panel-purple-border)', borderRadius: '1.1rem', padding: '1.3rem', textAlign: 'center' }}>
                    <Calendar size={22} style={{ color: '#a78bfa', marginBottom: '0.6rem' }} />
                    <div style={{ fontSize: '0.6rem', color: 'var(--panel-muted)', fontWeight: 800, letterSpacing: '0.1em', marginBottom: '0.4rem' }}>CLASES RESERVADAS</div>
                    {(() => {
                      const cWeekStart = getWeekStart(new Date());
                      const booked = (currentUser?.scheduledClasses || []).filter(c => c.timestamp >= cWeekStart);
                      const planBooked = booked.filter(c => !isOpenMat(c.name));
                      const planMax = planWeeklyMax(currentUser?.plan);

                      if (planBooked.length >= planMax && planMax < 99) {
                        return <div style={{ fontWeight: 900, fontSize: '0.8rem', color: '#b91c1c' }}>Límite semanal alcanzado<br /><span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--panel-muted)' }}>{planBooked.length} de {planMax} · Open Mat sigue libre</span></div>;
                      }
                      if (booked.length > 0) {
                        return <div style={{ fontWeight: 900, fontSize: '0.95rem' }}>{planBooked.length} de {planMax} <span style={{ fontSize: '0.7rem', color: 'var(--panel-muted)' }}>esta semana</span></div>;
                      } else {
                        return <div style={{ fontWeight: 800, fontSize: '0.65rem', color: 'var(--panel-muted)', lineHeight: 1.4 }}>Selecciona en tu horario<br /><span style={{ color: 'var(--logo-green)' }}>un día esta semana 👇</span></div>;
                      }
                    })()}
                  </div>
                </motion.div>
                    </>
                  );
                })()}
                {/* Weekly Schedule Subsystem */}
                 <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                   style={{ marginBottom: '1.5rem' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                     <h3 style={{ fontWeight: 900, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={18} style={{ color: 'var(--logo-green)' }} /> Horario de Clases</h3>
                     <div style={{ fontSize: '0.7rem', color: 'var(--panel-muted)', fontWeight: 700 }}>Esta Semana</div>
                   </div>

                   <div style={{ display: 'flex', overflowX: 'auto', gap: '0.8rem', paddingBottom: '1rem', margin: '0 -1.5rem', padding: '0 1.5rem', WebkitOverflowScrolling: 'touch' }} className="no-scrollbar">
                     {(groupByDay(
                       classSlots.filter((s) => {
                         const sede = Number(currentUser?.sedeId || currentUser?.sede_id);
                         return !sede || Number(s.sedeId) === sede;
                       }),
                       calculateAge(currentUser?.birthDate || null) < 18 ? 'KIDS' : 'ADULTS'
                     )).map((dayItem: any, idx: number) => (
                       <div key={idx} style={{ flexShrink: 0, width: '168px', background: 'var(--panel-card)', border: '1px solid var(--panel-border)', borderRadius: '1.2rem', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                         <div style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--logo-green)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{dayItem.day}</div>
                         <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                           {dayItem.classes.map((cls: any, cIdx: number) => {
                             const cWeekStart = getWeekStart(new Date());
                             const isBooked = (currentUser?.scheduledClasses || []).some((sc: any) => sc.timestamp >= cWeekStart && sc.day === dayItem.day && sc.time === cls.time);
                             const enrolled = students.filter((st) => (st.scheduledClasses || []).some((sc) => sc.timestamp >= cWeekStart && sc.day === dayItem.day && sc.time === cls.time)).length;
                             const cap = cls.capacity as number | null;
                             const isFull = !!(cap && cap > 0 && enrolled >= cap);
                             const openMat = isOpenMat(cls.name);
                             const planMax = planWeeklyMax(currentUser?.plan);
                             const planUsed = (currentUser?.scheduledClasses || []).filter((sc) => sc.timestamp >= cWeekStart && !isOpenMat(sc.name)).length;
                             const planLocked = !isBooked && !openMat && planUsed >= planMax && planMax < 99;
                             const remaining = cap && cap > 0 ? Math.max(0, cap - enrolled) : null;
                             const blocked = !isBooked && (isFull || planLocked);

                             return (
                               <motion.button key={cIdx} whileTap={{ scale: blocked ? 1 : 0.95 }}
                                 onClick={() => handleBookClass(dayItem.day, cls.time, cls.name)}
                                 style={{
                                   background: isBooked ? 'var(--logo-green)' : isFull ? 'rgba(239,68,68,0.08)' : 'var(--panel-surface)',
                                   borderRadius: '0.8rem', padding: '0.8rem', border: isFull && !isBooked ? '1px solid rgba(239,68,68,0.25)' : 'none',
                                   cursor: blocked ? 'not-allowed' : 'pointer', textAlign: 'left', width: '100%', opacity: planLocked ? 0.7 : 1
                                 }}>
                                 <div style={{ fontSize: '0.95rem', fontWeight: 900, color: isBooked ? '#000' : 'var(--panel-text)', marginBottom: '2px' }}>{cls.time}{cls.endTime ? `–${cls.endTime}` : ''}</div>
                                 <div style={{ fontSize: '0.6rem', fontWeight: 700, color: isBooked ? 'rgba(0,0,0,0.6)' : 'var(--panel-muted)', textTransform: 'uppercase' }}>{cls.name}</div>
                                 <div style={{ fontSize: '0.58rem', fontWeight: 800, marginTop: '0.35rem', color: isBooked ? 'rgba(0,0,0,0.55)' : isFull ? '#b91c1c' : planLocked ? '#b91c1c' : 'var(--logo-green)' }}>
                                   {isBooked ? 'Reservada' : isFull ? `Clase completa · ${enrolled}/${cap}` : planLocked ? 'Límite semanal' : openMat || remaining == null ? 'Sin límite de cupos' : `${remaining} cupos disponibles`}
                                 </div>
                               </motion.button>
                             );
                           })}
                         </div>
                       </div>
                     ))}
                   </div>
                 </motion.section>

                  {/* Graduaciones */}
                  {(() => {
                    const me = withProgress(currentUser);
                    const hist = me.progress?.history || [];
                    return (
                    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                      style={{ marginBottom: '1.5rem' }}>
                      <div style={{ padding: '1.5rem', background: 'var(--panel-card)', borderRadius: '1.2rem', border: '1px solid var(--panel-border)' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--logo-green)', letterSpacing: '0.1em', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Tu grado</div>
                        <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--panel-text)', marginBottom: '0.25rem' }}>{currentRankLabel(me.belt, me.progress?.stripes || 0)}</div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--panel-muted)', marginBottom: '1.1rem' }}>
                          {me.joinDate ? `Ingreso ${formatDate(me.joinDate, 'short')}` : 'Sin fecha de ingreso'}
                          {me.progress?.evaluationDate ? ` · Evaluación ${formatShortDate(me.progress.evaluationDate)}` : ''}
                        </div>
                        <BeltPath student={me} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', marginTop: '1.15rem' }}>
                          {hist.map((ev, i) => (
                            <div key={ev.id || i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.7rem 0.9rem', background: 'var(--panel-surface)', borderRadius: '0.8rem', border: '1px solid var(--panel-border)' }}>
                              <div>
                                <div style={{ fontWeight: 800, fontSize: '0.88rem' }}>{ev.label}</div>
                                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--panel-muted)' }}>{formatDate(ev.date, 'short')}</div>
                              </div>
                              <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--logo-green)', color: '#fff', display: 'grid', placeItems: 'center', fontSize: '0.7rem', fontWeight: 900 }}>✓</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.section>
                    );
                  })()}

                <OpenEventsCard apiUrl={API_URL} />

                <StudentLibrary
                  apiUrl={API_URL}
                  student={currentUser}
                  videos={videos}
                  onOpen={(video) => {
                    if ((video.format || 'video') === 'document') {
                      const href = video.url.startsWith('http') ? video.url : `${API_URL}${video.url}`;
                      window.open(href, '_blank');
                      return;
                    }
                    setPlayingVideo(video);
                  }}
                />
              </motion.div>
            )}



            {
              activeTab === 'settings' && (
                <motion.div key="settings" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                  <div style={{ padding: '2rem', background: 'var(--panel-card)', borderRadius: '1.5rem', border: '1px solid var(--panel-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                      <Settings size={28} style={{ color: 'var(--logo-green)' }} />
                      <h3 style={{ fontWeight: 900, fontSize: '1.4rem' }}>Mi Perfil</h3>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem', padding: '1rem' }}>
                      <button
                        type="button"
                        className="dp-avatar-btn"
                        style={{ width: '88px', height: '88px', border: '3px solid var(--logo-green)' }}
                        onClick={() => {
                          setPhotoLightboxStudent(currentUser);
                        }}
                        aria-label="Ver foto de perfil"
                      >
                        <img src={studentPhoto(currentUser)} alt="" onError={(e) => { e.currentTarget.src = BRAND.mascotAvatar; }} />
                      </button>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--panel-muted)', letterSpacing: '0.1em' }}>TU FOTO DE PERFIL</div>
                        <motion.button 
                          whileHover={{ scale: 1.05 }} 
                          whileTap={{ scale: 0.95 }}
                          onClick={handleUploadAvatar}
                          style={{ background: 'var(--logo-green)', border: 'none', borderRadius: '0.5rem', padding: '0.4rem 0.8rem', color: '#fff', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', alignSelf: 'flex-start' }}
                        >
                          Subir Foto
                        </motion.button>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '2.5rem', padding: '1.5rem', background: 'var(--panel-surface)', borderRadius: '1.2rem', border: '1px solid var(--panel-border)' }}>
                      <div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--panel-muted)', letterSpacing: '0.1em', marginBottom: '0.3rem' }}>NOMBRE</div>
                        <div style={{ fontWeight: 900, fontSize: '1.1rem' }}>{currentUser.name}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--panel-muted)', letterSpacing: '0.1em', marginBottom: '0.3rem' }}>PLAN DE ENTRENAMIENTO</div>
                        <div style={{ fontWeight: 900, fontSize: '1.1rem' }}>{currentUser.plan && planLabels[currentUser.plan.toString()] ? planLabels[currentUser.plan.toString()] : (currentUser.plan || 'Plan Normal')}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--panel-muted)', letterSpacing: '0.1em', marginBottom: '0.3rem' }}>VALOR MENSUALIDAD</div>
                        <div style={{ fontWeight: 900, fontSize: '1.1rem' }}>{formatCLP(currentUser.monthlyFee || 0)}</div>
                      </div>
                    </div>

                    {/* Fecha de Ingreso */}
                    {currentUser.joinDate && (
                      <div style={{ marginBottom: '1.5rem', padding: '1.5rem', background: 'var(--panel-surface)', borderRadius: '1.2rem', border: '1px solid var(--panel-border)' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--panel-muted)', letterSpacing: '0.1em', marginBottom: '0.8rem' }}>FECHA DE INGRESO AL DOJO</div>
                        <div style={{ fontWeight: 900, fontSize: '1.1rem', color: 'var(--panel-text)' }}>
                          {formatDate(currentUser.joinDate, 'long')}
                        </div>
                      </div>
                    )}

                    {/* Categoría de Competición IBJJF */}
                    {currentUser && (
                      <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'var(--panel-surface)', borderRadius: '1.2rem', border: '1px solid var(--panel-border)' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--logo-green)', letterSpacing: '0.12em', marginBottom: '1.2rem', textTransform: 'uppercase' }}>
                          CATEGORÍA DE COMPETICIÓN IBJJF
                        </div>

                        {/* Grid responsivo limpio */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.8rem', marginBottom: '1.2rem' }}>
                          <div style={{ minWidth: 0 }}>
                            <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 800, color: 'var(--panel-muted)', marginBottom: '0.3rem', letterSpacing: '0.05em' }}>FECHA NACIMIENTO</label>
                            <input type="date"
                              style={{ width: '100%', boxSizing: 'border-box', padding: '0.65rem 0.6rem', background: 'var(--panel-input-bg)', border: '1px solid var(--panel-input-border)', borderRadius: '0.8rem', color: 'var(--panel-text)', fontSize: '0.85rem', fontWeight: 700, outline: 'none' }}
                              value={currentUser.birthDate || ''}
                              onChange={e => {
                                const updated = { ...currentUser, birthDate: e.target.value };
                                setCurrentUser(updated);
                              }} />
                          </div>

                          <div style={{ minWidth: 0 }}>
                            <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 800, color: 'var(--panel-muted)', marginBottom: '0.3rem', letterSpacing: '0.05em' }}>PESO KIMONO (KG)</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                              <input type="number" step="0.1" min="20" max="200" placeholder="Ej: 75.5"
                                style={{ flex: 1, minWidth: 0, boxSizing: 'border-box', padding: '0.65rem 0.6rem', background: 'var(--panel-input-bg)', border: '1px solid var(--panel-input-border)', borderRadius: '0.8rem', color: 'var(--panel-text)', fontSize: '0.85rem', fontWeight: 700, outline: 'none' }}
                                value={currentUser.weight || ''}
                                onChange={e => {
                                  const val = parseFloat(e.target.value) || 0;
                                  const updated = { ...currentUser, weight: val };
                                  setCurrentUser(updated);
                                }} />
                              <span style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--panel-text)' }}>kg</span>
                            </div>
                          </div>

                          <div style={{ minWidth: 0 }}>
                            <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 800, color: 'var(--panel-muted)', marginBottom: '0.3rem', letterSpacing: '0.05em' }}>GÉNERO</label>
                            <select
                              style={{ width: '100%', boxSizing: 'border-box', padding: '0.65rem 0.5rem', background: 'var(--panel-input-bg)', border: '1px solid var(--panel-input-border)', borderRadius: '0.8rem', color: 'var(--panel-text)', fontSize: '0.85rem', fontWeight: 700, outline: 'none', cursor: 'pointer' }}
                              value={currentUser.gender || ''}
                              onChange={e => {
                                const val = e.target.value as 'MALE' | 'FEMALE';
                                const updated = { ...currentUser, gender: val };
                                setCurrentUser(updated);
                              }}>
                              <option value="">Seleccionar...</option>
                              <option value="MALE">Masculino</option>
                              <option value="FEMALE">Femenino</option>
                            </select>
                          </div>
                        </div>

                        {/* Tarjeta de visualización minimalista */}
                        {(() => {
                          const cat = calculateIBJJFCategory(currentUser.birthDate, currentUser.weight, currentUser.gender || null, currentUser.belt || 'WHITE');
                          return (
                            <div style={{ 
                              background: 'linear-gradient(135deg, rgba(5,168,106,0.08), rgba(5,168,106,0.02))', 
                              border: '1px solid rgba(5,168,106,0.2)', 
                              borderRadius: '1rem', 
                              padding: '1.2rem' 
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', gap: '0.5rem', flexWrap: 'wrap' }}>
                                <span style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--logo-green)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                                  CATEGORÍA OFICIAL IBJJF
                                </span>
                                <span style={{ fontSize: '0.6rem', fontWeight: 800, background: 'rgba(5,168,106,0.12)', color: 'var(--logo-green)', padding: '0.2rem 0.6rem', borderRadius: '100px', border: '1px solid rgba(5,168,106,0.25)' }}>
                                  Reglamento Gi
                                </span>
                              </div>

                              {cat.ready ? (
                                <div>
                                  <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--panel-text)', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    <span>{cat.divisionName}</span>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--logo-green)', background: 'rgba(5,168,106,0.12)', padding: '0.15rem 0.55rem', borderRadius: '0.5rem' }}>
                                      {cat.weightLimitText}
                                    </span>
                                  </div>

                                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                    <span style={{ background: 'var(--panel-surface)', border: '1px solid var(--panel-border)', padding: '0.3rem 0.6rem', borderRadius: '0.5rem', fontSize: '0.7rem', fontWeight: 800, color: 'var(--panel-text)' }}>
                                      {cat.ageCategory}
                                    </span>
                                    <span style={{ background: 'var(--panel-surface)', border: '1px solid var(--panel-border)', padding: '0.3rem 0.6rem', borderRadius: '0.5rem', fontSize: '0.7rem', fontWeight: 800, color: 'var(--panel-text)' }}>
                                      {cat.genderText}
                                    </span>

                                  </div>
                                </div>
                              ) : (
                                <div style={{ padding: '0.8rem 1rem', background: 'var(--panel-surface)', borderRadius: '0.8rem', border: '1px dashed var(--panel-border)', textAlign: 'center' }}>
                                  <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 800, color: 'var(--panel-text)', marginBottom: '0.2rem' }}>
                                    {!cat.hasGender ? 'Selecciona tu género en los campos superiores' : 'Ingresa tu peso en kg para calcular la división'}
                                  </p>
                                  <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--panel-muted)', fontWeight: 600 }}>
                                    Determina tu categoría oficial para torneos (Galo, Pluma, Pena, Leve, Medio, etc.)
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        })()}

                        {/* Botón explícito sin alertas bloqueantes */}
                        <motion.button
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={async () => {
                            await handleUpdateStudent(currentUser);
                            setCategorySavedSuccess(true);
                            setTimeout(() => setCategorySavedSuccess(false), 3000);
                          }}
                          style={{
                            width: '100%',
                            marginTop: '1rem',
                            padding: '0.85rem',
                            borderRadius: '0.8rem',
                            background: categorySavedSuccess ? '#10b981' : 'var(--logo-green)',
                            color: '#fff',
                            border: 'none',
                            fontWeight: 900,
                            fontSize: '0.8rem',
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                            transition: 'background 0.3s'
                          }}>
                          {categorySavedSuccess ? 'DATOS GUARDADOS CORRECTAMENTE' : 'GUARDAR DATOS DE COMPETICIÓN'}
                        </motion.button>
                      </div>
                    )}

                    {/* Sección Seguridad Limpia y Ajustada */}
                    <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'var(--panel-surface)', borderRadius: '1.2rem', border: '1px solid var(--panel-border)' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--panel-muted)', letterSpacing: '0.12em', marginBottom: '1.2rem', textTransform: 'uppercase' }}>SEGURIDAD</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        <input type="password" placeholder="Nueva contraseña"
                          style={{ width: '100%', boxSizing: 'border-box', padding: '0.85rem 1rem', background: 'var(--panel-input-bg)', border: '1px solid var(--panel-input-border)', borderRadius: '0.8rem', color: 'var(--panel-text)', fontSize: '0.9rem', fontWeight: 600, outline: 'none' }}
                          value={studentNewPassword} onChange={e => setStudentNewPassword(e.target.value)} />
                        <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.96 }}
                          style={{ width: '100%', padding: '0.85rem', background: 'var(--logo-green)', border: 'none', borderRadius: '0.8rem', color: '#fff', fontWeight: 900, cursor: 'pointer', fontSize: '0.8rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}
                          onClick={handleUpdateStudentPassword}>Actualizar Contraseña</motion.button>
                      </div>
                    </div>

                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }} onClick={handleLogout}
                      style={{ width: '100%', padding: '1.2rem', borderRadius: '1rem', background: 'var(--panel-red-bg)', color: '#ef4444', border: '1px solid var(--panel-red-border)', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <LogOut size={18} /> Cerrar Sesión
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        {/* Tab Bar */}
        <motion.nav initial={{ y: 100, x: '-50%' }} animate={{ y: 0, x: '-50%' }} transition={{ delay: 0.5, type: 'spring', stiffness: 300, damping: 30 }}
          style={{ position: 'fixed', bottom: '1.2rem', left: '50%', width: 'calc(100% - 2.5rem)', maxWidth: '440px', height: '66px', display: 'flex', justifyContent: 'space-around', alignItems: 'center', zIndex: 1000, borderRadius: '100px', background: 'var(--panel-sidebar)', backdropFilter: 'blur(30px)', border: '1px solid var(--panel-border)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
          <motion.button whileTap={{ scale: 0.82 }} onClick={() => setActiveTab('dashboard')}
            style={{ background: 'none', border: 'none', color: activeTab === 'dashboard' ? 'var(--logo-green)' : 'var(--panel-muted)', padding: '0.8rem', cursor: 'pointer', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
            <Users size={20} />
            {activeTab === 'dashboard' && <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--logo-green)' }} />}
          </motion.button>

          <motion.div whileTap={{ scale: 0.92 }} onClick={() => {
            setShowStudentAccess(true);
          }} style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, #006970, #1aa3ab)', color: '#fff', outline: '8px solid var(--panel-sidebar)', marginTop: '-30px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(0,105,112,0.3)', cursor: 'pointer' }}>
            <QrCode size={24} />
          </motion.div>

          <motion.button whileTap={{ scale: 0.82 }} onClick={() => setActiveTab('settings')}
            style={{ background: 'none', border: 'none', color: activeTab === 'settings' ? 'var(--logo-green)' : 'var(--panel-muted)', padding: '0.8rem', cursor: 'pointer', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
            <Settings size={20} />
            {activeTab === 'settings' && <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--logo-green)' }} />}
          </motion.button>
        </motion.nav>

        {/* Video Player Modal (Protected) */}
        <AnimatePresence>
          {playingVideo && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(15px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}
              onClick={() => setPlayingVideo(null)}>
              
              <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                style={{ width: '100%', maxWidth: '800px', background: '#111', borderRadius: '2.5rem', overflow: 'hidden', boxShadow: '0 50px 100px rgba(0,0,0,0.5)', position: 'relative' }}
                onClick={e => e.stopPropagation()}>
                
                {/* Header with Title and Close */}
                <div style={{ padding: '1.8rem 2rem', background: '#181818', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(5,168,106,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--logo-green)' }}>
                      <Play size={18} fill="var(--logo-green)" />
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 900, color: '#fff' }}>{playingVideo.title}</h3>
                      <p style={{ margin: 0, fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>{playingVideo.category || 'Biblioteca Técnica'}</p>
                    </div>
                  </div>
                  <button onClick={() => setPlayingVideo(null)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <X size={20} />
                  </button>
                </div>

                {/* Secure Player Container */}
                <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', background: '#000', WebkitTouchCallout: 'none', WebkitUserSelect: 'none', userSelect: 'none' }}>
                  {(() => {
                    const id = getYouTubeID(playingVideo.url.trim());
                    if (!id) return <div style={{ color: '#fff', position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 700 }}>ID de video no válido</div>;
                    
                    return (
                        <>
                          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '75px', zIndex: 10, background: 'transparent' }} />
                          <iframe 
                            width="100%" 
                            height="100%" 
                            src={`https://www.youtube-nocookie.com/embed/${id}?modestbranding=1&rel=0&iv_load_policy=3&showinfo=0&disablekb=1&controls=1&autoplay=0`}
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                            title="Reproductor seguro" 
                            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" 
                            sandbox="allow-scripts allow-same-origin allow-presentation"
                            allowFullScreen
                          ></iframe>
                        </>
                    );
                  })()}
                </div>

                <div style={{ padding: '2rem', display: 'flex', gap: '1.2rem', alignItems: 'start', background: '#111' }}>
                  <div style={{ background: 'rgba(5,168,106,0.1)', padding: '0.8rem', borderRadius: '15px', color: 'var(--logo-green)' }}>
                    <Info size={20} />
                  </div>
                  <div>
                    <h5 style={{ margin: 0, color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', fontWeight: 800, marginBottom: '0.5rem' }}>Sobre este contenido</h5>
                    <p style={{ margin: 0, color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', lineHeight: 1.5 }}>
                      Este video es parte del material exclusivo de **Academia Demo**. <br />
                      Está prohibida su reproducción parcial o total fuera de este portal oficial.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {showStudentAccess && (
          <StudentAccess
            student={currentUser}
            slots={classSlots}
            apiUrl={API_URL}
            onClose={() => setShowStudentAccess(false)}
          />
        )}

        {/* ====== DUAL PAYMENT MODAL (Student View) ====== */}
        <AnimatePresence>
        {showPaymentModal && paymentModalTarget && (() => {
          const studentsArr = Array.isArray(paymentModalTarget) ? paymentModalTarget : [paymentModalTarget];
          const baseAmount = studentsArr.reduce((acc, s) => acc + (s.monthlyFee || 40000), 0);
          const { charged, surcharge } = getSurcharge(baseAmount);
          const isGroup = studentsArr.length > 1;


          return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, zIndex: 9000, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
              onClick={closePaymentModal}>
              <motion.div initial={{ y: 40, opacity: 0, scale: 0.97 }} animate={{ y: 0, opacity: 1, scale: 1 }} transition={{ type: 'spring', damping: 25 }}
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
                style={{ width: '100%', maxWidth: '480px', background: '#fff', borderRadius: '2.5rem', overflow: 'hidden', boxShadow: '0 50px 120px rgba(0,0,0,0.4)', maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}>
                
                {/* Header */}
                <div style={{ padding: '1.5rem 1.5rem 0', textAlign: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ width: 36 }} />
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#111', letterSpacing: '-0.5px' }}>Pagar Mensualidad</h2>
                    <button onClick={closePaymentModal} style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}><X size={16} /></button>
                  </div>
                  
                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '1rem', padding: '0.8rem 1rem', marginBottom: '1rem' }}>
                    {studentsArr.map(s => (
                      <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.3rem 0' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#166534' }}>{s.name}</span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#166534' }}>{formatCLP(s.monthlyFee || 40000)}</span>
                      </div>
                    ))}
                    {isGroup && (
                      <div style={{ borderTop: '1px solid #bbf7d0', marginTop: '0.5rem', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#166534' }}>Total</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#166534' }}>{formatCLP(baseAmount)}</span>
                      </div>
                    )}
                  </div>

                  
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: '0 1.5rem 1.5rem' }}>
                  
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    
                    <div style={{ background: '#eff6ff', borderRadius: '1rem', padding: '1.2rem', border: '1px solid #bfdbfe' }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#1e40af', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <MpLogo height={32} />
                      </div>
                      <p style={{ fontSize: '0.8rem', color: '#1e3a5f', lineHeight: 1.5, margin: 0, fontWeight: 600 }}>
                        Este link te permite pagar tu mensualidad utilizando <b>cualquier método de pago</b>: transferencia bancaria, tu cuenta de Mercado Pago, o tarjetas de débito/crédito.
                      </p>
                    </div>

                    <div style={{ background: '#f8fafc', borderRadius: '1rem', padding: '1.2rem', border: '1px solid #e2e8f0', margin: '0.5rem 0' }}>
                      <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.8rem' }}>RESUMEN DE COBRO</div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #f1f5f9' }}>
                        <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>Mensualidad Base</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>{formatCLP(baseAmount)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #f1f5f9' }}>
                        <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>Cargo plataforma Mercado Pago</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ef4444' }}>+ {formatCLP(surcharge)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem 0 0.2rem', marginTop: '0.3rem' }}>
                        <span style={{ fontSize: '1rem', fontWeight: 900, color: '#0f172a' }}>Total a pagar</span>
                        <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#3b82f6' }}>{formatCLP(charged)}</span>
                      </div>
                    </div>

                    <div style={{ background: '#fefce8', borderRadius: '0.8rem', padding: '0.7rem 1rem', border: '1px solid #fde68a', marginBottom: '1rem' }}>
                      <p style={{ fontSize: '0.68rem', color: '#854d0e', margin: 0, lineHeight: 1.5 }}>
                        <strong>¿Por qué hay un cargo adicional?</strong> Las plataformas de pago retienen una comisión operativa. Este cargo se suma para asegurar que el 100% del valor de tu mensualidad llegue íntegramente al Dojo.
                      </p>
                    </div>


                    <button 
                      onClick={() => handleCreatePaymentLink(paymentModalTarget!)}
                      disabled={isGeneratingPayment}
                      style={{ width: '100%', padding: '1.05rem 1.1rem', borderRadius: '1rem', border: 'none', background: isGeneratingPayment ? '#3d2bb3' : '#0a0080', color: '#fff', fontWeight: 900, fontSize: '0.95rem', cursor: isGeneratingPayment ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', boxShadow: '0 10px 25px rgba(10,0,128,0.28)', transition: 'all 0.2s', marginBottom: '1.5rem' }}>
                      {isGeneratingPayment ? (
                        <><span className="premium-spinner" style={{ width: '16px', height: '16px', borderTopColor: '#fff', borderRightColor: 'rgba(255,255,255,0.6)' }} /> Redirigiendo a portal seguro...</>
                      ) : (
                        <MpLogo variant="white" height={34} />
                      )}
                    </button>
                  </motion.div>

                  <p style={{ fontSize: '0.6rem', color: '#94a3b8', textAlign: 'center', marginTop: '1rem', lineHeight: 1.4 }}>
                    Pagos procesados de forma segura. Ante cualquier duda,{' '}
                    <a href="mailto:contacto@dpsistemas.cl" style={{ color: '#16C47A', fontWeight: 700 }}>contáctanos</a>.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
        </AnimatePresence>

        {/* Interactive Avatar Cropper Modal */}
        {rawImageForCrop && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(15px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
            <div className="glass" style={{ background: '#ffffff', color: '#1e293b', padding: '2rem', borderRadius: '2rem', width: '100%', maxWidth: '380px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid rgba(0,0,0,0.08)' }}>
              
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 900, margin: 0, color: 'var(--tatami-black)' }}>Ajustar Foto</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--panel-muted)', marginTop: '0.4rem' }}>Arrastra para encuadrar y usa el zoom</p>
              </div>

              {/* Circular Cropping Frame */}
              <div 
                onMouseDown={(e) => handleDragStart(e.clientX, e.clientY)}
                onMouseMove={(e) => handleDragMove(e.clientX, e.clientY)}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
                onTouchStart={(e) => handleDragStart(e.touches[0].clientX, e.touches[0].clientY)}
                onTouchMove={(e) => handleDragMove(e.touches[0].clientX, e.touches[0].clientY)}
                onTouchEnd={handleDragEnd}
                style={{ 
                  width: '250px', 
                  height: '250px', 
                  borderRadius: '50%', 
                  overflow: 'hidden', 
                  position: 'relative', 
                  background: '#f1f5f9', 
                  border: '3px solid var(--logo-green)',
                  boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.15), 0 10px 25px rgba(0,0,0,0.1)',
                  cursor: 'move',
                  touchAction: 'none'
                }}
              >
                {cropImageObj && (() => {
                  const C = 250;
                  const imgW = cropImageObj.naturalWidth || cropImageObj.width;
                  const imgH = cropImageObj.naturalHeight || cropImageObj.height;
                  const s0 = C / Math.min(imgW, imgH);
                  const W = imgW * s0 * cropZoom;
                  const H = imgH * s0 * cropZoom;
                  const left = (C - W) / 2 + cropOffset.x;
                  const top = (C - H) / 2 + cropOffset.y;

                  return (
                    <img 
                      src={rawImageForCrop} 
                      style={{ 
                        position: 'absolute',
                        width: `${W}px`,
                        height: `${H}px`,
                        left: `${left}px`,
                        top: `${top}px`,
                        maxWidth: 'none',
                        maxHeight: 'none',
                        userSelect: 'none',
                        pointerEvents: 'none'
                      }} 
                    />
                  );
                })()}
                
                {/* Outer shadow overlay to emphasize the circle crop */}
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', boxShadow: 'inset 0 0 15px rgba(0,0,0,0.2)', pointerEvents: 'none' }} />
              </div>

              {/* Slider zoom */}
              <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0 0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--panel-muted)' }}>A-</span>
                <input 
                  type="range" 
                  min="1" 
                  max="3" 
                  step="0.01" 
                  value={cropZoom} 
                  onChange={(e) => handleZoomChange(parseFloat(e.target.value))} 
                  style={{ flex: 1, accentColor: 'var(--logo-green)', cursor: 'pointer', height: '6px', borderRadius: '3px', background: '#e2e8f0' }} 
                />
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--panel-muted)' }}>A+</span>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                <button 
                  onClick={() => setRawImageForCrop(null)} 
                  disabled={isCroppingSave}
                  style={{ flex: 1, background: '#f1f5f9', border: 'none', borderRadius: '1rem', padding: '0.8rem', color: '#64748b', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSaveCrop} 
                  disabled={isCroppingSave}
                  style={{ flex: 1, background: 'var(--logo-green)', border: 'none', borderRadius: '1rem', padding: '0.8rem', color: '#fff', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', boxShadow: '0 10px 20px rgba(5,168,106,0.2)' }}
                >
                  {isCroppingSave ? 'Guardando...' : 'Guardar'}
                </button>
              </div>

            </div>
          </div>
        )}

        {photoLightboxStudent && (
          <div
            onClick={() => setPhotoLightboxStudent(null)}
            style={{ position: 'fixed', inset: 0, zIndex: 99998, background: 'rgba(0,0,0,0.88)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '1.5rem' }}
          >
            <img
              src={studentPhoto(photoLightboxStudent)}
              alt={photoLightboxStudent.name}
              onClick={(e) => e.stopPropagation()}
              style={{ width: 'min(280px, 80vw)', height: 'min(280px, 80vw)', objectFit: 'contain', background: '#fff', borderRadius: '24px', border: '3px solid #006970' }}
            />
            <div style={{ color: '#fff', fontWeight: 800 }}>{photoLightboxStudent.name}</div>
          </div>
        )}
        <ModuleBoundary name="guia-alumno">
        <DemoGuide
          mode="student"
          moduleId={activeTab}
          onGo={(tab) => {
            if (tab === 'access') setShowStudentAccess(true);
            else setActiveTab(tab as any);
          }}
        />
        </ModuleBoundary>
      </motion.div>
    );
  }

  // --- RENDERING ADMIN PANEL ---
  const tabLabels: Record<string, string> = { dashboard: 'Resumen', schedule: 'Horarios', students: 'Alumnos', videos: 'Biblioteca', attendance: 'Asistencia', payments: 'Finanzas', grades: 'Grados', events: 'Eventos', settings: 'Ajustes', website: 'Sitio Web', communications: 'Comunicaciones' };
  return (
    <motion.div
      key="app-admin"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      style={{ background: 'var(--panel-bg)', minHeight: '100vh', display: 'flex', color: 'var(--panel-text)', overflow: 'hidden' }}>


      {/* BG */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: 0, right: '20%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(5,168,106,0.08) 0%, transparent 70%)', filter: 'blur(100px)', opacity: 'var(--panel-orb-opacity)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: '20%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(5,168,106,0.06) 0%, transparent 70%)', filter: 'blur(80px)', opacity: 'var(--panel-orb-opacity)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 1px 1px, var(--panel-grid-dot) 1px, transparent 0)', backgroundSize: '32px 32px' }} />
      </div>

      {/* Sidebar */}
      <motion.nav
        initial={{ x: -350, opacity: 0 }}
        animate={{ x: isMobile ? (isMobileMenuOpen ? 0 : -500) : 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={`sidebar ${isMobileMenuOpen ? 'sidebar-open' : ''}`}
        style={{
          position: 'fixed', left: 0, top: 0, bottom: 0,
          display: 'flex', flexDirection: 'column',
          zIndex: 9999,
          background: '#fff',
          borderRight: '1px solid rgba(22, 22, 22, 0.08)',
          overflow: 'hidden',
          padding: 0
        }}
      >
        {/* ── ZONA 1: Header fijo (nunca scrollea) ── */}
        <div style={{ flexShrink: 0, padding: '1.35rem 1.2rem 0.7rem', position: 'relative' }}>
          {isMobile && (
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: '#f8fafc', border: '1px solid rgba(22,22,22,0.08)', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#161616', cursor: 'pointer', zIndex: 10 }}
            >
              <X size={18} />
            </button>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: isMobile ? '0.4rem 2.6rem 0.15rem' : '0.35rem 0 0.1rem' }}>
            <img
              src={BRAND.logoMark}
              alt="DP Sistemas"
              style={{ width: isMobile ? '120px' : '148px', height: isMobile ? '114px' : '140px', objectFit: 'contain', display: 'block' }}
            />
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: '0.55rem' }}>Panel administración</div>
          </div>

          {role === 'superadmin' && sedes.length > 0 && (
            <div style={{ marginTop: '0.95rem', padding: '0.55rem 0.7rem', background: '#f8fafc', border: '1px solid rgba(22,22,22,0.08)', borderRadius: '0.75rem' }}>
              <span style={{ fontSize: '0.58rem', fontWeight: 800, color: '#006970', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '0.3rem' }}>SEDE ACTIVA</span>
              <select
                value={activeSedeId || ''}
                onChange={e => {
                  const val = e.target.value;
                  setActiveSedeId(val ? Number(val) : null);
                }}
                style={{ width: '100%', padding: '0.4rem 0.5rem', borderRadius: '0.45rem', border: '1px solid rgba(22,22,22,0.12)', background: '#fff', color: '#161616', fontSize: '0.78rem', outline: 'none', fontWeight: 600, cursor: 'pointer' }}
              >
                <option value="">Todas las Sedes</option>
                {sedes.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          )}

          <div style={{ height: '1px', background: 'rgba(22,22,22,0.08)', marginTop: '0.95rem' }} />
        </div>

        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '0.5rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.15rem', minHeight: 0 }}>
          {[
            { id: 'dashboard', label: 'Resumen', icon: <TrendingUp size={17} /> },
            { id: 'schedule', label: 'Horarios', icon: <Clock size={17} /> },
            { id: 'attendance', label: 'Asistencia', icon: <QrCode size={17} /> },
            { id: 'students', label: 'Alumnos', icon: <Users size={17} /> },
            { id: 'grades', label: 'Grados', icon: <Award size={17} /> },
            { id: 'events', label: 'Eventos', icon: <Ticket size={17} /> },
            { id: 'payments', label: 'Finanzas', icon: <CreditCard size={17} /> },
            { id: 'videos', label: 'Biblioteca', icon: <Play size={17} /> },
            { id: 'communications', label: 'Comunicaciones', icon: <Mail size={17} /> },
            { id: 'website', label: 'Sitio Web', icon: <Monitor size={17} /> },
            { id: 'settings', label: 'Ajustes', icon: <Settings size={17} /> },
          ].filter(item => {
            const isSecondarySede = role === 'admin' && activeSedeId !== 1;
            if (isSecondarySede && ['videos', 'website'].includes(item.id)) return false;
            if (isMobile) return ['dashboard', 'schedule', 'attendance', 'students', 'grades', 'events', 'payments', 'videos', 'communications'].includes(item.id);
            return true;
          }).map(item => (
            <motion.button
              key={item.id}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setActiveTab(item.id as any); setIsMobileMenuOpen(false); }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.68rem 0.8rem', borderRadius: '0.7rem', border: 'none', background: activeTab === item.id ? 'rgba(0,105,112,0.1)' : 'transparent', color: activeTab === item.id ? '#006970' : '#334155', fontWeight: activeTab === item.id ? 800 : 600, fontSize: '0.84rem', cursor: 'pointer', textAlign: 'left', position: 'relative', overflow: 'hidden', width: '100%', flexShrink: 0, fontFamily: 'inherit' }}
            >
              {activeTab === item.id && (
                <motion.div
                  layoutId="sidebar-active"
                  style={{ position: 'absolute', left: 0, top: '18%', bottom: '18%', width: '3px', borderRadius: '2px', background: '#006970' }}
                />
              )}
              <span style={{ color: activeTab === item.id ? '#006970' : '#64748b', flexShrink: 0 }}>{item.icon}</span>
              {item.label}
            </motion.button>
          ))}
        </div>

        <div style={{ flexShrink: 0, padding: '0.75rem 0.85rem 1.1rem', borderTop: '1px solid rgba(22,22,22,0.08)' }}>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', padding: '0.7rem 1rem', borderRadius: '0.7rem', border: '1px solid rgba(185,28,28,0.18)', background: '#fff', color: '#b91c1c', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', width: '100%', fontFamily: 'inherit' }}
          >
            <LogOut size={15} /> Cerrar sesión
          </motion.button>
        </div>
      </motion.nav>

      {/* Main content */}
      <main className="main-content" style={{ flex: 1, padding: isMobile ? '1.5rem 1rem' : '2.5rem 3rem', position: 'relative', zIndex: 1, overflowY: 'auto' }}>
        {/* Header */}
        <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {isMobile && (
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                style={{ background: 'var(--panel-card)', border: '1px solid var(--panel-border)', borderRadius: '12px', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--logo-green)', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            )}
            <div>
              <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--logo-green)', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                Sede de ejemplo
              </div>
              <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-1px', color: 'var(--logo-green)' }}>{tabLabels[activeTab]}</h1>
              <p style={{ margin: '0.35rem 0 0', fontSize: '0.75rem', fontWeight: 700, color: 'var(--panel-muted)' }}>Demo: se edita y se registra. No se borra el seed (alumnos, clases, material).</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }} className="mobile-hide">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.6rem 1.4rem', background: 'var(--panel-card)', border: '1px solid var(--panel-border)', borderRadius: '100px' }}>
              <Search size={15} style={{ color: 'var(--logo-green)', opacity: 0.7 }} />
              <input type="text" placeholder="Buscar..."
                style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--panel-text)', fontSize: '0.85rem', width: '180px' }}
                value={studentSearchTerm} onChange={e => setStudentSearchTerm(e.target.value)} />
            </div>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => handleOpenAddStudent()}
              style={{ display: (activeTab === 'schedule' || activeTab === 'attendance' || activeTab === 'payments' || activeTab === 'grades' || activeTab === 'events' || activeTab === 'videos') ? 'none' : 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1.4rem', background: 'var(--logo-green)', border: 'none', borderRadius: '100px', color: '#fff', fontWeight: 900, fontSize: '0.8rem', cursor: 'pointer', letterSpacing: '0.03em' }}>
              <Plus size={16} /> Nuevo Alumno
            </motion.button>
          </div>
          {isMobile && ['students'].includes(activeTab) && (
            <motion.button whileTap={{ scale: 0.95 }}
              onClick={() => handleOpenAddStudent()}
              style={{ background: 'var(--logo-green)', border: 'none', borderRadius: '12px', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer', boxShadow: '0 4px 10px rgba(22,196,122,0.3)', flexShrink: 0 }}>
              <Plus size={20} />
            </motion.button>
          )}
        </motion.header>

        <ModuleBoundary name={activeTab}>
        <AnimatePresence>
          {activeTab === 'dashboard' && (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <DashboardPanel
                students={students}
                slots={classSlots}
                activeSedeId={activeSedeId}
                onOpenStudent={setSelectedStudent}
                onGo={(tab) => {
                  if (tab === 'students') setStudentFilterPayment('ALL');
                  setActiveTab(tab);
                }}
              />
            </motion.div>
          )}



          {activeTab === 'students' && (
            <motion.div key="students" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <section className="dp-card" style={{ marginBottom: '1rem' }}>
                <div className="dp-head">
                  <div>
                    <div className="dp-kicker">Alumnos</div>
                    <h2>Fichas</h2>
                  </div>
                </div>
                <PanelTabs
                  name="alumnos"
                  value={studentFilterPayment}
                  onChange={(id) => setStudentFilterPayment(id as typeof studentFilterPayment)}
                  items={[
                    { id: 'ALL', label: 'Todos' },
                    { id: 'PAID', label: 'Al día' },
                    { id: 'PENDING', label: 'Pendientes' },
                  ]}
                />
              <div className="dp-body">
              {/* Filters + Search for Mobile */}
              <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                {isMobile && (
                  <div style={{ width: '100%', position: 'relative', marginBottom: '0.3rem' }}>
                    <Search size={15} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--logo-green)', opacity: 0.7 }} />
                    <input type="text" placeholder="Buscar alumno..."
                      style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.8rem', borderRadius: '1rem', background: 'var(--panel-surface)', color: 'var(--panel-text)', border: '1px solid var(--panel-border)', outline: 'none', fontWeight: 700, fontSize: '0.85rem', boxSizing: 'border-box' }}
                      value={studentSearchTerm} onChange={e => setStudentSearchTerm(e.target.value)} />
                  </div>
                )}
                <select className="glass" style={{ padding: '0.7rem 1rem', borderRadius: '1rem', background: 'var(--panel-surface)', color: 'var(--panel-text)', border: '1px solid var(--panel-border)', outline: 'none', fontWeight: 700, fontSize: isMobile ? '0.75rem' : '0.85rem', flex: isMobile ? '1 1 45%' : 'none', minWidth: 0 }}
                  value={studentFilterBelt} onChange={e => setStudentFilterBelt(e.target.value as any)}>
                  <option value="ALL">Todos los cinturones</option>
                  {Object.keys(beltLabels).map(b => (
                    <option key={b} value={b}>{beltLabels[b as Belt]}</option>
                  ))}
                </select>

                <select className="glass" style={{ padding: '0.7rem 1rem', borderRadius: '1rem', background: 'var(--panel-surface)', color: 'var(--panel-text)', border: '1px solid var(--panel-border)', outline: 'none', fontWeight: 700, fontSize: isMobile ? '0.75rem' : '0.85rem', flex: isMobile ? '1 1 100%' : 'none', minWidth: 0 }}
                  value={studentFilterIBJJFCategory} onChange={e => setStudentFilterIBJJFCategory(e.target.value)}>
                  <option value="ALL">Todas las categorías</option>
                  <option value="GALO">Galo</option>
                  <option value="PLUMA">Pluma</option>
                  <option value="PENA">Pena</option>
                  <option value="LEVE">Leve</option>
                  <option value="MEDIO">Medio</option>
                  <option value="MEIO_PESADO">Medio pesado</option>
                  <option value="PESADO">Pesado</option>
                  <option value="SUPER_PESADO">Super pesado</option>
                  <option value="PESADISSIMO">Pesadísimo</option>
                </select>

                {!isMobile && (
                  <select className="glass" style={{ padding: '0.8rem 1.2rem', borderRadius: '1rem', background: 'var(--panel-surface)', color: 'var(--panel-text)', border: '1px solid var(--panel-border)', outline: 'none', fontWeight: 700 }}
                    value={studentFilterAge} onChange={e => setStudentFilterAge(e.target.value as any)}>
                    <option value="ALL">Todas las edades</option>
                    <option value="KIDS">Niños (Menores de 18)</option>
                    <option value="ADULTS">Adultos (18+)</option>
                  </select>
                )}

                {isMobile && (
                  <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleOpenAddStudent()}
                    style={{ background: 'var(--logo-green)', border: 'none', borderRadius: '1rem', padding: '0.75rem 1.2rem', color: '#fff', fontWeight: 900, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', width: '100%', marginTop: '0.2rem' }}>
                    <Plus size={15} /> Nuevo Alumno
                  </motion.button>
                )}
              </div>

              {/* MOBILE: Compact student cards */}
              {isMobile ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {students
                    .filter(s => s.name.toLowerCase().includes(studentSearchTerm.toLowerCase()))
                    .filter(s => {
                      if (studentFilterPayment === 'ALL') return true;
                      if (studentFilterPayment === 'PAID') return s.isPaid;
                      return !s.isPaid;
                    })
                        .filter(s => {
                          if (studentFilterIBJJFCategory === 'ALL') return true;
                          const cat = calculateIBJJFCategory(s.birthDate, s.weight, s.gender, s.belt);
                          const div = (cat.divisionName || '').toLowerCase();
                          if (studentFilterIBJJFCategory === 'GALO') return div.includes('galo');
                          if (studentFilterIBJJFCategory === 'PLUMA') return div.includes('pluma');
                          if (studentFilterIBJJFCategory === 'PENA') return div === 'pena' || div.startsWith('pena ');
                          if (studentFilterIBJJFCategory === 'LEVE') return div.includes('leve');
                          if (studentFilterIBJJFCategory === 'MEDIO') return div === 'medio' || (div.includes('medio') && !div.includes('pesado'));
                          if (studentFilterIBJJFCategory === 'MEIO_PESADO') return div.includes('medio pesado');
                          if (studentFilterIBJJFCategory === 'PESADO') return div === 'pesado';
                          if (studentFilterIBJJFCategory === 'SUPER_PESADO') return div.includes('super pesado');
                          if (studentFilterIBJJFCategory === 'PESADISSIMO') return div.includes('pesadísimo') || div.includes('pesadisimo');
                          return true;
                        })
                    .map((student) => (
                      <div key={student.id}
                        style={{ background: 'var(--panel-surface)', border: '1px solid var(--panel-border)', borderRadius: '1rem', padding: '0.8rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flex: 1, minWidth: 0 }}>
                          <button
                            type="button"
                            className="dp-avatar-btn"
                            style={{ width: '40px', height: '40px' }}
                            onClick={() => {
                              setPhotoLightboxStudent(student);
                            }}
                            aria-label={`Ver foto de ${student.name}`}
                          >
                            <img
                              src={studentPhoto(student)}
                              alt=""
                              onError={(e) => { e.currentTarget.src = getFallbackAvatarUrl(student.name); }}
                            />
                          </button>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--panel-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{student.name}</div>
                            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap', marginTop: '2px' }}>
                              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: student.isPaid ? 'var(--logo-green)' : '#ef4444' }}>
                                {student.isPaid ? '✅ Al día' : '⚠️ Pendiente'}
                              </span>
                              {(() => {
                                const cat = calculateIBJJFCategory(student.birthDate, student.weight, student.gender, student.belt);
                                if (cat.ready) {
                                  return (
                                    <span style={{ fontSize: '0.6rem', fontWeight: 800, background: 'rgba(5,168,106,0.12)', color: 'var(--logo-green)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                                      {cat.divisionName.split('/')[0].trim()}
                                    </span>
                                  );
                                }
                                return null;
                              })()}
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0, alignItems: 'center' }}>
                          <button
                            onClick={() => {
                              const todayStr = new Date().toISOString().split('T')[0];
                              const alreadyPaidToday = (student.history || []).some((h: any) => h.date === todayStr);
                              if (alreadyPaidToday) {
                                alert(`⚠️ Ya se registró un pago para ${student.name} el día de hoy.`);
                                return;
                              }
                              if (window.confirm(`¿Registrar pago manual de ${student.name} por ${formatCLP(student.monthlyFee || 0)}?`)) {
                                handleUpdateStudent({ ...student, isPaid: true, lastPaymentDate: todayStr, lastPaymentMonth: todayStr.substring(0, 7), history: [...(student.history || []), { date: todayStr, status: 'Completado' as const, amount: student.monthlyFee || 0 }] });
                              }
                            }}
                            style={{ background: 'rgba(5,168,106,0.1)', border: 'none', width: '34px', height: '34px', borderRadius: '8px', color: 'var(--logo-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                            title="Registrar pago manual">
                            <DollarSign size={15} />
                          </button>
                          <button
                            onClick={() => window.open(`https://wa.me/${student.phone?.replace(/\D/g, '')}?text=Hola ${student.name}...`)}
                            style={{ background: 'rgba(37,211,102,0.1)', border: 'none', width: '34px', height: '34px', borderRadius: '8px', color: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                            title="WhatsApp">
                            <Phone size={15} />
                          </button>
                          <button
                            onClick={() => setSelectedStudent(student)}
                            style={{ background: 'none', border: '1px solid var(--panel-border)', height: '34px', paddingInline: '0.8rem', borderRadius: '8px', color: 'var(--panel-text)', fontSize: '0.65rem', fontWeight: 800, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                            Detalle
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                /* DESKTOP: Full table */
                <div style={{ borderRadius: '1.5rem', overflow: 'hidden', border: '1px solid var(--panel-border)', background: 'var(--panel-card)' }}>
                  <div style={{ width: "100%", overflowX: "auto", WebkitOverflowScrolling: "touch" }}><table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ background: 'rgba(5, 168, 106, 0.05)', borderBottom: '1px solid var(--glass-border)' }}>
                        <th style={{ padding: '1.5rem', fontSize: '0.7rem', fontWeight: 900, color: 'var(--logo-green)', letterSpacing: '0.1em' }}>ALUMNO</th>
                        <th style={{ padding: '1.5rem', fontSize: '0.7rem', fontWeight: 900, color: 'var(--logo-green)', letterSpacing: '0.1em' }}>CINTURÓN</th>
                        <th style={{ padding: '1.5rem', fontSize: '0.7rem', fontWeight: 900, color: 'var(--logo-green)', letterSpacing: '0.1em' }}>CATEGORÍA IBJJF</th>
                        <th style={{ padding: '1.5rem', fontSize: '0.7rem', fontWeight: 900, color: 'var(--logo-green)', letterSpacing: '0.1em' }}>ASISTENCIAS</th>
                        <th style={{ padding: '1.5rem', fontSize: '0.7rem', fontWeight: 900, color: 'var(--logo-green)', letterSpacing: '0.1em' }}>ESTADO</th>
                        <th style={{ padding: '1.5rem', fontSize: '0.7rem', fontWeight: 900, color: 'var(--logo-green)', letterSpacing: '0.1em', textAlign: 'right' }}>ACCIONES</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students
                        .filter(s => s.name.toLowerCase().includes(studentSearchTerm.toLowerCase()))
                        .filter(s => studentFilterBelt === 'ALL' || s.belt === studentFilterBelt)
                        .filter(s => {
                          if (studentFilterPayment === 'ALL') return true;
                          if (studentFilterPayment === 'PAID') return s.isPaid;
                          if (studentFilterPayment === 'PENDING') return !s.isPaid;
                          return true;
                        })
                        .filter(s => {
                          if (studentFilterAge === 'ALL') return true;
                            const age = calculateAge(s.birthDate || null);
                            if (age === 0 && studentFilterAge === 'KIDS') return false; 
                            if (studentFilterAge === 'KIDS') return age < 18;
                            if (studentFilterAge === 'ADULTS') return age >= 18;
                            return true;
                        })
                        .filter(s => {
                          if (studentFilterIBJJFCategory === 'ALL') return true;
                          const cat = calculateIBJJFCategory(s.birthDate, s.weight, s.gender, s.belt);
                          const div = (cat.divisionName || '').toLowerCase();
                          if (studentFilterIBJJFCategory === 'GALO') return div.includes('galo');
                          if (studentFilterIBJJFCategory === 'PLUMA') return div.includes('pluma');
                          if (studentFilterIBJJFCategory === 'PENA') return div === 'pena' || div.startsWith('pena ');
                          if (studentFilterIBJJFCategory === 'LEVE') return div.includes('leve');
                          if (studentFilterIBJJFCategory === 'MEDIO') return div === 'medio' || (div.includes('medio') && !div.includes('pesado'));
                          if (studentFilterIBJJFCategory === 'MEIO_PESADO') return div.includes('medio pesado');
                          if (studentFilterIBJJFCategory === 'PESADO') return div === 'pesado';
                          if (studentFilterIBJJFCategory === 'SUPER_PESADO') return div.includes('super pesado');
                          if (studentFilterIBJJFCategory === 'PESADISSIMO') return div.includes('pesadísimo') || div.includes('pesadisimo');
                          return true;
                        })
                        .map((student) => (
                          <tr key={student.id} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'all 0.3s' }} className="hover-light">
                            <td style={{ padding: '1.5rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                <button
                                  type="button"
                                  className="dp-avatar-btn"
                                  style={{ width: '44px', height: '44px' }}
                                  onClick={() => {
                                    setPhotoLightboxStudent(student);
                                  }}
                                  aria-label={`Ver foto de ${student.name}`}
                                >
                                  <img
                                    src={studentPhoto(student)}
                                    alt=""
                                    onError={(e) => { e.currentTarget.src = getFallbackAvatarUrl(student.name); }}
                                  />
                                </button>
                                <div>
                                  <p style={{ fontWeight: 900, fontSize: '1rem', color: 'var(--text-main)', margin: 0 }}>{student.name}</p>
                                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>{student.email}</p>
                                </div>
                              </div>
                            </td>
                            <td style={{ padding: '1.5rem' }}>
                              <div className={`belt-badge belt-${student.belt}`} style={{ display: 'inline-block', padding: '0.5rem 1rem', fontSize: '0.65rem' }}>{beltLabels[student.belt]}</div>
                            </td>
                            <td style={{ padding: '1.5rem' }}>
                              {(() => {
                                const cat = calculateIBJJFCategory(student.birthDate, student.weight, student.gender, student.belt);
                                if (!cat.ready) {
                                  return <span style={{ fontSize: '0.7rem', color: 'var(--panel-muted)', fontWeight: 600 }}>Sin registrar</span>;
                                }
                                return (
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                    <span style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--panel-text)' }}>{cat.divisionName}</span>
                                    <span style={{ fontSize: '0.65rem', color: 'var(--logo-green)', fontWeight: 700 }}>{cat.ageCategory} • {student.weight} kg</span>
                                  </div>
                                );
                              })()}
                            </td>
                            <td style={{ padding: '1.5rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                <div style={{ flex: 1, height: '5px', background: 'var(--glass-border)', borderRadius: '10px', maxWidth: '80px', overflow: 'hidden' }}>
                                  <div style={{ width: `${(student.classesAttended / student.classesToNextBelt) * 100}%`, height: '100%', background: 'var(--logo-green)' }}></div>
                                </div>
                                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)' }}>{student.classesAttended}</span>
                              </div>
                            </td>
                            <td style={{ padding: '1.5rem' }}>
                              <span style={{ color: student.isPaid ? 'var(--logo-green)' : '#ef4444', fontWeight: 900, fontSize: '0.75rem' }}>{student.isPaid ? 'AL DÍA' : 'PENDIENTE'}</span>
                            </td>
                            <td style={{ padding: '1.5rem', textAlign: 'right' }}>
                              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <button onClick={() => {
                                  const todayStr = new Date().toISOString().split('T')[0];
                                  const alreadyPaidToday = (student.history || []).some((h: any) => h.date === todayStr);
                                  if (alreadyPaidToday) {
                                    alert(`⚠️ Ya se registró un pago para ${student.name} el día de hoy.`);
                                    return;
                                  }
                                  if (window.confirm(`¿Registrar pago manual de ${student.name} por ${formatCLP(student.monthlyFee || 0)}?`)) {
                                    handleUpdateStudent({ ...student, isPaid: true, lastPaymentDate: todayStr, lastPaymentMonth: todayStr.substring(0, 7), history: [...(student.history || []), { date: todayStr, status: 'Completado' as const, amount: student.monthlyFee || 0 }] });
                                  }
                                }} style={{ background: 'rgba(5,168,106,0.1)', border: 'none', padding: '0.63rem', borderRadius: '0.8rem', color: 'var(--logo-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="Registrar Pago Manual">
                                  <DollarSign size={15} />
                                </button>
                                <button onClick={() => window.open(`https://wa.me/${student.phone?.replace(/\D/g, '')}?text=Hola ${student.name}...`)} style={{ background: 'rgba(37,211,102,0.1)', border: 'none', padding: '0.63rem', borderRadius: '0.8rem', color: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="WhatsApp">
                                  <Phone size={15} />
                                </button>
                                <button onClick={() => setSelectedStudent(student)} style={{ background: 'none', border: '1px solid var(--glass-border)', padding: '0.6rem 1.2rem', borderRadius: '0.8rem', color: 'var(--text-main)', fontSize: '0.7rem', fontWeight: 800, cursor: 'pointer' }}>DETALLES</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table></div>
                </div>
              )}
              </div>
              </section>
            </motion.div>
          )}

          {activeTab === 'videos' && (
            <motion.div key="videos" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <LibraryPanel
                apiUrl={API_URL}
                videos={videos}
                students={students}
                onVideosChange={setVideos}
              />
            </motion.div>
          )}

          {/* Admin Video Player Modal */}
          <AnimatePresence>
            {playingVideo && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(15px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}
                onClick={() => setPlayingVideo(null)}>
                
                <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                  style={{ width: '100%', maxWidth: '800px', background: '#111', borderRadius: '2.5rem', overflow: 'hidden', boxShadow: '0 50px 100px rgba(0,0,0,0.5)', position: 'relative' }}
                  onClick={e => e.stopPropagation()}>
                  
                  {/* Header */}
                  <div style={{ padding: '1.8rem 2rem', background: '#181818', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(5,168,106,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--logo-green)' }}>
                        <Play size={18} fill="var(--logo-green)" />
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 900, color: '#fff' }}>{playingVideo.title}</h3>
                        <p style={{ margin: 0, fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>{playingVideo.category || 'Biblioteca Técnica'}</p>
                      </div>
                    </div>
                    <button onClick={() => setPlayingVideo(null)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <X size={20} />
                    </button>
                  </div>

                  {/* Player Container */}
                  <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', background: '#000', WebkitTouchCallout: 'none', WebkitUserSelect: 'none', userSelect: 'none' }}>
                    {(() => {
                      const id = getYouTubeID(playingVideo.url.trim());
                      if (!id) return <div style={{ color: '#fff', position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 700 }}>ID de video no válido</div>;
                      
                      return (
                          <>
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '75px', zIndex: 10, background: 'transparent' }} />
                            <iframe 
                              width="100%" 
                              height="100%" 
                              src={`https://www.youtube-nocookie.com/embed/${id}?modestbranding=1&rel=0&iv_load_policy=3&showinfo=0&disablekb=1&controls=1&autoplay=0`}
                              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                              title="Reproductor seguro" 
                              allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" 
                              sandbox="allow-scripts allow-same-origin allow-presentation"
                              allowFullScreen
                            ></iframe>
                          </>
                      );
                    })()}
                  </div>

                  <div style={{ padding: '2rem', display: 'flex', gap: '1.2rem', alignItems: 'start', background: '#111' }}>
                    <div style={{ background: 'rgba(5,168,106,0.1)', padding: '0.8rem', borderRadius: '15px', color: 'var(--logo-green)' }}>
                      <Info size={20} />
                    </div>
                    <div>
                      <h5 style={{ margin: 0, color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', fontWeight: 800, marginBottom: '0.5rem' }}>Sobre este contenido</h5>
                      <p style={{ margin: 0, color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', lineHeight: 1.5 }}>
                        Este video es parte del material exclusivo de **Academia Demo**. <br />
                        Está prohibida su reproducción parcial o total fuera de este portal oficial.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {activeTab === 'communications' && (
            <motion.div key="communications" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
              <section className="dp-card">
                <div className="dp-head">
                  <div>
                    <div className="dp-kicker">Comunicaciones</div>
                    <h2>{commTab === 'aviso' ? 'Aviso a alumnos' : commTab === 'cumple' ? 'Cumpleaños' : 'Vista previa'}</h2>
                  </div>
                </div>
                <PanelTabs
                  name="comunicaciones"
                  value={commTab}
                  onChange={(id) => setCommTab(id as typeof commTab)}
                  items={[
                    { id: 'aviso', label: 'Aviso' },
                    { id: 'cumple', label: 'Cumpleaños' },
                    { id: 'preview', label: 'Vista previa' },
                  ]}
                />
                <div className="dp-body">
              {commTab === 'aviso' && (
              <div className="glass" style={{ padding: '2.5rem', borderRadius: '2rem', border: '1px solid var(--glass-border)', background: 'var(--panel-card)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'rgba(0,105,112,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#006970' }}>
                    <Bell size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>Editor de aviso</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Redacta el mensaje para el portal y el email.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)' }}>ASUNTO DEL MENSAJE</label>
                  <input type="text" value={noticeData.subject} onChange={e => setNoticeData({ ...noticeData, subject: e.target.value })}
                    placeholder="Ej: Cambio de horario este viernes"
                    style={{ padding: '1rem', background: 'var(--panel-surface)', border: '1px solid var(--panel-border)', borderRadius: '1rem', color: 'var(--text-main)', outline: 'none', fontWeight: 700 }} />
                  
                  <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)' }}>CUERPO DEL AVISO</label>
                  <textarea rows={6} value={noticeData.message} onChange={e => setNoticeData({ ...noticeData, message: e.target.value })}
                    placeholder="Escribe aquí el contenido de la notificación..."
                    style={{ padding: '1rem', background: 'var(--panel-surface)', border: '1px solid var(--panel-border)', borderRadius: '1rem', color: 'var(--text-main)', outline: 'none', resize: 'none', fontSize: '0.9rem' }} />
                </div>

                <div style={{ padding: '1.2rem', background: 'rgba(0,105,112,0.06)', borderRadius: '1.2rem', border: '1px dashed #006970' }}>
                  <p style={{ fontSize: '0.75rem', color: '#006970', fontWeight: 700, lineHeight: 1.5 }}>
                    Este mensaje aparece como aviso en el portal de los alumnos. No consume créditos de email.
                  </p>
                </div>

                <button onClick={async () => {
                  if(!noticeData.subject || !noticeData.message) return alert('Por favor escribe un asunto y un mensaje.');
                  if(confirm('¿Enviar este aviso a todos los alumnos?')) {
                    try {
                      setIsSendingNotice(true);
                      const queryParams = activeSedeId ? `?sedeId=${activeSedeId}` : '';
                      const res = await fetch(`${API_URL}/api/admin/broadcast${queryParams}`, { 
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ subject: noticeData.subject, message: noticeData.message })
                      });
                      const data = await res.json();
                      alert(data.message || 'Notificación enviada');
                    } catch(e) { alert('Error en el envío'); }
                    finally { setIsSendingNotice(false); }
                  }
                }} disabled={isSendingNotice} className="btn-primary" 
                  style={{ padding: '1.2rem', borderRadius: '1rem', fontWeight: 800, justifyContent: 'center', background: '#006970', boxShadow: '0 10px 20px rgba(0,105,112,0.22)' }}>
                  {isSendingNotice ? 'Enviando...' : 'Enviar aviso'}
                </button>
              </div>
              )}

              {commTab === 'cumple' && (
              <div className="glass" style={{ padding: '1rem 0 0', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'rgba(0,105,112,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#006970' }}>
                    <Calendar size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>Saludos de cumpleaños</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Envía felicitaciones a quienes cumplen hoy.</p>
                  </div>
                </div>

                <div style={{ padding: '1.2rem', background: 'rgba(0,105,112,0.06)', borderRadius: '1.2rem', border: '1px dashed #006970' }}>
                  <p style={{ fontSize: '0.75rem', color: '#006970', fontWeight: 700, lineHeight: 1.5 }}>
                    El sistema busca a los alumnos que cumplen hoy ({new Date().toLocaleDateString('es-CL', { day: 'numeric', month: 'long' })}) y les envía un correo de la academia.
                  </p>
                </div>

                <button 
                  onClick={handleSendBirthdayGreetings} 
                  disabled={isSendingBirthdays}
                  className="btn-primary" 
                  style={{ padding: '1.2rem', borderRadius: '1rem', fontWeight: 800, justifyContent: 'center', background: '#006970', boxShadow: '0 10px 20px rgba(0,105,112,0.2)' }}
                >
                  <motion.div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    {isSendingBirthdays ? 'Procesando...' : 'Enviar saludos de hoy'}
                  </motion.div>
                </button>
              </div>
              )}

              {commTab === 'preview' && (
              <div className="glass" style={{ padding: '2.5rem', borderRadius: '2rem', border: '1px solid var(--glass-border)', background: 'var(--panel-card)', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                    <Monitor size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>Vista previa en el portal</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Así lo ven los alumnos en su app.</p>
                  </div>
                </div>

                <div style={{ padding: '2rem', background: 'var(--panel-bg)', borderRadius: '2rem', border: '1px solid var(--panel-border)', minHeight: '300px', display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
                   {/* Mockup Header */}
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.3 }}>
                      <div style={{ width: '40px', height: '40px', background: '#334155', borderRadius: '50%' }} />
                      <div style={{ width: '80px', height: '12px', background: '#334155', borderRadius: '6px' }} />
                   </div>

                   {/* Global Broadcast Notice */}
                   {noticeData.subject && !isNoticeDismissed && (
                     <section style={{ margin: '0 1.5rem 2rem', padding: '1.5rem', background: 'linear-gradient(135deg, #063a3e, #006970)', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden' }}>
                       <button 
                         onClick={() => setIsNoticeDismissed(true)}
                         style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '5px', borderRadius: '50%', cursor: 'pointer', zIndex: 10 }}
                       >
                         <X size={16} />
                       </button>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.8rem', color: '#7ee0e6' }}>
                         <Bell size={18} fill="#7ee0e6" />
                         <span style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Aviso de la academia</span>
                       </div>
                       <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', marginBottom: '0.6rem', lineHeight: 1.3 }}>{noticeData.subject}</h4>
                       <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: (noticeData.message || '').replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong style="color:#7ee0e6; font-weight:800;">$1</strong>') }} />
                     </section>
                   )}
                   {/* The Banner Preview */}
                   <motion.div style={{ padding: '1.2rem', borderRadius: '1.2rem', background: '#e8f4f4', border: '1px solid #006970', display: 'flex', flexDirection: 'column', gap: '0.4rem', boxShadow: '0 10px 30px rgba(0,105,112,0.12)', position: 'relative', overflow: 'hidden' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#006970', marginBottom: '0.2rem' }}>
                        <Bell size={14} fill="#006970" />
                        <span style={{ fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Aviso</span>
                      </div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#134e4a', lineHeight: 1.2 }}>{noticeData.subject || 'Título de ejemplo'}</div>
                      <div style={{ fontSize: '0.8rem', color: '#0f766e', lineHeight: 1.4, margin: 0 }} dangerouslySetInnerHTML={{ __html: noticeData.message ? noticeData.message.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong style="color:#006970; font-weight:800;">$1</strong>') : 'Aquí se muestra el cuerpo del aviso…' }} />
                    </motion.div>

                    {/* Mockup rest of portal */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', opacity: 0.2 }}>
                      <div style={{ height: '80px', background: '#334155', borderRadius: '1rem' }} />
                      <div style={{ height: '80px', background: '#334155', borderRadius: '1rem' }} />
                    </div>
                </div>
              </div>
              )}
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === 'schedule' && (
            <motion.div key="schedule" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
              <SchedulePanel
                slots={classSlots}
                sedes={sedes}
                activeSedeId={activeSedeId}
                saving={savingSchedule}
                onSave={handleSaveSchedule}
              />
            </motion.div>
          )}

          {activeTab === 'attendance' && (
            <motion.div key="attendance" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
              <AttendancePanel
                slots={classSlots}
                students={students}
                sedes={sedes}
                activeSedeId={activeSedeId}
                apiUrl={API_URL}
                weekStart={getWeekStart(new Date())}
              />
            </motion.div>
          )}

          {activeTab === 'grades' && (
            <motion.div key="grades" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
              <GradesPanel students={students} onSave={handleUpdateStudent} />
            </motion.div>
          )}

          {activeTab === 'events' && (
            <motion.div key="events" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
              <EventsPanel apiUrl={API_URL} />
            </motion.div>
          )}

          {activeTab === 'payments' && (
            <motion.div key="payments" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <PaymentsPanel
                students={students}
                fees={fees}
                automation={automation}
                formatCLP={formatCLP}
                onSaveFees={(next) => { setFees(next); handleSaveFees(next); }}
                onSaveAutomation={(next) => { setAutomation(next); handleSaveAutomation(next); }}
                onRegisterPayment={(id, date) => handleManualPayment(id, date)}
              />
            </motion.div>
          )}

          {activeTab === 'website' && (
            <motion.div key="website" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
              <section className="dp-card">
                <div className="dp-head">
                  <div>
                    <div className="dp-kicker">Sitio web</div>
                    <h2>{webTab === 'hero' ? 'Portada' : webTab === 'news' ? 'Noticias' : 'Galería'}</h2>
                    <p className="dp-lead">Diseñado a medida de tu academia. Mostramos todo lo que necesites, manteniendo tu identidad.</p>
                  </div>
                </div>
                <PanelTabs
                  name="sitio"
                  value={webTab}
                  onChange={(id) => setWebTab(id as typeof webTab)}
                  items={[
                    { id: 'hero', label: 'Portada' },
                    { id: 'news', label: 'Noticias' },
                    { id: 'gallery', label: 'Galería' },
                  ]}
                />
                <div className="dp-body">
              {webTab === 'hero' && (
              <div className="glass" style={{ padding: '2.5rem', borderRadius: '2.5rem', background: 'var(--panel-card)', border: '1px solid var(--panel-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 900 }}>Hero Videos <br/><span style={{ fontSize: '0.7rem', opacity: 0.5 }}>(Slider Principal)</span></h3>
                  <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.7rem' }} onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'video/mp4';
                    input.onchange = async (e: any) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      
                      try {
                        const response = await fetch(`${API_URL}/api/upload`, {
                          method: 'POST',
                          headers: { 'X-Filename': file.name },
                          body: file
                        });
                        if (response.ok) {
                          const data = await response.json();
                          const url = `${API_URL}${data.url}`;
                          const updated = [...liveHeroVideos, url];
                          setLiveHeroVideos(updated);
                          syncWebsite('hero-videos', updated);
                        } else {
                          alert('Error al subir el archivo');
                        }
                      } catch (error) {
                        console.error('Error uploading:', error);
                      }
                    };
                    input.click();
                  }}><Plus size={14}/> Añadir</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {liveHeroVideos.map((url, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '1.2rem', border: '1px solid var(--panel-border)' }}>
                      <div style={{ width: '60px', height: '40px', background: '#000', borderRadius: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Play size={14} /></div>
                      <div style={{ flex: 1, fontSize: '0.75rem', color: 'var(--panel-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{url.split('/').pop()}</div>
                      <button style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.5rem' }} onClick={() => demoAlert('website')}><X size={16} /></button>
                    </div>
                  ))}
                </div>
              </div>
              )}

              {webTab === 'news' && (
              <div className="glass" style={{ padding: '2.5rem', borderRadius: '2.5rem', background: 'var(--panel-card)', border: '1px solid var(--panel-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 900 }}>Noticias <br/><span style={{ fontSize: '0.7rem', opacity: 0.5 }}>(Slider Diario)</span></h3>
                  <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.7rem' }} onClick={() => {
                    setNewNewsData({
                      title: '', 
                      body: '', 
                      img: '', 
                      link: '#', 
                      label: 'Noticias del Dojo', 
                      date: new Date().toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' }),
                      stats: [{ label: 'Evento', text: '' }]
                    });
                    setIsAddingNews(true);
                  }}><Plus size={14}/> Nueva Noticia</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))', gap: '1.5rem' }}>
                  {liveNews.map((news, i) => (
                    <div key={i} style={{ display: 'flex', gap: '1.2rem', background: 'rgba(255,255,255,0.03)', padding: '1.2rem', borderRadius: '1.5rem', border: '1px solid var(--panel-border)', position: 'relative' }}>
                      <img src={news.img} style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '0.8rem' }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '0.3rem' }}>{news.title}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--panel-muted)' }}>{news.date}</div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--logo-green)', fontWeight: 900, marginTop: '0.4rem' }}>{news.label}</div>
                      </div>
                      <button style={{ position: 'absolute', top: '0.8rem', right: '0.8rem', background: 'rgba(148,163,184,0.15)', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.4rem', borderRadius: '0.5rem' }} onClick={() => demoAlert('website')}><X size={14} /></button>
                    </div>
                  ))}
                </div>
              </div>
              )}

              {webTab === 'gallery' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '0.8rem', flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 900 }}>Galería de Fotos <br/><span style={{ fontSize: '0.7rem', opacity: 0.5 }}>(Mosaico de Inicio)</span></h3>
                  <button className="btn-primary" style={{ padding: '0.5rem 1.2rem', fontSize: '0.7rem', background: 'var(--logo-green)' }} onClick={() => {
                    setNewGalleryData({ img: '', size: 'small' });
                    setIsAddingGallery(true);
                  }}><Plus size={14}/> Nueva Foto</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 160px), 1fr))', gap: '1.5rem' }}>
                  {liveGallery.map((photo, i) => (
                    <div key={i} style={{ position: 'relative', borderRadius: '1.5rem', overflow: 'hidden', border: '1px solid var(--panel-border)', height: '180px' }}>
                      <img src={photo.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', display: 'flex', gap: '0.4rem' }}>
                        <div style={{ background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '0.3rem 0.6rem', borderRadius: '0.6rem', fontSize: '0.6rem', fontWeight: 900, textTransform: 'uppercase' }}>{photo.size}</div>
                        <button style={{ background: '#e2e8f0', border: 'none', color: '#64748b', cursor: 'pointer', padding: '0.4rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => demoAlert('website')}><X size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              )}
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}>
              <section className="dp-card">
                <div className="dp-head">
                  <div>
                    <div className="dp-kicker">Ajustes</div>
                    <h2>{settingsTab === 'ninos' ? 'Planes kids' : settingsTab === 'adultos' ? 'Planes adultos' : 'Claves y avisos'}</h2>
                  </div>
                </div>
                <PanelTabs
                  name="ajustes"
                  value={settingsTab}
                  onChange={(id) => setSettingsTab(id as typeof settingsTab)}
                  items={[
                    { id: 'ninos', label: 'Kids' },
                    { id: 'adultos', label: 'Adultos' },
                    { id: 'claves', label: 'Claves' },
                  ]}
                />
                <div className="dp-body">
              {settingsTab === 'ninos' && (
                <div>
                    <h4 style={{ fontWeight: 900, marginBottom: '1.5rem', color: 'var(--logo-green)', letterSpacing: '0.1em', fontSize: '0.85rem' }}>NIÑOS (Sub 18)</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {Object.keys(fees.kids).map(planKey => (
                        <div key={`kids-${planKey}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{planLabels[planKey] || planKey}</div>
                          <div className="glass" style={{ padding: '0.5rem 1rem', borderRadius: '1rem', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center' }}>
                            <span style={{ fontWeight: 900, marginRight: '0.5rem', color: 'var(--logo-green)' }}>$</span>
                            <input
                              type="number" step="1000"
                              value={fees.kids[planKey]}
                              onChange={e => {
                                const newFees = { ...fees, kids: { ...fees.kids, [planKey]: parseInt(e.target.value) || 0 } };
                                setFees(newFees);
                                handleSaveFees(newFees);
                              }}
                              style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text-main)', fontWeight: 900, width: '80px', fontSize: '1rem' }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                </div>
              )}

              {settingsTab === 'adultos' && (
                <div>
                    <h4 style={{ fontWeight: 900, marginBottom: '1.5rem', color: 'var(--logo-green)', letterSpacing: '0.1em', fontSize: '0.85rem' }}>ADULTOS</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {Object.keys(fees.adults).map(planKey => (
                        <div key={`adults-${planKey}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{planLabels[planKey] || planKey}</div>
                          <div className="glass" style={{ padding: '0.5rem 1rem', borderRadius: '1rem', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center' }}>
                            <span style={{ fontWeight: 900, marginRight: '0.5rem', color: 'var(--logo-green)' }}>$</span>
                            <input
                              type="number" step="1000"
                              value={fees.adults[planKey]}
                              onChange={e => {
                                const newFees = { ...fees, adults: { ...fees.adults, [planKey]: parseInt(e.target.value) || 0 } };
                                setFees(newFees);
                                handleSaveFees(newFees);
                              }}
                              style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text-main)', fontWeight: 900, width: '80px', fontSize: '1rem' }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                </div>
              )}

              {settingsTab === 'claves' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>DÍA DE COBRO (MENSUAL)</label>
                    <input type="range" min="1" max="28" value={automation.reminderDay} onChange={e => {
                      const newAuto = { ...automation, reminderDay: parseInt(e.target.value) };
                      setAutomation(newAuto);
                      handleSaveAutomation(newAuto);
                    }} style={{ width: '100%', accentColor: 'var(--logo-green)' }} />
                    <p style={{ marginTop: '1rem', fontSize: '1.2rem', fontWeight: 900 }}>Hoy es el día {automation.reminderDay}</p>
                  </div>
                  <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1.5rem', borderRadius: '2rem' }} onClick={() => setIsSendingNotice(true)}>ENVIAR COMUNICADO MASIVO</button>
                  <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center', padding: '1.5rem', borderRadius: '2rem', borderColor: 'var(--logo-green)', color: 'var(--logo-green)' }} onClick={handleGeneratePasswordsForAll}>GENERAR CLAVES A ALUMNOS ANTIGUOS</button>
                  <button className="btn-primary" style={{ width: '100%', background: '#111', color: '#fff', border: '1px solid #333', justifyContent: 'center', padding: '1.2rem', borderRadius: '2rem' }} onClick={() => handleSendCredentialsByEmail('ALL')}>SOLO ENVIAR CREDENCIALES POR EMAIL (SIN NOTIFICACIÓN)</button>
                </div>
              )}
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
        </ModuleBoundary>
      </main >

      {/* Admin Modals */}
      <AnimatePresence>
        {
          isAddingStudent && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(10px)' }}>
              <motion.div style={{ width: '100%', maxWidth: '450px', padding: isMobile ? '2rem 1.5rem' : '3.5rem', borderRadius: isMobile ? '2rem' : '3rem', background: '#fff', color: '#111', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 40px 100px -20px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                  <h2 style={{ fontSize: '2.2rem', fontWeight: 900, letterSpacing: '-1px', color: '#111', lineHeight: 1 }}>Nuevo <br /><span style={{ color: 'var(--logo-green)' }}>Alumno</span></h2>
                  <button onClick={() => setIsAddingStudent(false)} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#111', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={18} /></button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <input style={{ padding: '1.2rem', borderRadius: '1rem', border: '1px solid var(--panel-border)', background: '#f8fafc', color: '#111', fontWeight: 700, fontSize: '1rem', outline: 'none' }} placeholder="Nombre completo" value={newStudentData.name} onChange={e => setNewStudentData({ ...newStudentData, name: e.target.value })} />
                  <input style={{ padding: '1.2rem', borderRadius: '1rem', border: '1px solid var(--panel-border)', background: '#f8fafc', color: '#111', fontWeight: 700, fontSize: '1rem', outline: 'none' }} placeholder="Correo electrónico" value={newStudentData.email} onChange={e => setNewStudentData({ ...newStudentData, email: e.target.value })} />
                  <input style={{ padding: '1.2rem', borderRadius: '1rem', border: '1px solid var(--panel-border)', background: '#f8fafc', color: '#111', fontWeight: 700, fontSize: '1rem', outline: 'none' }} placeholder="Teléfono" value={newStudentData.phone} onChange={e => setNewStudentData({ ...newStudentData, phone: e.target.value })} />

                  {role === 'superadmin' && sedes.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.5rem' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--panel-muted)' }}>SEDE</label>
                      <select style={{ padding: '1.2rem', borderRadius: '1rem', border: '1px solid var(--panel-border)', background: '#fff', color: '#111', fontWeight: 900, fontSize: '1rem', outline: 'none', cursor: 'pointer' }} 
                        value={newStudentData.sedeId || ''} 
                        onChange={e => setNewStudentData({ ...newStudentData, sedeId: e.target.value })}
                      >
                        <option value="">Seleccionar Sede...</option>
                        {sedes.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </div>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.5rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--panel-muted)' }}>DÍAS POR SEMANA (PLAN)</label>
                    <select style={{ padding: '1.2rem', borderRadius: '1rem', border: '1px solid var(--panel-border)', background: '#fff', color: '#111', fontWeight: 900, fontSize: '1rem', outline: 'none', cursor: 'pointer' }} value={newStudentData.plan} onChange={e => {
                      const val = e.target.value;
                      const autoFee = fees.adults[val] || 0;
                      setNewStudentData({ ...newStudentData, plan: val, monthlyFee: autoFee });
                    }}>
                      {Object.keys(planLabels).map(p => <option key={p} value={p}>{planLabels[p]}</option>)}
                    </select>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '1rem', marginTop: '0.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: isMobile ? 'none' : 2 }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--panel-muted)' }}>CATEGORÍA DESCUENTO</label>
                        <select 
                            style={{ padding: '1.2rem', borderRadius: '1rem', border: '1px solid var(--panel-border)', background: '#fff', color: '#111', fontWeight: 900, fontSize: '1rem', outline: 'none', cursor: 'pointer' }}
                            value={newStudentData.discountCategory}
                            onChange={e => {
                                if (e.target.value === 'NEW') {
                                    setIsAddingCategory(true);
                                    setNewStudentData({ ...newStudentData, discountCategory: '' });
                                } else {
                                    setIsAddingCategory(false);
                                    setNewStudentData({ ...newStudentData, discountCategory: e.target.value });
                                }
                            }}
                        >
                            <option value="">Ninguno</option>
                            {discountCategories.map(c => <option key={c} value={c}>{c}</option>)}
                            <option value="NEW">+ Crear nueva categoría...</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: isMobile ? 'none' : 1 }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--panel-muted)' }}>% DSCTO.</label>
                        <input 
                            type="number" min="0" max="100"
                            style={{ padding: '1.2rem', borderRadius: '1rem', border: '1px solid var(--panel-border)', background: '#f8fafc', color: '#111', fontWeight: 900, fontSize: '1rem', outline: 'none' }}
                            placeholder="0"
                            value={newStudentData.discountPercentage || ''}
                            onChange={e => setNewStudentData({ ...newStudentData, discountPercentage: Number(e.target.value) })}
                        />
                    </div>
                  </div>

                  {isAddingCategory && (
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                          <input 
                              style={{ flex: 1, padding: '1rem', borderRadius: '0.8rem', border: '1px solid var(--panel-border)', outline: 'none' }} 
                              placeholder="Nombre nueva categoría..."
                              value={newCategoryName}
                              onChange={e => setNewCategoryName(e.target.value)}
                          />
                          <button 
                              style={{ padding: '0 1rem', background: 'var(--logo-green)', color: '#fff', border: 'none', borderRadius: '0.8rem', fontWeight: 800, cursor: 'pointer' }}
                              onClick={async () => {
                                  if (!newCategoryName) return;
                                  const updatedCategories = [...discountCategories, newCategoryName];
                                  setDiscountCategories(updatedCategories);
                                  setNewStudentData({ ...newStudentData, discountCategory: newCategoryName });
                                  setIsAddingCategory(false);
                                  setNewCategoryName('');
                                  await fetch(`${API_URL}/api/discount-categories`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updatedCategories) });
                              }}
                          >
                              GUARDAR
                          </button>
                      </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem 0', borderTop: '2px dashed var(--panel-border)', marginTop: '0.5rem' }}>
                    <span style={{ fontWeight: 800, color: '#111', fontSize: '0.9rem' }}>Mensualidad Final:</span>
                    <span style={{ fontWeight: 900, color: 'var(--logo-green)', fontSize: '1.6rem', letterSpacing: '-1px' }}>
                      {formatCLP(Math.round(newStudentData.monthlyFee * (1 - (newStudentData.discountPercentage || 0) / 100)))}
                    </span>
                  </div>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ marginTop: '0.5rem', width: '100%', padding: '1.4rem', background: 'var(--logo-green)', color: '#fff', fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 900, borderRadius: '1.2rem', border: 'none', cursor: 'pointer', boxShadow: '0 15px 30px rgba(22,196,122,0.3)' }} onClick={handleAddStudent}>REGISTRAR EN EL DOJO</motion.button>
                </div>
              </motion.div>
            </motion.div>
          )
        }

        {
          isSendingNotice && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(10px)' }}>
              <motion.div className="glass" style={{ width: '100%', maxWidth: '600px', padding: isMobile ? '2rem 1.5rem' : '4rem', borderRadius: isMobile ? '2rem' : '3rem', border: '1px solid var(--glass-border)', background: 'var(--panel-surface)', maxHeight: '90vh', overflowY: 'auto' }}>
                <h2 style={{ marginBottom: '2rem', color: 'var(--panel-text)' }}>Comunicado Masivo</h2>
                <input className="glass" style={{ width: '100%', padding: '1.2rem', marginBottom: '1.5rem', background: 'var(--panel-bg)', color: 'var(--panel-text)', border: '1px solid var(--panel-border)' }} placeholder="Asunto del correo" value={noticeData.subject} onChange={e => setNoticeData({ ...noticeData, subject: e.target.value })} />
                <textarea className="glass" style={{ width: '100%', height: '200px', padding: '1.5rem', resize: 'none', background: 'var(--panel-bg)', color: 'var(--panel-text)', border: '1px solid var(--panel-border)' }} placeholder="Mensaje para todos los alumnos..." value={noticeData.message} onChange={e => setNoticeData({ ...noticeData, message: e.target.value })} />
                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexDirection: isMobile ? 'column' : 'row' }}>
                  <button onClick={() => setIsSendingNotice(false)} style={{ flex: 1, background: 'none', border: '1px solid var(--glass-border)', padding: '1.2rem', borderRadius: '1rem', color: 'var(--text-main)', cursor: 'pointer' }}>CANCELAR</button>
                  <button className="btn-primary" style={{ flex: 2, justifyContent: 'center', background: 'var(--logo-green)', padding: '1.2rem', borderRadius: '1rem' }} onClick={handleSendMassNotice}>ENVIAR A TODOS</button>
                </div>
              </motion.div>
            </motion.div>
          )
        }

        {
          selectedStudent && (
            <StudentFile
              student={selectedStudent}
              isMobile={isMobile}
              role={role}
              sedes={sedes}
              beltLabels={beltLabels}
              planLabels={planLabels}
              isGeneratingPayment={isGeneratingPayment}
              weekStart={getWeekStart(new Date())}
              avatarUrl={studentPhoto(selectedStudent)}
              formatCLP={formatCLP}
              formatDate={formatDate}
              calculateAge={calculateAge}
              onClose={() => { setSelectedStudent(null); setIsEditingStudent(false); }}
              onSave={(draft) => handleUpdateStudent(draft)}
              onChangePhoto={() => handleAdminUploadAvatar(selectedStudent)}
              onViewPhoto={() => {
                setPhotoLightboxStudent(selectedStudent);
              }}
              onAddFamily={() => {
                setNewStudentData({ name: '', email: selectedStudent.email || '', phone: selectedStudent.phone || '', birthDate: '', documentId: '', belt: 'WHITE', plan: selectedStudent.plan ? selectedStudent.plan.toString() : '3', monthlyFee: selectedStudent.monthlyFee || 40000, discountCategory: '', discountPercentage: 0, sedeId: selectedStudent.sedeId?.toString() || selectedStudent.sede_id?.toString() || '' });
                setSelectedStudent(null);
                setIsAddingStudent(true);
              }}
              onCreatePaymentLink={() => handleCreatePaymentLink(selectedStudent)}
              onSendReminder={() => handleSendPaymentReminder(selectedStudent)}
              onDelete={() => handleDeleteStudent(selectedStudent.id)}
              onManualPay={(draft) => {
                if (!window.confirm(`¿Registrar pago manual de ${draft.name} por ${formatCLP(draft.monthlyFee || 0)}?`)) return;
                const todayStr = new Date().toISOString().split('T')[0];
                handleUpdateStudent({
                  ...draft,
                  isPaid: true,
                  lastPaymentDate: todayStr,
                  lastPaymentMonth: todayStr.substring(0, 7),
                  history: [
                    ...(draft.history || []),
                    { date: todayStr, status: 'Completado' as const, amount: draft.monthlyFee || 0 }
                  ]
                });
              }}
            />
          )
        }

        {
          isAddingVideo && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', backdropFilter: 'blur(10px)' }}>
              <motion.div style={{ width: '100%', maxWidth: '500px', padding: window.innerWidth < 768 ? '2rem' : '3.5rem', borderRadius: window.innerWidth < 768 ? '2rem' : '3.5rem', background: '#fff', color: '#111', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 40px 100px -20px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                  <h2 style={{ fontSize: '2.2rem', fontWeight: 900, letterSpacing: '-1px', color: '#111', lineHeight: 1 }}>Nuevo <br /><span style={{ color: 'var(--logo-green)' }}>Video</span></h2>
                  <button onClick={() => setIsAddingVideo(false)} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#111', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={18} /></button>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  {getYouTubeID(newVideoData.url) && (
                    <div style={{ width: '100%', height: '180px', background: '#000', borderRadius: '2rem', overflow: 'hidden', border: '3px solid var(--logo-green)', position: 'relative' }}>
                      <img src={`https://img.youtube.com/vi/${getYouTubeID(newVideoData.url)}/mqdefault.jpg`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(5,168,106,0.2)' }}>
                         <Play size={40} fill="#fff" color="#fff" />
                      </div>
                    </div>
                  )}

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 800, fontSize: '0.7rem', color: '#64748b' }}>TÍTULO DE LA TÉCNICA</label>
                    <input style={{ width: '100%', padding: '1.2rem', borderRadius: '1.2rem', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#111', fontWeight: 700, fontSize: '1rem', outline: 'none' }} placeholder="Ej: Pasaje de Guardia X" value={newVideoData.title} onChange={e => setNewVideoData({ ...newVideoData, title: e.target.value })} />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 800, fontSize: '0.7rem', color: '#64748b' }}>LINK DE YOUTUBE (OCULTO)</label>
                    <input style={{ width: '100%', padding: '1.2rem', borderRadius: '1.2rem', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#111', fontWeight: 700, fontSize: '1rem', outline: 'none' }} placeholder="https://youtube.com/watch?v=..." value={newVideoData.url} onChange={e => {
                      const url = e.target.value;
                      const id = getYouTubeID(url);
                      setNewVideoData({ 
                        ...newVideoData, 
                        url, 
                        thumbnail: id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : newVideoData.thumbnail 
                      });
                    }} />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 800, fontSize: '0.7rem', color: '#64748b' }}>DESCRIPCIÓN DE LA TÉCNICA</label>
                    <textarea 
                      style={{ width: '100%', padding: '1.2rem', borderRadius: '1.2rem', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#111', fontWeight: 600, fontSize: '0.9rem', outline: 'none', resize: 'none' }} 
                      rows={3}
                      placeholder="Breve descripción de lo que verá el alumno..." 
                      value={newVideoData.description} 
                      onChange={e => setNewVideoData({ ...newVideoData, description: e.target.value })} 
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 800, fontSize: '0.7rem', color: '#64748b' }}>CATEGORÍA TÉCNICA</label>
                      <select style={{ width: '100%', padding: '1rem', borderRadius: '1rem', border: '1px solid #e2e8f0', background: '#fff', color: '#111', fontWeight: 900, fontSize: '0.9rem', outline: 'none' }} value={newVideoData.category} onChange={e => setNewVideoData({ ...newVideoData, category: e.target.value })}>
                        {VIDEO_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 800, fontSize: '0.7rem', color: '#64748b' }}>DIRIGIDO A</label>
                      <select style={{ width: '100%', padding: '1rem', borderRadius: '1rem', border: '1px solid #e2e8f0', background: '#fff', color: '#111', fontWeight: 900, fontSize: '0.9rem', outline: 'none' }} value={newVideoData.targetAudience} onChange={e => setNewVideoData({ ...newVideoData, targetAudience: e.target.value as any })}>
                        <option value="ADULTS">Adultos</option>
                        <option value="KIDS">Niños</option>
                        <option value="BOTH">Ambos</option>
                      </select>
                    </div>
                  </div>

                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ marginTop: '0.5rem', width: '100%', padding: '1.2rem', background: 'var(--logo-green)', color: '#fff', fontSize: '0.9rem', letterSpacing: '0.05em', fontWeight: 900, borderRadius: '1.2rem', border: 'none', cursor: 'pointer', boxShadow: '0 15px 30px rgba(22,196,122,0.3)' }} onClick={handleAddVideo}>PUBLICAR TÉCNICA</motion.button>
                </div>
              </motion.div>
            </motion.div>
          )
        }

        {
          isAddingNews && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(10px)' }}>
              <motion.div style={{ width: '100%', maxWidth: '500px', padding: isMobile ? '2rem 1.5rem' : '3.5rem', borderRadius: isMobile ? '2rem' : '3rem', background: '#fff', color: '#111', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 40px 100px -20px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                  <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.2rem', fontWeight: 900, letterSpacing: '-1px', color: '#111' }}>Crear <span style={{ color: 'var(--logo-green)' }}>Noticia</span></h2>
                  <button onClick={() => setIsAddingNews(false)} style={{ background: 'var(--panel-surface)', border: '1px solid var(--panel-border)', color: '#111', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={18} /></button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  {newNewsData.img && (
                    <div style={{ width: '100%', height: '150px', borderRadius: '1.5rem', overflow: 'hidden', border: '2px solid var(--logo-green)', marginBottom: '0.5rem' }}>
                      <img src={newNewsData.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Preview" onError={(e) => (e.currentTarget.src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800')} />
                    </div>
                  )}
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 800, fontSize: '0.7rem', color: '#64748b' }}>TÍTULO DE LA NOTICIA</label>
                    <input style={{ width: '100%', padding: '1.2rem', borderRadius: '1rem', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#111', fontWeight: 700, fontSize: '1rem', outline: 'none' }} placeholder="Escribe el titular principal..." value={newNewsData.title} onChange={e => setNewNewsData({ ...newNewsData, title: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 800, fontSize: '0.7rem', color: '#64748b' }}>IMAGEN DE LA NOTICIA (Link o subir archivo)</label>
                    <div style={{ display: 'flex', gap: '0.8rem' }}>
                      <input style={{ flex: 1, padding: '1.2rem', borderRadius: '1rem', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#111', fontWeight: 700, fontSize: '1rem', outline: 'none' }} placeholder="https://..." value={newNewsData.img} onChange={e => setNewNewsData({ ...newNewsData, img: e.target.value })} />
                      <label style={{ background: 'var(--logo-green)', color: '#fff', padding: '0 1.5rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontWeight: 900, transition: 'all 0.2s' }} className="hover-lift">
                        <Camera size={20} />
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleGenericImageUpload(e, (b64) => setNewNewsData({ ...newNewsData, img: b64 }))} />
                      </label>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 800, fontSize: '0.7rem', color: '#64748b' }}>CUERPO / RESUMEN DE LA NOTICIA</label>
                    <textarea style={{ width: '100%', padding: '1.2rem', borderRadius: '1rem', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#111', fontWeight: 600, fontSize: '0.9rem', outline: 'none', minHeight: '100px', resize: 'none' }} placeholder="Escribe el contenido de la noticia aquí..." value={newNewsData.body} onChange={e => setNewNewsData({ ...newNewsData, body: e.target.value })} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 800, fontSize: '0.7rem', color: '#64748b' }}>ETIQUETA (CATEGORÍA)</label>
                      <input style={{ width: '100%', padding: '1.2rem', borderRadius: '1rem', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#111', fontWeight: 700, fontSize: '0.9rem', outline: 'none' }} placeholder="Ej: Noticias del Dojo" value={newNewsData.label} onChange={e => setNewNewsData({ ...newNewsData, label: e.target.value })} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 800, fontSize: '0.7rem', color: '#64748b' }}>FECHA DE PUBLICACIÓN</label>
                      <input style={{ width: '100%', padding: '1.2rem', borderRadius: '1rem', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#111', fontWeight: 700, fontSize: '0.9rem', outline: 'none' }} placeholder="Ej: 11 Mar, 2026" value={newNewsData.date} onChange={e => setNewNewsData({ ...newNewsData, date: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 800, fontSize: '0.7rem', color: '#64748b' }}>LINK A ARTÍCULO COMPLETO (OPCIONAL)</label>
                    <input style={{ width: '100%', padding: '1.2rem', borderRadius: '1rem', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#111', fontWeight: 700, fontSize: '0.9rem', outline: 'none' }} placeholder="https://..." value={newNewsData.link} onChange={e => setNewNewsData({ ...newNewsData, link: e.target.value })} />
                  </div>
                  <button className="btn-primary" style={{ marginTop: '1rem', width: '100%', justifyContent: 'center', padding: '1.5rem', borderRadius: '2rem', background: 'var(--logo-green)', color: '#fff', fontWeight: 900, fontSize: '1rem', letterSpacing: '0.05em' }} onClick={() => {
                    if (newNewsData.title && newNewsData.body && newNewsData.img) {
                      const updated = [newNewsData, ...liveNews];
                      setLiveNews(updated);
                      syncWebsite('news', updated);
                      setIsAddingNews(false);
                    } else {
                      alert('Por favor, completa al menos el título, imagen y cuerpo.');
                    }
                  }}>PUBLICAR NOTICIA EN EL SLIDER</button>
                </div>
              </motion.div>
            </motion.div>
          )
        }

        {
          isAddingGallery && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(10px)' }}>
              <motion.div style={{ width: '100%', maxWidth: '450px', padding: isMobile ? '2rem 1.5rem' : '3.5rem', borderRadius: isMobile ? '2rem' : '3rem', background: '#fff', color: '#111', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 40px 100px -20px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                  <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.2rem', fontWeight: 900, letterSpacing: '-1px', color: '#111' }}>Añadir a <span style={{ color: 'var(--logo-green)' }}>Galería</span></h2>
                  <button onClick={() => setIsAddingGallery(false)} style={{ background: 'var(--panel-surface)', border: '1px solid var(--panel-border)', color: '#111', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={18} /></button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {newGalleryData.img && (
                    <div style={{ width: '100%', height: '200px', borderRadius: '1.5rem', overflow: 'hidden', border: '2px solid var(--logo-green)' }}>
                      <img src={newGalleryData.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 800, fontSize: '0.7rem', color: '#64748b' }}>IMAGEN (Link o subir archivo)</label>
                    <div style={{ display: 'flex', gap: '0.8rem' }}>
                      <input style={{ flex: 1, padding: '1.2rem', borderRadius: '1rem', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#111', fontWeight: 700, fontSize: '1rem', outline: 'none' }} placeholder="https://..." value={newGalleryData.img} onChange={e => setNewGalleryData({ ...newGalleryData, img: e.target.value })} />
                      <label style={{ background: 'var(--logo-green)', color: '#fff', padding: '0 1.5rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontWeight: 900 }} className="hover-lift">
                        <Camera size={20} />
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleGenericImageUpload(e, (b64) => setNewGalleryData({ ...newGalleryData, img: b64 }))} />
                      </label>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 800, fontSize: '0.7rem', color: '#64748b' }}>TAMAÑO EN EL MOSAICO</label>
                    <select style={{ width: '100%', padding: '1.2rem', borderRadius: '1rem', border: '1px solid #e2e8f0', background: '#fff', color: '#111', fontWeight: 900, fontSize: '1rem', outline: 'none', cursor: 'pointer' }} value={newGalleryData.size} onChange={e => setNewGalleryData({ ...newGalleryData, size: e.target.value as any })}>
                      <option value="small">Pequeño (1x1)</option>
                      <option value="wide">Ancho (2x1)</option>
                      <option value="tall">Alto (1x2)</option>
                      <option value="large">Grande (2x2)</option>
                    </select>
                  </div>
                  <button className="btn-primary" style={{ marginTop: '1rem', width: '100%', justifyContent: 'center', padding: '1.5rem', borderRadius: '2rem', background: 'var(--logo-green)', color: '#fff', fontWeight: 900 }} onClick={() => {
                    if (newGalleryData.img) {
                      const updated = [newGalleryData, ...liveGallery];
                      setLiveGallery(updated);
                      syncWebsite('gallery', updated);
                      setIsAddingGallery(false);
                    } else {
                      alert('Por favor, selecciona una imagen.');
                    }
                  }}>AGREGAR A GALERÍA</button>
                </div>
              </motion.div>
            </motion.div>
          )
        }

        {/* ====== DUAL PAYMENT MODAL ====== */}
        {showPaymentModal && paymentModalTarget && (() => {
          const studentsArr = Array.isArray(paymentModalTarget) ? paymentModalTarget : [paymentModalTarget];
          const baseAmount = studentsArr.reduce((acc, s) => acc + (s.monthlyFee || 40000), 0);
          const { charged, surcharge } = getSurcharge(baseAmount);
          const isGroup = studentsArr.length > 1;

          // Datos de Mercado Pago para transferencia directa


          return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, zIndex: 9000, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
              onClick={closePaymentModal}>
              <motion.div initial={{ y: 40, opacity: 0, scale: 0.97 }} animate={{ y: 0, opacity: 1, scale: 1 }} transition={{ type: 'spring', damping: 25 }}
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
                style={{ width: '100%', maxWidth: '480px', background: '#fff', borderRadius: '2.5rem', overflow: 'hidden', boxShadow: '0 50px 120px rgba(0,0,0,0.4)', maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}>
                
                {/* Header */}
                <div style={{ padding: '1.5rem 1.5rem 0', textAlign: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ width: 36 }} />
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#111', letterSpacing: '-0.5px' }}>Pagar Mensualidad</h2>
                    <button onClick={closePaymentModal} style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}><X size={16} /></button>
                  </div>
                  
                  {/* Student(s) summary */}
                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '1rem', padding: '0.8rem 1rem', marginBottom: '1rem' }}>
                    {studentsArr.map(s => (
                      <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.3rem 0' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#166534' }}>{s.name}</span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#166534' }}>{formatCLP(s.monthlyFee || 40000)}</span>
                      </div>
                    ))}
                    {isGroup && (
                      <div style={{ borderTop: '1px solid #bbf7d0', marginTop: '0.5rem', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#166534' }}>Total</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#166534' }}>{formatCLP(baseAmount)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content area - scrollable */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '0 1.5rem 1.5rem' }}>
                  {/* Unified Payment Area */}
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    
                    <div style={{ background: '#eff6ff', borderRadius: '1rem', padding: '1.2rem', border: '1px solid #bfdbfe' }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#1e40af', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <MpLogo height={32} />
                      </div>
                      <p style={{ fontSize: '0.8rem', color: '#1e3a5f', lineHeight: 1.5, margin: 0, fontWeight: 600 }}>
                        Este link permite procesar la mensualidad utilizando <b>cualquier método de pago</b>: transferencia bancaria, cuenta de Mercado Pago, o tarjetas de débito/crédito.
                      </p>
                    </div>

                    <div style={{ background: '#f8fafc', borderRadius: '1rem', padding: '1.2rem', border: '1px solid #e2e8f0', margin: '0.5rem 0' }}>
                      <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.8rem' }}>RESUMEN DE COBRO</div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #f1f5f9' }}>
                        <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>Mensualidad Base</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>{formatCLP(baseAmount)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #f1f5f9' }}>
                        <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>Cargo plataforma Mercado Pago</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ef4444' }}>+ {formatCLP(surcharge)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem 0 0.2rem', marginTop: '0.3rem' }}>
                        <span style={{ fontSize: '1rem', fontWeight: 900, color: '#0f172a' }}>Total a pagar</span>
                        <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#3b82f6' }}>{formatCLP(charged)}</span>
                      </div>
                    </div>

                    <div style={{ background: '#fefce8', borderRadius: '0.8rem', padding: '0.7rem 1rem', border: '1px solid #fde68a', marginBottom: '1rem' }}>
                      <p style={{ fontSize: '0.68rem', color: '#854d0e', margin: 0, lineHeight: 1.5 }}>
                        <strong>¿Por qué hay un cargo adicional?</strong> Las plataformas de pago retienen una comisión operativa. Este cargo se suma para asegurar que el 100% del valor de la mensualidad llegue íntegramente al Dojo.
                      </p>
                    </div>


                    <button 
                      onClick={() => handleCreatePaymentLink(paymentModalTarget!)}
                      disabled={isGeneratingPayment}
                      style={{ width: '100%', padding: '1.05rem 1.1rem', borderRadius: '1rem', border: 'none', background: isGeneratingPayment ? '#3d2bb3' : '#0a0080', color: '#fff', fontWeight: 900, fontSize: '0.95rem', cursor: isGeneratingPayment ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', boxShadow: '0 10px 25px rgba(10,0,128,0.28)', transition: 'all 0.2s', marginBottom: '1.5rem' }}>
                      {isGeneratingPayment ? (
                        <><span className="premium-spinner" style={{ width: '16px', height: '16px', borderTopColor: '#fff', borderRightColor: 'rgba(255,255,255,0.6)' }} /> Redirigiendo a portal seguro...</>
                      ) : (
                        <MpLogo variant="white" height={34} />
                      )}
                    </button>
                  </motion.div>

                  {/* Footer note */}
                  <p style={{ fontSize: '0.6rem', color: '#94a3b8', textAlign: 'center', marginTop: '1rem', lineHeight: 1.4 }}>
                    Pagos procesados de forma segura. Ante cualquier duda,{' '}
                    <a href="mailto:contacto@dpsistemas.cl" style={{ color: '#16C47A', fontWeight: 700 }}>contáctanos</a>.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
        
        {/* Interactive Avatar Cropper Modal */}
        {rawImageForCrop && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(15px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
            <div className="glass" style={{ background: '#ffffff', color: '#1e293b', padding: '2rem', borderRadius: '2rem', width: '100%', maxWidth: '380px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid rgba(0,0,0,0.08)' }}>
              
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 900, margin: 0, color: 'var(--tatami-black)' }}>Ajustar Foto</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--panel-muted)', marginTop: '0.4rem' }}>Arrastra para encuadrar y usa el zoom</p>
              </div>

              {/* Circular Cropping Frame */}
              <div 
                onMouseDown={(e) => handleDragStart(e.clientX, e.clientY)}
                onMouseMove={(e) => handleDragMove(e.clientX, e.clientY)}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
                onTouchStart={(e) => handleDragStart(e.touches[0].clientX, e.touches[0].clientY)}
                onTouchMove={(e) => handleDragMove(e.touches[0].clientX, e.touches[0].clientY)}
                onTouchEnd={handleDragEnd}
                style={{ 
                  width: '250px', 
                  height: '250px', 
                  borderRadius: '50%', 
                  overflow: 'hidden', 
                  position: 'relative', 
                  background: '#f1f5f9', 
                  border: '3px solid var(--logo-green)',
                  boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.15), 0 10px 25px rgba(0,0,0,0.1)',
                  cursor: 'move',
                  touchAction: 'none'
                }}
              >
                {cropImageObj && (() => {
                  const C = 250;
                  const s0 = C / Math.min(cropImageObj.width, cropImageObj.height);
                  const W = cropImageObj.width * s0 * cropZoom;
                  const H = cropImageObj.height * s0 * cropZoom;
                  const left = (C - W) / 2 + cropOffset.x;
                  const top = (C - H) / 2 + cropOffset.y;

                  return (
                    <img 
                      src={rawImageForCrop} 
                      style={{ 
                        position: 'absolute',
                        width: `${W}px`,
                        height: `${H}px`,
                        left: `${left}px`,
                        top: `${top}px`,
                        maxWidth: 'none',
                        maxHeight: 'none',
                        userSelect: 'none',
                        pointerEvents: 'none'
                      }} 
                    />
                  );
                })()}
                
                {/* Outer shadow overlay to emphasize the circle crop */}
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', boxShadow: 'inset 0 0 15px rgba(0,0,0,0.2)', pointerEvents: 'none' }} />
              </div>

              {/* Slider zoom */}
              <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0 0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--panel-muted)' }}>A-</span>
                <input 
                  type="range" 
                  min="1" 
                  max="3" 
                  step="0.01" 
                  value={cropZoom} 
                  onChange={(e) => handleZoomChange(parseFloat(e.target.value))} 
                  style={{ flex: 1, accentColor: 'var(--logo-green)', cursor: 'pointer', height: '6px', borderRadius: '3px', background: '#e2e8f0' }} 
                />
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--panel-muted)' }}>A+</span>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                <button 
                  onClick={() => setRawImageForCrop(null)} 
                  disabled={isCroppingSave}
                  style={{ flex: 1, background: '#f1f5f9', border: 'none', borderRadius: '1rem', padding: '0.8rem', color: '#64748b', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSaveCrop} 
                  disabled={isCroppingSave}
                  style={{ flex: 1, background: 'var(--logo-green)', border: 'none', borderRadius: '1rem', padding: '0.8rem', color: '#fff', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', boxShadow: '0 10px 20px rgba(5,168,106,0.2)' }}
                >
                  {isCroppingSave ? 'Guardando...' : 'Guardar'}
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ── Photo Lightbox Modal (Admin) ── */}
        {photoLightboxStudent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPhotoLightboxStudent(null)}
            style={{ position: 'fixed', inset: 0, zIndex: 99998, background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(20px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', padding: '2rem' }}
          >
            {/* Close button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setPhotoLightboxStudent(null)}
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', backdropFilter: 'blur(10px)' }}
            >
              <X size={20} />
            </motion.button>

            {/* Student name tag */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              style={{ color: '#fff', fontWeight: 900, fontSize: isMobile ? '1.2rem' : '1.5rem', letterSpacing: '-0.03em', textAlign: 'center', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
              onClick={e => e.stopPropagation()}
            >
              {photoLightboxStudent.name}
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: '0.3rem' }}>Foto de Perfil</div>
            </motion.div>

            {/* Photo */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              onClick={e => e.stopPropagation()}
              style={{ borderRadius: '24px', overflow: 'hidden', width: isMobile ? '240px' : '300px', height: isMobile ? '240px' : '300px', border: '3px solid #006970', boxShadow: '0 30px 80px rgba(0,0,0,0.45)', flexShrink: 0, background: '#fff' }}
            >
              <img
                src={studentPhoto(photoLightboxStudent)}
                onError={(e) => { e.currentTarget.src = BRAND.mascotAvatar; }}
                alt={photoLightboxStudent.name}
                style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center', display: 'block', background: '#fff' }}
              />
            </motion.div>

            {/* Change photo button (admin only) */}
            {(role === 'superadmin' || role === 'admin') && (
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={e => { e.stopPropagation(); setPhotoLightboxStudent(null); handleAdminUploadAvatar(photoLightboxStudent); }}
                style={{ background: 'var(--logo-green)', border: 'none', borderRadius: '1rem', padding: '0.9rem 2rem', color: '#fff', fontWeight: 900, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 10px 30px rgba(5,168,106,0.35)' }}
              >
                <Camera size={16} /> Cambiar Foto de Perfil
              </motion.button>
            )}
          </motion.div>
        )}
        
      </AnimatePresence>
      <ModuleBoundary name="guia">
        <DemoGuide mode="admin" moduleId={activeTab} onGo={(tab) => { setActiveTab(tab as any); setIsMobileMenuOpen(false); }} />
      </ModuleBoundary>
    </motion.div>
  );
};

export default App;

// --- SUBSYSTEM: Waiver / Terms Modal ---
const AcceptTermsModal: React.FC<{ student: Student, onAccept: () => void }> = ({ student, onAccept }) => {
  const [accepted, setAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const termsRef = useRef<HTMLDivElement>(null);

  // Comprobar si no necesita scroll inicial (textos cortos)
  useEffect(() => {
    if (termsRef.current) {
      if (termsRef.current.scrollHeight <= termsRef.current.clientHeight + 10) {
        setHasScrolledToBottom(true);
      }
    }
  }, []);

  const handleScroll = () => {
    if (termsRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = termsRef.current;
      // 10px de margen de error al scrollear
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        setHasScrolledToBottom(true);
      }
    }
  };

  const handleConfirm = async () => {
    if (!accepted || !hasScrolledToBottom) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/students/${student.id}/accept-terms`, { method: 'POST' });
      if (res.ok) {
        onAccept();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(15px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ width: '100%', maxWidth: '550px', background: '#fff', borderRadius: '2.5rem', overflow: 'hidden', boxShadow: '0 50px 100px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
        <div style={{ padding: '1.5rem 1.5rem 1rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#111', letterSpacing: '-0.5px', marginBottom: '0.5rem' }}>Aviso Importante</h2>
          <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: 1.4, margin: 0 }}>Hola <strong>{student.name}</strong>, para ingresar al portal es necesario que leas y aceptes la liberación de responsabilidad.</p>
        </div>
        
        <div 
          ref={termsRef}
          onScroll={handleScroll}
          style={{ flex: 1, overflowY: 'auto', padding: '0 1.5rem', margin: '0' }}
        >
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '1.2rem', padding: '1rem', fontSize: '0.75rem', color: '#334155', lineHeight: 1.5, whiteSpace: 'pre-line' }}>
            <h4 style={{ textAlign: 'center', margin: '0 0 1rem 0', fontWeight: 900 }}>LIBERACIÓN DE RESPONSABILIDAD</h4>
            {`CLUB DEPORTIVO SOCIAL Y CULTURAL RANAS JIU JITSU

            A través de este documento acepto y libero de toda responsabilidad a la Academia Demo, a sus representantes, asociados, recinto que albergue actividades y/o sponsors del club y/o cualquier evento, de responsabilidad ante accidentes que generen lesiones y/o enfermedades, como resultado de mi participación como deportista o espectador en los entrenamientos, competencias y actividades propias de la organización.
            Por lo cual libero totalmente a la Academia Demo, de ser declarado responsable por lesiones que sucedan durante la práctica de la actividad deportiva o como espectador.

            Declaro que:
            1. He leído y acepto las condiciones de participación del Academia Demo también su reglamento y circular de financiamiento.
            2. Entiendo que la participación incluye riesgo de lesiones físicas.
            3. Estoy en conocimiento de alguna condición médica previamente informada en la anamnesis que limite la participación de las actividades del Academia Demo.
            4. Poseo cobertura médica para estas actividades.
            5. Entiendo como apoderado, tutor o participante que en el caso de que exista algún accidente o lesión el Academia Demo y sus representantes proveerán los primeros auxilios básicos, derivando al centro asistencial señalado previamente en la anamnesis, informando al tutor o familiar.
            6. Acepto que el Academia Demo haga uso de fotografías, video o cualquier otra forma de broadcast, para efectos de promoción nacional e internacional.
            7. A través de mi firma en este documento acepto toda responsabilidad de mis acciones en relación con mi participación del Academia Demo.
            8. Acepto la responsabilidad por mis posesiones y equipo deportivo durante los entrenamientos.
            9. A través de este documento libero de toda responsabilidad a la Academia Demo y a sus representantes, voluntarios, sponsors, directores, miembros, empleados, agentes y administradores de toda compensación o prosecución relacionada a las actividades del club de las cuales pueda resultar lesionado y/o accidentado.
            10. Libero de toda responsabilidad, posible persecución y responsabilidad económica o demandas de compensación a los organizadores por pérdida de posesiones personales o equipamiento deportivo.
            11. Acepto subir y permitir el uso de una fotografía de mi rostro (foto de perfil) con el fin exclusivo de permitir mi correcta identificación por parte del personal administrativo y los profesores del club en los registros internos.`}
          </div>
        </div>

        <div style={{ padding: '1rem 1.5rem 1.5rem' }}>
          <label style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start', cursor: hasScrolledToBottom ? 'pointer' : 'not-allowed', marginBottom: '1rem', opacity: hasScrolledToBottom ? 1 : 0.5 }}>
            <input type="checkbox" disabled={!hasScrolledToBottom} checked={accepted} onChange={e => setAccepted(e.target.checked)} style={{ width: '18px', height: '18px', marginTop: '2px', accentColor: 'var(--logo-green)' }} />
            <span style={{ fontSize: '0.8rem', color: '#111', fontWeight: 600 }}>He leído y entiendo a cabalidad este documento y sus términos de responsabilidad.</span>
          </label>
          <button onClick={handleConfirm} disabled={!accepted || !hasScrolledToBottom || isSubmitting} style={{ width: '100%', padding: '1rem', borderRadius: '1rem', border: 'none', background: (accepted && hasScrolledToBottom) ? 'var(--logo-green)' : '#cbd5e1', color: '#fff', fontWeight: 900, fontSize: '0.9rem', cursor: (accepted && hasScrolledToBottom) ? 'pointer' : 'not-allowed', transition: 'all 0.3s' }}>
            {isSubmitting ? 'Guardando...' : 'ACEPTAR Y ENTRAR AL PORTAL'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

