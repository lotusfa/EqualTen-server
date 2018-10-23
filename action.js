let act = { 
	reg : {
		received : function(clientServer,connection,jsonData){
			if (connection) {
				clientServer.users[clientServer.user_index] = { 'connection' : connection, 'user_index' : clientServer.user_index, 'pair': null };
				let msg = { 'action' : 'reg', 'user_index' : clientServer.user_index };
				connection_send_msg(connection,JSON.stringify(msg), (x) => {});
				clientServer.user_index++;
				//console.log(clientServer.users[0].connection.state);
			}
		},
	},
	pair : {
		received : function(clientServer,connection,jsonData){
			if (connection.connected && clientServer.users[jsonData.user_index]) {
				clientServer.pool.push(clientServer.users[jsonData.user_index]);
				let pool_connected_user = [];
				clientServer.pool.forEach( (user)=>{
		            if (user.connection.connected) {
		            	pool_connected_user.push(user);
		            	if (pool_connected_user.length == 2 ) { pairSuccess(pool_connected_user); }
		            }
		        });
		        console.log("pool connected people: ", pool_connected_user.length);
			}

			function pairSuccess(pool_connected_user){
				pool_connected_user[0].pair = pool_connected_user[1].user_index;
				pool_connected_user[1].pair = pool_connected_user[0].user_index;
				clientServer.pool = [];
				let msg = { 'action' : 'pair', 'result' : true };
				connection_send_msg(pool_connected_user[0].connection,JSON.stringify(msg), (x) => {});
				connection_send_msg(pool_connected_user[1].connection,JSON.stringify(msg), (x) => {});
			}
		},
	},

	msg : {
		received : function(clientServer,connection,jsonData){
			//{ action = "msg" , user_index : 10, msg : { }}
			try{
				let user1 = clientServer.users[jsonData.user_index];
				let user2 = clientServer.users[user1.pair]

				if (user2.connection.connected && user1.connection.connected && jsonData.msg) {
					let msg = jsonData.msg;
					connection_send_msg(user2.connection,JSON.stringify(msg), (x) => {});
				}else {
					reportErrorr();
				}
			}catch(e){
				reportErrorr();
			}

			function reportErrorr(){
				let msg = { 'action' : 'spawnUnit', 'result' : false };
				connection_send_msg(clientServer.users[jsonData.user_index],JSON.stringify(msg), (x) => {});
			}
		},
	}

};

function connection_send_msg(connection,msg,callback){
	if (connection.connected) {
		connection.sendUTF(msg);
		callback(true);
	}else 
		callback(false);
}

module.exports = act;