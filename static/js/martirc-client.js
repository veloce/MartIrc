/**
* Main client constructor
*
* @contructor
*
*/
MartIrcClient = function(options) {
    if (! (this instanceof arguments.callee)) {
        return new arguments.callee(arguments);
    }

    var self = this;

    self.ircConnection = null;

    self.init();
};


/**
* MartIrc init
*
*/
MartIrcClient.prototype.init = function() {
    var self = this;

    $('#connectButton').click(function() {

        if(self.ircConnection && self.ircConnection.connected()){
            self.ircConnection.disconnect();
        }

        self.doPage(
            $('#nodeServerHost').val(),parseInt($('#nodeServerPort').val())
            , $('#ircServerHost').val(),parseInt($('#ircServerPort').val())
            , $('#nickname').val()
            );
    });
};


MartIrcClient.prototype.doPage = function (nodeServerHost, nodeServerPort, ircServerHost, ircServerPort, nickname)
{
    self.ircConnection = new IrcConnection({
        nodeServerHost: nodeServerHost
        , nodeServerPort: nodeServerPort
        , ircServerHost: ircServerHost
        , ircServerPort: ircServerPort
        , nickname: nickname
    });

    $(self.ircConnection).bind('irc.notice',function(event, data) { 

        console.log('Notice: ' + data.raw);
    });

}