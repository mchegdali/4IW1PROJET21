import express from 'express';
import cors from 'cors';
import appRouter from './routes/index.js';

const PORT = parseInt(process.env.PORT) || 3000;

const app = express();
app.use(express.json());
app.use(cors());

app.use(appRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
