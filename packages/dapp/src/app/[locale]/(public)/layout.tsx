import PublicFooter from '@/components/PublicFooter';
import PublicNavbar from '@/components/PublicNavbar';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <div className="relative min-h-screen px-4 sm:px-12">
    //   <PublicNavbar />
    //   <div className="flex min-h-screen pt-24">
    //     <div className="flex-1">{children}</div>
    //   </div>
    //   <div className="relative bottom-0 left-0 right-0 w-full">
    //     <PublicFooter />
    //   </div>
    // </div>
    <div className="flex min-h-screen flex-col px-4 sm:px-12">
      <PublicNavbar />
      <div className="flex flex-1">
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
      <div className="relative bottom-0 left-0 right-0">
        <PublicFooter />
      </div>
    </div>
  );
}
