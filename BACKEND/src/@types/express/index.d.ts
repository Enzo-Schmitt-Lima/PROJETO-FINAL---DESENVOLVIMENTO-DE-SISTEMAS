// @types/express/index.d.ts
import 'express';

declare global {
  namespace Express {
    interface Request {
      user_id?: string; // opcional antes do middleware rodar
    }
  }
}
