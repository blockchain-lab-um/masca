import Image from 'next/image';
import Link from 'next/link';

export interface ProjectIconProps {
  icon: string;
  href: string;
  alt: string;
}

const ProjectIcon = ({ icon, href, alt }: ProjectIconProps) => (
  <div className="relative h-24 w-full sm:w-36">
    <Link href={href}>
      <Image src={icon} alt={alt} fill objectFit="contain" />
    </Link>
  </div>
);

export default ProjectIcon;
