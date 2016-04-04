(function () {
    'use strict';
    var server = {
        
        //loop vars
        now: Date.now(),
        then: Date.now(),
        elapsed: 0,
        fpsInterval: 1000 / 15,
        
        init: function () {
            setInterval(server.loop, server.fpsInterval);
        },
        loop: function () {
            server.now = Date.now();
            server.elapsed = server.now - server.then;

            if (server.elapsed > server.fpsInterval) {
                server.then = server.now - (server.elapsed % server.fpsInterval);

                server.update();
            }
        },
        update: function () {
            
        }
    };
    
    server.init();
}());