import React, { useState } from 'react';
import { getTherapistAvatarChain } from '../lib/utils';

interface TherapistImageProps {
  fullName: string;
  className?: string;
  alt: string;
}

export function TherapistImage({ fullName, className, alt }: TherapistImageProps) {
  const chain = getTherapistAvatarChain(fullName);
  const [index, setIndex] = useState(0);

  const handleError = () => {
    if (index < chain.length - 1) {
      setIndex(index + 1);
    }
  };

  // Determine custom object-position based on therapist's name to frame their faces perfectly
  let positionClass = 'object-[center_20%]'; // Excellent default for top-aligned portraits
  const nameLower = fullName.toLowerCase();
  if (nameLower.includes('sarah')) {
    positionClass = 'object-[center_15%]';
  } else if (nameLower.includes('michael')) {
    positionClass = 'object-[center_15%]';
  } else if (nameLower.includes('elena')) {
    positionClass = 'object-[center_18%]';
  }

  // If a custom object-position is already specified in className, don't override it
  const hasObjectPosition = className && (
    className.includes('object-top') || 
    className.includes('object-bottom') || 
    className.includes('object-center') || 
    className.includes('object-[')
  );

  const combinedClassName = `${className || ''} ${hasObjectPosition ? '' : positionClass}`;

  return (
    <img
      src={chain[index]}
      alt={alt}
      className={combinedClassName}
      onError={handleError}
    />
  );
}
