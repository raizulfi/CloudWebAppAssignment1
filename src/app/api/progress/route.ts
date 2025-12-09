import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface SaveProgressRequest {
  userId: string;
  currentStage: number;
  timeRemaining: number;
  stage1Code?: string;
  stage2BugFound?: boolean;
  stage3Code?: string;
  stage4Code?: string;
  gameStarted?: boolean;
  gameWon?: boolean;
  gameLost?: boolean;
}

// POST /api/progress/save - Save game progress
export async function POST(request: NextRequest) {
  try {
    const body: SaveProgressRequest = await request.json();
    const { userId, ...progressData } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const progress = await prisma.gameProgress.upsert({
      where: { userId },
      update: {
        ...progressData,
        lastSaved: new Date(),
      },
      create: {
        userId,
        ...progressData,
      },
    });

    return NextResponse.json({
      success: true,
      progress,
    });
  } catch (error) {
    console.error('Error saving progress:', error);
    return NextResponse.json(
      { error: 'Failed to save progress' },
      { status: 500 }
    );
  }
}

// GET /api/progress?userId=... - Load game progress
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const progress = await prisma.gameProgress.findUnique({
      where: { userId },
    });

    if (!progress) {
      return NextResponse.json(
        { error: 'Progress not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error loading progress:', error);
    return NextResponse.json(
      { error: 'Failed to load progress' },
      { status: 500 }
    );
  }
}

// DELETE /api/progress?userId=... - Delete game progress (reset game)
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    await prisma.gameProgress.delete({
      where: { userId },
    });

    return NextResponse.json({
      success: true,
      message: 'Progress deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting progress:', error);
    return NextResponse.json(
      { error: 'Failed to delete progress' },
      { status: 500 }
    );
  }
}
