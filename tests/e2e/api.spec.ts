import { test, expect } from '@playwright/test';

// These API tests hit the running Next.js app. Base URL comes from playwright.config.ts.
test.describe('API user + progress lifecycle', () => {
  test('creates user, saves progress, updates and deletes', async ({ request, baseURL }) => {
    const userTag = `playwright-user-${Date.now()}`;
    const encodedTag = encodeURIComponent(userTag);
    const newTag = `${userTag}-updated`;

    // 1) User should not exist yet
    const checkBefore = await request.get(`${baseURL}/api/user/check/${encodedTag}`);
    expect(checkBefore.ok()).toBeTruthy();
    await expect(checkBefore.json()).resolves.toMatchObject({ exists: false });

    // 2) Fetching user creates it
    const createRes = await request.get(`${baseURL}/api/user/${encodedTag}`);
    expect(createRes.ok()).toBeTruthy();
    const createdUser = await createRes.json();
    expect(createdUser).toMatchObject({ userTag });
    expect(createdUser).toHaveProperty('id');
    const userId = createdUser.id as string;

    // 3) Now user should exist
    const checkAfter = await request.get(`${baseURL}/api/user/check/${encodedTag}`);
    await expect(checkAfter.json()).resolves.toMatchObject({ exists: true });

    // 4) Save progress
    const saveRes = await request.post(`${baseURL}/api/progress`, {
      data: {
        userId,
        currentStage: 1,
        timeRemaining: 120,
        gameStarted: true,
        gameWon: false,
      },
    });
    expect(saveRes.ok()).toBeTruthy();
    const saveJson = await saveRes.json();
    expect(saveJson).toMatchObject({ success: true });
    expect(saveJson.progress).toMatchObject({ currentStage: 1, gameStarted: true });

    // 5) Load progress
    const loadRes = await request.get(`${baseURL}/api/progress?userId=${userId}`);
    expect(loadRes.ok()).toBeTruthy();
    const loaded = await loadRes.json();
    expect(loaded).toMatchObject({ userId, currentStage: 1 });

    // 6) Update user tag
    const updateRes = await request.put(`${baseURL}/api/user/id/${userId}`, {
      data: { userTag: newTag },
    });
    expect(updateRes.ok()).toBeTruthy();
    const updated = await updateRes.json();
    expect(updated).toMatchObject({ userTag: newTag });

    // 7) Delete progress
    const deleteProgressRes = await request.delete(`${baseURL}/api/progress?userId=${userId}`);
    expect(deleteProgressRes.ok()).toBeTruthy();

    // Verify progress gone
    const loadAfterDelete = await request.get(`${baseURL}/api/progress?userId=${userId}`);
    expect(loadAfterDelete.status()).toBe(404);

    // 8) Delete user
    const deleteUserRes = await request.delete(`${baseURL}/api/user/delete/${userId}`);
    expect(deleteUserRes.ok()).toBeTruthy();
    const deleteJson = await deleteUserRes.json();
    expect(deleteJson).toMatchObject({ success: true });
  });
});
