import React, { useMemo } from 'react';
import { Youtube, ShieldAlert, Sparkles, Filter } from 'lucide-react';
import { Language } from '../types';
import { t } from '../utils/i18n';
import { getVideosForRole } from '../data/roleVideos';

interface AiJobSecurityVideosProps {
  language: Language;
  currentRole?: string;
}

export const AiJobSecurityVideos: React.FC<AiJobSecurityVideosProps> = ({ language, currentRole }) => {
  const roleVideoData = useMemo(() => getVideosForRole(currentRole), [currentRole]);
  const { isCustomRole, targetRoleVi, targetRoleEn, videos } = roleVideoData;
  const roleName = language === 'en' ? targetRoleEn : targetRoleVi;

  return (
    <section id="ai-job-security-videos-section" className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Youtube className="w-5 h-5 text-rose-600" />
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
            {isCustomRole ? (
              language === 'en'
                ? `Job Security in the AI Era: Media & Expert Perspectives for ${roleName}`
                : `An Toàn Nghề Nghiệp Thời AI: Góc Nhìn Truyền Thông & Chuyên Gia cho ${roleName}`
            ) : (
              t(language, 'An Toàn Nghề Nghiệp Thời AI: Góc Nhìn Truyền Thông', 'Job Security in the AI Era: Media Perspectives')
            )}
          </h2>
        </div>

        {isCustomRole ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>{t(language, `Đã cá nhân hóa: ${roleName}`, `Personalized for: ${roleName}`)}</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>{t(language, 'Góc nhìn thị trường chung', 'Overall Market Context')}</span>
          </span>
        )}
      </div>

      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
        {isCustomRole ? (
          language === 'en' ? (
            <>
              Curated expert analyses and industry perspectives discussing how AI and automation directly impact the <strong>{roleName}</strong> workforce, and what skills safeguard your career in the next 5 years.
            </>
          ) : (
            <>
              Các phân tích chuyên gia và phóng sự truyền thông chọn lọc về mức độ tác động của AI đối với vị trí <strong>{roleName}</strong>, cùng những kỹ năng cốt lõi giúp thích ứng và bảo vệ sự nghiệp trong 5 năm tới.
            </>
          )
        ) : (
          t(
            language,
            'Hai phóng sự gần đây của VTV24 về áp lực việc làm mà người lao động đang đối mặt khi AI tái cấu trúc thị trường lao động.',
            'Two recent VTV24 reports on the job-security pressure workers face as AI restructures the labor market.'
          )
        )}
      </p>

      <div className="flex flex-col sm:flex-row gap-5">
        {videos.map(video => (
          <div key={video.id} className="flex-1 min-w-0 space-y-2">
            <div className="aspect-video w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-xs">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube-nocookie.com/embed/${video.id}?rel=0`}
                title={language === 'en' ? video.titleEn : video.titleVi}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs font-bold text-slate-800 flex items-start gap-1.5 leading-snug">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>{language === 'en' ? video.titleEn : video.titleVi}</span>
              </p>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                {video.channelName || video.sourceTag}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
