import { getCachedPosts } from '../../lib/cache/posts';
import { revalidateTag } from 'next/cache';

type Post = {
  id: number;
  title: string;
  content: string;
};

export default async function CachePage() {
  // Fetch posts using stable caching API
  const posts = await getCachedPosts();

  // Server action to add a new post
  async function handleAddPost(formData: FormData) {
    'use server';

    const title = formData.get('title') as string;
    const content = formData.get('content') as string;

    if (!title || !content) {
      throw new Error('Title and content are required');
    }

    // Add the post (simulated)
    // In a real app, this would update the database
    console.log('Adding post:', { title, content });

  // Manually revalidate the cache using stable API
  // This marks the "posts" tag as stale and will refresh on next request
  revalidateTag('posts', 'max');
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Caching with next/cache</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Understanding Next.js Caching</h2>
        <p className="mb-4">
          Next.js provides powerful caching mechanisms to improve performance.
          The <code>unstable_cache</code> function allows you to cache data fetching
          operations with fine-grained control.
        </p>

        <div className="bg-gray-100 p-4 rounded mb-4">
          <h3 className="font-medium mb-2">Key Concepts:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Request Memoization:</strong> Automatic caching of identical requests during rendering</li>
            <li><strong>Data Cache:</strong> Persistent caching of data across requests</li>
            <li><strong>Full Route Cache:</strong> Caching of entire rendered routes</li>
            <li><strong>Router Cache:</strong> Client-side caching of visited routes</li>
          </ul>
        </div>

        <p className="mb-4">
          In this demo, we use <code>unstable_cache</code> to cache the posts data
          with a 30-second revalidation period and manual cache invalidation.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Stable Caching API</h3>
        <div className="bg-gray-50 p-4 rounded">
          <p className="mb-2"><strong>Caching Method:</strong> use cache directive with cacheTag</p>
          <p className="mb-2"><strong>Revalidation:</strong> On-demand via revalidateTag</p>
          <p className="mb-2"><strong>Cache Tags:</strong> posts</p>
          <p className="mb-2"><strong>Behavior:</strong> Stale-while-revalidate</p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Add New Post</h3>
        <form action={handleAddPost} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="Enter post title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              id="content"
              name="content"
              placeholder="Enter post content"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Post
          </button>
        </form>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Stable Caching Benefits</h3>
        <div className="bg-blue-50 p-4 rounded">
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li><strong>Stable API:</strong> Uses official Next.js 16 caching APIs</li>
            <li><strong>Stale-while-revalidate:</strong> Serves stale data while fetching fresh</li>
            <li><strong>Tag-based invalidation:</strong> Precise control over cache invalidation</li>
            <li><strong>Production ready:</strong> Not using unstable/deprecated APIs</li>
          </ul>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Cached Posts ({posts.length})</h3>

        {posts.length === 0 ? (
          <div className="bg-gray-50 p-4 rounded text-center">
            <p className="text-gray-600">No posts found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post: Post) => (
              <div key={post.id} className="bg-white p-4 rounded border border-gray-200">
                <h4 className="font-semibold text-blue-600 mb-1">{post.title}</h4>
                <p className="text-gray-700">{post.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 bg-gray-50 p-4 rounded">
        <h3 className="font-medium mb-2">Caching Strategies Explained</h3>

        <div className="mb-4">
          <h4 className="font-medium mb-1">1. Request Memoization</h4>
          <p className="text-sm">
            Automatic caching during rendering. Identical fetches in the same
            component tree are deduplicated.
          </p>
        </div>

        <div className="mb-4">
          <h4 className="font-medium mb-1">2. Stable Caching API</h4>
          <p className="text-sm mb-2">
            Next.js 16 stable caching with fine-grained control:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li><strong>use cache directive:</strong> Marks functions for caching</li>
            <li><strong>cacheTag:</strong> Tags cached data for targeted invalidation</li>
            <li><strong>revalidateTag:</strong> Invalidates specific cache tags</li>
            <li><strong>Stale-while-revalidate:</strong> Serves stale while fetching fresh</li>
          </ul>
        </div>

        <div className="mb-4">
          <h4 className="font-medium mb-1">3. Cache Scope</h4>
          <p className="text-sm">
            Cached data is shared across all users and requests, making it
            ideal for content that doesn't change frequently.
          </p>
        </div>

        <div className="mb-4">
          <h4 className="font-medium mb-1">4. Cache Invalidation</h4>
          <p className="text-sm mb-2">
            Strategies for keeping cached data fresh:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li><strong>Time-based:</strong> Automatic revalidation after TTL</li>
            <li><strong>Tag-based:</strong> Manual invalidation using <code>revalidateTag()</code></li>
            <li><strong>Path-based:</strong> Invalidate by route using <code>revalidatePath()</code></li>
            <li><strong>On-demand:</strong> Trigger revalidation from API routes</li>
          </ul>
        </div>

        <div className="mb-4">
          <h4 className="font-medium mb-1">5. When to Use Caching</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Static content that changes infrequently</li>
            <li>Data that's expensive to compute/fetch</li>
            <li>Content shared across many users</li>
            <li>Performance-critical pages</li>
          </ul>
        </div>

        <div className="mb-4">
          <h4 className="font-medium mb-1">6. When to Avoid Caching</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>User-specific data (use client-side state instead)</li>
            <li>Real-time data that must always be fresh</li>
            <li>Sensitive data with strict consistency requirements</li>
            <li>Data that changes very frequently</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
