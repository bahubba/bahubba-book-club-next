export default interface IconProps {
  color?: 'primary' | 'secondary' | 'black' | 'white';
  fill?: string; // TODO - make this a union type of the colors in the theme
  size?: number;
  height?: number;
  width?: number;
  label?: string;
}
