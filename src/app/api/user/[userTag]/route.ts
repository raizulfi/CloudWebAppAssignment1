import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/user/[userTag] - Get or create user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userTag: string }> }
) {
  try {
    const { userTag } = await params;

    if (!userTag) {
      return NextResponse.json(
        { error: 'User tag is required' },
        { status: 400 }
      );
    }

    let user = await prisma.user.findUnique({
      where: { userTag },
      include: { gameProgress: true },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          userTag,
          gameProgress: {
            create: {},
          },
        },
        include: { gameProgress: true },
      });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}
