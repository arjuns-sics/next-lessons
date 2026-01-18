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
