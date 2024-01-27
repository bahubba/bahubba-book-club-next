import ProtectedRoute from '@/components/nav/protected-route.component';

/** Layout for the home page; Simple protected route */
const HomePageLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return <ProtectedRoute>{ children }</ProtectedRoute>;
};

export default HomePageLayout;
