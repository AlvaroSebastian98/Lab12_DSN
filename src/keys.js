module.exports = {

    // database: {
    //     connectionLimit: 10,
    //     host: process.env.MYSQL_HOST || 'localhost',
    //     user: 'root',
    //     password: 'root',
    //     database: 'agenda',
    //     port: '8889'
    // }

    database: {
        connectionLimit: 10,
        host: process.env.MYSQL_HOST || '172.31.19.182',
        user: 'root',
        password: 'password',
        database: 'agenda',
        // port: '6603'
    }

};