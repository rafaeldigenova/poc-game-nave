(function () {
    'use strict';
    var tiroHelper = {
        image: new Image(),
        
        draw: function (context, shot) {
            context.save();
            context.translate(shot.x, shot.y);
            context.rotate(shot.degrees * Math.PI / 180);
            context.drawImage(tiroHelper.image, 0, 0, 50, 11, 0, -7, 25, 6);
            context.drawImage(tiroHelper.image, 0, 0, 50, 11, 0, +3, 25, 6);
            context.restore();
        },
        update: function (shot) {
            if (shot.xAuxMove === -1) {
                shot.x -= shot.d[0];
            } else if (shot.xAuxMove === 1) {
                shot.x += shot.d[0];
            }
            if (shot.yAuxMove === -1) {
                shot.y -= shot.d[1];
            } else if (shot.yAuxMove === 1) {
                shot.y += shot.d[1];
            }
        },
        init: function () {
            tiroHelper.image.src = "/res/tiro.png";
        }
    };
    tiroHelper.init();
    window.tiroHelper = tiroHelper;
}());