import { prisma } from "./db";
import bcrypt from "bcryptjs";
console.log(process.env.ADMIN_PASS);
async function seedAdmin() {
    try {
        const adminCount = await prisma.user.count({
            where: {
                role: "ADMIN",
            },
        });
        if (adminCount < 1) {
            console.log("No admin found. Generating seed admin...");
            // 3. Hash the password securely using bcrypt (10 salt rounds is standard)
            const plainPassword = process.env.ADMIN_PASS;
            console.log(plainPassword);
            const hashedPassword = await bcrypt.hash(plainPassword, 10);
            const newAdmin = await prisma.user.create({
                data: {
                    username: "Admin User",
                    email: "admin123@gmail.com",
                    phone: "9800000000",
                    password: hashedPassword,
                    role: "ADMIN",
                },
            });
            console.log(`Admin seeded successfully with ID: ${newAdmin.id}`);
        }
        else {
            console.log("Admin seeding skipped: An administrator already exists in the database.");
            return;
        }
    }
    catch (error) {
        console.error("Failed to seed admin user:", error);
    }
}
await seedAdmin();
//# sourceMappingURL=seed.js.map