require('dotenv').config()

const mongoose = require('mongoose')
const fs = require('fs')
const db = (JSON.parse(fs.readFileSync("./src/config/dbs.json")))[process.env.NODE_ENV]

mongoose.connect(`mongodb://${db.host}/`, {
    dbName: db.dbname,
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    connectTimeoutMS: 5000
}).then((data) => {
    const dbdata = data.connections[0]
    console.log(`Connected to "${dbdata.name}" database on ${dbdata.host}:${dbdata.port}`)
}).catch((err) => console.error(err))
