// Server Configuration ====>\\
module.exports = {
    'default_port'	     : process.env.PORT || 5000,
    'database_url'	     : 'mongodb://localhost:27017/',
    'database'           : 'chatterbox',
    'database_collection': 'MessagesSaved',
    'socket_port': 3000
 };