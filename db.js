const { MongoClient } = require('mongodb')

let dBConnection


module.exports = {
    connectToDB: (cb) => {
        MongoClient.connect('mongodb://localhost:27017/Bookstore')
        .then((client) => {
            dBConnection = client.db()
            return cb()
        })
        .catch(err => {
            console.log(err)
            return cb(err)
        })
    },
    getDB: () => dBConnection
}