const { z } = require('zod');
const app = require('./app');
const zodErrorMap = require('./utils/zod-error-map');

// Initialize translated error messages
z.setErrorMap(zodErrorMap);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

module.exports = app;
