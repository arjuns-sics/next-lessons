import { cacheTag } from 'next/cache';

/**
 * Cached posts fetch function
 * - Tags with "posts"
 * - Cached across requests until invalidated
 */
export async function getCachedPosts() {
  'use cache';
  cacheTag('posts');

  // Mock "database" logic (could be replaced later)
  const posts = [
    { id: 1, title: 'Post A', content: 'Content A' },
    { id: 2, title: 'Post B', content: 'Content B' },
    { id: 3, title: 'Post C', content: 'Content C' },
  ];

  return posts;
}
