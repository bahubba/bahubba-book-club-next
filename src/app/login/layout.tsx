/** Layout for the login page */
const LoginPageLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="flex justify-center items-start h-screen">
      <div className="flex flex-col justify-center">
        { children }
      </div>
    </div>
  );
};

export default LoginPageLayout;