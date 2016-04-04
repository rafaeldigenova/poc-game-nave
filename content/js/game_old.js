(function () {
    'use strict';
    var player = {
        socket : io(),
        users : [],
        positions : [],
        shotsList : [],
        sucumbiu : false,
        atirou : false,
        now: Date.now(),
        elapsed : 0,
        fpsInterval : 1000 / 40,
        then: Date.now(),
        shot : {},
        info : {
            id : (Math.random() * 1000).toFixed(2),
            top: parseInt(Math.random() * 350 + 100, 10),
            left: parseInt(Math.random() * 600 + 100, 10),
            degrees: 0,
            sucumbiu: false,
            nome: ''
        },
        addEvents: function () {
            var confirmaNome = document.getElementById("confirma-nome"),
                reiniciarJogo = document.getElementById("reiniciar-jogo");
            
            confirmaNome.onclick = function () {
                player.info.nome = document.getElementById("confirma-nome-text").value;
                document.getElementById("modal").style.display = "none";
                player.configSocket();
            };

            reiniciarJogo.onclick = function () {
                player.reinit();
                document.getElementById("modal-form").style.display = "none";
                document.getElementById("modal").style.display = "none";
                document.getElementById("sucumbiu").style.display = "none";
            };
        },
        configSocket: function () {
            player.socket.emit('novousuario', player.info);

            player.socket.on('novousuario', function (info) {
                player.users.push(info);
            });

            player.socket.on('updatePosition', function (info) {
                var i, max;
                for (i = 0, max = player.users.length; i < max; i += 1) {
                    if (player.users[i].id === info.id) {
                        player.users[i] = info;
                    }
                }
            });

            player.socket.on('reconnect', function () {
                player.socket.emit('novousuario', player.info);
            });

            player.socket.on('atualizausuarios', function (usersServer) {
                player.users = [];
                var i, max;
                for (i = 0, max = usersServer.length; i < max; i += 1) {
                    if (usersServer[i].id !== player.info.id) {
                        player.users.push(usersServer[i]);
                    }
                }
            });
            player.socket.on('addTiro', function (tiro) {
                tiro.image = new Image();
                tiro.image.src = "/res/tiro.png";
                player.shotsList.push(tiro);
            });

            player.init();
        },
        reinit: function () {
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
        },
        init: function () {
            player.canvas = document.getElementById('meuCanvas');
            player.context = player.canvas.getContext('2d');
            player.canvas.addEventListener('mousemove', player.mouseMove);

            window.addEventListener('keydown', player.keyDown);
            window.addEventListener('keyup', player.keyUp);

            player.xMouse = 0;
            player.yMouse = 0;
            player.xPlayer = player.info.left;
            player.yPlayer = player.info.top;
            player.Degrees = 0;

            player.movendoEsquerda = false;
            player.movendoDireita = false;
            player.movendoCima = false;
            player.movendoBaixo = false;

            player.fundo = new Image();
            player.fundo.src = "/res/fundo.png";

            player.personagem = new Image();
            player.personagem.src = "/res/personagem.png";

            player.loop();
        },
        loop: function () {
            window.requestAnimationFrame(player.loop);

            player.now = Date.now();
            player.elapsed = player.now - player.then;

            if (player.elapsed > player.fpsInterval) {
                player.then = player.now - (player.elapsed % player.fpsInterval);

                player.update();
                player.draw();
            }
        },
        update: function () {
            player.Degrees = player.calcAngle(player.xPlayer, player.yPlayer, player.xMouse, player.yMouse);
            var i, max;
            for (i = 0, max = player.shotsList.length; i < max; i += 1) {
                if (player.shotsList[i].xAuxMove === -1) {
                    player.shotsList[i].x -= player.shotsList[i].d[0];
                } else if (player.shotsList[i].xAuxMove === 1) {
                    player.shotsList[i].x += player.shotsList[i].d[0];
                }
                if (player.shotsList[i].yAuxMove === -1) {
                    player.shotsList[i].y -= player.shotsList[i].d[1];
                } else if (player.shotsList[i].yAuxMove === 1) {
                    player.shotsList[i].y += player.shotsList[i].d[1];
                }
            }

            player.info = {
                id: player.info.id,
                top: player.yPlayer,
                left: player.xPlayer,
                degrees: player.Degrees,
                sucumbiu: player.sucumbiu,
                nome: player.info.nome
            };
            player.socket.emit('updatePosition', player.info);

            player.handleMovement();

            if (player.info.sucumbiu) { return; }

            player.testColision();
            player.cleanShotsList();
        },
        testColision: function () {
            if (player.info.sucumbiu) { return; }

            var i, max, shot;
            for (i = 0, max = player.shotsList.length; i < max; i += 1) {
                shot = player.shotsList[i];
                if (shot.idNave !== player.info.id) {
                    if (shot.x + 50 > player.xPlayer - 3
                            && shot.x < player.xPlayer + 3
                            && shot.y + 50 > player.yPlayer - 3
                            && shot.y < player.yPlayer + 3) {
                        player.sucumbiu = true;
                        player.showModalMorte();
                    }
                }
            }
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
            for (i = 0, max = player.shotsList.length; i < max; i += 1) {
                shot = player.shotsList[i];
                if (shot.x > 800 || shot.x < -100) { player.shotsList.splice(i, 1); return; }
                if (shot.y > 600 || shot.y < -100) { player.shotsList.splice(i, 1); return; }
            }
        },
        draw: function () {
            player.context.drawImage(player.fundo, 0, 0);

            var i, max, shot, user = {};
            for (i = 0, max = player.shotsList.length; i < max; i += 1) {
                shot = player.shotsList[i];
                player.context.save();
                player.context.translate(shot.x, shot.y);
                player.context.rotate(shot.degrees * Math.PI / 180);
                player.context.drawImage(shot.image, 0, 0, 50, 11, 0, -7, 25, 6);
                player.context.drawImage(shot.image, 0, 0, 50, 11, 0, +3, 25, 6);
                player.context.restore();
            }

            player.context.save();
            if (player.info.sucumbiu) { player.context.globalAlpha = 0.5; }
            player.context.translate(player.xPlayer, player.yPlayer);
            player.context.textBaseline = "bottom";
            player.context.fillStyle = "white";
            player.context.textAlign = "center";
            player.context.fillText(player.info.nome, 0, -25);
            player.context.rotate(player.Degrees * Math.PI / 180);
            player.context.drawImage(player.personagem, -25, -25);
            player.context.restore();
 
            for (i = 0, max = player.users.length; i < max; i += 1) {
                user = player.users[i];
                player.context.save();
                if (user.sucumbiu) { player.context.globalAlpha = 0.5; }
                player.context.translate(user.left, user.top);
                player.context.textBaseline = "bottom";
                player.context.fillStyle = "white";
                player.context.textAlign = "center";
                player.context.fillText(user.nome, 0, -25);
                player.context.rotate(user.degrees * Math.PI / 180);
                player.context.drawImage(player.personagem, -25, -25);
                player.context.restore();
            }
        },
        calcAngle: function (x, y, x2, y2) {
            this.catetoA =  x2 - x;
            this.catetoO =  y2 - y;
            return Math.atan2(this.catetoO, this.catetoA) * 180 / Math.PI;
        },
        mouseMove: function (evt) {
            if (player.info.sucumbiu) { return; }
            player.xMouse = evt.offsetX;
            player.yMouse = evt.offsetY;
        },
        tiro: function (xMouse, yMouse, degrees) {
            this.xAuxMov = 1;
            this.yAuxMov = 1;
            this.targetX = xMouse;
            this.targetY = yMouse;
            this.movementFraction = player.calcMovement();
            this.d = player.Movement(this.movementFraction);
            this.x = player.xPlayer;
            this.y = player.yPlayer;
            this.height = 11;
            this.width = 50;
            this.degrees = player.calcAngle(this.x, this.y, this.targetX, this.targetY);
            this.image = new Image();
            this.image.src = "/res/tiro.png";
            this.idNave = player.info.id;

            if (this.x > this.targetX) {
                this.xAuxMove = -1;
            } else if (this.x < this.targetX) {
                this.xAuxMove = 1;
            }

            if (this.y > this.targetY) {
                this.yAuxMove = -1;
            } else if (this.y < this.targetY) {
                this.yAuxMove = 1;
            }

            player.socket.emit('addTiro', this);
        },
        Movement: function (movementFraction) {
            this.resultMovement = [];
            if (movementFraction[1] === 1) {
                this.resultMovement[0] = 5 / movementFraction[0];
                this.resultMovement[1] = this.resultMovement[0] * movementFraction[0];
                return this.resultMovement;
            } else {
                this.resultMovement[1] = 5 / movementFraction[0];
                this.resultMovement[0] = this.resultMovement[1] * movementFraction[0];
                return this.resultMovement;
            }
        },
        calcMovement: function () {
            this.returnMovement = [];
            if (player.xMouse > player.xPlayer && player.yMouse > player.yPlayer) {
                if ((player.yMouse - player.yPlayer) > (player.xMouse - player.xPlayer)) {
                    this.returnMovement = [(player.yMouse - player.yPlayer) / (player.xMouse - player.xPlayer), 1];
                } else {
                    this.returnMovement = [(player.xMouse - player.xPlayer) / (player.yMouse - player.yPlayer), 2];
                }
            } else if (player.xMouse < player.xPlayer && player.yMouse > player.yPlayer) {
                if ((player.yMouse - player.yPlayer) > (player.xPlayer - player.xMouse)) {
                    this.returnMovement = [(player.yMouse - player.yPlayer) / (player.xPlayer - player.xMouse), 1];
                } else {
                    this.returnMovement = [(player.xPlayer - player.xMouse) / (player.yMouse - player.yPlayer), 2];
                }
            } else if (player.xMouse > player.xPlayer && player.yMouse < player.yPlayer) {
                if ((player.yPlayer - player.yMouse) > (player.xMouse - player.xPlayer)) {
                    this.returnMovement = [(player.yPlayer - player.yMouse) / (player.xMouse - player.xPlayer), 1];
                } else {
                    this.returnMovement = [(player.xMouse - player.xPlayer) / (player.yPlayer - player.yMouse), 2];
                }
            } else if (player.xMouse < player.xPlayer && player.yMouse < player.yPlayer) {
                if ((player.yPlayer - player.yMouse) > (player.xPlayer - player.xMouse)) {
                    this.returnMovement = [(player.yPlayer - player.yMouse) / (player.xPlayer - player.xMouse), 1];
                } else {
                    this.returnMovement = [(player.xPlayer - player.xMouse) / (player.yPlayer - player.yMouse), 2];
                }
            }
            return this.returnMovement;
        },
        handleMovement: function () {
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
        },
        keyUp: function (event) {
            if (event.keyCode === 32) {
                if (player.info.sucumbiu) { return; }
                player.shotsList.push(new player.tiro(player.xMouse, player.yMouse, null));
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
        },
        keyDown: function (event) {
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
        }
    };

    player.addEvents();
}());