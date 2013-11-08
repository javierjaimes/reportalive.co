var app = require( 'express' )(),
    server = require( 'http' ).createServer( app ),
    io = require( 'socket.io' ).listen( server ),
    redis = require( 'redis' ).createClient();

redis.subscribe( 'r-live' );
server.listen( 8080 );

app.get( '/', function( req, res ){
  res.sendFile( __dirname + '/index.html' );
})

io.sockets.on( 'connection', function( socket ){
  
  redis.on( 'message', function( channel, message ){
    console.log( 'reddis', channel, message );
    message = JSON.parse( message );
    console.log( message.emit );

    socket.emit( message.emit, message );
  })

  socket.emit( 'welcome', { message: 'Hello World!' });

  /*socket.on( 'start', function( data ){
    console.log( data );
  })*/
})

