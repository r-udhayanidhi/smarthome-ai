import type { LogEntry } from '@/types';
import { formatTime } from '@/utils/format';

type Props = {
  log: LogEntry[];
};

const sourceConfig = {
  USER: { color: 'text-sky-400', bg: 'bg-sky-400/10', label: 'You' },
  AI: { color: 'text-emerald-400', bg: 'bg-emerald-400/10', label: 'AI' },
  SYSTEM: { color: 'text-slate-400', bg: 'bg-slate-400/10', label: 'System' },
};

const typeIcon: Record<LogEntry['type'], React.ReactNode> = {
  INFO: (
    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  DEVICE: (
    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  MODE: (
    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
    </svg>
  ),
};

export function ActivityLog({ log }: Props) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-700/60 bg-slate-800/40 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-700/40 text-slate-300">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Activity Log</h3>
            <p className="text-[11px] text-slate-500">{log.length} events</p>
          </div>
        </div>
      </div>

      <div className="-mr-2 flex-1 space-y-1.5 overflow-y-auto pr-2" style={{ maxHeight: '320px' }}>
        {log.length === 0 && (
          <p className="py-8 text-center text-sm text-slate-600">No activity yet</p>
        )}
        {log.map((entry) => {
          const cfg = sourceConfig[entry.source];
          return (
            <div
              key={entry.id}
              className="flex items-start gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-slate-700/20"
            >
              <div
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${cfg.bg} ${cfg.color}`}
              >
                {typeIcon[entry.type]}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs leading-snug text-slate-300">
                  {entry.message}
                </p>
                <div className="mt-0.5 flex items-center gap-2">
                  <span className={`text-[10px] font-semibold ${cfg.color}`}>
                    {cfg.label}
                  </span>
                  <span className="text-[10px] text-slate-600">
                    {formatTime(entry.time)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
