import React from 'react';
import { Youtube, ShieldAlert } from 'lucide-react';
import { Language } from '../types';
import { t } from '../utils/i18n';

// Both videos are verified-live VTV24 broadcasts on YouTube (oEmbed-checked).
const VIDEOS = [
  {
    id: 'aKrhPf8qf-Y',
    titleVi: 'A.I đang tái cấu trúc thị trường lao động như thế nào?',
    titleEn: 'How is AI restructuring the labor market?'
  },
  {
    id: 'wmKMa_KavrY',
    titleVi: 'Giới trẻ đối mặt áp lực trên thị trường lao động',
    titleEn: 'Young workers facing pressure in the labor market'
  }
];

interface AiJobSecurityVideosProps {
  language: Language;
}

export const AiJobSecurityVideos: React.FC<AiJobSecurityVideosProps> = ({ language }) => (
  <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
    <div className="flex items-center gap-2">
      <Youtube className="w-5 h-5 text-rose-600" />
      <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
        {t(language, 'An Toàn Nghề Nghiệp Thời AI: Góc Nhìn Truyền Thông', 'Job Security in the AI Era: Media Perspectives')}
      </h2>
    </div>
    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
      {t(
        language,
        'Hai phóng sự gần đây của VTV24 về áp lực việc làm mà người lao động đang đối mặt khi AI tái cấu trúc thị trường lao động.',
        'Two recent VTV24 reports on the job-security pressure workers face as AI restructures the labor market.'
      )}
    </p>
    <div className="flex flex-col sm:flex-row gap-5">
      {VIDEOS.map(video => (
        <div key={video.id} className="flex-1 min-w-0 space-y-2">
          <div className="aspect-video w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube-nocookie.com/embed/${video.id}?rel=0`}
              title={language === 'en' ? video.titleEn : video.titleVi}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            {language === 'en' ? video.titleEn : video.titleVi}
            <span className="text-slate-400 font-medium">| VTV24</span>
          </p>
        </div>
      ))}
    </div>
  </section>
);
