"use client";
import { useState, useTransition } from 'react';
import { fetchPostsWithDelay } from './action';
// Mock data for demonstration
const mockPosts = [
  { id: 1, title: 'Introduction to React', content: 'Learn the basics of React components' },
  { id: 2, title: 'Next.js App Router', content: 'Understanding the new App Router paradigm' },
  { id: 3, title: 'State Management', content: 'Exploring different state management approaches' },
];



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

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">useTransition Demonstration</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Understanding Transitions</h2>
        <p className="mb-4">
          <strong>useTransition</strong> helps distinguish between urgent and non-urgent state updates.
          Urgent updates (like typing in an input) should happen immediately, while non-urgent updates
          (like search results) can be deferred to keep the UI responsive.
        </p>

        <div className="bg-gray-100 p-4 rounded mb-4">
          <h3 className="font-medium mb-2">Key Concepts:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Urgent Updates:</strong> Direct state changes that block rendering (e.g., input typing)</li>
            <li><strong>Non-urgent Updates:</strong> Deferred updates that don't block UI (e.g., search results)</li>
            <li><strong>isPending:</strong> Boolean indicating if a transition is in progress</li>
            <li><strong>startTransition:</strong> Function to mark updates as non-urgent</li>
          </ul>
        </div>

        <p className="mb-4">
          Without <code>useTransition</code>, typing in the input would feel sluggish because
          React would re-render the entire component (including the potentially slow search results)
          on every keystroke.
        </p>
      </div>

      <div className="mb-6">
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search posts..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            disabled={isPending}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isPending ? 'Searching...' : 'Search'}
          </button>
        </div>

        {isPending && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4">
            <p className="text-yellow-700">
              <strong>Transition in progress...</strong> The UI remains responsive while
              the search results are being fetched. Try typing in the input - it won't be blocked!
            </p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Search Results ({posts.length} posts found)</h3>

        {posts.length === 0 ? (
          <div className="bg-gray-50 p-4 rounded text-center">
            <p className="text-gray-600">No posts found matching your search.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <div key={post.id} className="bg-white p-4 rounded border border-gray-200">
                <h4 className="font-semibold text-blue-600 mb-1">{post.title}</h4>
                <p className="text-gray-700">{post.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 bg-gray-50 p-4 rounded">
        <h3 className="font-medium mb-2">When to Use useTransition</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>Large list filtering/sorting operations</li>
          <li>Search functionality with network requests</li>
          <li>Tab switching with expensive re-renders</li>
          <li>Any operation that could cause UI jank</li>
        </ul>

        <h3 className="font-medium mb-2 mt-4">When NOT to Use useTransition</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>Urgent UI updates (input typing, button clicks)</li>
          <li>Navigation or routing changes</li>
          <li>Animations or immediate visual feedback</li>
        </ul>
      </div>
    </div>
  );
}
