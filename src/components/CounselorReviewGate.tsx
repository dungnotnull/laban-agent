import { useState } from 'react';
import { ShieldCheck, UserCheck } from 'lucide-react';
import type { Trajectory } from '../agents/trajectory';
import { t } from '../utils/i18n';
import type { Language } from '../types';

export default function CounselorReviewGate({
  trajectory,
  language,
  onReviewed
}: {
  trajectory: Trajectory | null;
  language: Language;
  onReviewed: () => void;
}) {
  const [approved, setApproved] = useState(false);
  if (!trajectory) return null;

  const approve = () => {
    // Sandboxed human-in-the-loop checkpoint (ground rule 05): the approval
    // event becomes part of the trajectory evidence.
    trajectory.events.push({
      ts: new Date().toISOString(),
      type: 'human_checkpoint',
      message: t(
        language,
        'Tư vấn viên đã xem xét và phê duyệt kết quả.',
        'Counselor reviewed and approved the result.'
      )
    });
    setApproved(true);
    onReviewed();
  };

  if (approved) {
    return (
      <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
        <ShieldCheck size={16} /> {t(language, 'Đã có tư vấn viên xem xét và xác nhận kết quả này.', 'A career counselor has reviewed and approved this result.')}
      </div>
    );
  }
  return (
    <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
      <span>{t(language, 'Kết quả đang chờ tư vấn viên xác nhận trước khi hoàn tất.', 'Result is pending counselor review before final delivery.')}</span>
      <button onClick={approve} className="flex items-center gap-1 rounded-lg bg-amber-600 px-3 py-1.5 text-white hover:bg-amber-700">
        <UserCheck size={14} /> {t(language, 'Xác nhận (tư vấn viên)', 'Approve (counselor)')}
      </button>
    </div>
  );
}
