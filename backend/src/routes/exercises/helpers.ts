import { clerkClient } from '@clerk/express';

export async function buildUserNameMap(userIds: string[]): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  await Promise.all(
    userIds.map(async (id) => {
      try {
        const user = await clerkClient.users.getUser(id);
        const name =
          user.username ||
          [user.firstName, user.lastName].filter(Boolean).join(' ') ||
          'Unknown';
        map.set(user.id, name);
      } catch {
        // user not found or Clerk error — skip
      }
    })
  );
  return map;
}
