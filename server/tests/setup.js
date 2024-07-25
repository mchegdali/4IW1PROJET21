const { execSync } = require('child_process');
const path = require('path');

module.exports = async () => {
  console.log('Running migrations...');
  try {
    execSync('node ' + path.join(__dirname, '..', 'bin', 'migrate.js'), {
      stdio: 'inherit',
    });
    console.log('Migrations completed successfully.');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};
