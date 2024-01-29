import ProtectedRoute from '@/components/nav/protected-route.component';

/**
 * Layout for the home page; Simple protected route
 *
 * @param {Object} props Component props
 * @param {React.ReactNode} props.children The children of the layout
 */
const HomePageLayout = ({ children }: Readonly<{ children: React.ReactNode }>) =>
  <ProtectedRoute>{ children }</ProtectedRoute>;

export default HomePageLayout;
