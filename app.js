var app = require('express').createServer(),
    irc = require('./lib/IRC-js/lib/irc'),
    io = require('./lib/Socket.IO-node'),
    socket = io.listen(app);

var opts = {
    encoding: "utf-8",
};
var webClients = [];
var servers = [];

socket.on('connection', function(client){



    client.on('message', function(clientMessage){
        console.log("got a message :: "+ clientMessage.type);

        switch(clientMessage.type)
        {
            case 'connect':

                var server = new irc({
                    server: clientMessage.data.ircHost,
                    port: clientMessage.data.ircPort,
                    nick: clientMessage.data.nick,
                    encoding: opts.encoding
                });

                channels = clientMessage.data.channels;

                server.connect(function() {
                    setTimeout(function() {
                        for(i in channels) {
                            server.join(channels[i]);
                        }
                    }, 2000);
                });

                server.addListener('privmsg', function(msg) {
                    nick = msg.person.nick;
                    chan = msg.params[0];
                    message = msg.params[1];

                    var data = {channel: chan, from:nick, msg:message};

                    console.log("IRC new: "+msg.params[0]+" - "+msg.person.nick+":"+msg.params[1]+"\n");


                    if(webClients.length != 0) {
                        for(i in webClients) {
                            webClient = webClients[i];

                            if(webClient.server == this) {

                                for(j in webClient.channels) {

                                    if(chan.toLowerCase() == webClient.channels[j].toLowerCase()) {

                                        webClient.client.send(data);

                                    }
                                }
                            }
                        }
                    }


                });

                webClients.push({session:client.sessionId,client:client, server:server, channels: channels});
                console.log("got a client :: "+client.sessionId+" :: "+webClients.length);

                client.send({msgs:[],channels: channels});

                break;

        }
    });

    client.on('disconnect', function(){ 
        for(i in webClients) {
            if(webClients[i].session == client.sessionId) {
                webClients[i].server.quit("Leaving");
                webClients.splice(i,1);
            }
        }
        console.log("disconnect");
    });
});


process.on('uncaughtException', function (err) {
    //We should certainly do something here :)
    console.log(err);
});


app.listen(3000);
