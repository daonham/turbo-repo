export const getDefaultUserRole = (email: string | null | undefined) => {
  return email === 'nhamdv@templatica.net' ? 'ADMIN' : 'USER';
};
