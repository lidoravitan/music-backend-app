export const appConfig = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  SECRET: process.env.SECRET || 'secret',
  PRIVATE_KEY_PEM: process.env.PRIVATE_KEY_PEM || '',
}
