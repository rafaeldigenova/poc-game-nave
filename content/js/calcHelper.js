(function () {
    'use strict';
    var calcHelper = {
        calcMovement: function (xMouse, yMouse, xPlayer, yPlayer) {
            this.returnMovement = [];
            if (xMouse > xPlayer && yMouse > yPlayer) {
                if ((yMouse - yPlayer) > (xMouse - xPlayer)) {
                    this.returnMovement = [(yMouse - yPlayer) / (xMouse - xPlayer), 1];
                } else {
                    this.returnMovement = [(xMouse - xPlayer) / (yMouse - yPlayer), 2];
                }
            } else if (xMouse < xPlayer && yMouse > yPlayer) {
                if ((yMouse - yPlayer) > (xPlayer - xMouse)) {
                    this.returnMovement = [(yMouse - yPlayer) / (xPlayer - xMouse), 1];
                } else {
                    this.returnMovement = [(xPlayer - xMouse) / (yMouse - yPlayer), 2];
                }
            } else if (xMouse > xPlayer && yMouse < yPlayer) {
                if ((yPlayer - yMouse) > (xMouse - xPlayer)) {
                    this.returnMovement = [(yPlayer - yMouse) / (xMouse - xPlayer), 1];
                } else {
                    this.returnMovement = [(xMouse - xPlayer) / (yPlayer - yMouse), 2];
                }
            } else if (xMouse < xPlayer && yMouse < yPlayer) {
                if ((yPlayer - yMouse) > (xPlayer - xMouse)) {
                    this.returnMovement = [(yPlayer - yMouse) / (xPlayer - xMouse), 1];
                } else {
                    this.returnMovement = [(xPlayer - xMouse) / (yPlayer - yMouse), 2];
                }
            }
            return this.returnMovement;
        },
        calcAngle: function (x, y, x2, y2) {
            this.catetoA =  x2 - x;
            this.catetoO =  y2 - y;
            return Math.atan2(this.catetoO, this.catetoA) * 180 / Math.PI;
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
        }
    };
    window.calcHelper = calcHelper;
}());