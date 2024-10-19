import Image from 'next/image';

import images from '@/public/assets';

const Loader = () => (
  <div className="flexCenter w-full my-16">
    <Image src={images.loader} alt="loader" width={100} objectFit="contain" />
  </div>
);

export default Loader;