# Lab Test 2 — Design Document

**Date:** 2026-02-27
**Feature:** Map + Location Search + Weather (7-day forecast)

---

## Overview

A new screen added as a drawer-top-level entry called "Lab Test 2". It shows a full-screen map, an overlaid search bar, and a sliding bottom sheet with current weather and a 7-day forecast. Theme (dark/light) is inherited from the existing ThemeContext and toggled via the existing drawer settings.

---

## Navigation Integration

- Route: `app/(app)/test2.tsx` (renders `<LabTest2 />`)
- Added as a new entry in the root drawer (`app/_layout.tsx`)
- No tabs involvement — drawer-only access

---

## New Dependencies

| Package | Purpose |
|---|---|
| `react-native-maps` | Native map rendering (Google Maps on Android, Apple Maps on iOS) |
| `expo-location` | GPS permission + current coordinates |
| `@gorhom/bottom-sheet` | Sliding weather panel (deps already installed) |

---

## File Structure

```
src/exercises/labtest2/
  index.tsx                     ← Main screen (state owner)
  components/
    SearchBar.tsx               ← Overlaid search input on map
    WeatherBottomSheet.tsx      ← Bottom sheet wrapper
    CurrentWeatherCard.tsx      ← Today's temp, condition, humidity, wind
    ForecastStrip.tsx           ← Horizontal 7-day scroll
  services/
    geocoding.ts                ← Nominatim API (search query → coordinates)
    weather.ts                  ← Open-Meteo API (coordinates → weather data)
  types.ts                      ← Shared TypeScript types
```

---

## Screen Layout

```
┌─────────────────────────────────┐
│  [≡]  [🔍 Search location...  ] │  ← SearchBar (absolute overlay, top)
│                                  │
│         react-native-maps        │
│         (full screen)            │
│         📍 location marker       │
│                                  │
│  ┌── Bottom Sheet ──────────────┐│
│  │ 📍 City Name, Country        ││  snap point 1: peek
│  │ ☁ 22°C  Partly Cloudy       ││
│  │ Humidity: 68%  Wind: 12km/h  ││
│  │ ────────────────────────     ││
│  │ [Mon][Tue][Wed]... →         ││  horizontal 7-day scroll
│  └──────────────────────────────┘│
└─────────────────────────────────┘
```

Bottom sheet has 3 snap points: peek (120px), half (~45%), full (~85%).

---

## Data Flow

1. Screen mounts → `expo-location` requests permission → obtains coords
2. Coords → `MapView` centers + `weather.ts` fetches Open-Meteo
3. User types in search → on submit → `geocoding.ts` calls Nominatim → new coords
4. New coords → `MapView.animateToRegion()` + re-fetch weather
5. Weather state updates → `WeatherBottomSheet` re-renders

**State in `index.tsx`:** `location: {lat, lon, name}`, `weatherData`, `searchQuery`, `isLoadingWeather`, `error`

---

## API Contracts

### Geocoding — OpenStreetMap Nominatim (free, no key)
```
GET https://nominatim.openstreetmap.org/search
  ?q={query}&format=json&limit=1
→ [{ lat: string, lon: string, display_name: string }]
```
Called on form submit only (not on keystroke) to respect 1 req/sec rate limit.

### Weather — Open-Meteo (free, no key)
```
GET https://api.open-meteo.com/v1/forecast
  ?latitude={lat}&longitude={lon}
  &current=temperature_2m,weathercode,windspeed_10m,relative_humidity_2m
  &daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_sum
  &timezone=auto
  &forecast_days=7
```

---

## Error Handling

| Scenario | Behavior |
|---|---|
| Location permission denied | Use default coords (Algiers: 36.74, 3.06) + show banner |
| Geocoding returns no results | Show "Location not found" inline under search bar |
| Weather fetch fails | Show "Weather unavailable" placeholder in bottom sheet |
| Network offline | Graceful error state (no crash) |

---

## Theme Integration

- All components use `useTheme()` from `src/exercises/common/ThemeContext.tsx`
- `MapView.customMapStyle`: applies a dark JSON style when `theme === 'dark'`
- Bottom sheet background: `colors.card`
- Search bar background: `colors.card` with `colors.border`
- Text: `colors.text`
- Theme toggle remains in the existing drawer Settings screen

---

## Permissions (app.json)

Add to `app.json` plugins:
```json
["expo-location", {
  "locationAlwaysAndWhenInUsePermission": "This app uses your location to show weather at your current position."
}]
```
