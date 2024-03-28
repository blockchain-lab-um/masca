import PublicFooter from '@/components/PublicFooter';
import PublicNavbar from '@/components/PublicNavbar';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen px-4 sm:px-12">
      <div className="m-0 p-6 sm:px-12">
        <PublicNavbar />
      </div>
      <div className="flex flex-1">
        <div className="flex flex-1 items-center justify-center overflow-auto">
          {children}
        </div>
      </div>
      <div className="relative bottom-0 left-0 right-0 p-6 max-md:hidden sm:px-12">
        <PublicFooter setIsMenuOpen={null} />
      </div>
    </div>
  );
}
