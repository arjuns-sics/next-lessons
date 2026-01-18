import { SignJWT, jwtVerify, importPKCS8, importSPKI } from 'jose';

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
