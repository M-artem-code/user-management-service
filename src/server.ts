import './load-env';
import app from './app';
import { prisma } from './utils/prisma';
import validateEnv from './utils/validateEnv';

validateEnv();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
});