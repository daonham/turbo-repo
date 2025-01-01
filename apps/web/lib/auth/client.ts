import { createAuthClient } from 'better-auth/react';
import { toast } from 'sonner';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  fetchOptions: {
    onError: async (context) => {
      const { response } = context;
      if (response.status === 429) {
        const retryAfter = response.headers.get('X-Retry-After');
        toast.error(`Rate limit exceeded. Retry after ${retryAfter} seconds`);
      }
    }
  }
});
