const mongoose = require('mongoose')
const emailVal = require('email-validator')
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Every user must have a name'],
    },
    email: {
        type: String,
        required: [true, 'Every user must have an email'],
        unique: [true, 'Emails cannot be the same.'],
        validate: {
            validator: emailVal.validate
        }
    },
    password: {
        type: String,
        required: [true, 'Every user must have a password'],
        minlength: [8, 'A password cannot be less than 8 characters']
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Every user must confirm their password'],
        validate: function(val){
            return val === this.password;
        },
        message: 'The confirmed password and password must be the same'
    },
    passwordChangedAt: {
        type: Date
    },
    balance: {
        type: Number,
        default: 0
    },
    transactionHistory: [{
        type: Object,
    }]
})

// Hashing password after each save
userSchema.pre('save', async function(next) {
    // Ignoring the hash if the password has not been modified
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12)
    this.passwordConfirm = undefined
    next()
})

userSchema.pre('save', function(next){
    if(!this.isModified('password') || this.isNew) return next();

    this,passwordChangedAt = Date.now()
    next()
})

userSchema.methods.comparePasswords = async function (hashedPassword, enteredPassword) {
    return await bcrypt.compare(enteredPassword, hashedPassword)
}

const User = mongoose.model("User", userSchema);

module.exports = User;