# লেনদেন (Lenden) - Digital Baki Khata Frontend

A modern, mobile-first Next.js application for managing digital ledger (Baki Khata) for shop owners and customers in Bangladesh.

## 🚀 Features

- 📱 Mobile-first responsive design
- 🔐 Phone-based authentication
- 🏪 Shop management
- 👥 Customer management
- 💰 Credit (Baki) and Payment tracking
- 📊 Real-time ledger views
- 🔔 In-app notifications
- 💳 Subscription management
- 🌐 Bangla language support

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui (Radix UI)
- **Forms**: React Hook Form + Zod
- **State Management**: React Context API
- **Icons**: Lucide React
- **Notifications**: Sonner

## 📋 Prerequisites

- Node.js 18+ 
- npm/yarn/pnpm
- Backend API running (see `lenden_backend`)

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. Environment Setup

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Update the API URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

For production:

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

### 3. Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/          # Shop owner dashboard
│   ├── customer/           # Customer dashboard
│   ├── customers/          # Customer management
│   ├── ledger/             # Ledger views
│   ├── notifications/      # Notifications page
│   └── subscription/      # Subscription management
├── components/             # React components
│   ├── dashboard/          # Dashboard-specific components
│   ├── landing/            # Landing page components
│   ├── modals/             # Modal components
│   ├── shared/             # Shared components
│   └── ui/                 # shadcn/ui components
├── contexts/               # React Context providers
│   └── AppContext.tsx      # Main app state management
├── hooks/                  # Custom React hooks
└── lib/                    # Utility functions
    ├── api.ts              # API client
    ├── formatters.ts       # Formatting utilities
    └── utils.ts            # General utilities
```

## 🔧 Configuration

### API Configuration

The API client is configured in `src/lib/api.ts`. It automatically:
- Adds authentication tokens to requests
- Handles 401 errors (redirects to login)
- Provides error handling
- Supports all backend endpoints

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:8000/api` |

## 🚨 Important Notes

### ⚠️ Before Production Launch

**Critical**: The app currently uses dummy data in `AppContext`. Before launching:

1. **Replace dummy data** with real API calls in `src/contexts/AppContext.tsx`
2. **Integrate authentication** flow in `src/app/auth/page.tsx`
3. **Add error boundaries** for better error handling
4. **Add loading states** for better UX

See `PRODUCTION_READINESS.md` and `FRONTEND_AUDIT_REPORT.md` for detailed checklist.

## 📚 API Integration

The app uses a centralized API client (`src/lib/api.ts`) with the following modules:

- `authAPI` - Authentication (register, login, profile)
- `shopAPI` - Shop management
- `customerAPI` - Customer management
- `transactionAPI` - Credit and payment entries
- `notificationAPI` - Notifications
- `subscriptionAPI` - Subscription management

All API calls include:
- Automatic token injection
- Error handling
- TypeScript types
- Consistent error messages

## 🎨 Styling

The app uses Tailwind CSS with:
- Custom color scheme for Bangla-friendly design
- Responsive breakpoints
- Dark mode support (via next-themes)
- Custom animations

## 📱 Mobile Support

- Fully responsive design
- Touch-optimized interactions
- Mobile-first approach
- PWA-ready (can be extended)

## 🔒 Security

- Environment variables for sensitive data
- Secure token storage (localStorage)
- HTTPS enforced in production
- Security headers configured
- Input validation on all forms

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

### Other Platforms

The app uses Next.js standalone output, making it compatible with:
- Docker
- AWS Amplify
- Netlify
- Railway
- Any Node.js hosting

## 📖 Documentation

- `PRODUCTION_READINESS.md` - Pre-launch checklist
- `FRONTEND_AUDIT_REPORT.md` - Code audit and recommendations
- `CURSOR.md` - Development guidelines (if exists)

## 🤝 Contributing

1. Follow TypeScript best practices
2. Use Biome for code formatting
3. Follow existing code structure
4. Add proper error handling
5. Test on mobile devices

## 📄 License

Private project - All rights reserved

## 🆘 Support

For issues or questions, refer to:
- Backend documentation in `lenden_backend/`
- Next.js documentation: https://nextjs.org/docs
- shadcn/ui documentation: https://ui.shadcn.com

