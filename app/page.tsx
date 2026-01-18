import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const demos = [
    {
      title: "useTransition",
      description: "Demonstrates React's useTransition hook for non-urgent state updates",
      href: "/transition",
      color: "bg-blue-100 text-blue-800",
    },
    {
      title: "Optimistic UI",
      description: "Shows optimistic updates with automatic rollback on failure",
      href: "/optimistic",
      color: "bg-green-100 text-green-800",
    },
    {
      title: "Caching",
      description: "Next.js stable caching with 'use cache' directive and cacheTag",
      href: "/cache",
      color: "bg-purple-100 text-purple-800",
    },
    {
      title: "Validation",
      description: "Client and server-side validation with Zod schemas",
      href: "/validation",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      title: "Error Handling",
      description: "Error boundaries and graceful error recovery patterns",
      href: "/error-handling",
      color: "bg-red-100 text-red-800",
    },
    {
      title: "Authentication",
      description: "JWT-based authentication with protected routes",
      href: "/auth/login",
      color: "bg-indigo-100 text-indigo-800",
    },
    {
      title: "Dashboard",
      description: "Protected dashboard (requires authentication)",
      href: "/dashboard",
      color: "bg-gray-100 text-gray-800",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <Image
            className="dark:invert mx-auto mb-6"
            src="/next.svg"
            alt="Next.js logo"
            width={120}
            height={24}
            priority
          />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Next.js 16 App Router Teaching Reference
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A comprehensive collection of Next.js 16 App Router concepts demonstrated with
            clear, pedagogical examples. Each demo focuses on one specific pattern and includes
            detailed explanations and best practices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {demos.map((demo) => (
            <Link
              key={demo.href}
              href={demo.href}
              className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
            >
              <div className="mb-4">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${demo.color}`}>
                  {demo.title}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {demo.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {demo.description}
              </p>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-blue-900 mb-2">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="text-blue-800">
                <strong>Stable APIs:</strong> Uses official Next.js 16 features
              </div>
              <div className="text-blue-800">
                <strong>TypeScript:</strong> Full type safety throughout
              </div>
              <div className="text-blue-800">
                <strong>Interactive:</strong> Hands-on examples with real feedback
              </div>
              <div className="text-blue-800">
                <strong>Educational:</strong> Clear explanations and best practices
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://nextjs.org/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Next.js Documentation
            </a>
            <a
              href="https://github.com/vercel/next.js"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors"
            >
              GitHub Repository
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
