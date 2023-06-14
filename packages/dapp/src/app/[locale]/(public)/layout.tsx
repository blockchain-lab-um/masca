import PublicNavbar from '@/components/PublicNavbar';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen px-4 sm:px-12">
      <PublicNavbar />
      <div className="flex min-h-screen pt-24">
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
