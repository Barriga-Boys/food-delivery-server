const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const customerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        age: {
            type: Number,
            min: 18,
            max: 65,
        },
        email: {
            type: String,
            unique: true,
            required: true,
            trim: true,
            lowercase: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Email is invalid!');
                }
            },
        },
        password: {
            type: String,
            required: true,
            trim: true,
            minlength: 8,
            validate(value) {
                if (value.toLowerCase().includes('password')) {
                    throw new Error(
                        "Password must not include the word 'password'"
                    );
                }
            },
        },
        addresses: [
            {
                address: {
                    type: String,
                    trim: true,
                    uppercase: true,
                },
            },
        ],
        tokens: [
            {
                token: {
                    type: String,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

//when adding methods, middleware, dont use arrow functions

customerSchema.methods.toJSON = function () {
    const customerObject = this.toObject();
    delete customerObject.password;
    delete customerObject.tokens;
    return customerObject;
};

//generate token for user
customerSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign({ _id: this._id }, 'thisismysecretkey', {
        expiresIn: '7d',
    });

    this.tokens = this.tokens.concat({ token });
    await this.save();

    return token;
};

customerSchema.statics.findByCredentials = async function (email, password) {
    const customer = await Customer.findOne({ email });
    if (!customer) {
        throw new Error('Unable to login');
    }

    const isMatch = bcrypt.compare(password, customer.password);

    if (!isMatch) {
        throw new Error('Unable to login');
    }

    return customer;
};

//store hashed password before saving
customerSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }

    next();
});

const Customer = new mongoose.model('Customer', customerSchema);

module.exports = Customer;
