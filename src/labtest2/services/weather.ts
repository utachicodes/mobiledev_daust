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

    // Use hourly endpoint — matches the provided data format
    const url =
        `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${latitude}&longitude=${longitude}` +
        `&hourly=temperature_2m,weathercode,windspeed_10m,relative_humidity_2m` +
        `&timezone=auto&forecast_days=7`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    const times: string[]    = data.hourly.time;
    const temps: number[]    = data.hourly.temperature_2m;
    const codes: number[]    = data.hourly.weathercode;
    const winds: number[]    = data.hourly.windspeed_10m;
    const humidity: number[] = data.hourly.relative_humidity_2m;

    // Find the index for the current local hour
    const nowHour = new Date().toISOString().slice(0, 13); // e.g. "2026-02-27T14"
    let idx = times.findIndex(t => t.startsWith(nowHour));
    if (idx < 0) idx = 0;

    const info = decode(codes[idx]);
    const current: CurrentWeather = {
        temperature: Math.round(temps[idx]),
        weatherCode: codes[idx],
        windSpeed:   Math.round(winds[idx]),
        humidity:    humidity[idx],
        condition:   info.condition,
        icon:        info.icon,
    };

    // Group 168 hourly points into 7 daily forecasts (24 per day)
    const daily: DailyForecast[] = [];
    for (let d = 0; d < 7; d++) {
        const start   = d * 24;
        const dayTemps = temps.slice(start, start + 24);
        const date    = times[start].split('T')[0];      // "2026-02-27"
        const noonIdx = start + 12;                       // Use midday for day's icon
        const dayInfo = decode(codes[noonIdx]);

        daily.push({
            date,
            dayName:  dayName(date),
            maxTemp:  Math.round(Math.max(...dayTemps)),
            minTemp:  Math.round(Math.min(...dayTemps)),
            weatherCode: codes[noonIdx],
            precipitation: 0,
            icon: dayInfo.icon,
        });
    }

    return { current, daily, locationName };
}
