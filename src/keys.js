module.exports = {

    // database: {
    //     connectionLimit: 10,
    //     host: 'us-cdbr-iron-east-05.cleardb.net',
    //     user: 'b0655ea373feff',
    //     password: '738467e4',
    //     database: 'heroku_5e9a53f250f17f8',
    //     // port: '8889'
    // }

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