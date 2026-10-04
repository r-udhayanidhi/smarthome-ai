import type { RoomState, AIInsight } from '@/types';

export function generateInsights(state: RoomState): AIInsight[] {
  const insights: AIInsight[] = [];
  const { temperature, humidity, lightLevel, fan, light, mode } = state;

  // Temperature
  if (temperature > 28) {
    if (fan === 'OFF' && mode === 'AUTO') {
      insights.push({
        icon: 'thermometer',
        message: `High temperature (${temperature.toFixed(1)}°C). Turn on the fan to cool the room.`,
        severity: 'danger',
      });
    } else if (fan === 'ON') {
      insights.push({
        icon: 'thermometer',
        message: `Warm room (${temperature.toFixed(1)}°C). Fan active — cooling in progress.`,
        severity: 'warning',
      });
    } else {
      insights.push({
        icon: 'thermometer',
        message: `Warm (${temperature.toFixed(1)}°C). Enable AUTO mode to let me manage the fan.`,
        severity: 'warning',
      });
    }
  } else if (temperature < 18) {
    insights.push({
      icon: 'thermometer',
      message: `Cool room (${temperature.toFixed(1)}°C). Consider turning the fan off to retain warmth.`,
      severity: 'warning',
    });
  } else {
    insights.push({
      icon: 'thermometer',
      message: `Temperature optimal (${temperature.toFixed(1)}°C).`,
      severity: 'success',
    });
  }

  // Humidity
  if (humidity > 65) {
    insights.push({
      icon: 'droplets',
      message: `Humidity high (${humidity.toFixed(0)}%). Ventilation recommended to reduce moisture.`,
      severity: 'danger',
    });
  } else if (humidity < 35) {
    insights.push({
      icon: 'droplets',
      message: `Air is dry (${humidity.toFixed(0)}%). A humidifier would improve comfort.`,
      severity: 'warning',
    });
  } else {
    insights.push({
      icon: 'droplets',
      message: `Humidity comfortable (${humidity.toFixed(0)}%).`,
      severity: 'success',
    });
  }

  // Light level
  if (lightLevel < 25 && light === 'OFF') {
    if (mode === 'AUTO') {
      insights.push({
        icon: 'lightbulb',
        message: `Low ambient light (${lightLevel}%). Turning the light on would improve visibility.`,
        severity: 'danger',
      });
    } else {
      insights.push({
        icon: 'lightbulb',
        message: `Room is dim (${lightLevel}%). Turn on the light or switch to AUTO mode.`,
        severity: 'warning',
      });
    }
  } else if (lightLevel > 70 && light === 'ON') {
    insights.push({
      icon: 'lightbulb',
      message: `Bright ambient light (${lightLevel}%). The light can be turned off to save energy.`,
      severity: 'warning',
    });
  } else {
    insights.push({
      icon: 'lightbulb',
      message: `Lighting conditions good (${lightLevel}%).`,
      severity: 'success',
    });
  }

  // Energy note
  if (fan === 'ON' && light === 'ON') {
    insights.push({
      icon: 'zap',
      message: 'Both devices active. Monitor energy usage during peak hours.',
      severity: 'warning',
    });
  } else if (fan === 'OFF' && light === 'OFF') {
    insights.push({
      icon: 'zap',
      message: 'All devices off — minimal energy consumption.',
      severity: 'success',
    });
  }

  return insights;
}
