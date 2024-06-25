import IconProps from '@/components/icons/icon-props';

const AddMemberIcon = ({
                         color,
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
    xmlns="http://www.w3.org/2000/svg"
    { ...props }
  >
    <circle
      cx="10"
      cy="6"
      r="4"
      stroke={ !color ? '#1C274C' : color === 'primary' ? '#0A5C36' : '#FFBA00' }
      strokeWidth="1.5"
    />
    <path
      d="M21 10H19M19 10H17M19 10L19 8M19 10L19 12"
      stroke={ !color ? '#1C274C' : color === 'primary' ? '#0A5C36' : '#FFBA00' }
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M17.9975 18C18 17.8358 18 17.669 18 17.5C18 15.0147 14.4183 13 10 13C5.58172 13 2 15.0147 2 17.5C2 19.9853 2 22 10 22C12.231 22 13.8398 21.8433 15 21.5634"
      stroke={ !color ? '#1C274C' : color === 'primary' ? '#0A5C36' : '#FFBA00' }
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export default AddMemberIcon;
