'use client';

import { useState } from 'react';

// Component props
interface SectionHeaderLayoutProps {
  title: React.ReactNode;
  hiddenContentJustify?: 'start' | 'around' | 'between' | 'end';
  children?: React.ReactNode;
}

/**
 * Header for a section of a sectioned page, with action section hidden until hovered over
 *
 * @param {Object} props - The component props
 * @param {React.ReactNode} props.title - The title of the section
 * @param {'start' | 'around' | 'between' | 'end'} props.hiddenContentJustify - The alignment of the hidden content
 * @param {React.ReactNode} props.children - The content to display in the hidden hover div of the header
 */
const SectionHeaderLayout = ({
  title,
  hiddenContentJustify = 'end',
  children
}: Readonly<SectionHeaderLayoutProps>) => {
  // State vars
  const [hover, setHover] = useState(false);

  // Event handlers
  const handleMouseEnter = () => setHover(true);
  const handleMouseLeave = () => setHover(false);

  return (
    <div
      className="flex items-center w-full gap-x-4 p-2 pb-0"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex-shrink mb-0.5">{title}</div>
      <div className={`flex flex-1 justify-${hiddenContentJustify}`}>
        {hover && children}
      </div>
    </div>
  );
};

export default SectionHeaderLayout;
