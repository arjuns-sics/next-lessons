import { cookies,headers } from 'next/headers';
import { verifyToken } from '../../lib/auth/jwt';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  // Read token from cookies
  const token = (await cookies()).get('auth-token')?.value;

  if (!token) {
    return redirect('/auth/login');
  }

  let user;
  try {
    user = await verifyToken(token);
  } catch (err) {
    // Token invalid or expired
    return redirect('/auth/login');
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Protected Dashboard</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Welcome to Your Dashboard</h2>
        <p className="mb-4">
          This page is protected by middleware and requires authentication to access.
          Only logged-in users can see this content.
        </p>

        {user ? (
          <div className="bg-gray-900 p-4 rounded mb-4">
            <h3 className="font-medium mb-2">Your Account Information</h3>
            <p className="mb-1"><strong>Username:</strong> {user.username}</p>
            <p className="mb-1"><strong>User ID:</strong> {user.userId}</p>
            <p className="mb-1"><strong>Role:</strong> {user.role}</p>
            <p className="text-sm text-gray-600 mt-2">
              You are currently authenticated and can access protected routes.
            </p>
          </div>
        ) : (
          <div className="bg-yellow-900 p-4 rounded mb-4">
            <p className="text-yellow-700">
              You should not be seeing this message! The middleware should have
              redirected you to the login page if you're not authenticated.
            </p>
          </div>
        )}
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Protected Content</h3>
        <div className="bg-black p-4 rounded border border-gray-200">
          <p className="mb-4">
            This is sensitive content that should only be visible to authenticated users.
            The middleware ensures that only users with valid JWT tokens can access this page.
          </p>

          <div className="space-y-3">
            <div className="bg-blue-50 p-3 rounded">
              <h4 className="font-medium text-blue-700 mb-1">User Settings</h4>
              <p className="text-sm text-blue-600">
                Manage your account preferences and personal information.
              </p>
            </div>

            <div className="bg-green-50 p-3 rounded">
              <h4 className="font-medium text-green-700 mb-1">Recent Activity</h4>
              <p className="text-sm text-green-600">
                View your recent actions and account history.
              </p>
            </div>

            <div className="bg-purple-50 p-3 rounded">
              <h4 className="font-medium text-purple-700 mb-1">Premium Features</h4>
              <p className="text-sm text-purple-600">
                Access exclusive features available only to authenticated users.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Authentication Flow</h3>
        <div className="bg-gray-900 p-4 rounded">
          <ol className="list-decimal pl-5 space-y-2">
            <li>User attempts to access protected route (/dashboard)</li>
            <li>Middleware intercepts the request</li>
            <li>Middleware checks for auth-token cookie</li>
            <li>If no token or invalid token, redirect to login</li>
            <li>If valid token, allow access to protected route</li>
            <li>Server component verifies authentication and renders content</li>
          </ol>
        </div>
      </div>

      <div className="mt-8 bg-gray-900 p-4 rounded">
        <h3 className="font-medium mb-2">Middleware Protection</h3>
        <p className="text-sm mb-4">
          This page demonstrates how middleware can protect routes in Next.js:
        </p>

        <div className="mb-4">
          <h4 className="font-medium mb-1">Key Features:</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Route-based protection using middleware</li>
            <li>Cookie-based JWT authentication</li>
            <li>Automatic redirect to login for unauthenticated users</li>
            <li>Server-side user verification</li>
            <li>Role-based access control (demonstration)</li>
          </ul>
        </div>

        <div className="mb-4">
          <h4 className="font-medium mb-1">Security Considerations:</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>HTTP-only cookies prevent XSS attacks</li>
            <li>SameSite=Lax prevents CSRF attacks</li>
            <li>JWT tokens are signed and verified</li>
            <li>Short token expiration (1 hour)</li>
            <li>Server-side validation of all requests</li>
          </ul>
        </div>

        <div className="mb-4">
          <h4 className="font-medium mb-1">When to Use Middleware:</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Protecting entire route groups</li>
            <li>Authentication and authorization checks</li>
            <li>Redirect logic based on user state</li>
            <li>Request logging and monitoring</li>
            <li>Feature flags and A/B testing</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
