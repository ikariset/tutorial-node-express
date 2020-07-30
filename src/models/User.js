const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const EntitySchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
})

EntitySchema.methods.encrypt = async (p) => {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(p, salt)
}

EntitySchema.methods.checkPwd = async function (p) {
    return await bcrypt.compare(p, this.password)
}

module.exports = mongoose.model('User', EntitySchema)