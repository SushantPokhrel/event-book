import jwt, {} from "jsonwebtoken";
import { prisma } from "../lib/db";
const verifyToken = async (req, res, next) => {
    try {
        // console.log(req.cookies);
        const token = req.cookies.token;
        // console.log(token)
        console.log(process.env.JWT_SECRET);
        if (!token)
            return res.status(401).json({ message: "unauthorized access" });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
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
    }
    catch (e) {
        console.log(e);
        return res.status(403).json({ message: "Token verification failed" });
    }
};
const restrictTo = (...roles) => {
    roles.forEach((r) => console.log(r));
    return (req, res, next) => {
        if (!roles.includes(req.user?.role))
            return res.status(403).json({ message: "cannot access this resource" });
        return next();
    };
};
export { verifyToken, restrictTo };
//# sourceMappingURL=auth.js.map