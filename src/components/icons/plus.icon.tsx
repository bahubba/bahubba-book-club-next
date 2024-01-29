import IconProps from '@/components/icons/icon-props';

const PlusIcon = ({
  fill = 'currentColor',
  size,
  height,
  width,
  label,
  ...props
}: IconProps): React.ReactNode => (
  <svg
    height={size || height || 24}
    width={size || width || 24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://ww.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6 12H18M12 6V18"
      stroke="#000000"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={fill}
    />
  </svg>
);

export default PlusIcon;
