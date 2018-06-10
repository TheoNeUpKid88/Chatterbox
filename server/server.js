//=|=========================================================================|\\
//=|     Author: TheoNeUpKID aka Ramon J. Yniguez                            |=\\
//=|     Purpse: Sever setup & REST API Setup                                |==\\
//=|=========================================================================|===\\
//=|                                                                         |====\\
//=| Server Constants ~ Server | Setup | PORT | REST API endpoints | SOCKETS |=====\\
//=|================================================================================\\        
// ========================( Router & DB Endpoints )=================================\\
//\__________________________________________________________________________________/\\
const methodOverride = require('method-override'),
        app = require('express')(),
        http = require('http').createServer(app),
        config = require('./config/config'),
        bodyParser = require('body-parser'),                                   
        ChatController = require('./chat'),
        io = require('socket.io')(http),
        morgan = require('morgan'),                                             
        cors = require('cors'),
        apiRoutes = app,
        chatRoutes = apiRoutes;

// /* ======================================
//  |   Author: Ramon J Yniguez AkA TheoNeUpKID
//  |   Purpose: Nodejs Backend Server Setup
//  |   Technology: Expressjs Routing 4.X 
//  |   URL: https://expressjs.com/en/4x/api.html 
// ====================================== */ 
    apiRoutes.use(morgan('dev'));                                     
    apiRoutes.use(bodyParser.json());                                 
    apiRoutes.use(bodyParser.json({ type: 'application/vnd.api+json' }));
    apiRoutes.use(bodyParser.urlencoded({'extended':'true'}));        
    apiRoutes.use(methodOverride());
    apiRoutes.use(cors());
    apiRoutes.use(function(req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader('Access-Control-Allow-Methods', 'DELETE, PUT');
        res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();});

    
// /* ======================================
//  |   Author: Ramon J Yniguez AkA TheoNeUpKID
//  |   Purpose: Establish REST API Endpoints
//  |   Technology: Expressjs Routing 4.X 
//  |   URL: https://expressjs.com/en/4x/api.html 
// ====================================== */   
    // Set chat routes as a subgroup/middleware to apiRoutes
        apiRoutes.use('./chat', (err, req, res, next) =>{
            if(err){ throw err;}
            next();});

    // Add New messages to database
        chatRoutes.post('/api/a/AddMessages', (req, res, next) =>{ChatController.AddMessages(req, res) });
    
    // View Most Recent Message added to databse
        chatRoutes.get('/api/a/recentMessages', (req,res, next) =>{ ChatController.getrecentMessages(req, res) });

    // View ALL message from database
        chatRoutes.get('/api/a/ALLmessages', (req,res, next) =>{ ChatController.getAllMessages(req, res) });
    
// /* ======================================
//  |   Author: Ramon J Yniguez AkA TheoNeUpKID
//  |   Purpose: Enable Real-time communication
//  |   Technology: Socket.io 
//  |   URL: https://socket.io/docs/ 
// ====================================== */
    var msg = '';
    
    io.on('connection', (socket) => {
        
        socket.on('disconnect', function(){
        io.emit('users-changed', {user: socket.nickname, event: 'left'});   
        });
        
        socket.on('set-nickname', (nickname) => {
        socket.nickname = nickname;
        io.emit('users-changed', {user: nickname, event: 'joined'});    
        });
        
        socket.on('add-message', (message) => {
        // console.log('from sockets', msg) //for debuggin purposes
        io.emit('message', {text: message.text, from: socket.nickname, created: new Date()});
        });
    });
    // Listening to Port =========================== \\
    http.listen(config.socket_port, function(req, res){
        console.log('Server & socket.io: listening on ...... ' + config.socket_port);
    });