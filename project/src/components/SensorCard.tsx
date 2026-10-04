import type { SensorHistoryPoint, SensorReading } from '@/types';
import { Sparkline } from './Sparkline';

type Metric = {
  label: string;
  value: string;
  unit: string;
  color: string;
  icon: React.ReactNode;
  data: number[];
  min: number;
  max: number;
  status: 'normal' | 'warning' | 'danger';
  statusLabel: string;
};

type Props = {
  reading: SensorReading;
  history: SensorHistoryPoint[];
  lightOn: boolean;
};

export function SensorCard({ reading, history, lightOn }: Props) {
  const tempData = history.map((h) => h.temperature);
  const humData = history.map((h) => h.humidity);

  const tempStatus =
    reading.temperature > 28
      ? 'danger'
      : reading.temperature < 18
        ? 'warning'
        : 'normal';
  const humStatus =
    reading.humidity > 65
      ? 'danger'
      : reading.humidity < 35
        ? 'warning'
        : 'normal';
  const lightStatus =
    reading.lightLevel < 25
      ? 'danger'
      : reading.lightLevel > 70
        ? 'warning'
        : 'normal';

  const metrics: Metric[] = [
    {
      label: 'Temperature',
      value: reading.temperature.toFixed(1),
      unit: '°C',
      color: '#f97316',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z" />
        </svg>
      ),
      data: tempData,
      min: 15,
      max: 33,
      status: tempStatus,
      statusLabel:
        tempStatus === 'danger'
          ? 'Hot'
          : tempStatus === 'warning'
            ? 'Cool'
            : 'Optimal',
    },
    {
      label: 'Humidity',
      value: Math.round(reading.humidity).toString(),
      unit: '%',
      color: '#38bdf8',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0L12 2.69z" />
        </svg>
      ),
      data: humData,
      min: 25,
      max: 80,
      status: humStatus,
      statusLabel:
        humStatus === 'danger'
          ? 'High'
          : humStatus === 'warning'
            ? 'Low'
            : 'Comfortable',
    },
    {
      label: 'Light Level',
      value: Math.round(reading.lightLevel).toString(),
      unit: '%',
      color: '#fbbf24',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 21h6m-5-4h4M12 3a7 7 0 00-4 12.74V17a1 1 0 001 1h6a1 1 0 001-1v-1.26A7 7 0 0012 3z" />
        </svg>
      ),
      data: [],
      min: 0,
      max: 100,
      status: lightStatus,
      statusLabel:
        lightStatus === 'danger'
          ? 'Dark'
          : lightStatus === 'warning'
            ? 'Bright'
            : 'Good',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {metrics.map((m) => {
        const statusColor =
          m.status === 'danger'
            ? 'text-red-400 bg-red-400/10 border-red-400/20'
            : m.status === 'warning'
              ? 'text-amber-400 bg-amber-400/10 border-amber-400/20'
              : 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';

        return (
          <div
            key={m.label}
            className="group rounded-2xl border border-slate-700/60 bg-slate-800/40 p-5 transition-all duration-300 hover:border-slate-600/60 hover:bg-slate-800/60"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${m.color}1a`, color: m.color }}
                >
                  {m.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400">{m.label}</p>
                  <span
                    className={`mt-1 inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold ${statusColor}`}
                  >
                    {m.statusLabel}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-end justify-between">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white tabular-nums">
                  {m.value}
                </span>
                <span className="text-lg font-medium text-slate-500">
                  {m.unit}
                </span>
              </div>
              <div className="opacity-70 transition-opacity group-hover:opacity-100">
                <Sparkline
                  data={m.data}
                  color={m.color}
                  min={m.min}
                  max={m.max}
                  width={90}
                  height={34}
                />
              </div>
            </div>
          </div>
        );
      })}

      {/* Light device status card */}
      <div className="flex items-center justify-between rounded-2xl border border-slate-700/60 bg-slate-800/40 p-5 sm:col-span-2 lg:col-span-3">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
              lightOn
                ? 'bg-amber-400/15 text-amber-400'
                : 'bg-slate-700/40 text-slate-500'
            }`}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3a7 7 0 00-4 12.74V17a1 1 0 001 1h6a1 1 0 001-1v-1.26A7 7 0 0012 3z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">Light Status</p>
            <p className="text-lg font-bold text-white">
              {lightOn ? 'Illuminated' : 'Off'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden text-right sm:block">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Ambient
            </p>
            <p className="text-sm font-bold text-white">
              {Math.round(reading.lightLevel)}%
            </p>
          </div>
          {/* Light bar */}
          <div className="relative h-12 w-3 overflow-hidden rounded-full bg-slate-700/50">
            <div
              className="absolute bottom-0 w-full rounded-full bg-gradient-to-t from-amber-500 to-amber-300 transition-all duration-500"
              style={{
                height: `${lightOn ? Math.max(reading.lightLevel, 30) : 0}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
