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
        $(".game div.section").not("#"+key).hide();
        $(".game #"+key).show();
    }

    function doAction(key) {
        switch(key) {
            case 'start' :
                startGame();
                break;
            case 'reset' :
                status.hide();
                break;
            case 'hit' :
                loseOneLife();
                break;
            case 'heal' :
                giveOneLife();
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
            setLife(getLife()-1);
        }
    }

    function getOneLife() {
        setLife(getLife()+1);
    }
    
    /**
    * startGame
    * Débute le jeu
    **/
    function startGame() {
        status.show();
        setLife(3);
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

    $(".game div.section").not("#intro").hide();
    status.hide();

    function generateGame(json) {
        var html ="";
        for(var i = 0; i < json.phases.length ; i++) {

            html+= "<div class='section' id='";
            html+=json.phases[i].name;
            html+= "' style='display: none;'>";
            html+= json.phases[i].desc;

            if (json.phases[i].actions.length > 0) {
	            for(var k = 1; k<=json.phases[i].actions.length; k++) {
	                html+="<action name='";
	                html+=json.phases[i].actions[k-1].name;
	                html+="'/>";
	            }
	        }

            if (json.phases[i].buttons.length > 0) {
	            for(var j = 1; j<=json.phases[i].buttons.length; j++) {
	                html+="<button go='";
	                html+=json.phases[i].buttons[j-1].go;
	                html+="'>";
	                html+=json.phases[i].buttons[j-1].desc;
	                html+="</button>";
	            }
	        }
            html+="</div>";
        }
        $('div.game').append($(html));

        console.log("Game generated !");
    }

    $.getJSON("zombie.json", function(data){

        generateGame(data);

        buttons = $(".game button");

        buttons.click(function() {
            var goTo = $(event.target).attr("go");
            
            gotoSection(goTo);
            
            if($('.game #'+goTo).find('action').attr('name') != undefined ) {
                doAction($('#'+goTo).find('action').attr('name'));
            }
        });

        //TEMPORAIRE
        //$("#intro").show();
    });

    //CODE MENU
    $('.menu button').click(function(){
        
        var key = $(event.target).attr("go");

        if(key == "game") {
            $(".menu").slideUp(2000, function() {
                $(".game #intro").slideDown(2000);
            });
            
        }
    })
    
} );