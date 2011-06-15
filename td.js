var canvas = document.getElementById("foo")
var ctx = canvas.getContext("2d")

var Map = function(width, height, data) {
	this.width = width
	this.height = height
	this.data = data
}
Map.prototype.at = function(x, y) {
	return this.data[y].substr(x,1)
}
var map = new Map(10,10,[
	"oooooooooo",
	"s    oo  e",
	"oooo oo oo",
	"oooo oo oo",
	"o    oo oo",
	"o ooooo oo",
	"o     o oo",
	"ooooo o oo",
	"ooooo   oo",
	"oooooooooo"]
)
var scale = canvas.height/map.height
// Variable Variablen
var wave = 1
var life = 10
var score = 400

var colorTable = {
	"o" : "green",
	"s" : "violet",
	"e" : "red",
	" " : "brown"
}
var towerType = {
	"0" : "Grenade",
	"1" : "Laser",
	"2" : "Arrow"
}

function showMap() {
	for(var i=0;i<map.width;i++) {
		for(var k=0;k<map.width;k++) {
			ctx.fillStyle = colorTable[map.at(i,k)]
			ctx.fillRect(i*scale,k*scale,scale,scale)
		}
	}
}

var mob = []
var tower = []
var shot = []

function showTower() {
	ctx.fillStyle = "white"
	for(p in tower) {
		ctx.beginPath()
		ctx.arc(tower[p].x*scale,tower[p].y*scale,scale/3,0,7)
		ctx.fill()
		ctx.closePath()
	}
}

function checkPath() {
	for (p in mob) {
		//write(Math.floor(mob[0].x/scale))
		if (map.at(Math.floor(mob[p].x+1),Math.floor(mob[p].y)) == "o" && mob[p].vx > 0) {
			if (map.at(Math.floor(mob[p].x),Math.floor(mob[p].y+1)) == " ") {
				mob[p].vy = mob[p].vx
				mob[p].vx = 0
				//write(1)
				//write(" x: "+mob[p].vx+" y: "+mob[p].vy+" (X: "+Math.floor(mob[p].x)+" Y:"+Math.floor(mob[p].y)+" )")
			}
			if (map.at(Math.floor(mob[p].x),Math.floor(mob[p].y-1)) == " ") {
				mob[p].vy = - mob[p].vx
				mob[p].vx = 0
				//write(2)
				//write(" x: "+mob[p].vx+" y: "+mob[p].vy+" (X: "+Math.floor(mob[p].x)+" Y:"+Math.floor(mob[p].y)+" )")
			}
		}
		if (map.at(Math.floor(mob[p].x-1),Math.floor(mob[p].y)) == "o" && mob[p].vx < 0) {
			if (map.at(Math.floor(mob[p].x),Math.floor(mob[p].y+1)) == " ") {
				mob[p].vy = - mob[p].vx
				mob[p].vx = 0
				//write(3)
				//write(" x: "+mob[p].vx+" y: "+mob[p].vy+" (X: "+Math.floor(mob[p].x)+" Y:"+Math.floor(mob[p].y)+" )")
			}
			if (map.at(Math.floor(mob[p].x),Math.floor(mob[p].y-1)) == " ") {
				mob[p].vy = mob[p].vx
				mob[p].vx = 0
				//write(4)
				//write(" x: "+mob[p].vx+" y: "+mob[p].vy+" (X: "+Math.floor(mob[p].x)+" Y:"+Math.floor(mob[p].y)+" )")
			}
		}
		if (map.at(Math.floor(mob[p].x),Math.floor(mob[p].y-1)) == "o" && mob[p].vy < 0) {
			if (map.at(Math.floor(mob[p].x-1),Math.floor(mob[p].y)) == " ") {
				mob[p].vx = - mob[p].vy
				mob[p].vy = 0
				//write(5)
				//write(" x: "+mob[p].vx+" y: "+mob[p].vy+" (X: "+Math.floor(mob[p].x)+" Y:"+Math.floor(mob[p].y)+" )")
			}
			if (map.at(Math.floor(mob[p].x+1),Math.floor(mob[p].y)) == " ") {
				mob[p].vx = - mob[p].vy
				mob[p].vy = 0
				//write(6+" -- "+p)
				//write(" x: "+mob[p].vx+" y: "+mob[p].vy+" (X: "+Math.floor(mob[p].x)+" Y:"+Math.floor(mob[p].y)+" )")
			}
		}
		if (map.at(Math.floor(mob[p].x),Math.floor(mob[p].y+1)) == "o" && mob[p].vy > 0) {
			if (map.at(Math.floor(mob[p].x-1),Math.floor(mob[p].y)) == " " && Math.floor(mob[p].x-1) >= 0 ) {
				mob[p].vx = - mob[p].vy
				mob[p].vy = 0
				//write(7)
				//write(" x: "+mob[p].vx+" y: "+mob[p].vy+" (X: "+Math.floor(mob[p].x)+" Y:"+Math.floor(mob[p].y)+" )")
			}
			if (map.at(Math.floor(mob[p].x+1),Math.floor(mob[p].y)) == " ") {
				mob[p].vx = mob[p].vy
				mob[p].vy = 0
				//write(8)
				//write(" x: "+mob[p].vx+" y: "+mob[p].vy+" (X: "+Math.floor(mob[p].x)+" Y:"+Math.floor(mob[p].y)+" )")
			}
		}
	}
}

var oldT = new Date().getTime()
function moveStuff() {
	var t = new Date().getTime()
	var dT = (t-oldT)/1000
	for(var p in mob) {
		mob[p].x+=mob[p].vx*dT
		mob[p].y+=mob[p].vy*dT
	}
	for (var p in shot) {
		shot[p].x+=shot[p].vx*dT
		shot[p].y+=shot[p].vy*dT
	}
	oldT = t
	// Kill Shots
	for(var p=shot.length-1; p>=0; p--) {
		if (shot[p].explodes) {
			if (shot[p].explodes + 1000 > t) {
				shot.splice(p, 1)
			}
		} 
		else if (shot[p].x < 0 || shot[p].y < 0 || shot[p].x > map.width || shot[p].y > map.height) {
			shot.splice(p, 1)
		}
	}
	// Schuss richtig
	for (p in shot) {
		if (Math.sqrt(Math.pow(shot[p].dX,2)+Math.pow(shot[p].dY,2)) <= Math.sqrt(Math.pow(shot[p].x - shot[p].sX,2)+Math.pow(shot[p].y - shot[p].sY,2))) {
			explode(shot[p])
		}
	}
}

function checkDeath() {
	for(var p=mob.length-1; p>=0; p--) {
		if (mob[p].health <= 0) {
			setScore(mob[p].vx*mob[p].sHealth)
			mob.splice(p, 1)
		}
	}
}

function explode(shot) {
	shot.vX = 0
	shot.vY = 0
	shot.x = shot.sX+shot.dX
	shot.y = shot.sY+shot.dY
	shot.explodes = new Date().getTime()
	var res = near(shot.x, shot.y, shot.r)
	for (p in res) {
		res[p].health = res[p].health - shot.damage
	}
	//write(JSON.stringify(mob))
}

function showShot() {
	for (p in shot) {
		if (shot[p].type == 0) {
			ctx.fillStyle = "red"
			ctx.strokeStyle = "orange"
			ctx.beginPath()
			if (!shot[p].explodes) {
				ctx.arc(shot[p].x*scale,shot[p].y*scale,scale/7,0,7)
				ctx.fill()
			} else {
				ctx.arc(shot[p].x*scale,shot[p].y*scale,shot[p].r*scale,0,7)
				ctx.stroke()
			}
			ctx.closePath()
		} else if (shot[p].type == 1) {
			ctx.strokeStyle="blue"
			ctx.lineWith=4
			ctx.beginPath()
			ctx.moveTo(shot[p].sX*scale,shot[p].sY*scale)
			ctx.lineTo(shot[p].x*scale,shot[p].y*scale)
			ctx.stroke()
			ctx.closePath()
		} else if (shot[p].type == 2) {
			shot[p].x += shot[p].dX
			shot[p].y += shot[p].dY
			ctx.strokeStyle = "rgba(55,55,55,0.5)"
			ctx.strokeRect((shot[p].x-0.25)*scale,( shot[p].y-0.25)*scale, 20, 20)
			explode(shot[p])
			shot.splice(p, 1)
		}
	}
}

function showMob() {
	ctx.fillStyle = "yellow"
	ctx.strokeStyle = "blue"
	ctx.lineWidth = 2
	for (p in mob) {
		ctx.beginPath()
		ctx.arc(mob[p].x*scale,mob[p].y*scale,scale/3,0,7)
		ctx.fill()
		ctx.closePath()
		ctx.beginPath()
		ctx.arc(mob[p].x*scale, mob[p].y*scale, scale/3,
				0, Math.PI*2/mob[p].sHealth*mob[p].health)
		ctx.stroke()
		ctx.closePath()
	}
}

function near(x, y, r) {
	var res = []
	for(p in mob) {
		var dX = x - mob[p].x
		var dY = y - mob[p].y
		if(r>=Math.sqrt(Math.pow(dX,2)+Math.pow(dY,2))) {
			res.push(mob[p])
		}
	}
	return res
}

function shoot(tower,mob) {
	var dX = mob.x - tower.x
	var dY = mob.y - tower.y
	var dL = Math.sqrt(Math.pow(dX,2)+Math.pow(dY,2))
	if (tower.type == 0) {
		shot.push({
			"x" : tower.x,
			"sX" : tower.x,
			"dX" : dX,
			"y" : tower.y,
			"sY" : tower.y,
			"dY" : dY,
			"vx": dX / dL * tower.v,
			"vy": dY / dL * tower.v,
			"r" : tower.exR,
			"damage" : tower.damage,
			"type" : tower.type
		})
	} else if (tower.type == 1) {
		shot.push({
			"x" : tower.x,
			"sX" : tower.x,
			"dX" : dX,
			"y" : tower.y,
			"sY" : tower.y,
			"dY" : dY,
			"vx": dX / dL * tower.v,
			"vy": dY / dL * tower.v,
			"r" : tower.exR,
			"damage" : tower.damage,
			"type" : tower.type
		})
	} else if (tower.type == 2) {
		shot.push({
			"x" : tower.x,
			"sX" : tower.x,
			"dX" : dX,
			"y" : tower.y,
			"sY" : tower.y,
			"dY" : dY,
			"vx": 0,
			"vy": 0,
			"r" : tower.exR,
			"damage" : tower.damage,
			"type" : tower.type
		})
	}
}

function checkRange() {
	for (var p in tower) {
		var t = new Date().getTime()
		if (t - tower[p].delay > tower[p].lastShot) {
			shootAt = near(tower[p].x,tower[p].y,tower[p].r)
			if (shootAt.length > 0) {
				shoot(tower[p],shootAt[0])
				tower[p].lastShot = t
			}
		}
	}
}

function checkLife() {
	for (var p=mob.length-1; p>=0; p--) {
		if (mob[p].x > map.width) {
			life--
			mob.splice(p,1)
			updateStatus()
		}
	}
	if (life <= 0) {
		clearInterval(inter)
	}
}

function write(text) {
	document.getElementById("con").innerHTML+="<br>"+text
}

function updateStatus() {
	document.getElementById("wave").innerHTML=wave
	document.getElementById("life").innerHTML=life
	document.getElementById("score").innerHTML=Math.round(score)
}

function setScore(add) {
	score += add
	updateStatus()
}

function autoWave() {
	var setX = 0
	var setY = 0
	if (nextWave > new Date().getTime()) {
		return
	}
	var maxStrength = Math.pow(wave+2, 2)*10
	if (maxStrength >= spawnStrength) {
		var health = Math.random()*maxStrength
		var speed = 0.3+Math.random()*0.8
		for(var i=0;i<map.width;i++) {
			for(var k=0;k<map.width;k++) {
				if (map.at(i, k) == "s") {
					write(i+" "+k);
					setX = i + 0.5
					setY = k + 0.5
				}
			}
		}
		mob.push({
			x: setX,
			y: setY,
			vx: speed,
			vy: 0,
			health: health,
			sHealth: health
		})
		var strength = speed*health
		spawnStrength += strength
		nextWave = new Date().getTime()+300
	} else {
		if (!mob.length) {
			wave++
			updateStatus()
			spawnStrength = 0
			nextWave = new Date().getTime()+3000
		}
	}
}
var spawnStrength = 0
var nextWave = new Date().getTime()+3000

canvas.onclick = selectPlace

var selectedX = undefined
var selectedY = undefined
function selectPlace(e) {
	selectedX = Math.floor(e.offsetX/scale)+0.5
	selectedY = Math.floor(e.offsetY/scale)+0.5
}

function drawSelectedPlace() {
	if (map.at(selectedX-0.5,selectedY-0.5) == " ") {
		selectedX = undefined
		selectedY = undefined
	}
	ctx.strokeStyle = "white"
	ctx.lineWidth = 2
	ctx.strokeRect((selectedX-0.5)*scale,(selectedY-0.5)*scale,scale,scale)
	for (p in tower) {
		if (tower[p].x == selectedX && tower[p].y == selectedY) {
			ctx.strokeStyle="black"
			ctx.lineWidth=3
			ctx.beginPath()
			ctx.arc(selectedX*scale,selectedY*scale,tower[p].r*scale,0,7)
			ctx.stroke()
			ctx.closePath()
			showTowerInfo(tower[p])
		}
	}
	if (selectedX == undefined) {
		document.getElementById("stat").innerHTML="_.~<'^'>~._"
	}
}
var cost = 0
function showTowerInfo(tower) {
	if (tower.type == 0) {
		cost = 100 * tower.lvl
	}
	else if (tower.type == 1) {
		cost = 40 * tower.lvl
	}
	else if (tower.type == 2) {
		cost = 10 * tower.lvl
	}
	document.getElementById("stat").innerHTML="Type: "+towerType[tower.type]+" - Level: "+tower.lvl+" - Damage: "+tower.damage+" - Costs: "+cost
}

var uCost = 0
var damageIncer = 0
function placeTower(x, y, type) {
	for (p in tower) {
		if (tower[p].x == x && tower[p].y == y) {
			if (tower[p].type == 0) {
				uCost = 100 * tower[p].lvl
				damageIncer = tower[p].lvl*100
			} else if (tower[p].type == 1) {
				uCost = 40 * tower[p].lvl
				damageIncer = tower[p].lvl*40
			} else if (tower[p].type == 2) {
				uCost = 10 * tower[p].lvl
				damageIncer = tower[p].lvl*10
			}
			if (score >= uCost) {
				tower[p].damage += damageIncer
				score -= uCost
				updateStatus()
				tower[p].lvl++
			}
			return
		}
	}
	if (map.at(x-0.5, y-0.5) == "o" && score >= 200) {
		score -= 200
		updateStatus()
		tower.push({
			"x" : x,
			"y" : y,
			"v" : 8.5,
			"r" : 3,
			"exR" : 0.4,
			"delay" : 800,
			"lastShot" : 0,
			"damage" : 40,
			"lvl" : 1,
			"type" : type
		})
	}
}

function tick() {
	showMap()
	showMob()
	showTower()
	showShot()
	moveStuff()
	checkRange()
	checkDeath()
	checkLife()
	checkPath()
	autoWave()
	drawSelectedPlace()
	if (map.at(Math.floor(mob[0].x/scale), Math.floor(mob[0].y/scale)) == " ") {
		write(map.at(Math.floor(mob[0].x/scale), Math.floor(mob[0].y/scale)))	
	} 
}
var inter = setInterval(tick, 100)
write("end")
