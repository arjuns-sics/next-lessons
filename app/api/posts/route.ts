import { NextResponse } from 'next/server';
import { z } from 'zod';

// Mock database
let mockPosts = [
  { id: 1, title: 'First Post', content: 'This is the first post content' },
  { id: 2, title: 'Second Post', content: 'This is the second post content' },
  { id: 3, title: 'Third Post', content: 'This is the third post content' },
];

// Schema for post creation
const postSchema = z.object({
  title: z.string().min(3).max(100),
  content: z.string().min(10).max(1000),
});

// GET handler - Fetch all posts
export async function GET() {
  try {
    // Simulate database delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json({
      success: true,
      data: mockPosts,
      message: 'Posts fetched successfully',
    });
  } catch (error) {
    console.error('GET /api/posts error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST handler - Create a new post
export async function POST(request: Request) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = postSchema.parse(body);

    // Create new post
    const newPost = {
      id: mockPosts.length + 1,
      title: validatedData.title,
      content: validatedData.content,
    };

    // Add to mock database
    mockPosts.push(newPost);

    // Return 201 Created status
    return NextResponse.json({
      success: true,
      data: newPost,
      message: 'Post created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('POST /api/posts error:', error);

    if (error instanceof z.ZodError) {
      // Return validation errors
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: error.issues.map((issue: any) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create post' },
      { status: 500 }
    );
  }
}

// PUT handler - Update a post
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Post ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = postSchema.parse(body);

    // Find post index
    const postIndex = mockPosts.findIndex(post => post.id === Number(id));

    if (postIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    // Update post
    mockPosts[postIndex] = {
      ...mockPosts[postIndex],
      ...validatedData,
    };

    return NextResponse.json({
      success: true,
      data: mockPosts[postIndex],
      message: 'Post updated successfully',
    });
  } catch (error) {
    console.error('PUT /api/posts error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

// DELETE handler - Delete a post
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Post ID is required' },
        { status: 400 }
      );
    }

    // Find post index
    const postIndex = mockPosts.findIndex(post => post.id === Number(id));

    if (postIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    // Remove post
    const [deletedPost] = mockPosts.splice(postIndex, 1);

    return NextResponse.json({
      success: true,
      data: deletedPost,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    console.error('DELETE /api/posts error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
