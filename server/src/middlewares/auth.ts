import jwt, { type JwtPayload } from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
interface CustomJwtPayload extends JwtPayload {
  userId: string;
  userName: string;
  role: string;
  email: string;
  phone: string;
}
import { prisma } from "../lib/db.js";
const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // console.log(req.cookies);
    const token = req.cookies.token;
    // console.log(token)
    console.log(process.env.JWT_SECRET!);
    if (!token) return res.status(401).json({ message: "unauthorized access" });
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!,
    ) as CustomJwtPayload;
    console.log(decoded);
    // //current user from db
    const currentUser = await prisma.user.findFirst({
      where: {
        email: decoded.email,
      },
    });
    if (!currentUser) {
      return res.status(401).json({ message: "User account not found" });
    }

    req.user = {
      userId: currentUser.id,
      userName: currentUser.username,
      role: currentUser.role,
      email: currentUser.email,
      phone: currentUser.phone,
    };
    return next();
  } catch (e) {
    console.log(e);
    return res.status(403).json({ message: "Token verification failed" });
  }
};
const restrictTo = (...roles: string[]) => {
  roles.forEach((r) => console.log(r));
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role as string))
      return res.status(403).json({ message: "cannot access this resource" });
    return next();
  };
};
export { verifyToken,restrictTo };
