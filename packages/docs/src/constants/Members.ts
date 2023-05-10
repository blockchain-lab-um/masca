/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import andraz from '@site/static/img/team/andraz_photo.jpg';
import martin from '@site/static/img/team/martin_photo.jpg';
import muhamed from '@site/static/img/team/muhamed_photo.jpg';
import patrik from '@site/static/img/team/patrik_photo.jpg';
import spela from '@site/static/img/team/spela_photo.jpg';
import urban from '@site/static/img/team/urban_photo.jpg';
import vid from '@site/static/img/team/vid_photo.jpg';

export type Member = {
  name: string;
  title: string;
  description: string;
  linkedin: string;
  image: any;
  twitter: string;
  github: string;
};

const members: Member[] = [
  {
    name: 'doc. dr. Muhamed Turkanović',
    title: 'Head of BlockchainLab:UM',
    description: '',
    linkedin: 'https://www.linkedin.com/in/muhamedturkanovic/',
    image: muhamed,
    twitter: '',
    github: '',
  },
  {
    name: 'Vid Keršič',
    title: 'Project Leader & Researcher',
    description: '',
    linkedin: 'https://www.linkedin.com/in/vid-kersic/',
    image: vid,
    twitter: 'https://twitter.com/vidkersic',
    github: 'https://github.com/Vid201',
  },
  {
    name: 'Andraž Vrečko',
    title: 'Developer & Researcher',
    description: '',
    linkedin: 'https://www.linkedin.com/in/andrazvrecko/',
    image: andraz,
    twitter: '',
    github: 'https://github.com/andyv09',
  },
  {
    name: 'Martin Domajnko',
    title: 'Developer & Researcher',
    description: '',
    linkedin: 'https://www.linkedin.com/in/martin-domajnko/',
    image: martin,
    twitter: 'https://twitter.com/MartinesXD',
    github: 'https://github.com/martines3000',
  },
  {
    name: 'Urban Vidovič',
    title: 'Developer & Researcher',
    description: '',
    linkedin: 'https://www.linkedin.com/in/urbanvidovic',
    image: urban,
    twitter: 'https://twitter.com/plesasta_pevka',
    github: 'https://github.com/plesastapevka',
  },
  {
    name: 'Tadej Podrekar',
    title: 'Developer & Researcher',
    description: '',
    linkedin: 'https://www.linkedin.com/in/tadej-podrekar/',
    image: 'https://via.placeholder.com/150',
    twitter: '',
    github: '',
  },
  {
    name: 'Špela Čučko',
    title: 'Researcher & UI/UX Designer',
    description: '',
    linkedin: 'https://www.linkedin.com/in/spelacucko/',
    image: spela,
    twitter: '',
    github: '',
  },
  {
    name: 'Patrik Rek',
    title: 'Developer & Researcher',
    description: '',
    linkedin: 'https://www.linkedin.com/in/patrik-rek/',
    image: patrik,
    twitter: '',
    github: 'https://github.com/patrikrek',
  },
];

export default members;
