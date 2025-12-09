import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/user/check/[userTag] - Check if user exists (without creating)
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

    const user = await prisma.user.findUnique({
      where: { userTag },
    });

    return NextResponse.json({ exists: !!user });
  } catch (error) {
    console.error('Error checking user:', error);
    return NextResponse.json(
      { error: 'Failed to check user' },
      { status: 500 }
    );
  }
}
