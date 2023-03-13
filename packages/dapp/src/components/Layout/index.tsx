import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { ToastWrapper } from './ToastWrapper';

const Layout = ({ children }: { children: JSX.Element }) => {
  return (
    <div className="flex h-screen flex-col">
      <>
        <ToastWrapper>
          <div className="mx-4 mt-4 lg:mx-8 xl:mx-16">
            <Navbar />
            <div className="my-8 lg:mt-12">{children}</div>
          </div>
        </ToastWrapper>
        <Footer />
      </>
    </div>
  );
};

export default Layout;
