import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import 'express-async-errors';
import cors from 'cors';
import path from 'path';

import { router } from './routes';

const app = express();


app.use(express.json());
app.use(cors());


app.use(router);


app.use(
  '/files',
  express.static(path.resolve(__dirname, '..', 'tmp'))
);


const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof Error) {
    
    res.status(400).json({ error: err.message });
    return; 
  }


  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
};


app.use(errorHandler);


app.listen(3333, () => console.log('Servidor online!!!!!!!'));
