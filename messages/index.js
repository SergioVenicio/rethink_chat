const rethinkdb = require('rethinkdb')

async function getConnection() {
    return await rethinkdb.connect({host: '172.20.0.100', port: 28015, db: 'messages'})
}

async function createMessage(message, username, clientOffset) {
    const conn = await getConnection()
    const item = {
        message,
        username,
        clientOffset,
        createdAt: rethinkdb.now()
    }
    await rethinkdb.table('messages').insert(item, { returnChanges: true }).run(conn)
}

async function listenMessage(callback) {
    const conn = await getConnection()
    const cursor = await rethinkdb.table('messages').orderBy(rethinkdb.desc('createdAt')).run(conn)
    const messages = await cursor.toArray()
    messages.forEach(async (item) => {
        const { message = '', username = '' } = item
        await callback(message, username)
    })
}


module.exports = {
    getConnection,
    createMessage,
    listenMessage,
}