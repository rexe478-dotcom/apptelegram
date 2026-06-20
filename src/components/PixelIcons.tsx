import React from 'react';

interface PixelIconProps {
  className?: string;
}

export function PixelHomeIcon({ className = "w-6 h-6" }: PixelIconProps) {
  return (
    <svg className={className} viewBox="0 0 12 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: 'pixelated' }}>
      {/* 12x12 grid house */}
      <path d="M5 1h2v1H5V1zm-1 1h4v1H4V2zm-1 1h6v1H3V3zm-1 1h8v1H2V4zm-1 1h10v1H1V5zm0 1h2v5H1V6zm8 0h2v5H9V6zm-6 1h4v4H3V7zm1 1h2v3H4V8z" />
    </svg>
  );
}

export function PixelHistoryIcon({ className = "w-6 h-6" }: PixelIconProps) {
  return (
    <svg className={className} viewBox="0 0 12 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: 'pixelated' }}>
      {/* Hourglass representing node history */}
      <path d="M2 1h8v1H2V1zm0 1h8v1H2V2zm1 1h6v1H3V3zm1 1h4v1H4V4zm1 1h2v1H5V5zm0 1h2v1H5V6zm-1 1h4v1H4V7zm-1 1h6v1H3V8zm-1 1h8v1H2V9zm0 1h8v1H2v-1z" />
    </svg>
  );
}

export function PixelRanksIcon({ className = "w-6 h-6" }: PixelIconProps) {
  return (
    <svg className={className} viewBox="0 0 12 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: 'pixelated' }}>
      {/* Trophy representing leaderboards */}
      <path d="M2 2h8v1H2V2zm0 1h1v2H2V3zm7 0h1v2H9V3zm-6 2h6v1H3V5zm1 1h4v1H4V6zm2 1h1v2H6V7zm-2 2h4v1H4V9zm-2 1h8v1H2v-1z" />
    </svg>
  );
}

export function PixelProfileIcon({ className = "w-6 h-6" }: PixelIconProps) {
  return (
    <svg className={className} viewBox="0 0 12 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: 'pixelated' }}>
      {/* User profile avatar shape */}
      <path d="M4 1h4v1H4V1zm-1 1h6v1H3V2zm0 1h6v1H3V3zm-1 1h8v1H2V4zm0 1h8v1H2V5zm1 1h6v1H3V6zm-2 2h10v1H1V8zm-1 1h12v3H0V9z" />
    </svg>
  );
}

export function PixelShieldIcon({ className = "w-6 h-6" }: PixelIconProps) {
  return (
    <svg className={className} viewBox="0 0 12 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: 'pixelated' }}>
      {/* Shield status badge */}
      <path d="M1 1h10v4H1V1zm1 4h8v2H2V5zm1 2h6v2H3V7zm1 2h4v2H4V9zm1 2h2v1H5v-1z" />
    </svg>
  );
}

export function PixelFireIcon({ className = "w-6 h-6" }: PixelIconProps) {
  return (
    <svg className={`${className} animate-pulse`} viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: 'pixelated' }}>
      {/* Outer flame (Electric Pink) */}
      <path d="M5 1h2v1H5V1zm-1 1h4v1H4V2zm-1 2h6v1H3V4zm-1 2h8v1H2V6zm-1 2h10v1H1V8zm0 1h10v2H1V9z" fill="#fe00fe" />
      {/* Middle flame (Cyber Yellow) */}
      <path d="M5 4h2v1H5V4zm-1 2h4v1H4V6zm-1 2h6v2H3V8z" fill="#ffdb40" />
      {/* Inner core (White) */}
      <path d="M5 7h2v2H5V7z" fill="#ffffff" />
    </svg>
  );
}
