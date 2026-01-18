'use server';

import { updateTag } from 'next/cache';

/**
 * Server Action to revalidate posts cache immediately
 */
export function revalidatePostsImmediately() {
  // Invalidate cache for "posts" tag now
  updateTag('posts');
}
