const express = require("express");
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');

//Create a User using POST "/api/auth". No auth required
router.post('/', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'min length is 6').isLength({ min: 6 }),
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        })
        res.json(user);
    } catch (error) {
        if(error.code === 11000) {
            //Duplicate key error
            return res.status(400).json({ error: "This email already exists" });
        }
        console.error(error);
        res.status(500).send("Some error occured");
    }
});

module.exports = router;
