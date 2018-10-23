const wsServer = require('./wsServer.js');
global.clientServer = new wsServer();


/*
#!/usr/bin/env node
var WebSocketServer = require('websocket').server;
var http = require('http');

let Port = 9044;
let protocol = null;
let user_index = 0;

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(Port, function() {
    console.log((new Date()) + ' Server is listening on port' + Port);
});
 
wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production 
    // applications, as it defeats all standard cross-origin protection 
    // facilities built into the protocol and the browser.  You should 
    // *always* verify the connection's origin and decide whether or not 
    // to accept it. 
    autoAcceptConnections: false
});
 
function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed. 
  return true;
}
 
wsServer.on('request', function(request) {

    var connection = request.accept(protocol, request.origin);
    connection.sendUTF("{ user : { user_index : user_index } }");
    user_index++;

    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            //connection.sendUTF(message.utf8Data);
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});

function connection_send_msg(connection,msg,callback){
    if (connection.connected) {
        connection.sendUTF(msg);
        callback(true);
    }else 
        callback(false);
}

*/