const jwt = require('jsonwebtoken');
const Customer = require('../models/customer');

const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.replace('Bearer ', '');
        const decoded = jwt.verify(token, 'thisismysecretkey');

        const customer = await Customer.findOne({
            _id: decoded._id,
            'tokens.token': token,
        });

        if (!customer) {
            throw new Error();
        }

        req.token = token;
        req.customer = customer;

        next();
    } catch (e) {
        res.status(404).send('Please authenticate');
    }
};

module.exports = auth;
