import init from './init.js';
import getApp from './server.js';

init()
  .then(() => {
    const PORT = parseInt(process.env.PORT) || 3000;
    const app = getApp();

    app.listen(PORT, () => {
      console.log('Server is running');
    });
  })
  .catch((error) => {
    console.error('Failed to connect to the database', error);
  });
