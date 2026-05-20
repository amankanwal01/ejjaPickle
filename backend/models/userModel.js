const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * USER SCHEMA CONCEPT:
 * A Schema is like a blueprint for your data. It tells MongoDB 
 * exactly what fields a "User" should have.
 */
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true // No two users can have the same email
    },
    password: {
        type: String,
        required: [true, 'Please add a password']
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, {
    timestamps: true // Automatically creates "createdAt" and "updatedAt"
});

/**
 * PASSWORD HASHING MIDDLEWARE:
 * Before saving a user, we check if the password was modified.
 * If yes, we hash it using bcryptjs.
 */
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

/**
 * COMPARISON METHOD:
 * We add a function directly to the user object to help us 
 * compare entered passwords with the hashed one in the DB.
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
