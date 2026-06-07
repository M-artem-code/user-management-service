// Test environment configuration. Loaded before any test module so that
// utilities reading process.env (jwt, cookies, prisma) get deterministic values
// and never require a real database connection.
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
process.env.JWT_ACCESS_TOKEN_SECRET =
  'test_access_secret_minimum_32_characters_long';
process.env.JWT_REFRESH_TOKEN_SECRET =
  'test_refresh_secret_minimum_32_characters_long';
process.env.JWT_ACCESS_TOKEN_EXPIRES_IN = '15m';
process.env.JWT_REFRESH_TOKEN_EXPIRES_IN = '7d';
process.env.CLIENT_URL = 'http://localhost:3000';
