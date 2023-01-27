import Footer from '../Footer';
import Navbar from '../Navbar';

const Layout = ({ children }: { children: JSX.Element }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="my-4 desktop:mx-16 mx-4 tablet:mx-8">
        <Navbar />
        <div className="mt-8 tablet:mt-16">{children}</div>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
