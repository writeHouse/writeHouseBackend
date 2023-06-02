export const slugGenerator = (title: string): string => `${title}-${Math.random().toString(36).substring(2, 15)}`;
