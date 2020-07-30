const express = require('express')
const hbars = require('express-handlebars')
const override = require('method-override')
const session = require('express-session')
const path = require('path')
const routes = require('./routes')
const flash = require('connect-flash')
const passport = require('passport')

//Initializations
const app = express()
require('./config/database')
require('./config/passport')

//Settings - Archivos de configuración y carpetas de recursos y capas
app.set('port', process.env.PORT || 3000)
app.set('views', path.join((__dirname), 'views'))
app.engine('.hbs', hbars({ //Para configuración de Template Handlebarss
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}))
app.set('view engine', '.hbs') //Handlebars -- End

//Middlewares - Gestores de los requests desde front y response hacia front
app.use(express.urlencoded({ extended: false }))
app.use(override((req, res) => {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
    }
})) //Para reconocer métodos además de POST y GET en formularios por botón _method '_method'
app.use(session({
    secret: 'MyFirstSecretCode',
    resave: true,
    saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

//Global Variables
//  Disponibilizar carpeta Public en front
app.use(express.static(path.join((__dirname), 'public')))
//  Trabajar con locals
app.use((req, res, next) => {
    res.locals.status = req.flash('status')
    res.locals.errors = req.flash('errors')
    res.locals.error = req.flash('error')
    res.locals.user = (req.user ? req.user.toObject() : null)
    next()
})

//Routes
routes.forEach(route => { app.use(route) })

//Static Folder Set-up


//Server deployment
app.listen(app.get('port'), () => {
    console.log(`Server is listening on port ${app.get('port')}`);
})