var redisp = process.env.REDISTOGO_URL || 6379,
    expressp = process.env.PORT || 8080;

console.log( redisp );

var app = require( 'express' )(),
    server = require( 'http' ).createServer( app ),
    io = require( 'socket.io' ).listen( server ),
    redis = require( 'redis' ).createClient( redisp );

redis.subscribe( 'r-live' );
server.listen( expressp );

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

