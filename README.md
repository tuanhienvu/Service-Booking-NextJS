# Service-Booking Next.js Application

> A modern, full-stack Next.js service booking application for home services with real-time features, payment processing, and comprehensive user management.

## 🚀 Live Demo

[![Netlify Status](https://api.netlify.com/api/v1/badges/a1c0de26-1c5f-4f0f-967b-940f9a03403b/deploy-status?branch=master)](https://app.netlify.com/sites/nextjs-home-services-booking/deploys)

**[Live Demo](https://nextjs-home-services-booking.netlify.app/)**

## 🛠️ Technologies & Frameworks

### Frontend

- **Next.js 14** - React framework with App Router
- **React 18** - UI library with latest features
- **TypeScript** - Type-safe JavaScript development
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Component library built on Tailwind CSS
- **Keen Slider** - Touch-friendly carousel/slider
- **React Hook Form** - Form handling and validation
- **React Hot Toast** - Toast notifications
- **React Icons** - Icon library
- **React Calendar** - Date picker component
- **React Confetti** - Celebration effects

### Backend & Database

- **Next.js API Routes** - Server-side API endpoints
- **Prisma ORM** - Database toolkit and ORM
- **PostgreSQL** - Primary database
- **Supabase** - Backend-as-a-Service (optional)

### Authentication & Security

- **JWT (JSON Web Tokens)** - Stateless authentication
- **bcryptjs** - Password hashing
- **Role-based access control** - Admin, Customer, Service Provider roles

### Payment & External Services

- **Stripe** - Payment processing
- **Google Maps API** - Location services
- **Nodemailer** - Email functionality
- **Gmail SMTP** - Email delivery

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## ✨ Features & Functionality

### 🏠 Home & User Experience

- **Interactive Carousel** - Promotional slides with Keen Slider
- **Service Categories** - Browse available service types
- **Popular Services** - Featured and trending services
- **Responsive Design** - Mobile-first, cross-device compatibility

### 👤 User Management

- **User Registration & Login** - Secure authentication system
- **Role-based Access** - Different interfaces for different user types
- **Profile Management** - Update personal information and preferences
- **Password Recovery** - Secure password reset via email

### 📅 Booking System

- **Service Booking** - Schedule appointments with service providers
- **Calendar Integration** - Date and time selection
- **Location Services** - Google Maps integration for service areas
- **Booking Management** - View, edit, and cancel appointments

### 💳 Payment Processing

- **Stripe Integration** - Secure payment processing
- **Multiple Payment Methods** - Credit cards, digital wallets
- **Payment History** - Track all transactions
- **Refund Support** - Handle payment reversals

### 🔧 Service Provider Features

- **Service Listings** - Create and manage service offerings
- **Availability Management** - Set working hours and availability
- **Order Management** - Handle incoming service requests
- **Earnings Tracking** - Monitor income and performance

### 📊 Admin Dashboard

- **User Management** - Oversee all users and roles
- **Order Monitoring** - Track all bookings and payments
- **Review Management** - Moderate customer feedback
- **Analytics** - Business insights and reporting

### 📱 Notifications & Communication

- **Email Notifications** - Booking confirmations and updates
- **Real-time Updates** - Live status changes
- **Review System** - Customer feedback and ratings

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.17 or later
- **npm** or **yarn** package manager
- **PostgreSQL** database
- **Git** for version control

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd service-booking-nextjs

# Install dependencies
npm install
# or
yarn install

# Set up environment variables
cp ENVIRONMENT_SETUP.md .env.local
# Edit .env.local with your actual values

# Set up database
npm run build
# This will generate Prisma client

# Run database migrations (if needed)
npx prisma migrate dev

# Seed the database (optional)
npm run seed

# Start development server
npm run dev
```

### Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/service-booking"

# JWT
JWT_SECRET="your-super-secret-jwt-key"

# Email (Gmail)
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"

# App
NEXT_PUBLIC_HOST="http://localhost:3000"
NODE_ENV="development"

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your-key"
STRIPE_SECRET_KEY="sk_test_your-key"

# Supabase (optional)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

## 🚀 Deployment & Hosting

### Build for Production

```bash
# Generate Prisma client and build
npm run build

# Start production server
npm start
```

### Deployment Options

#### 1. Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

#### 2. Netlify

```bash
# Build command
npm run build

# Publish directory
.next

# Set environment variables in Netlify dashboard
```

#### 3. Traditional Server

```bash
# Build the application
npm run build

# Copy .next folder to server
# Set up reverse proxy (nginx/Apache)
# Configure environment variables
# Use PM2 or similar for process management
```

### Server Requirements

- **Node.js** 18.17+
- **PostgreSQL** 12+
- **SSL Certificate** (for HTTPS)
- **Reverse Proxy** (nginx/Apache)
- **Process Manager** (PM2, Docker, etc.)

## 📖 Usage Guidelines

### For Customers

1. **Browse Services** - View available service categories
2. **Select Service** - Choose service type and provider
3. **Book Appointment** - Pick date, time, and location
4. **Make Payment** - Complete booking with Stripe
5. **Track Progress** - Monitor booking status
6. **Leave Reviews** - Rate and review completed services

### For Service Providers

1. **Create Profile** - Set up service offerings and pricing
2. **Manage Availability** - Set working hours and availability
3. **Handle Bookings** - Accept, reject, or modify requests
4. **Complete Services** - Mark jobs as finished
5. **Track Earnings** - Monitor income and performance

### For Administrators

1. **User Management** - Oversee all user accounts
2. **Order Monitoring** - Track all bookings and payments
3. **Content Management** - Update service categories and features
4. **Analytics** - View business insights and reports

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run seed         # Seed database with sample data
```

### Project Structure

```
service-booking-nextjs/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── components/        # Reusable components
│   ├── auth/             # Authentication pages
│   ├── admin/            # Admin dashboard
│   ├── services/         # Service-related pages
│   └── layout.tsx        # Root layout
├── prisma/               # Database schema and migrations
├── public/               # Static assets
├── styles/               # Global styles
└── config/               # Configuration files
```

### Database Schema

The application uses a relational database with the following main entities:

- **Users** - Customers, service providers, and admins
- **Categories** - Service types and classifications
- **Orders** - Booking requests and transactions
- **Reviews** - Customer feedback and ratings
- **Notifications** - System and user notifications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the [documentation](docs/)
- Review the [environment setup guide](ENVIRONMENT_SETUP.md)

## 🔮 Roadmap

- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Advanced scheduling algorithms
- [ ] Integration with more payment providers
- [ ] Real-time chat support
- [ ] Advanced notification system

---

**Built with ❤️ using Next.js, TypeScript, and modern web technologies**
