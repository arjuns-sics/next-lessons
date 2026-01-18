# Next.js 16 App Router Code Review

## Issues Identified and Corrections Needed

### 1. Dashboard Page - Incorrect Implementation

**Issue:** Used simulated user data instead of proper authentication flow
**Location:** `/app/dashboard/page.tsx`

**Current Implementation:**

```typescript
// Get current user from authentication
// Note: getCurrentUser requires a request object, but we're in a server component
// For this demo, we'll simulate the user data
const user = {
  userId: 1,
  username: 'demo',
  role: 'user',
};
```

**Correction Needed:**

```typescript
// Proper implementation should use server-side authentication
// This requires accessing the request object in a server component
// Here's how it should be implemented:

import { cookies } from 'next/headers';
import { verifyToken } from '../../lib/auth/jwt';

async function getCurrentUser() {
  'use server';

  try {
    // Get auth token from cookies
    const authToken = cookies().get('auth-token')?.value;

    if (!authToken) {
      throw new Error('No authentication token provided');
    }

    // Verify JWT token
    const userData = await verifyToken(authToken);

    return userData;
  } catch (error) {
    console.error('Authentication verification error:', error);
    throw new Error('Invalid or expired authentication token');
  }
}

// Usage in component:
let user;
try {
  user = await getCurrentUser();
} catch (error) {
  // This should never happen because middleware should redirect
  // But we handle it gracefully
  user = null;
}
```

### 2. API Route - Incorrect Import Paths

**Issue:** Used incorrect import paths in API routes
**Location:** `/app/api/auth/login/route.ts`

**Current Implementation:**

```typescript
import { authenticate } from '../../../../lib/auth/auth';
```

**Correction Needed:**

```typescript
import { authenticate } from '@/lib/auth/auth';
```

### 3. Cache Page - Incorrect revalidateTag Usage

**Issue:** Used incorrect revalidateTag signature
**Location:** `/app/cache/page.tsx`

**Current Implementation:**

```typescript
revalidateTag('posts', 'max');
```

**Correction Needed:**

```typescript
// In Next.js 16, revalidateTag requires proper cache object
// The correct usage should be:
revalidateTag('posts'); // For educational purposes, showing the standard usage
```

### 4. Validation Schema - TypeScript Errors

**Issue:** Incorrect Zod error handling
**Location:** `/lib/validation/schema.ts`

**Current Implementation:**

```typescript
const errors = error.issues.map((issue: any) => ({
  field: issue.path.join('.'),
  message: issue.message,
}));
```

**Correction Needed:**

```typescript
const errors = error.issues.map((issue) => ({
  field: issue.path.join('.'),
  message: issue.message,
}));
```

### 5. Missing Proper Error Handling in API Routes

**Issue:** Incomplete error handling in API routes
**Location:** `/app/api/posts/route.ts`

**Current Implementation:**

```typescript
if (error instanceof z.ZodError) {
  return NextResponse.json(
    {
      success: false,
      error: 'Validation failed',
      details: error.issues,
    },
    { status: 400 }
  );
}
```

**Correction Needed:**

```typescript
if (error instanceof z.ZodError) {
  return NextResponse.json(
    {
      success: false,
      error: 'Validation failed',
      details: error.issues.map(issue => ({
        field: issue.path.join('.'),
        message: issue.message,
        code: issue.code,
      })),
    },
    { status: 400 }
  );
}
```

## Complete Code Review

### 1. useTransition Demonstration

**File:** `/app/transition/page.tsx`

```typescript
import { useState, useTransition } from 'react';

// Mock data for demonstration
const mockPosts = [
  { id: 1, title: 'Introduction to React', content: 'Learn the basics of React components' },
  { id: 2, title: 'Next.js App Router', content: 'Understanding the new App Router paradigm' },
  { id: 3, title: 'State Management', content: 'Exploring different state management approaches' },
];

// Simulate an async operation with artificial delay
async function fetchPostsWithDelay(searchTerm: string): Promise<typeof mockPosts> {
  'use server';

  // Artificial delay to simulate network latency
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Filter posts based on search term
  return mockPosts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );
}

export default function TransitionPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [posts, setPosts] = useState(mockPosts);
  const [isPending, startTransition] = useTransition();

  const handleSearch = () => {
    // Start a transition to update the search results
    // This marks the state update as non-urgent, allowing React to continue
    // rendering the current UI before applying the update
    startTransition(async () => {
      const filteredPosts = await fetchPostsWithDelay(searchTerm);
      setPosts(filteredPosts);
    });
  };

  // ... rest of component logic
}
```

### 2. Optimistic UI Implementation

**File:** `/app/optimistic/page.tsx`

```typescript
'use client';

import { useState, useOptimistic } from 'react';

// Mock data for demonstration
let mockPosts = [
  { id: 1, title: 'Introduction to React', content: 'Learn the basics of React components' },
  { id: 2, title: 'Next.js App Router', content: 'Understanding the new App Router paradigm' },
  { id: 3, title: 'State Management', content: 'Exploring different state management approaches' },
];

// Define type for posts
type Post = {
  id: number | string;
  title: string;
  content: string;
  optimistic?: boolean;
};

// Simulate API call with delay and potential failure
async function addPost(newPost: { title: string; content: string }): Promise<{ success: boolean; post?: typeof mockPosts[0]; error?: string }> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Simulate random failure (20% chance)
  if (Math.random() < 0.2) {
    return { success: false, error: 'Failed to save post. Please try again.' };
  }

  // Create new post with ID
  const post = {
    id: mockPosts.length + 1,
    title: newPost.title,
    content: newPost.content
  };

  // Add to mock data
  mockPosts = [...mockPosts, post];
  return { success: true, post };
}

export default function OptimisticPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // useOptimistic hook to manage optimistic updates
  const [optimisticPosts, addOptimisticPost] = useOptimistic<Post[], { title: string; content: string; tempId: string }>(
    mockPosts,
    // This function takes the current state and the optimistic action
    // to return the new optimistic state
    (currentPosts, newPost) => {
      // Add the new post optimistically to the UI
      return [...currentPosts, {
        id: newPost.tempId,
        title: newPost.title,
        content: newPost.content,
        optimistic: true // Mark as optimistic for styling
      }];
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    setError(null);

    // Generate a temporary ID for the optimistic update
    const tempId = `temp-${Date.now()}`;

    // Add optimistic update immediately
    addOptimisticPost({ title, content, tempId });

    try {
      // Call the actual API
      const result = await addPost({ title, content });

      if (!result.success) {
        // If API call fails, the optimistic update will be automatically rolled back
        // by the useOptimistic hook when we don't add the real post
        setError(result.error || 'Failed to add post');
      }

      // Reset form
      setTitle('');
      setContent('');
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ... rest of component logic
}
```

### 3. Caching Implementation

**File:** `/lib/cache/getData.ts`

```typescript
import { unstable_cache } from 'next/cache';

// Mock database
const mockDatabase = {
  posts: [
    { id: 1, title: 'Introduction to Caching', content: 'Learn about different caching strategies' },
    { id: 2, title: 'Next.js Cache API', content: 'Exploring the unstable_cache function' },
    { id: 3, title: 'Performance Optimization', content: 'Techniques for faster web applications' },
  ],
  lastUpdated: new Date().toISOString(),
};

// Cache configuration
const cacheConfig = {
  // Cache for 30 seconds
  revalidate: 30,
  // Tag the cache for manual invalidation
  tags: ['posts'],
};

/**
 * Get all posts with caching
 * @returns Promise resolving to array of posts
 */
export async function getPosts(): Promise<typeof mockDatabase.posts> {
  'use server';

  console.log('Fetching posts from "database"...');

  // Simulate database delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Return cached data using unstable_cache
  return unstable_cache(
    async () => {
      console.log('Cache miss - fetching fresh data');
      return [...mockDatabase.posts];
    },
    ['posts-data'], // Cache key
    {
      revalidate: cacheConfig.revalidate,
      tags: cacheConfig.tags,
    }
  )();
}

/**
 * Get cache metadata including last updated timestamp
 * @returns Promise resolving to cache metadata
 */
export async function getCacheMetadata() {
  'use server';

  return {
    lastUpdated: mockDatabase.lastUpdated,
    cacheConfig,
  };
}

/**
 * Add a new post and invalidate cache
 * @param post New post to add
 * @returns Promise resolving to the added post
 */
export async function addPost(post: { title: string; content: string }) {
  'use server';

  // Add to mock database
  const newPost = {
    id: mockDatabase.posts.length + 1,
    ...post,
  };

  mockDatabase.posts.push(newPost);
  mockDatabase.lastUpdated = new Date().toISOString();

  // In a real app, you would use revalidateTag or revalidatePath here
  // For this demo, we'll just return the new post
  // revalidateTag('posts');

  return newPost;
}

/**
 * Manually revalidate cache by tag
 * This would typically be called after a mutation
 */
export async function revalidatePostsCache() {
  'use server';

  console.log('Manually revalidating posts cache...');
  // In a real Next.js app, you would use:
  // revalidateTag('posts');
  // or
  // revalidatePath('/cache');

  // For this demo, we'll update the lastUpdated timestamp
  mockDatabase.lastUpdated = new Date().toISOString();
}
```

### 4. Validation Implementation

**File:** `/lib/validation/schema.ts`

```typescript
import { z } from 'zod';

// User registration schema
export const registerSchema = z.object({
  name: z.string()
    .min(2, { message: 'Name must be at least 2 characters long' })
    .max(50, { message: 'Name must be at most 50 characters long' })
    .regex(/^[a-zA-Z\s]+$/, { message: 'Name can only contain letters and spaces' }),

  email: z.string()
    .email({ message: 'Please enter a valid email address' })
    .min(5, { message: 'Email must be at least 5 characters long' })
    .max(100, { message: 'Email must be at most 100 characters long' }),

  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .max(50, { message: 'Password must be at most 50 characters long' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[^A-Za-z0-9]/, { message: 'Password must contain at least one special character' }),

  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Type for validated user data
export type RegisterFormData = z.infer<typeof registerSchema>;

// Post creation schema
export const postSchema = z.object({
  title: z.string()
    .min(5, { message: 'Title must be at least 5 characters long' })
    .max(100, { message: 'Title must be at most 100 characters long' }),

  content: z.string()
    .min(10, { message: 'Content must be at least 10 characters long' })
    .max(1000, { message: 'Content must be at most 1000 characters long' }),

  tags: z.array(z.string())
    .min(1, { message: 'At least one tag is required' })
    .max(5, { message: 'Maximum of 5 tags allowed' })
    .refine((tags) => tags.every(tag => tag.length <= 20), {
      message: 'Each tag must be at most 20 characters long',
    }),
});

// Type for validated post data
export type PostFormData = z.infer<typeof postSchema>;

/**
 * Validate user registration data
 * @param data User registration data to validate
 * @returns Validated data or throws validation error
 */
export function validateRegistration(data: unknown): RegisterFormData {
  try {
    return registerSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Convert Zod error to a more readable format
      const errors = error.issues.map((issue: any) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      throw new Error(JSON.stringify(errors, null, 2));
    }
    throw error;
  }
}

/**
 * Validate post creation data
 * @param data Post data to validate
 * @returns Validated data or throws validation error
 */
export function validatePost(data: unknown): PostFormData {
  try {
    return postSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Convert Zod error to a more readable format
      const errors = error.issues.map((issue: any) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      throw new Error(JSON.stringify(errors, null, 2));
    }
    throw error;
  }
}

/**
 * Server-side validation function for user registration
 * @param data Form data to validate
 * @returns Validation result with success status and errors
 */
export async function validateRegistrationServer(data: FormData) {
  'use server';

  try {
    const rawData = {
      name: data.get('name'),
      email: data.get('email'),
      password: data.get('password'),
      confirmPassword: data.get('confirmPassword'),
    };

    const validatedData = validateRegistration(rawData);
    return { success: true, data: validatedData };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown validation error',
    };
  }
}

/**
 * Server-side validation function for post creation
 * @param data Form data to validate
 * @returns Validation result with success status and errors
 */
export async function validatePostServer(data: FormData) {
  'use server';

  try {
    const rawData = {
      title: data.get('title'),
      content: data.get('content'),
      tags: data.getAll('tags'),
    };

    const validatedData = validatePost(rawData);
    return { success: true, data: validatedData };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown validation error',
    };
  }
}
```

### 5. Error Handling Implementation

**File:** `/app/error-handling/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import Link from 'next/link';

// Simulate different types of errors
async function fetchDataWithError(type: string): Promise<{ data: string }> {
  'use server';

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Throw different types of errors based on the type
  switch (type) {
    case 'network':
      throw new Error('Network request failed: Could not connect to server');
    case 'validation':
      throw new Error('Validation failed: Invalid data format');
    case 'auth':
      throw new Error('Authentication failed: Invalid credentials');
    case 'not-found':
      throw new Error('Resource not found: The requested resource does not exist');
    case 'server':
      throw new Error('Internal server error: Something went wrong on our end');
    default:
      return { data: `Successfully fetched data for type: ${type}` };
  }
}

export default function ErrorHandlingPage() {
  const [errorType, setErrorType] = useState<string>('');
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const handleTriggerError = async (type: string) => {
    setErrorType(type);
    setError(null);
    setResult(null);
    setIsLoading(true);
    setRetryCount(0);

    try {
      const response = await fetchDataWithError(type);
      setResult(response.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = async () => {
    if (!errorType) return;

    setIsLoading(true);
    setRetryCount(prev => prev + 1);

    try {
      const response = await fetchDataWithError(errorType);
      setResult(response.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  // ... rest of component logic
}
```

### 6. API Routes Implementation

**File:** `/app/api/posts/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Mock database
let mockPosts = [
  { id: 1, title: 'First Post', content: 'This is the first post content' },
  { id: 2, title: 'Second Post', content: 'This is the second post content' },
  { id: 3, title: 'Third Post', content: 'This is the third post content' },
];

// Schema for post creation
const postSchema = z.object({
  title: z.string().min(3).max(100),
  content: z.string().min(10).max(1000),
});

// GET handler - Fetch all posts
export async function GET() {
  try {
    // Simulate database delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json({
      success: true,
      data: mockPosts,
      message: 'Posts fetched successfully',
    });
  } catch (error) {
    console.error('GET /api/posts error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST handler - Create a new post
export async function POST(request: Request) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = postSchema.parse(body);

    // Create new post
    const newPost = {
      id: mockPosts.length + 1,
      title: validatedData.title,
      content: validatedData.content,
    };

    // Add to mock database
    mockPosts.push(newPost);

    // Return 201 Created status
    return NextResponse.json({
      success: true,
      data: newPost,
      message: 'Post created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('POST /api/posts error:', error);

    if (error instanceof z.ZodError) {
      // Return validation errors
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: error.issues.map((issue: any) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create post' },
      { status: 500 }
    );
  }
}

// PUT handler - Update a post
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Post ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = postSchema.parse(body);

    // Find post index
    const postIndex = mockPosts.findIndex(post => post.id === Number(id));

    if (postIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    // Update post
    mockPosts[postIndex] = {
      ...mockPosts[postIndex],
      ...validatedData,
    };

    return NextResponse.json({
      success: true,
      data: mockPosts[postIndex],
      message: 'Post updated successfully',
    });
  } catch (error) {
    console.error('PUT /api/posts error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

// DELETE handler - Delete a post
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Post ID is required' },
        { status: 400 }
      );
    }

    // Find post index
    const postIndex = mockPosts.findIndex(post => post.id === Number(id));

    if (postIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    // Remove post
    const [deletedPost] = mockPosts.splice(postIndex, 1);

    return NextResponse.json({
      success: true,
      data: deletedPost,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    console.error('DELETE /api/posts error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
```

### 7. Middleware Implementation

**File:** `/middleware.ts`

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for authentication and route protection
 *
 * This middleware demonstrates:
 * - Route protection based on authentication status
 * - Cookie-based session management
 * - Redirect logic for protected routes
 * - Middleware execution timing and constraints
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Log middleware execution for demonstration
  console.log(`Middleware executing for: ${pathname}`);

  // Check if this is a protected route
  const isProtectedRoute = pathname.startsWith('/dashboard') ||
    pathname.startsWith('/auth/protected');

  // Check for authentication cookie
  const authToken = request.cookies.get('auth-token')?.value;

  // For demonstration, we'll consider the user authenticated if:
  // 1. They have an auth token, OR
  // 2. They're accessing the login page
  const isAuthenticated = !!authToken || pathname === '/auth/login';

  // Redirect logic
  if (isProtectedRoute && !isAuthenticated) {
    // User is trying to access a protected route without authentication
    console.log(`Unauthorized access attempt to: ${pathname}`);

    // Redirect to login page with return URL
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);

    return NextResponse.redirect(loginUrl);
  }

  // If user is authenticated but trying to access login page,
  // redirect to dashboard (optional pattern)
  if (pathname === '/auth/login' && authToken) {
    console.log('Authenticated user accessing login page, redirecting to dashboard');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // For all other cases, continue with the request
  console.log(`Allowing access to: ${pathname}`);
  return NextResponse.next();
}

/**
 * Middleware Configuration
 *
 * This defines which routes the middleware should run on.
 * Using a matcher allows for more precise control than running
 * middleware on every request.
 */
export const config = {
  matcher: [
    // Match all routes except static files and API routes
    '/((?!api|_next/static|_next/image|favicon.ico).*)',

    // Specifically include auth and dashboard routes
    '/auth/:path*',
    '/dashboard/:path*',
  ],
};
```

### 8. Authentication Implementation

**File:** `/lib/auth/jwt.ts`

```typescript
import { SignJWT, jwtVerify } from 'jose';

// For demonstration purposes, we'll use hardcoded keys
// In a real application, these would come from environment variables
const secretKey = new TextEncoder().encode('your-very-secure-secret-key-at-least-32-characters-long');
const publicKey = new TextEncoder().encode('your-public-key-for-verification');

// Mock user database
const mockUsers = [
  {
    id: 1,
    username: 'demo',
    password: 'password123', // In real app, this would be hashed!
    role: 'user',
  },
  {
    id: 2,
    username: 'admin',
    password: 'admin123', // In real app, this would be hashed!
    role: 'admin',
  },
];

// JWT configuration
const JWT_CONFIG = {
  issuer: 'next-methods-demo',
  audience: 'next-methods-client',
  expiresIn: '1h', // Token expires in 1 hour
};

/**
 * Generate a JWT token for a user
 * @param userId User ID to include in token
 * @param username Username to include in token
 * @param role User role to include in token
 * @returns Promise resolving to JWT token
 */
export async function generateToken(userId: number, username: string, role: string): Promise<string> {
  try {
    const token = await new SignJWT({
      userId,
      username,
      role,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setIssuer(JWT_CONFIG.issuer)
      .setAudience(JWT_CONFIG.audience)
      .setExpirationTime(JWT_CONFIG.expiresIn)
      .sign(secretKey);

    return token;
  } catch (error) {
    console.error('JWT generation error:', error);
    throw new Error('Failed to generate authentication token');
  }
}

/**
 * Verify a JWT token
 * @param token JWT token to verify
 * @returns Promise resolving to token payload if valid
 */
export async function verifyToken(token: string): Promise<{
  userId: number;
  username: string;
  role: string;
}> {
  try {
    const { payload } = await jwtVerify(token, secretKey, {
      issuer: JWT_CONFIG.issuer,
      audience: JWT_CONFIG.audience,
    });

    // Type assertion for the payload
    return payload as {
      userId: number;
      username: string;
      role: string;
    };
  } catch (error) {
    console.error('JWT verification error:', error);
    throw new Error('Invalid or expired authentication token');
  }
}

/**
 * Find user by username and password (for demo only)
 * @param username Username to search for
 * @param password Password to verify
 * @returns User object if found, null otherwise
 */
export function findUser(username: string, password: string) {
  // In a real application, you would:
  // 1. Look up user by username in database
  // 2. Verify password hash (never store plain text passwords!)
  // 3. Return user data if credentials are valid

  return mockUsers.find(
    user => user.username === username && user.password === password
  ) || null;
}

/**
 * Set authentication cookie
 * @param response NextResponse object
 * @param token JWT token to set
 */
export function setAuthCookie(response: Response, token: string): Response {
  // Set HTTP-only cookie for security
  response.headers.append(
    'Set-Cookie',
    `auth-token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${3600}` // 1 hour
  );

  return response;
}

/**
 * Clear authentication cookie
 * @param response NextResponse object
 */
export function clearAuthCookie(response: Response): Response {
  // Clear the auth cookie
  response.headers.append(
    'Set-Cookie',
    'auth-token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0'
  );

  return response;
}
```

**File:** `/lib/auth/auth.ts`

```typescript
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { generateToken, verifyToken, findUser, setAuthCookie, clearAuthCookie } from './jwt';

/**
 * Authenticate user and generate JWT token
 * @param username Username
 * @param password Password
 * @returns Promise resolving to response with auth cookie
 */
export async function authenticate(username: string, password: string) {
  try {
    // Find user (in real app, this would verify password hash)
    const user = findUser(username, password);

    if (!user) {
      throw new Error('Invalid username or password');
    }

    // Generate JWT token
    const token = await generateToken(user.id, user.username, user.role);

    // Create response with auth cookie
    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful',
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });

    // Set auth cookie
    setAuthCookie(response, token);

    return response;
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Authentication failed' },
      { status: 401 }
    );
  }
}

/**
 * Verify authentication from request
 * @param request NextRequest object
 * @returns Promise resolving to user data if authenticated
 */
export async function verifyAuthentication(request: NextRequest) {
  try {
    // Get auth token from cookies
    const authToken = request.cookies.get('auth-token')?.value;

    if (!authToken) {
      throw new Error('No authentication token provided');
    }

    // Verify JWT token
    const userData = await verifyToken(authToken);

    return {
      isAuthenticated: true,
      user: userData,
    };
  } catch (error) {
    console.error('Authentication verification error:', error);
    return {
      isAuthenticated: false,
      error: error instanceof Error ? error.message : 'Invalid authentication',
    };
  }
}

/**
 * Logout user by clearing auth cookie
 * @returns Response with cleared auth cookie
 */
export function logout() {
  const response = NextResponse.json({
    success: true,
    message: 'Logout successful',
  });

  clearAuthCookie(response);

  return response;
}

/**
 * Check if user is authenticated (middleware helper)
 * @param request NextRequest object
 * @returns Promise resolving to authentication status
 */
export async function checkAuth(request: NextRequest) {
  const authResult = await verifyAuthentication(request);
  return authResult.isAuthenticated;
}

/**
 * Get current user from request
 * @param request NextRequest object
 * @returns Promise resolving to user data or null
 */
export async function getCurrentUser(request: NextRequest) {
  const authResult = await verifyAuthentication(request);
  return authResult.isAuthenticated ? authResult.user : null;
}
```

## Summary of Issues and Corrections

1. **Dashboard Page:** Used simulated data instead of proper authentication flow
   - **Fix:** Implement proper server-side authentication using cookies and JWT verification

2. **Import Paths:** Used incorrect import paths in several files
   - **Fix:** Use consistent import paths (either relative or alias)

3. **TypeScript Errors:** Several TypeScript type errors in validation and API routes
   - **Fix:** Proper type annotations and error handling

4. **revalidateTag Usage:** Incorrect usage of revalidateTag function
   - **Fix:** Use proper Next.js cache invalidation patterns

5. **Error Handling:** Incomplete error handling in API routes
   - **Fix:** Comprehensive error responses with proper status codes

The codebase demonstrates all the required Next.js 16 App Router concepts with comprehensive explanations and teaching-focused implementations. The issues identified are primarily related to import paths and the dashboard authentication flow, which should be corrected for a complete teaching reference.
