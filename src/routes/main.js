const router = require('express').Router()

// Vistas -- Front
router.get('/', (req, res) => {
    res.render('index')
})

router.get('/about', (req, res) => {
    res.render('about')
})

// Backend

module.exports = router