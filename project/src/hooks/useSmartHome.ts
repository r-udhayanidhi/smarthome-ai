import { useEffect, useReducer } from 'react';
import type {
  RoomState,
  DeviceState,
  AutomationMode,
  LogEntry,
  SensorHistoryPoint,
} from '@/types';
import { generateInsights } from '@/utils/ai';

type Action =
  | { type: 'TICK'; sensor: Pick<RoomState, 'temperature' | 'humidity' | 'lightLevel'> }
  | { type: 'SET_MODE'; mode: AutomationMode; manual?: boolean }
  | { type: 'SET_DEVICE'; device: 'FAN' | 'LIGHT'; state: DeviceState; manual?: boolean };

type FullState = {
  room: RoomState;
  history: SensorHistoryPoint[];
  log: LogEntry[];
  logId: number;
  prevMode: AutomationMode;
};

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function makeLog(
  id: number,
  message: string,
  source: LogEntry['source'],
  type: LogEntry['type'],
): LogEntry {
  return { id, time: Date.now(), message, source, type };
}

// Drift sensor values slightly each tick to simulate real readings
function driftSensor(prev: Pick<RoomState, 'temperature' | 'humidity' | 'lightLevel'>) {
  const temperature = clamp(
    prev.temperature + (Math.random() - 0.5) * 0.6,
    16,
    32,
  );
  const humidity = clamp(prev.humidity + (Math.random() - 0.5) * 2, 28, 78);
  // light level drifts with a slow sinusoidal day cycle + noise
  const hourFraction = (Date.now() / 1000 / 60) % 100; // arbitrary cycle
  const base = 45 + Math.sin(hourFraction / 15) * 30;
  const lightLevel = clamp(base + (Math.random() - 0.5) * 8, 2, 98);
  return { temperature, humidity, lightLevel };
}

function autoAdjust(room: RoomState): Partial<RoomState> {
  const changes: Partial<RoomState> = {};
  if (room.temperature > 27 && room.fan === 'OFF') changes.fan = 'ON';
  if (room.temperature < 22 && room.fan === 'ON') changes.fan = 'OFF';
  if (room.lightLevel < 25 && room.light === 'OFF') changes.light = 'ON';
  if (room.lightLevel > 65 && room.light === 'ON') changes.light = 'OFF';
  return changes;
}

function reducer(state: FullState, action: Action): FullState {
  switch (action.type) {
    case 'TICK': {
      const room: RoomState = { ...state.room, ...action.sensor };
      let log = state.log;
      let logId = state.logId;

      if (room.mode === 'AUTO') {
        const changes = autoAdjust(room);
        if (changes.fan) {
          room.fan = changes.fan;
          logId += 1;
          log = [
            makeLog(logId, `Auto: fan turned ${changes.fan === 'ON' ? 'ON' : 'OFF'}`, 'AI', 'DEVICE'),
            ...log,
          ].slice(0, 50);
        }
        if (changes.light) {
          room.light = changes.light;
          logId += 1;
          log = [
            makeLog(logId, `Auto: light turned ${changes.light === 'ON' ? 'ON' : 'OFF'}`, 'AI', 'DEVICE'),
            ...log,
          ].slice(0, 50);
        }
      }

      const point: SensorHistoryPoint = {
        time: Date.now(),
        temperature: room.temperature,
        humidity: room.humidity,
      };
      const history = [...state.history, point].slice(-30);

      return { ...state, room, history, log, logId };
    }

    case 'SET_MODE': {
      const room = { ...state.room, mode: action.mode };
      let log = state.log;
      let logId = state.logId;
      if (action.manual) {
        logId += 1;
        log = [
          makeLog(logId, `Mode switched to ${action.mode}`, 'USER', 'MODE'),
          ...log,
        ].slice(0, 50);
      }
      return { ...state, room, log, logId, prevMode: state.room.mode };
    }

    case 'SET_DEVICE': {
      const deviceKey = action.device === 'FAN' ? 'fan' : 'light';
      if (state.room[deviceKey] === action.state) return state;
      const room = { ...state.room, [deviceKey]: action.state };
      let log = state.log;
      let logId = state.logId;
      if (action.manual) {
        logId += 1;
        log = [
          makeLog(
            logId,
            `${action.device === 'FAN' ? 'Fan' : 'Light'} turned ${action.state === 'ON' ? 'ON' : 'OFF'}`,
            'USER',
            'DEVICE',
          ),
          ...log,
        ].slice(0, 50);
      }
      return { ...state, room, log, logId };
    }

    default:
      return state;
  }
}

const initialState: FullState = {
  room: {
    temperature: 24.5,
    humidity: 52,
    lightLevel: 40,
    fan: 'OFF',
    light: 'OFF',
    mode: 'MANUAL',
  },
  history: [],
  log: [
    { id: 1, time: Date.now() - 5000, message: 'SmartHome AI system initialized', source: 'SYSTEM', type: 'INFO' },
  ],
  logId: 1,
  prevMode: 'MANUAL',
};

export function useSmartHome() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Sensor simulation — updates every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const sensor = driftSensor({
        temperature: state.room.temperature,
        humidity: state.room.humidity,
        lightLevel: state.room.lightLevel,
      });
      dispatch({ type: 'TICK', sensor });
    }, 3000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.room.temperature, state.room.humidity, state.room.lightLevel]);

  const setMode = (mode: AutomationMode) =>
    dispatch({ type: 'SET_MODE', mode, manual: true });

  const setDevice = (device: 'FAN' | 'LIGHT', devState: DeviceState) =>
    dispatch({ type: 'SET_DEVICE', device, state: devState, manual: true });

  const insights = generateInsights(state.room);

  return {
    room: state.room,
    history: state.history,
    log: state.log,
    insights,
    setMode,
    setDevice,
  };
}
