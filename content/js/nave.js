(function () {
    'use strict';
    var Nave = function Nave(game) {
        
        var player = this;
        this.game = game;
        
        this.shotsList = [];
        this.sucumbiu = false;
        this.atirou = false;
        this.shot = {};
        this.info = {
            id : (Math.random() * 1000).toFixed(2),
            top: parseInt(Math.random() * 350 + 100, 10),
            left: parseInt(Math.random() * 600 + 100, 10),
            degrees: 0,
            sucumbiu: false,
            nome: ''
        };
        
        this.init = function () {
            player.xMouse = 0;
            player.yMouse = 0;
            player.xPlayer = player.info.left;
            player.yPlayer = player.info.top;
            player.Degrees = 0;

            player.movendoEsquerda = false;
            player.movendoDireita = false;
            player.movendoCima = false;
            player.movendoBaixo = false;

            player.personagem = new Image();
            player.personagem.src = "/res/personagem.png";
        };
        
        this.reinit = function () {
            player.sucumbiu = false;
            player.info = {
                id : player.info.id,
                top: parseInt(Math.random() * 350 + 100, 10),
                left: parseInt(Math.random() * 600 + 100, 10),
                degrees: 0,
                sucumbiu: false,
                nome: player.info.nome
            };
            player.yPlayer = player.info.top;
            player.xPlayer = player.info.left;
            player.Degrees = player.info.degrees;
        };
        
        this.draw = function (context) {
            
            //desenha usuario
            context.save();
            if (player.info.sucumbiu) { context.globalAlpha = 0.5; }
            context.translate(player.xPlayer, player.yPlayer);
            context.textBaseline = "bottom";
            context.fillStyle = "white";
            context.textAlign = "center";
            context.fillText(player.info.nome, 0, -25);
            context.rotate(player.Degrees * Math.PI / 180);
            context.drawImage(player.personagem, -25, -25);
            context.restore();
            
            //desenha os tiros do usuario
            var i, max;
            for (i = 0, max = player.shotsList.length; i < max; i += 1) {
                player.shotsList[i].draw(context);
            }
        };
        
        this.update = function () {
            player.Degrees = calcHelper.calcAngle(player.xPlayer, player.yPlayer, player.xMouse, player.yMouse);
            
            player.info = {
                id: player.info.id,
                top: player.yPlayer,
                left: player.xPlayer,
                degrees: player.Degrees,
                sucumbiu: player.sucumbiu,
                nome: player.info.nome
            };
            
            player.handleMovement();
            
            player.testColision();
            
            var i, max;
            for (i = 0, max = player.shotsList.length; i < max; i += 1) {
                player.shotsList[i].update();
            }
        };

        
        this.testColision = function () {
            if (player.info.sucumbiu) { return; }

            var i, max, shot;
            for (i = 0, max = player.game.shotsList.length; i < max; i += 1) {
                shot = player.game.shotsList[i];
                if (shot.idNave !== player.info.id) {
                    if (shot.x + 50 > player.xPlayer - 3
                            && shot.x < player.xPlayer + 3
                            && shot.y + 50 > player.yPlayer - 3
                            && shot.y < player.yPlayer + 3) {
                        player.sucumbiu = true;
                        player.game.showModalMorte();
                    }
                }
            }
        };
        
        this.handleMovement = function () {
            if (player.info.sucumbiu) { return; }
            if (player.movendoEsquerda) {
                player.xPlayer -= 2;
            }
            if (player.movendoCima) {
                player.yPlayer -= 2;
            }
            if (player.movendoDireita) {
                player.xPlayer += 2;
            }
            if (player.movendoBaixo) {
                player.yPlayer += 2;
            }
        };
        
        this.mouseMove = function (event) {
            if (player.info.sucumbiu) { return; }
            player.xMouse = event.offsetX;
            player.yMouse = event.offsetY;
        };
        
        this.keyUp = function (event) {
            if (event.keyCode === 32 && player.atirou) {
                if (player.info.sucumbiu) { return; }
                player.shot = new Tiro(player)
                player.shotsList.push(player.shot);
                player.game.socket.emit('addTiro', player.shot);
                player.atirou = false;
            } else if (event.keyCode === 37 || event.keyCode === 65) {
                player.movendoEsquerda = false;
            } else if (event.keyCode === 38 || event.keyCode === 87) {
                player.movendoCima = false;
            } else if (event.keyCode === 39 || event.keyCode === 68) {
                player.movendoDireita = false;
            } else if (event.keyCode === 40 || event.keyCode === 83) {
                player.movendoBaixo = false;
            }
        };
        
        this.keyDown = function (event) {
            if ((event.keyCode === 32) && !player.atirou) {
                player.atirou = true;
            } else if (!player.movendoEsquerda && (event.keyCode === 37 || event.keyCode === 65) && player.xPlayer > 50) {
                player.movendoEsquerda = true;
            } else if (!player.movendoCima && (event.keyCode === 38 || event.keyCode === 87) && player.yPlayer > 50) {
                player.movendoCima = true;
            } else if (!player.movendoDireita && (event.keyCode === 39 || event.keyCode === 68) && player.xPlayer < 750) {
                player.movendoDireita = true;
            } else if (!player.movendoBaixo && (event.keyCode === 40 || event.keyCode === 83) && player.yPlayer < 550) {
                player.movendoBaixo = true;
            }
        };
    };
    window.Nave = Nave;
}());