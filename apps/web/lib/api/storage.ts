export const uploadCloud = async ({ image, path = 'uploads' }: { image: string; path?: string }) => {
  if (!image) {
    return '';
  }

  const res = await fetch('/api/storage', {
    method: 'POST',
    body: JSON.stringify({
      image: image,
      path: path
    })
  });

  if (res.ok) {
    const upload = await res.json();

    return upload?.url || '';
  }

  return '';
};
