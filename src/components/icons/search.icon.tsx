import IconProps from '@/components/icons/icon-props';

const SearchIcon = ({
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
      d="M11 6C13.7614 6 16 8.23858 16 11M16.6588 16.6549L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
      stroke="#000000"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SearchIcon;
