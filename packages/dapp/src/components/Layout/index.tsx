import Footer from '../Footer';
import Navbar from '../Navbar';

const Layout = ({ children }: { children: JSX.Element }) => {
  return (
    <div className="flex flex-col h-screen">
      <div className="mt-4 xl:mx-16 mx-4 lg:mx-8">
        <Navbar />
        <div className="my-8 lg:mt-12">{children}</div>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
