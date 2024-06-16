import { migrator } from './umzug.js';

if (import.meta.url.endsWith(process.argv[1])) {
  try {
    await migrator.runAsCLI();
    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
}
