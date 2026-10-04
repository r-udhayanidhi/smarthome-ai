import type { RoomState } from '@/types';
import { formatGreeting } from '@/utils/format';

type Props = {
  room: RoomState;
};

export function Header({ room }: Props) {
  const greeting = formatGreeting();

  return (
    <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2 text-sm font-medium text-slate-400">
          <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          System Online
        </div>
        <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
          SmartHome AI
        </h1>
        <p className="mt-0.5 text-sm text-slate-400">
          {greeting} — your living room is at {room.temperature.toFixed(1)}°C
        </p>
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-slate-700/60 bg-slate-800/40 px-4 py-2.5">
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Mode
          </span>
          <span
            className={`text-sm font-bold ${
              room.mode === 'AUTO' ? 'text-emerald-400' : 'text-sky-400'
            }`}
          >
            {room.mode}
          </span>
        </div>
        <div className="h-8 w-px bg-slate-700" />
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Devices
          </span>
          <span className="text-sm font-bold text-white">
            {(room.fan === 'ON' ? 1 : 0) + (room.light === 'ON' ? 1 : 0)} / 2
          </span>
        </div>
      </div>
    </header>
  );
}
