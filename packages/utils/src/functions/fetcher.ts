interface SWRError extends Error {
  info: any;
  status: number;
}

export async function fetcher<JSON = any>(input: RequestInfo, init?: RequestInit): Promise<JSON> {
  const res = await fetch(input, init);

  if (!res.ok) {
    const data = await res.json();
    const error = new Error(data?.message || 'An error occurred while fetching the data.') as SWRError;

    error.info = data?.error;
    error.status = res.status;

    throw error;
  }

  return res.json();
}
