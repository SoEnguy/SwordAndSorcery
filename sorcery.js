$( function() {

    //CODE JEU
    var buttons,
        status = $(".game #status"),
        life,
        hungerActivated = false,
        hungerLevel = 0;

    /**
    * goToSection
    * Permet de changer de page
    *
    * parameter key Nom de la page à laquelle aller
    */
    function gotoSection(key) {
        if (getLife() == 0) { endGame(); }
        localStorage.setItem("scene", key);
        localStorage.setItem("life", getLife());
        setHunger(hungerLevel-1);
        localStorage.setItem("hunger", getHunger());
        $(".game div.section:visible").not("#"+key).hide();
        $(".game #"+key).show();

        var bg = $(".game #"+key).find("bg").attr("value");
        
        $("body").css('background', 'url(images/'+ bg + '.png)');
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
                break;
            case 'death' :
                setLife(0);
                break;
            case 'feed':
                setHunger(hungerLevel +=10);
                break;
            case 'talk':
                hungerLevel +=1;
                break;
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

    function getHunger(){
        return hungerLevel;
    }

    /**
    * setLife
    * Permet de changer la vie du joueur
    *
    * parameter v Nouvelle valeur de la vie
    **/
    function setLife(v) {
        life = v;
        status.find(".life span").text(life);
    }
    
    function setHunger(v) {
        hungerLevel = v;
        status.find(".hunger span").text(hungerLevel);
    }

    /**
    * loseOneLife
    * Fait perdre 1 vie au joueur
    **/
    function loseOneLife() {
        setLife(parseInt(getLife())-1);
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
        if(hungerActivated) {
            setHunger(10);
        }
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

            gameBox.append($("<bg value='"+json.phases[i].background+"'/>"))

            $('div.game').append(gameBox);

        }
        hungerActivated = json.hunger;
        if (hungerActivated) {
            hungerLevel = json.hunger_level;
        }

        $(".section button").hover(
            function(){
                $(this).prepend($('<img src="hand.png">'));
            }, function(){
                $(this).find("img:first").remove();
            }
        );

        startGame(json.start_life);
    }

    function begin(game, callback) {
        $.getJSON(game+".json", function(data){
            generateGame(data);
            buttons = $(".game button");
            buttons.click(function(event) {
                var goTo = $(event.target).attr("go");
                gotoSection(goTo);
                if($('.game #'+goTo).find('action').attr('name') != undefined ) {
                    $('#'+goTo).find('action').each(function(i, elem){
                        doAction($(this).attr('name'));
                    });
                    
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
                $(".menu").slideUp(1000, function() {
                    $(".game #select-game").slideDown(1000); 
                });
                break;
            case 'load' :
                var scene = localStorage.getItem("scene");
                var hp = localStorage.getItem("life");
                var hunger = localStorage.getItem("life");

                $(".menu").slideUp(1000, function() {
                    begin(function(){
                        $(".game #"+scene).slideDown(1000);
                        setLife(hp);
                        setHunger(hunger);
                    });
                });
                break;
            case 'credits' :
                $(".menu").slideUp(1000, function() {
                    $(".credits").slideDown(1000); 
                });
                break;
            case 'create':
                $(".menu").slideUp(1000, function() {
                    $(".create-game").slideDown(1000); 
                });
                break;
        }
    })

    $("#select-game button").click(function(event){
        var key = $(event.target).attr("play");
        switch(key) {
            case 'base' :
                $("#select-game").slideUp(1000, function() {
                    begin("game", function(){
                        $(".game #intro").slideDown(1000); 
                    });
                });
                break
            case 'zombie':
                $("#select-game").slideUp(1000, function() {
                    begin("zombie", function(){
                        $(".game #intro").slideDown(1000); 
                    });
                });
                break;
        }
    });

    $("button").hover(
        function(){
            $(this).prepend($('<img src="pac1.gif">'));
        }, function(){
            $(this).find("img:first").remove();
        }
    );

    $(".game div.section").not("#intro").hide();
    $(".create-game").hide();
    $(".credits").hide();
    $(".game #select-game").hide();

    status.hide();
} );