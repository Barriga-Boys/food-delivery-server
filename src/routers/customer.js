const { Router } = require('express');
const Customer = require('../models/customer');

const auth = require('../middleware/auth');

const router = new Router();

router.post('/customers', async (req, res) => {
    try {
        const customer = new Customer(req.body);
        const token = await customer.generateAuthToken();
        await customer.save();
        res.status(201).send({ customer, token });
    } catch (e) {
        res.status(400).send(e);
    }
});

router.post('/customers/login', async (req, res) => {
    try {
        const customer = await Customer.findByCredentials(
            req.body.email,
            req.body.password
        );
        const token = await customer.generateAuthToken();
        res.send({ customer, token });
    } catch (e) {
        res.status(400).send();
    }
});

router.post('/customers/logout', auth, async (req, res) => {
    try {
        req.customer.tokens = req.customer.tokens.filter(
            (token) => token.token !== req.token
        );

        await req.customer.save();
        res.send();
    } catch (e) {
        res.status(500).send();
    }
});

router.post('/customers/logoutAll', auth, async (req, res) => {
    try {
        req.customer.tokens = [];
        await req.customer.save();
        res.send();
    } catch (e) {
        res.status(500).send(e);
    }
});

router.post('/customers/addresses', auth, async (req, res) => {
    try {
        const address = req.body.address;
        req.customer.addresses = req.customer.addresses.concat({ address });
        await req.customer.save();
        res.send(req.customer);
    } catch (e) {
        res.status(400).send(e);
    }
});

module.exports = router;
