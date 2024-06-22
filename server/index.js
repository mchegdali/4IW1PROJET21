import { z } from 'zod';
import app from './app.js';
import zodErrorMap from './utils/zod-error-map.js';
import './models/sql/db.js';
import './models/mongo/db.js';

// Initialize translated error messages
z.setErrorMap(zodErrorMap);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
