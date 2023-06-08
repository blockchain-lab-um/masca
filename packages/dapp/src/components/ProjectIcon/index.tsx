import Image from 'next/image';
import Link from 'next/link';

export interface ProjectIconProps {
  icon: string;
  href: string;
  alt: string;
  width: number;
  height: number;
}

const ProjectIcon = ({ icon, href, alt, width, height }: ProjectIconProps) => {
  return (
    <div className="relative flex items-center justify-center">
      <Link href={href}>
        <Image src={icon} alt={alt} width={width} height={height} />
      </Link>
    </div>
  );
};

export default ProjectIcon;
