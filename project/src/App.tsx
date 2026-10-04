import { useSmartHome } from '@/hooks/useSmartHome';
import { Header } from '@/components/Header';
import { SensorCard } from '@/components/SensorCard';
import { ModeToggle } from '@/components/ModeToggle';
import { DeviceControl } from '@/components/DeviceControl';
import { AIRecommendation } from '@/components/AIRecommendation';
import { ActivityLog } from '@/components/ActivityLog';
import { Analytics } from '@/components/Analytics';

function App() {
  const { room, history, log, insights, setMode, setDevice } = useSmartHome();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Ambient background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl" />
        <div className="absolute -top-20 right-0 h-72 w-72 rounded-full bg-sky-500/5 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-amber-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Header room={room} />

        {/* Main grid */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Left column — sensors + controls */}
          <div className="space-y-4 lg:col-span-2">
            {/* Sensor cards */}
            <div>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Live Sensors
              </h2>
              <SensorCard
                reading={{
                  temperature: room.temperature,
                  humidity: room.humidity,
                  lightLevel: room.lightLevel,
                }}
                history={history}
                lightOn={room.light === 'ON'}
              />
            </div>

            {/* Controls */}
            <div>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Controls
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <ModeToggle mode={room.mode} onChange={setMode} />
                <DeviceControl
                  label="Fan"
                  description={
                    room.mode === 'AUTO'
                      ? 'AI manages fan automatically'
                      : 'Manual control — toggle on/off'
                  }
                  state={room.fan}
                  onColor="#38bdf8"
                  onToggle={() =>
                    setDevice('FAN', room.fan === 'ON' ? 'OFF' : 'ON')
                  }
                  icon={
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.522.23-.97.423-1.277C10.245 2.29 10.612 2 11 2s.755.29 1.072.663c.193.307.333.755.423 1.277M12 4.5a7.5 7.5 0 100 15 7.5 7.5 0 000-15zm0 0v3m0 0a4.5 4.5 0 110 9 4.5 4.5 0 010-9z" />
                    </svg>
                  }
                />
                <DeviceControl
                  label="Light"
                  description={
                    room.mode === 'AUTO'
                      ? 'AI manages light automatically'
                      : 'Manual control — toggle on/off'
                  }
                  state={room.light}
                  onColor="#fbbf24"
                  onToggle={() =>
                    setDevice('LIGHT', room.light === 'ON' ? 'OFF' : 'ON')
                  }
                  icon={
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3a7 7 0 00-4 12.74V17a1 1 0 001 1h6a1 1 0 001-1v-1.26A7 7 0 0012 3z" />
                    </svg>
                  }
                />
              </div>
            </div>

            {/* Analytics */}
            <div>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Status Visualization
              </h2>
              <Analytics history={history} room={room} />
            </div>
          </div>

          {/* Right column — AI + activity log */}
          <div className="space-y-4">
            <div>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Intelligence
              </h2>
              <AIRecommendation insights={insights} />
            </div>
            <div>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                History
              </h2>
              <ActivityLog log={log} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 border-t border-slate-800 pt-4 text-center text-xs text-slate-600">
          SmartHome AI · Intelligent Room Automation · MVP Demo
        </footer>
      </div>
    </div>
  );
}

export default App;
