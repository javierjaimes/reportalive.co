var app = require( 'express' )(),
    server = require( 'http' ).createServer( app ),
    io = require( 'socket.io' ).listen( server );

//Connect to RedisToGo at Heroku
if (process.env.REDISTOGO_URL) {
  var rtg   = require("url").parse(process.env.REDISTOGO_URL);
  var redis = require("redis").createClient(rtg.port, rtg.hostname);

  redis.auth(rtg.auth.split(":")[1]);
} else {
  var redis = require("redis").createClient();
}

redis.subscribe( 'r-live' );
server.listen( process.env.PORT || 8080 );

app.get( '/', function( req, res ){
  res.sendFile( __dirname + '/index.html' );
})

io.sockets.on( 'connection', function( socket ){

  redis.on( 'message', function( channel, message ){

    message = JSON.parse( message );
    socket.emit( message.emit, message );
  })

  socket.emit( 'welcome', { message: 'Hello World!' });

})

