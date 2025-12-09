// Utility functions for API calls to save/load progress

export interface GameProgressData {
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

export interface SavedProgress {
  id: string;
  userId: string;
  currentStage: number;
  timeRemaining: number;
  stage1Code?: string;
  stage2BugFound: boolean;
  stage3Code?: string;
  stage4Code?: string;
  gameStarted: boolean;
  gameWon: boolean;
  gameLost: boolean;
  lastSaved: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Check if a userTag already exists (without creating)
 */
export async function checkUserExists(userTag: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/user/check/${userTag}`);
    if (!response.ok) {
      return false;
    }
    const data = await response.json();
    return data.exists || false;
  } catch (error) {
    console.error('Error checking user:', error);
    return false;
  }
}

/**
 * Get or create a user by their tag
 */
export async function getOrCreateUser(userTag: string) {
  try {
    const response = await fetch(`/api/user/${userTag}`);
    if (!response.ok) {
      throw new Error('Failed to get user');
    }
    return await response.json();
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
}

/**
 * Save game progress to the backend
 */
export async function saveGameProgress(progressData: GameProgressData) {
  try {
    const response = await fetch('/api/progress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(progressData),
    });

    if (!response.ok) {
      throw new Error('Failed to save progress');
    }

    return await response.json();
  } catch (error) {
    console.error('Error saving progress:', error);
    throw error;
  }
}

/**
 * Load game progress from the backend
 */
export async function loadGameProgress(userId: string): Promise<SavedProgress | null> {
  try {
    const response = await fetch(`/api/progress?userId=${userId}`);

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error('Failed to load progress');
    }

    return await response.json();
  } catch (error) {
    console.error('Error loading progress:', error);
    throw error;
  }
}

/**
 * Reset/delete game progress
 */
export async function resetGameProgress(userId: string) {
  try {
    const response = await fetch(`/api/progress?userId=${userId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to reset progress');
    }

    return await response.json();
  } catch (error) {
    console.error('Error resetting progress:', error);
    throw error;
  }
}

/**
 * Delete user completely from database
 */
export async function deleteUser(userId: string) {
  try {
    const response = await fetch(`/api/user/delete/${userId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete user');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

/**
 * Update user fields (currently userTag)
 */
export async function updateUser(userId: string, data: { userTag: string }) {
  try {
    const response = await fetch(`/api/user/id/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update user');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}
