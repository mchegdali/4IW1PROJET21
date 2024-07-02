const { z } = require('zod');
const app = require('./app');
const zodErrorMap = require('./utils/zod-error-map');

// Initialize translated error messages
z.setErrorMap(zodErrorMap);

app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});
