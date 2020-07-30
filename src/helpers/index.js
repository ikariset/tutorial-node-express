module.exports = {
    isAuthorized(req, res, next){
        if(req.isAuthenticated()) return next()

        req.flash('errors', [{ value: '', msg: 'Not Registered User, Register or Log In please!', param: 'UserAcc', location: 'body' }])
        res.redirect('/users/sign-in')
    }
}