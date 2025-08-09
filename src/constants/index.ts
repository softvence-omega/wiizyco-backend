export type TUserRole = 'admin' | 'user' | 'founder' | 'reviver';

export const userRole = {
  user: 'user',
  admin: 'admin',
  founder: 'founder',
  reviver: 'reviver',
} as const;

export type TErrorSource = {
  path: string | number;
  message: string;
}[];
