import IconProps from '@/components/icons/icon-props';

const RejectIcon = ({
                      color = 'secondary',
                      fill = 'currentColor',
                      size,
                      height,
                      width,
                      label,
                      ...props
                    }: IconProps): React.ReactNode => (
  <svg
    height={ size || height || 24 }
    width={ size || width || 24 }
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://ww.w3.org/2000/svg"
    { ...props }
  >
    <circle
      cx="12"
      cy="12"
      r="9"
      stroke={ color === 'black' ? '#000' : '#FFBA00' }
      strokeWidth="2"
    />
    <path
      d="M18 18L6 6"
      stroke={ color === 'black' ? '#000' : '#FFBA00' }
      strokeWidth="2"
    />
  </svg>
);

export default RejectIcon;
