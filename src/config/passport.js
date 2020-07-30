const User = require('../models/User')
const passport = require('passport')
const strategy = require('passport-local').Strategy

//Para validar el Login
passport.use(new strategy({ usernameField: 'email' },
    async (email, password, done) => {
        const user = await User.findOne({ email: email })

        if (!user) { return done(null, false, { message: 'Not Registered User' }) }
        else if (await user.checkPwd(password)) {
            return done(null, user)
        } else {
            return done(null, false, { message: 'Wrong password' })
        }
    })
)

// Para guardar solo el ID
passport.serializeUser((user, done) => { done(null, user.id) })

// Para traer todo el objeto
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => { done(err, user) })
})