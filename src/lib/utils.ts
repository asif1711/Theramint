import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAssetUrl(path: string): string {
  if (path.startsWith('http')) return path;
  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${cleanBase}${cleanPath}`;
}

export function getTherapistAvatarChain(fullName: string): string[] {
  const name = fullName || '';

  if (name.includes('Sarah')) {
    return [
      '/therapist1.webp',
      '/therapist1.jpg',
      '/therapist1.png',
      '/therapist1.jpeg',
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600'
    ].map(getAssetUrl);
  }
  if (name.includes('Michael')) {
    return [
      '/therapist2.webp',
      '/therapist2.jpg',
      '/therapist2.png',
      '/therapist2.jpeg',
      'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600'
    ].map(getAssetUrl);
  }
  if (name.includes('Elena')) {
    return [
      '/therapist3.webp',
      '/therapist3.jpg',
      '/therapist3.png',
      '/therapist3.jpeg',
      'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=600'
    ].map(getAssetUrl);
  }
  return [
    '/therapist1.webp',
    '/therapist1.jpg',
    '/therapist1.png',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600'
  ].map(getAssetUrl);
}
