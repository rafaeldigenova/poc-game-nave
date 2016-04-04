(function () {
    'use strict';
    var naveHelper = {
        personagem: new Image(),
        
        draw: function (context, info) {
            context.save();
            if (info.sucumbiu) { context.globalAlpha = 0.5; }
            context.translate(info.left, info.top);
            context.textBaseline = "bottom";
            context.fillStyle = "white";
            context.textAlign = "center";
            context.fillText(info.nome, 0, -25);
            context.rotate(info.degrees * Math.PI / 180);
            context.drawImage(naveHelper.personagem, -25, -25);
            context.restore();
        },
        update: function () {
            
        },
        init: function () {
            naveHelper.personagem.src = "/res/personagem.png";
        }
    };
    naveHelper.init();
    window.naveHelper = naveHelper;
}());