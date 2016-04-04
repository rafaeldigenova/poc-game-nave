(function () {
    'use strict';
    var game = {
        socket : io(),
        playersPositions : [],
        shotsList : [],
        users: [],
        
        nave: {},
        
        //loop vars
        now: Date.now(),
        elapsed : 0,
        fpsInterval : 1000 / 40,
        then: Date.now(),
                
        addEvents: function () {
            var confirmaNome = document.getElementById("confirma-nome"),
                reiniciarJogo = document.getElementById("reiniciar-jogo");
            
            confirmaNome.onclick = function () {
                game.nave = new window.Nave(game);
                game.nave.info.nome = document.getElementById("confirma-nome-text").value;
                document.getElementById("modal").style.display = "none";
                game.configSocket();
            };

            reiniciarJogo.onclick = function () {
                game.reinit();
                document.getElementById("modal-form").style.display = "none";
                document.getElementById("modal").style.display = "none";
                document.getElementById("sucumbiu").style.display = "none";
            };
        },
        configSocket: function () {
            game.socket.emit('novousuario', game.nave.info);

            game.socket.on('novousuario', function (info) {
                game.users.push(info);
            });

            game.socket.on('updatePosition', function (info) {
                var i, max;
                for (i = 0, max = game.users.length; i < max; i += 1) {
                    if (game.users[i].id === info.id) {
                        game.users[i] = info;
                    }
                }
            });

            game.socket.on('reconnect', function () {
                game.socket.emit('novousuario', game.nave.info);
            });

            game.socket.on('atualizausuarios', function (usersServer) {
                game.users = [];
                var i, max;
                for (i = 0, max = usersServer.length; i < max; i += 1) {
                    if (usersServer[i].id !== game.nave.info.id) {
                        game.users.push(usersServer[i]);
                    }
                }
            });
            game.socket.on('addTiro', function (tiro) {
                tiro.image = new Image();
                tiro.image.src = "/res/tiro.png";
                game.shotsList.push(tiro);
            });

            game.init();
        },
        reinit: function () {
            game.nave.reinit();
        },
        init: function () {
            game.canvas = document.getElementById('meuCanvas');
            game.context = game.canvas.getContext('2d');
            game.canvas.addEventListener('mousemove', game.mouseMove);

            window.addEventListener('keydown', game.keyDown);
            window.addEventListener('keyup', game.keyUp);

            game.fundo = new Image();
            game.fundo.src = "/res/fundo.png";     
            
            game.nave.init();
            
            game.loop();
        },
        loop: function () {
            window.requestAnimationFrame(game.loop);

            game.now = Date.now();
            game.elapsed = game.now - game.then;

            if (game.elapsed > game.fpsInterval) {
                game.then = game.now - (game.elapsed % game.fpsInterval);

                game.update();
                game.draw();
            }
        },
        update: function () {
            game.nave.update();

            var i, max;
            for (i = 0, max = game.shotsList.length; i < max; i += 1) {
                tiroHelper.update(game.shotsList[i]);
            }
            
            game.socket.emit('updatePosition', game.nave.info);

            if (game.nave.info.sucumbiu) { return; }

            game.cleanShotsList();
        },
        showModalMorte: function () {
            setTimeout(function () {
                document.getElementById("modal-form").style.display = "none";
                document.getElementById("modal").style.display = "block";
                document.getElementById("sucumbiu").style.display = "block";
            }, 1000);
        },
        cleanShotsList: function () {
            var i, max, shot;
            for (i = 0, max = game.shotsList.length; i < max; i += 1) {
                shot = game.shotsList[i];
                if (shot.x > 800 || shot.x < -100) { game.shotsList.splice(i, 1); return; }
                if (shot.y > 600 || shot.y < -100) { game.shotsList.splice(i, 1); return; }
            }
        },
        draw: function () {
            game.context.drawImage(game.fundo, 0, 0);

            var i, max, user;
            for (i = 0, max = game.shotsList.length; i < max; i += 1) {
                tiroHelper.draw(game.context, game.shotsList[i]);
            }
            
            game.nave.draw(game.context);
            
            for (i = 0, max = game.users.length; i < max; i += 1) {
                naveHelper.draw(game.context, game.users[i]);
            }
        },
        mouseMove: function (event) {
            game.nave.mouseMove(event);
        },
        keyUp: function (event) {
            game.nave.keyUp(event);
        },
        keyDown: function (event) {
            game.nave.keyDown(event);
        }
    };

    game.addEvents();
}());