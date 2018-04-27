// COLORS
const RED = 'rgba(255, 0, 0, 1)';
const BLUE = 'rgba(0, 0, 255, 1)';
const GREEN = 'rgba(0, 255, 0, 1)';
const CYAN = 'rgba(0, 255, 255, 1)';
const YELLOW = 'rgba(255, 255, 0, 1)';
const PURPLE = 'rgba(200, 150, 250, 1)';
const WHITE = 'rgba(255, 255, 255, 1)';
const BLACK = 'rgba(0, 0, 0, 1)';

// INITIALIZE CANVAS
var msn = document.getElementById('msn');
var canvas = document.getElementById('my-canvas');
var width  = canvas.width  = 600;
var height = canvas.height = 600;
var context = canvas.getContext('2d');
var audio = document.getElementById('theme');
var deaths = 0;
var enable_to_play = false;
var points = document.getElementById('points');
var btn_iniciar = document.getElementById('iniciar');
var btn_continuar = document.getElementById('continuar');

var random = function(min, max) {
	return Math.abs(Math.floor(Math.random() * max + min));
}
var eraseCanvasIn = function(x, y, w, h) {
	context.clearRect(x, y, w, h);
}
var writeMSN = function(m, seconds) {
	msn.innerHTML = m;
	msn.style.display = 'block';
	setTimeout(function(){
		msn.style.display = 'none';
	}, 1000 * seconds);
}
var drawObject = function(img, x, y, w, h) {
	context.fillRect(x, y, w, h);
}
var collition = function(obj1, obj2) {
	var y_m_1 = obj1.y;
	var y_M_1 = obj1.y + obj1.height;
	var x_m_1 = obj1.x;
	var x_M_1 = obj1.x + obj1.width;

	var y_m_2 = obj2.y;
	var y_M_2 = obj2.y + obj2.height;
	var x_m_2 = obj2.x;
	var x_M_2 = obj2.x + obj2.width;

	// CORNER TOP-LEFT (2) INTO (1)
	if((x_m_1 <= x_m_2 && x_m_2 < x_M_1) && (y_m_1 <= y_m_2 && y_m_2 < y_M_1)) {
		return true;
	}
	// CORNER TOP-RIGHT (2) INTO (1)
	if((x_m_1 < x_M_2 && x_M_2 <= x_M_1) && (y_m_1 <= y_m_2 && y_m_2 < y_M_1)) {
		return true;
	}
	// CORNER BOTTOM-LEFT (2) INTO (1)
	if((x_m_1 <= x_m_2 && x_m_2 < x_M_1) && (y_m_1 < y_M_2 && y_M_2 <= y_M_1)) {
		return true;
	}
	// CORNER BOTTOM-RIGHT (2) INTO (1)
	if((x_m_1 < x_M_2 && x_M_2 <= x_M_1) && (y_m_1 < y_M_2 && y_M_2 <= y_M_1)) {
		return true;
	}

	// ------------------------------------------------------------------------------------------------------------

	// CORNER TOP-LEFT (1) INTO (2)
	if((x_m_2 <= x_m_1 && x_m_1 < x_M_2) && (y_m_2 <= y_m_1 && y_m_1 < y_M_2)) {
		return true;
	}
	// CORNER TOP-RIGHT (1) INTO (2)
	if((x_m_2 < x_M_1 && x_M_1 <= x_M_2) && (y_m_2 <= y_m_1 && y_m_1 < y_M_2)) {
		return true;
	}
	// CORNER BOTTOM-LEFT (1) INTO (2)
	if((x_m_2 <= x_m_1 && x_m_1 < x_M_2) && (y_m_2 < y_M_1 && y_M_1 <= y_M_2)) {
		return true;
	}
	// CORNER BOTTOM-RIGHT (1) INTO (2)
	if((x_m_2 < x_M_1 && x_M_1 <= x_M_2) && (y_m_2 < y_M_1 && y_M_1 <= y_M_2)) {
		return true;
	}
	return false;
}
window.addEventListener('keydown', function(event){
	if(enable_to_play && document.getElementById('keys').checked) {
		if(event.keyCode == 40) player.move('down');
		else if(event.keyCode == 39) player.move('right');
		else if(event.keyCode == 38) player.move('up');
		else if(event.keyCode == 37) player.move('left');
	}
});
canvas.addEventListener('mousemove', function(event){
	if(enable_to_play && document.getElementById('mouse').checked) {
		player.remove();
		var rect = canvas.getBoundingClientRect();
		player.x = event.clientX - player.width/2 - rect.left;
		player.y = event.clientY - player.height/2 - rect.top;
	}
});

// CLASS FOR THE OBJECT START
class Start {
	constructor(w, h) {
		this.width = w;
		this.height = h;
		this.x = random(0, width - this.width);
		this.y = height - this.height;
		this.img = document.getElementById('start');
		this.draw();
		var loop = setInterval(function(chr){
			chr.draw();
		}, 10, this);
	}

	draw() {
		context.save();
		context.drawImage(this.img, this.x, this.y, this.width, this.height);
		context.restore();
	}
}

// CLASS FOR THE OBJECT FINISH
class Finish {
	constructor(w, h) {
		this.width = w;
		this.height = h;
		this.x = random(0, width - this.width);
		this.y = 0;
		this.img = document.getElementById('konoha');
		this.draw();
		var loop = setInterval(function(chr){
			chr.draw();
		}, 10, this);
	}

	draw() {
		context.save();
		context.drawImage(this.img, this.x, this.y, this.width, this.height);
		context.restore();
	}
}

// CLASS FOR THE OBJECT ENEMY
class Enemy {
	constructor(y, w, h, image, xm, xM, especial) {
		this.width = w;
		this.height = h;
		this.xm = xm;
		this.xM = xM;
		this.y = y;
		this.x = random(xm, xM - this.width);
		this.img = document.getElementById(image);
		this.draw();
		if(especial) {
			this.kamui();
		} else {
			this.move();
		}
	}

	kamui() {
		var loop = setInterval(function(obj){
			obj.remove();
			obj.x = random(obj.xm, obj.xM - obj.width);
			obj.draw();
		}, 250, this);
	}

	remove() {
		eraseCanvasIn(this.x, this.y, this.width, this.height);
	}

	move() {
		var direction = 1;
		var loop = setInterval(function(obj){
			if(obj.x + obj.width >= obj.xM - 5) {
				direction = -1;
			} else if(obj.x <= obj.xm + 5) {
				direction = 1;
			}

			obj.remove();
			obj.x = obj.x + direction;
			obj.draw();
		}, 5, this);
	}

	draw() {
		context.save();
		context.drawImage(this.img, this.x, this.y, this.width, this.height);
		context.restore();
	}
}

// CLASS FOR THE OBJECT STATIC OBJECT
class Static_Object {
	constructor(x, y, w, h) {
		this.width = w;
		this.height = h;
		this.y = y;
		this.x = x;
		this.img = document.getElementById('tree');
		this.draw();
		var loop = setInterval(function(obj){
			obj.draw();
		}, 5, this);
	}

	draw() {
		context.save();
		eraseCanvasIn(this.x, this.y, this.width, this.height);
		context.drawImage(this.img, this.x, this.y, this.width, this.height);
		context.restore();
	}
}

// CLASS FOR THE OBJECT CHARACTER
class Character {
	constructor(start, w, h) {
		this.img = document.getElementById('naruto');
		this.width = w;
		this.height = h;
		this.xi = start.x + start.width/2 - this.width/2;
		this.yi = start.y + start.height - this.height;
		this.reset();
		this.draw();
		var loop = setInterval(function(chr){
			if(collition(chr, finish)) {
				writeMSN('HAS LLEGADO A KONOHA!! Lastima que solo es un juego!!', 5);
				document.getElementById('points').innerHTML = deaths;
				parar(true);
				chr.reset();
			}
			chr.draw();
		}, 3, this);
	}

	add_Collition_Enemy(enemy) {
		var interval = setInterval(function(chr){
			if(collition(chr, enemy)) {
				deaths++;
				enable_to_play = false;
				points.innerHTML = deaths;
				writeMSN('USA OTRO CLON!!', 1);
				points.classList.add('notoriedad');
				setTimeout(function(){
					points.classList.remove('notoriedad');
				}, 1000);
				parar(false);
				chr.reset();
			}
		}, 10, this);
	}

	reset() {
		this.remove();
		this.x = this.xi;
		this.y = this.yi;
		this.draw();
	}

	draw() {
		this.check_borders();
		context.save();
		context.drawImage(this.img, this.x, this.y, this.width, this.height);
		context.restore();
	}

	move(dir) {
		this.remove();
		switch(dir) {
			case 'up': this.y -= this.height/2;
			break;
			case 'down': this.y += this.height/2;
			break;
			case 'left': this.x -= this.width/2;
			break;
			case 'right': this.x += this.width/2;
			break;	
		}
	}

	remove() {
		eraseCanvasIn(this.x, this.y, this.width, this.height);
	}

	check_borders() {
		if(this.x + this.width > width) {
			this.x = 0;
		}
		if(this.x < 0) {
			this.x = width - this.width;
		}
	}
}

audio.loop = true;
audio.play();
var start = 		new Start(110, 30);
var finish = 	new Finish(142, 30);

var tobi = 		new Enemy(60, 44, 60, 'tobi', 0, width, true);

var itachi = 	new Enemy(180, 41, 60, 'itachi', 0, 200, false);
var arbol1 = 	new Static_Object(200, 180, 45, 60);
var kisame = 	new Enemy(180, 39, 60, 'kisame', 245, width, false);

var hidan = 	new Enemy(300, 60, 60, 'hidan', 0, 350, false);
var arbol2 = 	new Static_Object(350, 300, 45, 60);
var kakuzu = 	new Enemy(300, 42, 60, 'kakuzu', 395, width, false);

var pain = 		new Enemy(420, 44, 60, 'pain', 0, 150, false);
var arbol3 = 	new Static_Object(150, 420, 45, 60);
var konan = 	new Enemy(420, 40, 60, 'konan', 195, width, false);

var deidara = new Enemy(480, 36, 60, 'deidara', 0, width, false);

var player = 	new Character(start, 44, 60);
player.add_Collition_Enemy(deidara);
player.add_Collition_Enemy(itachi);
player.add_Collition_Enemy(arbol1);
player.add_Collition_Enemy(kisame);
player.add_Collition_Enemy(hidan);
player.add_Collition_Enemy(arbol2);
player.add_Collition_Enemy(kakuzu);
player.add_Collition_Enemy(pain);
player.add_Collition_Enemy(arbol3);
player.add_Collition_Enemy(konan);
player.add_Collition_Enemy(tobi);


// TIMER

var centesimas = 0;
var segundos = 0;
var minutos = 0;
var horas = 0;
var control;
function inicio() {
	reinicio();
	setTimeout(function(){
		enable_to_play = true;
	}, 1000);
	btn_iniciar.style.display = 'none';
	continuar();
}

function continuar() {
	control = setInterval(cronometro,10);
	setTimeout(function(){
		enable_to_play = true;
	}, 1000);
	btn_continuar.style.display = 'none';
}

function parar(value) {
	clearInterval(control);
	enable_to_play = false;
	if(value) btn_iniciar.style.display = 'inherit';
	else btn_continuar.style.display = 'inherit';
}
function reinicio() {
	deaths = 0;
	points.innerHTML = '0';
	enable_to_play = false;
	btn_continuar.style.display = 'none';
	btn_iniciar.style.display = 'inherit';
	clearInterval(control);
	centesimas = 0;
	segundos = 0;
	minutos = 0;
	horas = 0;
	Centesimas.innerHTML = ":00";
	Segundos.innerHTML = ":00";
	Minutos.innerHTML = ":00";
	Horas.innerHTML = "00";
}
function cronometro() {
	if (centesimas < 99) {
		centesimas++;
		if (centesimas < 10) { centesimas = "0"+centesimas }
		Centesimas.innerHTML = ":"+centesimas;
	}
	if (centesimas == 99) {
		centesimas = -1;
	}
	if (centesimas == 0) {
		segundos ++;
		if (segundos < 10) { segundos = "0"+segundos }
		Segundos.innerHTML = ":"+segundos;
	}
	if (segundos == 59) {
		segundos = -1;
	}
	if ( (centesimas == 0)&&(segundos == 0) ) {
		minutos++;
		if (minutos < 10) { minutos = "0"+minutos }
		Minutos.innerHTML = ":"+minutos;
	}
	if (minutos == 59) {
		minutos = -1;
	}
	if ( (centesimas == 0)&&(segundos == 0)&&(minutos == 0) ) {
		horas ++;
		if (horas < 10) { horas = "0"+horas }
		Horas.innerHTML = horas;
	}
}