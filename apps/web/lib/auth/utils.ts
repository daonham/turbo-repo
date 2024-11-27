export const getRole = (email: string | null | undefined) => {
  return email === 'nhamdv@templatica.net' ? 'ADMIN' : 'USER';
};
