import { LocationResult } from '../types';

export async function searchLocation(query: string): Promise<LocationResult | null> {
  if (!query.trim()) return null;

  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'MobileDevClass-LabTest2/1.0',
      'Accept-Language': 'en',
    },
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const results = await res.json();

  if (!results?.length) return null;

  return {
    coordinates: {
      latitude: parseFloat(results[0].lat),
      longitude: parseFloat(results[0].lon),
    },
    displayName: results[0].display_name,
  };
}
