#!/usr/bin/env node
const express = require('express');
const http = require('http');
const WebSocketClient = require('websocket').client;
const WebSocketServer = require('websocket').server;
let action = require('./action.js');

let gb_constants = {
    client_server_port : 9044,
    
};
 class client_server { 
    constructor() {
        this.protocol = null;
        this.user_index = 0;
        this.init_ws_server();
        this.connections = [];
        this.users = [];
        this.Action = action;
        this.pool = [];
    }

    init_ws_server(){
        //initiate http server
        this.app = express();
        this.server = http.createServer(this.app);
        this.app.get('/', function(req, res) {
          res.sendFile( __dirname +'/index.html');
        });
        this.server.listen(process.env.PORT || gb_constants.client_server_port);

        this.wsServer = new WebSocketServer({
            httpServer: this.server,
            autoAcceptConnections: false
        });
        this.server_on_request();
    }

    server_on_request(){
        this.wsServer.on('request', (request) => {
            
            var connection = request.accept(null, request.origin);
            console.log(' Connection accepted.');
            this.connections.push(connection);

            connection.on('message', (message) => {
                if (message.type === 'utf8') this.received_utf8_msg_then(connection,message);
            });

            connection.on('close', function(reasonCode, description) {
                console.log(' Peer ' + connection.remoteAddress + ' disconnected.');
            });
        });
    }

    received_utf8_msg_then(connection,message){
        if (message.type === 'utf8') {
            try {
                console.log(message);
                let jsonData = JSON.parse(message.utf8Data);
                this.received_Action_reponse(connection,jsonData);
            }
            catch(err) {
                connection.sendUTF(message.utf8Data);
                console.log(err);
                console.log( "ws server received: '" + message.utf8Data + "'");
            } 
        }
    }

    received_Action_reponse(connection,jsonData){
        console.log(jsonData.action);
        try  {this.Action[jsonData.action].received(this,connection,jsonData);}
        catch(err)  {console.log(err);
            console.log("received a incorrect action:",jsonData.action);}
    }

    sendToAllClient(msg){
        this.connections.forEach(function (item) {
          if (item.connected) { 
            item.sendUTF(msg);
          }
        })
    }
}

module.exports = client_server;