<<<<<<< HEAD
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
=======
import app from './app.js';
import init from './init.js';

init().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
});
>>>>>>> 1381fce (IW1S2G21-68 add confirm email)
