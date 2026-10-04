import type { AIInsight } from '@/types';

type Props = {
  insights: AIInsight[];
};

const severityConfig = {
  success: {
    ring: 'border-emerald-400/20 bg-emerald-400/5',
    dot: 'bg-emerald-400',
    text: 'text-emerald-400',
  },
  warning: {
    ring: 'border-amber-400/20 bg-amber-400/5',
    dot: 'bg-amber-400',
    text: 'text-amber-400',
  },
  danger: {
    ring: 'border-red-400/20 bg-red-400/5',
    dot: 'bg-red-400',
    text: 'text-red-400',
  },
};

function InsightIcon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    thermometer: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z" />
      </svg>
    ),
    droplets: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0L12 2.69z" />
      </svg>
    ),
    lightbulb: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 21h6m-5-4h4M12 3a7 7 0 00-4 12.74V17a1 1 0 001 1h6a1 1 0 001-1v-1.26A7 7 0 0012 3z" />
      </svg>
    ),
    zap: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  };
  return icons[name] ?? icons.zap;
}

export function AIRecommendation({ insights }: Props) {
  const topInsight = insights.find((i) => i.severity === 'danger') ?? insights[0];

  return (
    <div className="rounded-2xl border border-slate-700/60 bg-gradient-to-br from-slate-800/60 to-slate-900/40 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400/20 to-sky-400/20 text-emerald-400">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.5.8a2 2 0 11-3.536 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">AI Recommendations</h3>
            <p className="text-[11px] text-slate-500">Real-time analysis</p>
          </div>
        </div>
        <span className="inline-flex animate-pulse items-center gap-1.5 rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Analyzing
        </span>
      </div>

      {/* Featured insight */}
      {topInsight && (
        <div
          className={`mb-3 rounded-xl border p-3 ${severityConfig[topInsight.severity].ring}`}
        >
          <div className="flex items-start gap-2.5">
            <div className={`mt-0.5 ${severityConfig[topInsight.severity].text}`}>
              <InsightIcon name={topInsight.icon} />
            </div>
            <p className="text-sm text-slate-200">{topInsight.message}</p>
          </div>
        </div>
      )}

      {/* Remaining insights */}
      <div className="space-y-2">
        {insights
          .filter((i) => i !== topInsight)
          .map((insight, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-slate-700/20"
            >
              <span
                className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${severityConfig[insight.severity].dot}`}
              />
              <p className="text-xs leading-relaxed text-slate-400">
                {insight.message}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}
