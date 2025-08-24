import { category, review, serviceProvider } from '@prisma/client';

export interface serviceProviderExtended extends serviceProvider {
  category: category;
  reviewMessages: review[];
  _count: {
    reviewMessages: number;
  };
  rating: number;
}

export interface reviewExtended extends review {
  user: {
    first_name: string;
    last_name: string;
    imageUrl: string;
  };
}
