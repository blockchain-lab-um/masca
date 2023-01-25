import Navbar from '../Navbar';

const Layout = ({ children }: { children: JSX.Element }) => {
  return (
    <div className="containe mx-auto my-4 desktop:mx-16 mobile:mx-4 tablet:mx-8">
      <Navbar />
      <div className="mt-16">{children}</div>
    </div>
  );
};

export default Layout;
