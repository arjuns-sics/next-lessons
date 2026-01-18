# Next.js 16 App Router Teaching Reference

This project is a comprehensive teaching-oriented reference codebase demonstrating Next.js 16 App Router concepts with a focus on clarity and pedagogy.

## Project Structure

```
src/
  app/
    transition/          # useTransition demonstration
    optimistic/          # Optimistic UI patterns
    cache/               # Caching strategies
    validation/          # Form validation
    error-handling/      # Error boundaries and recovery
    api/                 # API route handlers
    auth/                # Authentication patterns
    dashboard/           # Protected route example
  lib/
    auth/               # Auth utilities (JWT, session management)
    cache/              # Cache utilities
    validation/         # Validation schemas
  middleware.ts         # Route protection middleware
```

## Key Concepts Demonstrated

### 1. useTransition Demonstration (`/app/transition`)

**Location:** `/app/transition/page.tsx`

**Concepts:**

- React's `useTransition` hook
- Urgent vs non-urgent state updates
- UI responsiveness during async operations
- `isPending` state management

**Key Features:**

- Simulated async search with artificial delay
- Visual feedback during transitions
- Clear explanation of when to use transitions
- Interactive demo with immediate UI feedback

### 2. Optimistic UI (`/app/optimistic`)

**Location:** `/app/optimistic/page.tsx`

**Concepts:**

- React's `useOptimistic` hook
- Immediate UI updates before server confirmation
- Automatic rollback on failure
- Perceived performance improvements

**Key Features:**

- Post creation with optimistic updates
- Visual distinction between optimistic and confirmed states
- Simulated server failures (20% chance)
- Automatic reconciliation patterns

### 3. Caching with next/cache (`/app/cache`)

**Location:** `/lib/cache/getData.ts` and `/app/cache/page.tsx`

**Concepts:**

- `unstable_cache` function
- Cache tags and manual revalidation
- Time-based and tag-based invalidation
- Stale-while-revalidate patterns

**Key Features:**

- Mock database with cached data
- Manual cache invalidation controls
- Visual cache metadata display
- Comprehensive caching strategy explanations

### 4. Validation Patterns (`/app/validation`)

**Location:** `/lib/validation/schema.ts` and `/app/validation/page.tsx`

**Concepts:**

- Client-side and server-side validation
- Schema reuse with Zod
- Structured error responses
- Form validation patterns

**Key Features:**

- User registration and post creation forms
- Real-time validation feedback
- Server-side validation with detailed error messages
- Schema sharing between client and server

### 5. Error Handling (`/app/error-handling`)

**Location:** `/app/error-handling/page.tsx`, `error.tsx`, `loading.tsx`

**Concepts:**

- Error boundaries in App Router
- Route-specific error handling
- Graceful degradation
- Recovery strategies

**Key Features:**

- Different error type simulations
- Custom error boundary UI
- Loading states
- Retry functionality
- Error boundary demonstration page

### 6. API Routes (`/app/api`)

**Location:** `/app/api/posts/route.ts`

**Concepts:**

- Route handlers (GET, POST, PUT, DELETE)
- Request/Response API
- HTTP status codes
- Request body validation

**Key Features:**

- Full CRUD API for posts
- Zod schema validation
- Proper HTTP status codes
- Error handling and response formatting

### 7. Middleware (`/middleware.ts`)

**Location:** `/middleware.ts`

**Concepts:**

- Route protection
- Cookie-based authentication
- Request interception
- Redirect logic

**Key Features:**

- JWT token verification
- Protected route enforcement
- Login page redirection
- Route matching configuration

### 8. Authentication (`/app/auth` and `/lib/auth`)

**Location:** `/lib/auth/jwt.ts`, `/lib/auth/auth.ts`, `/app/api/auth/login/route.ts`, `/app/dashboard/page.tsx`

**Concepts:**

- JWT token generation and verification
- Cookie-based sessions
- Protected routes
- Stateless authentication

**Key Features:**

- Login API endpoint
- Protected dashboard page
- Middleware integration
- Security best practices

## Technical Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Validation:** Zod
- **Authentication:** JWT with Jose library
- **State Management:** React hooks (useTransition, useOptimistic)

## Key Design Principles

1. **Clarity over Optimization:** Code is written to be easily understood rather than highly optimized
2. **Explicit over Abstract:** Concepts are demonstrated directly rather than hidden behind abstractions
3. **Comprehensive Documentation:** Every non-obvious decision is explained with inline comments
4. **Isolated Concepts:** Each route demonstrates one primary concept
5. **Teaching Focus:** Code is structured to facilitate learning and understanding

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run the development server:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Navigation Guide

### For Learners

1. Start with the basic concepts:
   - `/transition` - Understanding React transitions
   - `/optimistic` - Optimistic UI patterns

2. Move to data handling:
   - `/cache` - Caching strategies
   - `/validation` - Form validation

3. Explore error handling:
   - `/error-handling` - Error boundaries and recovery

4. Study API integration:
   - `/api/posts` - API route handlers

5. Learn authentication:
   - `/auth/login` - Login API
   - `/dashboard` - Protected route

### For Instructors

Each folder contains:

- **Interactive demos** with clear visual feedback
- **Comprehensive explanations** of key concepts
- **Best practices** and when to use each pattern
- **Common pitfalls** and how to avoid them
- **Real-world considerations** for production use

## App Router Mental Model

### Server vs Client Components

- **Server Components:** Default in App Router, execute on server
- **Client Components:** Marked with `"use client"`, execute on client
- **Hybrid Approach:** Mix server and client components as needed

### Data Flow Patterns

1. **Server-to-Client:** Fetch data in server components, pass to client
2. **Client-to-Server:** Use server actions for mutations
3. **API Routes:** Traditional RESTful endpoints for external clients

### Rendering Strategies

- **Static Rendering:** Content generated at build time
- **Dynamic Rendering:** Content generated on each request
- **Streaming:** Progressive content delivery
- **Partial Prerendering:** Hybrid static/dynamic approach

## Best Practices Demonstrated

### Caching

- Use `unstable_cache` for data that changes infrequently
- Implement proper cache invalidation strategies
- Balance performance and data freshness

### Validation

- Always validate on server (client validation is UX only)
- Use shared schemas between client and server
- Provide clear, actionable error messages

### Error Handling

- Use error boundaries for route-specific errors
- Provide fallback UI and recovery options
- Log errors for debugging while maintaining user experience

### Authentication

- Use HTTP-only cookies for security
- Implement proper token expiration
- Protect routes at both middleware and component levels

### Performance

- Use transitions for non-urgent updates
- Implement optimistic UI for perceived performance
- Cache appropriately based on data volatility

## Production Considerations

While this demo focuses on teaching concepts, here are key considerations for production:

1. **Security:**
   - Use environment variables for secrets
   - Implement proper password hashing
   - Add CSRF protection
   - Implement rate limiting

2. **Database:**
   - Replace mock data with real database
   - Use connection pooling
   - Implement proper indexing

3. **Authentication:**
   - Use established auth providers (Auth.js, Clerk, etc.)
   - Implement password reset flows
   - Add multi-factor authentication

4. **Error Handling:**
   - Implement proper logging
   - Set up error monitoring
   - Create user-friendly error pages

5. **Performance:**
   - Implement proper caching headers
   - Optimize images and assets
   - Use CDN for static assets

## License

This project is licensed under the MIT License. Feel free to use, modify, and share this code for educational purposes.
