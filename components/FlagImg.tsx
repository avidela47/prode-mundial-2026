'use client';

import Image from 'next/image';
import { EQUIPOS } from '@/lib/fixture';

interface FlagImgProps {
  equipo: string;
  size?: number;
  className?: string;
}

export function FlagImg({ equipo, size = 32, className = '' }: FlagImgProps) {
  const eq = EQUIPOS[equipo];
  if (!eq) return (
    <div
      style={{ width: size, height: Math.round(size * 0.67), borderRadius: 3, background: '#333' }}
      className={className}
    />
  );

  const codigo = eq.codigo;
  const height = Math.round(size * 0.67);

  // flagcdn handles subdivisions like gb-sct, gb-eng
  const url = `https://flagcdn.com/w${size >= 64 ? '80' : '40'}/${codigo}.png`;

  return (
    <img
      src={url}
      alt={equipo}
      width={size}
      height={height}
      style={{ borderRadius: 3, objectFit: 'cover', display: 'block' }}
      className={className}
    />
  );
}
