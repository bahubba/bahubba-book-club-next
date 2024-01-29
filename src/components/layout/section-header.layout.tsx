'use client';

import { useState } from 'react';

// Component props
interface SectionHeaderLayoutProps {
  title: string;
  children?: React.ReactNode;
}

/**
 * Header for a section of a sectioned page, with action section hidden until hovered over
 */
const SectionHeaderLayout = ({ title, children }: Readonly<SectionHeaderLayoutProps>) => {
  // State vars
  const [ hover, setHover ] = useState(false);

  // Event handlers
  const handleMouseEnter = () => setHover(true);
  const handleMouseLeave = () => setHover(false);

  return (
    <div
      className="flex items-center justify-between p-2 pb-0"
      onMouseEnter={ handleMouseEnter }
      onMouseLeave={ handleMouseLeave }
    >
      <h1 className="flex-shrink text-2xl font-bold mb-0.5">{ title }</h1>
      <div className="flex flex-1 justify-end">
        { hover && children }
      </div>
    </div>
  );
};

export default SectionHeaderLayout;