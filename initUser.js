require('dotenv').config({ path: './env/.env.dev' });
const mongoose = require('mongoose');
const User = require('./models/user');

const init = async () => {
    try {
        await mongoose.connect(process.env.URL_MONGO, { dbName: 'apinode'});
        console.log("Connecté à MongoDB...");

        const adminExists = await User.findOne({ email: 'john.doe@test.com' });
        if (!adminExists) {
            const admin = new User({
                username: 'John',
                email: 'john.doe@test.com',
                password: 'password123' 
            });
            await admin.save();
            console.log("Utilisateur admin créé avec succès !");
            console.log("Email: john.doe@test.com");
            console.log("Password: password123");
        } else {
            console.log("L'utilisateur John existe déjà.");
        }
    } catch (error) {
        console.error("Erreur :", error);
    } finally {
        mongoose.connection.close();
    }
};

init();
