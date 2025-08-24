# Environment Variables Setup

This application requires the following environment variables to function properly. Create a `.env.local` file in the root directory with these variables:

## Required Environment Variables

### Database Configuration

```bash
DATABASE_URL="postgresql://username:password@localhost:5432/service-booking"
```

### JWT Configuration

```bash
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
```

### Email Configuration (Gmail)

```bash
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
```

### Application Configuration

```bash
NEXT_PUBLIC_HOST="http://localhost:3000"
NODE_ENV="development"
```

### Google Maps API

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
```

### Stripe Configuration

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your-stripe-publishable-key"
STRIPE_SECRET_KEY="sk_test_your-stripe-secret-key"
```

### Supabase Configuration (if using Supabase)

```bash
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

## Important Security Notes

1. **Never expose `STRIPE_SECRET_KEY` to the client side** - it should only be used in server-side API routes
2. **Use strong, unique values for `JWT_SECRET`** in production
3. **Keep your `.env.local` file out of version control** (it's already in `.gitignore`)

## Setup Instructions

1. Copy this file to `.env.local`
2. Fill in your actual values for each variable
3. Restart your development server
4. Run `npm run build` to verify everything works

## Testing the Setup

After setting up the environment variables:

1. Run `npm run dev` to start the development server
2. Check the console for any missing environment variable errors
3. Test the application functionality
4. Run `npm run build` to ensure the production build works
