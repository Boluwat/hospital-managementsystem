module.exports = {
    mongodb: {
        url: process.env.DB_HOST || "mongodb+srv://Boluwatife:Oyedemi14@cluster0.seu4p.mongodb.net/healthManagementSystem?retryWrites=true&w=majority"
    },
    jwtSecret: process.env.JWT_SECRET || 'boluwatife_peter_oyedemi',
    superAdminPassword: process.env.SUPERADMINPASSWORD || 1234,
    migrationIDS: {
        HOSPITAL_ADMIN_ID: process.env.HOSPITAL_ADMIN_ID || "62d6a89e1caa4942b1db3fb8",
        HOSPITAL_USER_ID: process.env.USER_ID || "62d6a89e1caa4942b1db3fb4",
        ADMIN_ROLE_IDS: [
            process.env.SUPER_ADMIN_ID || '62d6a4151caa4942b1db3fb2',
            process.env.ADMIN_ROLE_ID || '62d6a4151caa4942b1db3fc3',
        ]
    }
}
