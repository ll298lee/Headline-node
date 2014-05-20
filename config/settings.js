module.exports = {
  httpPort : 1337,
  database:{
    host: 'localhost',
    db: 'headlineDb',
    url : 'mongodb://localhost/headlineDb'
  },
  cookie_parser_secret: '53748980788a9332c4c7e170',
  session_cookie_secret: '5375b1be5c81561fc922acf6',
  sesstion_max_age: 20 * 60 * 1000  //20 minutes
}
