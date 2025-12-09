import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT/PATCH /api/user/id/[userId] - Update user fields (currently supports userTag)
async function updateUser(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json().catch(() => null);
    const nextUserTag = body?.userTag as string | undefined;

    if (!nextUserTag || typeof nextUserTag !== 'string' || !nextUserTag.trim()) {
      return NextResponse.json(
        { error: 'userTag is required' },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        userTag: nextUserTag.trim(),
      },
      include: { gameProgress: true },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'userTag must be unique' },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, ctx: { params: Promise<{ userId: string }> }) {
  return updateUser(request, ctx);
}

export async function PATCH(request: NextRequest, ctx: { params: Promise<{ userId: string }> }) {
  return updateUser(request, ctx);
}
