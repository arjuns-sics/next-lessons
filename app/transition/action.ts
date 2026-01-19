  'use server';

  // Mock data for demonstration
const mockPosts = [
  { id: 1, title: 'Introduction to React', content: 'Learn the basics of React components' },
  { id: 2, title: 'Next.js App Router', content: 'Understanding the new App Router paradigm' },
  { id: 3, title: 'State Management', content: 'Exploring different state management approaches' },
];
// Simulate an async operation with artificial delay
export async function fetchPostsWithDelay(searchTerm: string): Promise<typeof mockPosts> {


  // Artificial delay to simulate network latency
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Filter posts based on search term
  return mockPosts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );
}