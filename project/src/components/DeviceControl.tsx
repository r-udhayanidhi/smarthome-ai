import type { DeviceState } from '@/types';

type Props = {
  label: string;
  description: string;
  icon: React.ReactNode;
  state: DeviceState;
  onColor: string;
  onToggle: () => void;
};

export function DeviceControl({
  label,
  description,
  icon,
  state,
  onColor,
  onToggle,
}: Props) {
  const isOn = state === 'ON';

  return (
    <div
      className={`rounded-2xl border p-5 transition-all duration-300 ${
        isOn
          ? 'border-slate-600/60 bg-slate-800/60'
          : 'border-slate-700/60 bg-slate-800/40'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300 ${
              isOn ? '' : 'bg-slate-700/40 text-slate-500'
            }`}
            style={isOn ? { backgroundColor: `${onColor}1a`, color: onColor } : {}}
          >
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">{label}</p>
            <p className="text-lg font-bold text-white">
              {isOn ? 'On' : 'Off'}
            </p>
          </div>
        </div>

        <button
          onClick={onToggle}
          className={`relative inline-flex h-8 w-16 items-center rounded-full border transition-colors focus:outline-none focus:ring-2 ${
            isOn
              ? `border-transparent focus:ring-2`
              : 'border-slate-600 bg-slate-700/50 focus:ring-slate-500/40'
          }`}
          style={isOn ? { backgroundColor: onColor } : {}}
          role="switch"
          aria-checked={isOn}
          aria-label={`Toggle ${label}`}
        >
          <span
            className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
              isOn ? 'translate-x-9' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
        <span
          className={`inline-flex h-1.5 w-1.5 rounded-full ${
            isOn ? 'animate-pulse' : ''
          }`}
          style={{ backgroundColor: isOn ? onColor : '#64748b' }}
        />
        {description}
      </div>
    </div>
  );
}
