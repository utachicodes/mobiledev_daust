import { Coordinates, WeatherData, CurrentWeather, DailyForecast } from '../types';

const WMO: Record<number, { icon: string; condition: string }> = {
  0:  { icon: '☀️',  condition: 'Clear sky' },
  1:  { icon: '🌤️', condition: 'Mainly clear' },
  2:  { icon: '⛅',  condition: 'Partly cloudy' },
  3:  { icon: '☁️',  condition: 'Overcast' },
  45: { icon: '🌫️', condition: 'Foggy' },
  48: { icon: '🌫️', condition: 'Icy fog' },
  51: { icon: '🌦️', condition: 'Light drizzle' },
  53: { icon: '🌦️', condition: 'Drizzle' },
  55: { icon: '🌦️', condition: 'Heavy drizzle' },
  61: { icon: '🌧️', condition: 'Light rain' },
  63: { icon: '🌧️', condition: 'Rain' },
  65: { icon: '🌧️', condition: 'Heavy rain' },
  71: { icon: '❄️',  condition: 'Light snow' },
  73: { icon: '❄️',  condition: 'Snow' },
  75: { icon: '❄️',  condition: 'Heavy snow' },
  80: { icon: '🌧️', condition: 'Rain showers' },
  95: { icon: '⛈️',  condition: 'Thunderstorm' },
  96: { icon: '⛈️',  condition: 'Thunderstorm + hail' },
  99: { icon: '⛈️',  condition: 'Violent thunderstorm' },
};

function decode(code: number) {
  return WMO[code] ?? { icon: '🌡️', condition: 'Unknown' };
}

function dayName(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' });
}

export async function fetchWeather(coords: Coordinates, locationName: string): Promise<WeatherData> {
  const { latitude, longitude } = coords;
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${latitude}&longitude=${longitude}` +
    `&current=temperature_2m,weathercode,windspeed_10m,relative_humidity_2m` +
    `&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_sum` +
    `&timezone=auto&forecast_days=7`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();

  const { current: c, daily: d } = data;
  const info = decode(c.weathercode);

  const current: CurrentWeather = {
    temperature: Math.round(c.temperature_2m),
    weatherCode: c.weathercode,
    windSpeed: Math.round(c.windspeed_10m),
    humidity: c.relative_humidity_2m,
    condition: info.condition,
    icon: info.icon,
  };

  const daily: DailyForecast[] = d.time.map((date: string, i: number) => {
    const di = decode(d.weathercode[i]);
    return {
      date,
      dayName: dayName(date),
      maxTemp: Math.round(d.temperature_2m_max[i]),
      minTemp: Math.round(d.temperature_2m_min[i]),
      weatherCode: d.weathercode[i],
      precipitation: d.precipitation_sum[i] ?? 0,
      icon: di.icon,
    };
  });

  return { current, daily, locationName };
}
