if (process.env.NODE_ENV==='production') {
    // mongouri='mlab uri'
} else {
    mongouri = 'mongodb://localhost:27017/practice-auth'
}
module.exports ={mongouri}