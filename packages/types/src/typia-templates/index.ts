export * from './isVC.js';
export * from './isVP.js';
export * from './isParam.js';

export const isJWT = (jwt: string): boolean => {
  if (typeof jwt !== 'string') return false;
  return jwt.split('.').length === 3;
};
