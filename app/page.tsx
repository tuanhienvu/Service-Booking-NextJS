import HomeCarousel from '@/app/components/home/HomeCarousel';
import ServiceCategories from '@/app/components/home/ServiceCategories';
import HomePopularServices from '@/app/components/home/HomePopularServices';

export const metadata = {
  title: 'Service - Home',
  description: 'Service home page',
  keywords: 'next, next.js, react, app, booking',
};

const Home = async () => {
  // All users (authenticated or not) can view the home page
  // User authentication is handled in the root layout
  return (
    <div className="home w-full">
      <HomeCarousel />
      <div className="container mx-auto">
        <ServiceCategories title="Categories" />
        <HomePopularServices title="Popular Services" />
      </div>
    </div>
  );
};

export default Home;
