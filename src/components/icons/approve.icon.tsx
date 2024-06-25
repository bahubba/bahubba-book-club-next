import IconProps from '@/components/icons/icon-props';

const ApproveIcon = ({
  color = 'black',
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
      d="M4 12.6111L8.92308 17.5L20 6.5"
      stroke={
        color === 'black'
          ? '#000'
          : color === 'white'
          ? '#FFF'
          : color === 'primary'
          ? '#1C274C'
          : '#FFBA00'
      }
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default ApproveIcon;
