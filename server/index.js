const fs = require('node:fs');
const { z } = require('zod');
const app = require('./app');
const zodErrorMap = require('./utils/zod-error-map');

// Initialize translated error messages
z.setErrorMap(zodErrorMap);

try {
  fs.mkdirSync('./uploads');
} catch {
  // Do nothing
}

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
