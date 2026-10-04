export type AutomationMode = 'AUTO' | 'MANUAL';

export type DeviceState = 'ON' | 'OFF';

export type SensorHistoryPoint = {
  time: number;
  temperature: number;
  humidity: number;
};

export type SensorReading = {
  temperature: number; // °C
  humidity: number;    // %
  lightLevel: number;  // 0-100
};

export type Device = 'FAN' | 'LIGHT';

export type LogEntry = {
  id: number;
  time: number;
  message: string;
  source: 'USER' | 'AI' | 'SYSTEM';
  type: 'INFO' | 'DEVICE' | 'MODE';
};

export type RoomState = {
  temperature: number;
  humidity: number;
  lightLevel: number;
  fan: DeviceState;
  light: DeviceState;
  mode: AutomationMode;
};

export type AIInsight = {
  icon: string;
  message: string;
  severity: 'success' | 'warning' | 'danger';
};
