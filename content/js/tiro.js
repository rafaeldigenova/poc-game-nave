(function () {
    'use strict';
    var Tiro = function (nave) {
        
        var shot = this;
        
        this.xAuxMov = 1;
        this.yAuxMov = 1;
        this.targetX = nave.xMouse;
        this.targetY = nave.yMouse;
        this.movementFraction = calcHelper.calcMovement(nave.xMouse, nave.yMouse, nave.xPlayer, nave.yPlayer);
        this.d = calcHelper.Movement(this.movementFraction);
        
        this.x = nave.xPlayer;
        this.y = nave.yPlayer;
        
        this.height = 11;
        this.width = 50;
        
        this.degrees = calcHelper.calcAngle(this.x, this.y, this.targetX, this.targetY);
        this.image = new Image();
        this.image.src = "/res/tiro.png";
        this.idNave = nave.info.id;

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
        this.draw = function (context) {
            context.save();
            context.translate(shot.x, shot.y);
            context.rotate(shot.degrees * Math.PI / 180);
            context.drawImage(shot.image, 0, 0, 50, 11, 0, -7, 25, 6);
            context.drawImage(shot.image, 0, 0, 50, 11, 0, +3, 25, 6);
            context.restore();
        };
        this.update = function () {
            if (this.xAuxMove === -1) {
                this.x -= this.d[0];
            } else if (this.xAuxMove === 1) {
                this.x += this.d[0];
            }
            if (this.yAuxMove === -1) {
                this.y -= this.d[1];
            } else if (this.yAuxMove === 1) {
                this.y += this.d[1];
            }
        };
    };
    window.Tiro = Tiro;
}());