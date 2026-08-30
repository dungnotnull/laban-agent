import React from 'react';
import { Compass, Sparkles, ShieldCheck, BookOpen, TrendingUp, MapPin, Briefcase, Users, Building2, Award, Globe } from 'lucide-react';
import { GOLDEN_PROFILES } from '../data/goldenProfiles';
import { Language } from '../types';
import ReactCountryFlag from 'react-country-flag';
import { User } from 'firebase/auth';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedGoldenId: string;
  onSelectGoldenPersona: (id: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  isOnlineDemo?: boolean;
  user?: User | null;
  isAuthLoading?: boolean;
  onLogin?: () => void;
  onLogout?: () => void;
  onOpenAuthModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedGoldenId,
  onSelectGoldenPersona,
  language,
  setLanguage,
  user,
  isAuthLoading = false,
  onLogin,
  onLogout,
  onOpenAuthModal
}) => {
  const tabs = [
    { id: 'suggest', labelVi: 'Định Hướng AI', labelEn: 'AI Guidance', icon: Sparkles },
    { id: 'resilience', labelVi: 'Điểm Kháng AI', labelEn: 'Resilience Score', icon: ShieldCheck },
    { id: 'trajectories', labelVi: 'Lộ Trình & Lương', labelEn: 'Trajectories', icon: TrendingUp },
    { id: 'roadmap', labelVi: 'Bản Đồ Kỹ Năng', labelEn: 'Skill Roadmap', icon: MapPin },
    { id: 'research', labelVi: 'Thư Viện RAG', labelEn: 'Research Base', icon: BookOpen },
    { id: 'news', labelVi: 'Tin Tức AI', labelEn: 'Job News', icon: Globe },
    { id: 'jobs', labelVi: 'Việc Làm AI', labelEn: 'AI Jobs', icon: Briefcase },
    { id: 'community', labelVi: 'Cộng đồng', labelEn: 'Community', icon: Users },
    { id: 'employer', labelVi: 'Nhà Tuyển Dụng', labelEn: 'Employers', icon: Building2 },
    { id: 'proof', labelVi: 'Bảng Minh Chứng', labelEn: 'Proof / KPIs', icon: Award }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 text-slate-900 shadow-xs">
      {/* Top Banner / Judge Quick-Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-1.5 text-xs text-white flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-slate-300 hidden sm:inline font-medium">
            {language === 'vi' ? 'Hệ thống Định hướng Nghề nghiệp Kỷ nguyên AI • Chuẩn dữ liệu O*NET & MOLISA' : 'Evidence-Based AI Career Orientation Platform'}
          </span>
        </div>

        {/* User & Settings Bar */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Language Toggle */}
          <button
            id="lang-toggle-btn"
            onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
            className="px-2.5 py-0.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition cursor-pointer"
            title="Chuyển đổi ngôn ngữ / Switch language"
          >
            {language === 'vi' ? (
              <span className="flex items-center gap-1.5"><ReactCountryFlag countryCode="VN" svg /> VI</span>
            ) : (
              <span className="flex items-center gap-1.5"><ReactCountryFlag countryCode="GB" svg /> EN</span>
            )}
          </button>
          
          {/* User Auth */}
          {user ? (
            <div className="flex items-center gap-2 border-l border-slate-700 pl-2 ml-1">
              <button
                type="button"
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 hover:opacity-80 transition cursor-pointer"
                title="Xem thông tin tài khoản và đồng bộ"
              >
                <img
                  src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}&background=f59e0b&color=fff`}
                  alt="avatar"
                  className="w-6 h-6 rounded-full border border-amber-400 object-cover"
                />
                <span className="text-[11px] font-semibold text-slate-200 hidden sm:inline max-w-[100px] truncate">
                  {user.displayName || 'Tài khoản'}
                </span>
              </button>
              <button
                type="button"
                onClick={onLogout}
                className="text-[10px] bg-rose-600/20 text-rose-300 px-2 py-0.5 rounded border border-rose-600/30 hover:bg-rose-600 hover:text-white transition cursor-pointer"
                title="Đăng xuất tài khoản"
              >
                {language === 'vi' ? 'Thoát' : 'Sign Out'}
              </button>
            </div>
          ) : (
            <div className="border-l border-slate-700 pl-2 ml-1">
              <button
                id="btn-google-login-nav"
                type="button"
                onClick={onLogin}
                disabled={isAuthLoading}
                className="flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-900 px-2.5 py-0.5 rounded-lg text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-60"
                title="Đăng nhập tài khoản Google để đồng bộ dữ liệu đám mây"
              >
                {isAuthLoading ? (
                  <span className="w-3.5 h-3.5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    <path d="M1 1h22v22H1z" fill="none"/>
                  </svg>
                )}
                <span className="hidden sm:inline">
                  {isAuthLoading
                    ? (language === 'vi' ? 'Đang kết nối...' : 'Connecting...')
                    : (language === 'vi' ? 'Đăng nhập Google' : 'Google Login')}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => setActiveTab('suggest')}
          className="flex items-center gap-3 cursor-pointer group select-none flex-shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 p-0.5 shadow-sm group-hover:scale-105 transition transform">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
              <Compass className="w-6 h-6 text-amber-600 group-hover:rotate-45 transition duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-amber-600 to-indigo-600 bg-clip-text text-transparent font-sans">
                LA BÀN
              </span>
              {/* <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                AI RISER 2026
              </span> */}
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              {language === 'vi' ? 'La bàn nghề nghiệp, giữa biển đổi AI' : 'Career compass, amid the AI sea-change'}
            </p>
          </div>
        </div>

        {/* Navigation Tabs (Desktop) */}
        <nav className="hidden xl:flex items-center gap-1 overflow-x-auto py-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-xs border border-transparent'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-slate-500'}`} />
                <span>{language === 'vi' ? tab.labelVi : tab.labelEn}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile & Tablet Scrollable Tabs */}
      <div className="xl:hidden flex items-center gap-1 overflow-x-auto px-3 py-2 bg-slate-100/90 border-t border-slate-200 scrollbar-thin">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`mob-nav-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-xs border border-transparent'
                  : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{language === 'vi' ? tab.labelVi : tab.labelEn}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
