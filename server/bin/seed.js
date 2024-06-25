const umzug = require('./umzug');

if (require.main === module) {
  umzug()
    .then(({ seeder }) => seeder.runAsCLI())
    .then((isOk) => {
      if (isOk) {
        process.exit(0);
      }
      process.exit(1);
    });
}
