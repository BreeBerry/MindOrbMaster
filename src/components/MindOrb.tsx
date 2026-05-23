import React, { useState, useEffect } from 'react';
import { INITIAL_ORBS } from '../data';

interface MindOrbProps {
  orbId: string;
  className?: string; // e.g., 'w-3.5 h-3.5' or 'w-8.5 h-8.5'
  style?: React.CSSProperties;
  key?: React.Key;
}

export default function MindOrb({ orbId, className = 'w-3.5 h-3.5', style }: MindOrbProps) {
  const [imgErr, setImgErr] = useState(false);
  const orb = INITIAL_ORBS.find(o => o.id === orbId);

  useEffect(() => {
    setImgErr(false);
  }, [orbId]);

  if (!orb) {
    return (
      <div
        className={`${className} rounded-full shadow-inner relative flex-shrink-0`}
        style={{
          background: 'radial-gradient(circle at 35% 35%, #ffffff 0%, #cccccc 45%, #000000 100%)',
          ...style
        }}
      />
    );
  }

  const imageUrl = `/Images/mind_orb_assets/${orbId}_orb.png`;

  if (!imgErr) {
    return (
      <img
        src={imageUrl}
        alt={orb.name}
        onError={() => setImgErr(true)}
        className={`${className} rounded-full object-cover flex-shrink-0 select-none`}
        style={style}
      />
    );
  }

  // Fallback to beautiful CSS gradient if image is missing/failing
  return (
    <div
      className={`${className} rounded-full shadow-inner relative flex-shrink-0`}
      style={{
        background: `radial-gradient(circle at 35% 35%, #ffffff 0%, ${orb.hex} 45%, #000000 100%)`,
        boxShadow: `0 0 10px ${orb.hex}30`,
        ...style
      }}
    />
  );
}
