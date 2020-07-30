const { body, validationResult } = require('express-validator');

const router = require('express').Router()
const User = require('../models/User')
const passport = require('passport')

const newUserValidation = [
    body('first_name').exists().isLength({ min: 1 }),
    body('last_name').exists().isLength({ min: 1 }),
    body('email').exists().isEmail(),
    body('conf_pass').exists().isLength({ min: 8 }).withMessage('password must be at least 8 characters'),
    body('password').exists().isLength({ min: 8 }).withMessage('password must be at least 8 characters')
        .custom((value, { req, loc, path }) => {
            if (value !== req.body.conf_pass) {
                throw new Error("Passwords doesn't match");
            } else {
                return value;
            }
        })
]

// Vistas -- Front
router.get('/users/sign-in', (req, res) => {
    res.render('users/sign-in')
})

router.get('/users/sign-up', (req, res) => {
    res.render('users/sign-up')
})

// Backend
router.post('/users/sign-up', newUserValidation, async (req, res) => {
    let errors = (validationResult(req)).errors || []
    let route = 'users/sign-up'

    try {
        if (!errors) throw "Validation"

        const user = await User.findOne({ email: req.body.email }).lean()
        if (user) throw "OldUser"

        delete req.body.pass_conf
        const newUser = new User(req.body)
        newUser.password = await newUser.encrypt(newUser.password)
        await newUser.save()

        route = 'users/sign-in'
    } catch (err) {
        switch (err) {
            case 'Validation':
                break

            case 'OldUser':
                errors.push({ value: req.body.email, msg: 'Registered User', param: 'email', location: 'body' })
                break

            default:
                errors.push({ value: 'Generic', msg: err.message, param: 'Generic', location: 'Node' })
                break
        }
        req.flash('errors', errors)
    }

    req.flash('status', { success: (errors.length === 0), email: req.body.email, method: 'created' })
    res.redirect(`/${route}`)
})

router.post('/users/sign-in', passport.authenticate('local', {
    successRedirect: '/notes',
    failureRedirect: '/users/sign-in',
    failureFlash: true
}))

router.get('/users/sign-out', (req, res) => {
    req.logOut()
    res.redirect("/")
})

module.exports = router