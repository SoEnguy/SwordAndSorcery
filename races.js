/**
* getRacesList
* Retourne la liste des races (strings dans un array)
* return Array
**/
function getRacesList(){
	var list = ['orc', 'humain'];

	return list;
}

/**
* TODO
* getRace
* Lis, et retourne, la race du joueur depuis le localstorage
* return String
**/
function getRace(){
	return;
}

/**
* TODO
* setRace
* Change la race du joueur dans le localstorage
* parameter String race
**/
function setRace(race){

}

function getRaceSpec(race) {
	
	var orc = {name:'orc', 
		sizeMax:250, sizeMin: 210, 
		str: 3, dex: 0, con: 2, int: -3, cha: -2, sag: -1};

	var humain = {name:'humain',
		sizeMax:205, sizeMin:170,
		str: 0, dex: 0, con: 0, int: 0, cha: 0, sag: 0};

	var raceList = [orc, humain],
		raceReturn = null;

	for (var i = raceList.length - 1; i >= 0; i--) {
		if(raceList[i].name == race) {
			raceReturn = raceList[i];
		}
	}

	return raceReturn;
}