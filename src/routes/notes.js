const { body, validationResult } = require('express-validator');
const Note = require('../models/Note');
const User = require('../models/User');
const { isAuthorized } = require('../helpers');
const router = require('express').Router()
const noteValidation = [
    isAuthorized,
    body('title').exists().isLength({ min: 1 }),
    body('description').exists().isLength({ min: 1 })
]

// Vistas -- Front
router.get('/notes', isAuthorized, async (req, res) => {
    // .lean() te permite transformar el objeto que llega a uno de JS
    const notes = await Note.find({creator: req.user._id}).sort({created_at: -1}).lean()
    res.render('notes/index', { notes })
})

router.get('/notes/new',isAuthorized, (req, res) => {
    res.render('notes/add')
})

// Backend
router.post('/notes/new', noteValidation, async (req, res) => {
    const errors = (validationResult(req)).errors
    
    if(errors.length === 0){
        req.body.creator = req.user._id
        const note = new Note(req.body)
        await note.save()
    }
    else req.flash('errors', errors)

    req.flash('status', { success: (errors.length === 0), title: req.body.title, method: 'created' })
    res.redirect('/notes/new')
})

router.get('/notes/edit/:id',isAuthorized, async (req, res) => {
    const note = await Note.findById(req.params.id).lean()
    res.render('notes/edit', { note })
})

router.put('/notes/:id', noteValidation, async (req, res) => {
    const errors = (validationResult(req)).errors

    if(errors.length === 0){
        await Note.findByIdAndUpdate(req.params.id, req.body)
    }
    else req.flash('errors', errors)

    const note = await Note.findById(req.params.id).lean()

    req.flash('status', { success: (errors.length === 0), title: req.body.title, method: 'modified' })
    req.flash('note', note)
    res.redirect(`/notes/edit/${req.params.id}`)
})

router.delete('/notes/:id', isAuthorized, async (req, res) => {
    const note = await Note.findById(req.params.id).lean()

    if(note){  
        await Note.findByIdAndDelete(req.params.id)
    }
    
    req.flash('status', { success: !(!note), title: note.title, method: 'deleted' })
    res.redirect('/notes')
})

module.exports = router