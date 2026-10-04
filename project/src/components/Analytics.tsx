import type { SensorHistoryPoint, RoomState } from '@/types';
import { formatTimeShort } from '@/utils/format';

type Props = {
  history: SensorHistoryPoint[];
  room: RoomState;
};

export function Analytics({ history, room }: Props) {
  const maxLen = Math.max(history.length, 1);
  const width = 280;
  const height = 120;
  const padX = 8;
  const padY = 12;

  // Temperature line
  const temps = history.map((h) => h.temperature);
  const hums = history.map((h) => h.humidity);
  const tMin = 15;
  const tMax = 33;
  const hMin = 25;
  const hMax = 80;

  function buildPath(data: number[], min: number, max: number) {
    if (data.length < 2) return { line: '', area: '' };
    const stepX = (width - padX * 2) / (data.length - 1);
    const points = data.map((v, i) => {
      const x = padX + i * stepX;
      const y = height - padY - ((v - min) / (max - min)) * (height - padY * 2);
      return { x, y };
    });
    const line = points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
      .join(' ');
    const area =
      `M ${padX} ${height - padY} ` +
      points.map((p) => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ') +
      ` L ${width - padX} ${height - padY} Z`;
    return { line, area };
  }

  const tempPath = buildPath(temps, tMin, tMax);
  const humPath = buildPath(hums, hMin, hMax);

  const energyScore = Math.round(
    ((room.fan === 'ON' ? 45 : 0) + (room.light === 'ON' ? 30 : 0) + 25) ,
  );

  const stats = [
    {
      label: 'Avg Temp',
      value: temps.length > 0 ? (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1) : '--',
      unit: '°C',
      color: 'text-orange-400',
    },
    {
      label: 'Avg Humidity',
      value: hums.length > 0 ? Math.round(hums.reduce((a, b) => a + b, 0) / hums.length).toString() : '--',
      unit: '%',
      color: 'text-sky-400',
    },
    {
      label: 'Energy',
      value: energyScore.toString(),
      unit: 'W',
      color: 'text-amber-400',
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-700/60 bg-slate-800/40 p-5">
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-700/40 text-slate-300">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12H4V4z" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">Analytics</h3>
          <p className="text-[11px] text-slate-500">Last {history.length} readings</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="mb-4 grid grid-cols-3 gap-2">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg bg-slate-700/20 p-2.5 text-center">
            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
              {s.label}
            </p>
            <p className={`mt-0.5 text-base font-bold tabular-nums ${s.color}`}>
              {s.value}
              <span className="ml-0.5 text-xs font-normal text-slate-500">{s.unit}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="rounded-xl bg-slate-900/40 p-3">
        <div className="mb-2 flex items-center gap-4 text-[10px] font-medium">
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="h-2 w-2 rounded-full bg-orange-400" />
            Temperature
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="h-2 w-2 rounded-full bg-sky-400" />
            Humidity
          </span>
        </div>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full"
          preserveAspectRatio="none"
          style={{ height: '120px' }}
        >
          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map((p) => (
            <line
              key={p}
              x1={padX}
              y1={padY + p * (height - padY * 2)}
              x2={width - padX}
              y2={padY + p * (height - padY * 2)}
              stroke="#334155"
              strokeWidth={0.5}
              strokeDasharray="2 4"
            />
          ))}

          {/* Humidity area + line */}
          {humPath.area && (
            <>
              <path d={humPath.area} fill="#38bdf8" fillOpacity={0.08} />
              <path
                d={humPath.line}
                fill="none"
                stroke="#38bdf8"
                strokeWidth={1.5}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </>
          )}

          {/* Temperature area + line */}
          {tempPath.area && (
            <>
              <path d={tempPath.area} fill="#f97316" fillOpacity={0.08} />
              <path
                d={tempPath.line}
                fill="none"
                stroke="#f97316"
                strokeWidth={1.5}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </>
          )}

          {/* X-axis labels */}
          {history.length > 0 && (
            <>
              <text x={padX} y={height - 1} fill="#475569" fontSize={8}>
                {formatTimeShort(history[0].time)}
              </text>
              <text x={width - padX - 24} y={height - 1} fill="#475569" fontSize={8}>
                {formatTimeShort(history[history.length - 1].time)}
              </text>
            </>
          )}
        </svg>
      </div>
    </div>
  );
}
