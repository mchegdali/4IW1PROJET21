import { seeder } from './umzug.js';

if (import.meta.url.endsWith(process.argv[1])) {
  try {
    await seeder.runAsCLI();
    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
}