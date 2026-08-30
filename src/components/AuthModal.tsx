import React from 'react';
import { User } from 'firebase/auth';
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  LogOut,
  RefreshCw,
  HelpCircle,
  Database,
  Lock
} from 'lucide-react';
import { Language } from '../types';
import { t } from '../utils/i18n';

export interface AuthErrorInfo {
  code?: string;
  message: string;
  solution?: string;
  consoleUrl?: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  isLoading: boolean;
  errorInfo: AuthErrorInfo | null;
  onLoginWithGoogle: () => void;
  onLogout: () => void;
  language: Language;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  user,
  isLoading,
  errorInfo,
  onLoginWithGoogle,
  onLogout,
  language
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white p-5 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {user
                  ? t(language, 'Tài Khoản & Đồng Bộ Đám Mây', 'Account & Cloud Sync')
                  : t(language, 'Đăng Nhập Google (Firebase Auth)', 'Google Sign-In (Firebase Auth)')}
              </h3>
              <p className="text-xs text-slate-300">
                {user
                  ? t(language, 'Đã xác thực danh tính an toàn', 'Securely authenticated')
                  : t(language, 'Đồng bộ hồ sơ, lộ trình & bài đăng cộng đồng', 'Sync your profile, roadmaps & community posts')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {user ? (
            /* Logged-In State */
            <div className="space-y-4">
              <div className="flex items-center gap-3.5 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <img
                  src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}&background=f59e0b&color=fff`}
                  alt="avatar"
                  className="w-12 h-12 rounded-full border-2 border-amber-500 object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 truncate">
                      {user.displayName || 'Thành viên La Bàn'}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                      ✓ Đã xác thực
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
                    UID: {user.uid}
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                  <Database className="w-4 h-4 text-emerald-600" />
                  <span>{t(language, 'Đồng bộ Firestore Đang Hoạt Động', 'Firestore Sync Active')}</span>
                </div>
                <p className="text-emerald-700 leading-relaxed">
                  {t(
                    language,
                    'Hồ sơ định hướng Persona, kết quả phân tích 20 ngành nghề và các bài đăng cộng đồng của bạn được lưu trữ an toàn trên Firestore Cloud.',
                    'Your Persona profile, 20-career radar analysis, and community posts are saved securely on Firestore Cloud.'
                  )}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition"
                >
                  {t(language, 'Tiếp Tục Sử Dụng', 'Continue')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="py-2.5 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-xs flex items-center gap-1.5 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t(language, 'Đăng Xuất', 'Sign Out')}</span>
                </button>
              </div>
            </div>
          ) : (
            /* Logged-Out / Login Flow */
            <div className="space-y-4">
              <div className="text-center space-y-1.5">
                <p className="text-xs text-slate-600 leading-relaxed">
                  {t(
                    language,
                    'Đăng nhập bằng tài khoản Google để lưu trữ dữ liệu cá nhân hóa, lộ trình học tập và bình luận trong cộng đồng chia sẻ nỗi niềm nghề nghiệp.',
                    'Sign in with your Google account to save personalized roadmap data and participate in the community.'
                  )}
                </p>
              </div>

              {/* Main Login Button */}
              <button
                type="button"
                onClick={onLoginWithGoogle}
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-300 hover:border-slate-400 font-bold text-sm flex items-center justify-center gap-3 shadow-sm hover:shadow transition disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin text-indigo-600" />
                    <span>{t(language, 'Đang mở cửa sổ đăng nhập Google...', 'Opening Google Sign-In...')}</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    <span>{t(language, 'Tiếp tục với tài khoản Google', 'Continue with Google Account')}</span>
                  </>
                )}
              </button>

              {/* Error & Diagnostic Banner if error occurred */}
              {errorInfo && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-950 space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-900 block">
                        {t(language, 'Thông báo trạng thái Auth:', 'Auth Status Notice:')}
                      </span>
                      <p className="text-amber-800 mt-0.5 leading-relaxed">{errorInfo.message}</p>
                    </div>
                  </div>

                  {errorInfo.solution && (
                    <div className="pt-1 text-slate-700 border-t border-amber-200/80">
                      <span className="font-semibold text-slate-900 block mb-0.5">
                        💡 {t(language, 'Cách khắc phục:', 'Resolution:')}
                      </span>
                      <p className="leading-relaxed text-[11px]">{errorInfo.solution}</p>
                    </div>
                  )}

                  {errorInfo.consoleUrl && (
                    <a
                      href={errorInfo.consoleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 hover:text-indigo-900 underline mt-1"
                    >
                      <span>{t(language, 'Mở Firebase Console Authentication', 'Open Firebase Authentication Console')}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              )}

              {/* Feature Highlights */}
              <div className="border-t border-slate-200 pt-3 space-y-2 text-xs text-slate-600">
                <span className="font-semibold text-slate-800 text-[11px] uppercase tracking-wider block">
                  🛡️ {t(language, 'Quyền lợi khi đăng nhập:', 'Benefits of signing in:')}
                </span>
                <ul className="space-y-1.5">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{t(language, 'Tự động lưu lịch sử phân tích 20 ngành nghề', 'Auto-save 20-career analysis history')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{t(language, 'Đồng bộ bài đăng & câu chuyện chuyển đổi trong Cộng đồng', 'Sync community posts & verified career stories')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{t(language, 'Bảo mật dữ liệu tuyệt đối theo tiêu chuẩn Google Cloud', 'Enterprise data security powered by Google Cloud')}</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
