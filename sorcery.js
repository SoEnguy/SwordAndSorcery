$( function() {

    //CODE JEU
    var buttons,
        status = $(".game #status"),
        life;

    /**
    * goToSection
    * Permet de changer de page
    *
    * parameter key Nom de la page à laquelle aller
    */
    function gotoSection(key) {
        localStorage.setItem("scene", key);
        localStorage.setItem("life", getLife());
        $(".game div.section").not("#"+key).hide();
        $(".game #"+key).show();
    }

    function doAction(key) {
        switch(key) {
            case 'start' :
                begin();
                break;
            case 'reset' :
                status.hide();
                break;
            case 'hit' :
                loseOneLife();
                break;
            case 'heal' :
                getOneLife();
            default :
                break;
        }
    }

    /**
    * getLife
    * Permet de connaitre la vie du joueur
    *
    * return Number life Retourne la vie du joueur
    **/
    function getLife() {
        return life;
    }

    /**
    * setLife
    * Permet de changer la vie du joueur
    *
    * parameter v Nouvelle valeur de la vie
    **/
    function setLife(v) {
        life = v;
        status.find("span").text(life);
    }
    
    /**
    * loseOneLife
    * Fait perdre 1 vie au joueur
    **/
    function loseOneLife() {
        if (getLife() == 1) {
            setLife(getLife()-1);
            endGame();
        } else {
            setLife(parseInt(getLife())-1);
        }
    }

    function getOneLife() {
        setLife(parseInt(getLife())+1);
    }
    
    /**
    * startGame
    * Débute le jeu
    **/
    function startGame(hp) {
        status.show();
        setLife(hp);
    }
    
    /**
    * endGame
    * Termine le jeu
    **/
    function endGame() {
        $(".game div.section").not("#death").hide();
        $(".game #death").show();
    }

    /**
    * hasAttr
    * Permet de connaitre le nom d'un attribut
    */
    $.fn.hasAttr = function(name) {
        var attr = $(this).attr(name);
        if (typeof attr !== typeof undefined && attr !== false) {
            return true;
        }
        return false;
    };

    function generateGame(json) {
        for(var i = 0; i < json.phases.length ; i++) {
            var gameBox = $("<div class='section' id='"+json.phases[i].name+"' style='display: none;'></div>");

            gameBox.text(json.phases[i].desc);
            
            if (json.phases[i].actions.length > 0) {
	            for(var k = 1; k<=json.phases[i].actions.length; k++) {
	                var action = $("<action name='" + json.phases[i].actions[k-1].name + "'/>");
                    gameBox.append(action);
	            }
	        }
            if (json.phases[i].buttons.length > 0) {
	            for(var j = 1; j<=json.phases[i].buttons.length; j++) {
	                var button = $("<button go='" + json.phases[i].buttons[j-1].go + "'>" + json.phases[i].buttons[j-1].desc + "</button>");
                    gameBox.append(button);
	            }
	        }
            $('div.game').append(gameBox);
        }
        startGame(json.start_life);
    }

    function generateInventory(){
        var table = $("#inventory table");

        for (var i = 0; i < 5 ; i++) {
            var newline = $("<tr></tr>");
            for (var j = 0; j < 5; j++) {
                newline.append("<td>X</td>");
            }
            table.append(newline);
        }
    }

    function begin(game, callback) {
        $.getJSON(game+".json", function(data){
            generateGame(data);
            buttons = $(".game button");
            buttons.click(function(event) {
                var goTo = $(event.target).attr("go");
                gotoSection(goTo);
                if($('.game #'+goTo).find('action').attr('name') != undefined ) {
                    doAction($('#'+goTo).find('action').attr('name'));
                }
            });
            callback();
        });
    }

    //CODE MENU
    $('.menu button').click(function(event){
        var key = $(event.target).attr("go");
        
        switch(key) {
            case 'game' :
                $(".menu").slideUp(2000, function() {
                    $(".game #select-game").slideDown(2000); 
                });
                break;
            case 'load' :
                var scene = localStorage.getItem("scene");
                var hp = localStorage.getItem("life");

                $(".menu").slideUp(2000, function() {
                    begin(function(){
                        $(".game #"+scene).slideDown(2000);
                        setLife(hp);
                    });
                });
                break;
            case 'credits' :
                $(".menu").slideUp(2000, function() {
                    $(".credits").slideDown(2000); 
                });
                break;
        }
    })

    $("#select-game button").click(function(event){
        var key = $(event.target).attr("play");
        switch(key) {
            case 'base' :
                $("#select-game").slideUp(2000, function() {
                    begin("game", function(){
                        $(".game #intro").slideDown(2000); 
                    });
                });
                break
            case 'zombie':
                $("#select-game").slideUp(2000, function() {
                    begin("zombie", function(){
                        $(".game #intro").slideDown(2000); 
                    });
                });
                break;
        }
    });

    $(".game div.section").not("#intro").hide();
    $(".credits").hide();
    $(".game #select-game").hide();
    status.hide();
    generateInventory();
} );