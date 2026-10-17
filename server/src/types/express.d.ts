export interface UserPayload {
  userId: string;
  userName: string;
  role: string;
  email: string;
  phone: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
