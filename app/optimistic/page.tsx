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

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Optimistic UI Demonstration</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Understanding Optimistic UI</h2>
        <p className="mb-4">
          <strong>Optimistic UI</strong> provides immediate feedback by updating the UI before
          the server confirms the action. This creates a perception of faster performance.
        </p>

        <div className="bg-gray-100 p-4 rounded mb-4">
          <h3 className="font-medium mb-2">Key Concepts:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Perceived Performance:</strong> UI updates immediately, making the app feel faster</li>
            <li><strong>Automatic Rollback:</strong> If the server request fails, the UI reverts automatically</li>
            <li><strong>useOptimistic Hook:</strong> Manages the optimistic state and reconciliation</li>
            <li><strong>Reconciliation:</strong> Process of syncing optimistic updates with actual server state</li>
          </ul>
        </div>

        <p className="mb-4">
          In this example, when you add a post, it appears immediately in the list with a
          different background. If the server request fails (20% chance in this demo),
          the post will disappear automatically.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Post Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Post Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter post content"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Adding Post...' : 'Add Post'}
          </button>
        </div>

        {error && (
          <div className="mt-4 bg-red-100 border-l-4 border-red-500 p-4">
            <p className="text-red-700">
              <strong>Error:</strong> {error}
            </p>
          </div>
        )}
      </form>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Posts ({optimisticPosts.length})</h3>

        {optimisticPosts.length === 0 ? (
          <div className="bg-gray-50 p-4 rounded text-center">
            <p className="text-gray-600">No posts yet. Add one using the form above!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {optimisticPosts.map((post) => (
              <div
                key={post.id}
                className={`p-4 rounded border ${
                  post.optimistic
                    ? 'bg-blue-50 border-blue-200' // Optimistic posts have blue background
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-blue-600">{post.title}</h4>
                  {post.optimistic && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      Pending...
                    </span>
                  )}
                </div>
                <p className="text-gray-700">{post.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 bg-gray-50 p-4 rounded">
        <h3 className="font-medium mb-2">Optimistic UI Benefits</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>Immediate visual feedback improves perceived performance</li>
          <li>Users can continue interacting without waiting for server responses</li>
          <li>Automatic rollback on failure maintains data consistency</li>
          <li>Better user experience in high-latency environments</li>
        </ul>

        <h3 className="font-medium mb-2 mt-4">Risks and Considerations</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>Complexity: Requires careful state management</li>
          <li>Conflict resolution: Need strategies for handling concurrent updates</li>
          <li>User confusion: Optimistic updates that fail might confuse users</li>
          <li>Overuse: Not all actions benefit from optimistic updates</li>
        </ul>

        <h3 className="font-medium mb-2 mt-4">When to Use Optimistic UI</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>Creating new items (posts, comments, messages)</li>
          <li>Liking/favoriting content</li>
          <li>Updating simple fields (status, visibility)</li>
          <li>Actions with high success rates</li>
        </ul>

        <h3 className="font-medium mb-2 mt-4">When to Avoid Optimistic UI</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>Financial transactions</li>
          <li>Actions with significant consequences</li>
          <li>Low-success-rate operations</li>
          <li>Complex multi-step workflows</li>
        </ul>
      </div>
    </div>
  );
}
