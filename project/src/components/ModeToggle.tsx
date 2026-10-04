import type { AutomationMode } from '@/types';

type Props = {
  mode: AutomationMode;
  onChange: (mode: AutomationMode) => void;
};

export function ModeToggle({ mode, onChange }: Props) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-700/60 bg-slate-800/40 p-5">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
            mode === 'AUTO'
              ? 'bg-emerald-400/15 text-emerald-400'
              : 'bg-sky-400/15 text-sky-400'
          }`}
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-400">Automation Mode</p>
          <p className="text-lg font-bold text-white">
            {mode === 'AUTO' ? 'AI Control' : 'Manual Control'}
          </p>
        </div>
      </div>

      <button
        onClick={() => onChange(mode === 'AUTO' ? 'MANUAL' : 'AUTO')}
        className="relative inline-flex h-8 w-16 items-center rounded-full border border-slate-600 bg-slate-700/50 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
        role="switch"
        aria-checked={mode === 'AUTO'}
        aria-label="Toggle automation mode"
      >
        <span
          className={`inline-block h-6 w-6 transform rounded-full shadow-lg transition-transform duration-300 ${
            mode === 'AUTO'
              ? 'translate-x-9 bg-emerald-400'
              : 'translate-x-1 bg-sky-400'
          }`}
        />
      </button>
    </div>
  );
}
