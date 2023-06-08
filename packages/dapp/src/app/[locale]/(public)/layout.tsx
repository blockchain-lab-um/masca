import PublicNavbar from '@/components/PublicNavbar';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col p-4 sm:p-12">
      <PublicNavbar />
      <div className="flex-1">{children}</div>
    </div>
  );
}
