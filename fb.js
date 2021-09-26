var canvas, ctx;
var width, height, birdPos;
var sky, land, bird, pipe, dualPipeUp, dualPipeDown, scoreBoard, ready, splash, score12, score24, instro, instro2, blankPipe;
var dist, birdY, birdF, birdN, birdV, nextBirdY, speedDelta, intervalSpeed, intervalUpdateSpeed, startedTime;
var animation, death, deathAnim;
var pipes = [], pipesDir = [], pipeSt, pipeNumber, rocks = [];
var score, maxScore, realScore;
var dropSpeed;
var flashlight_switch = false, hidden_switch = false;
var mode, delta;
var wechat = false;
var playend = false, playdata = [];
var wxData;
var playedTime = 0;
var countDown = 45, intervalCountdown;
var clearCanvas = function () {
	ctx.fillStyle = '#99d9f4';
	ctx.fillRect(0, 0, width, height);
}
var soundBackground, soundStart, soundWin, soundHit, soundflapping, soundGameOver, soundEarnPoint, soundSpeedUp, soundBtnClick, soundLeaderBoard, soundTimUp, soundCountdown
var extraScore, lastTimeExtraScore;
var isDropMode = 1;
var loadImages = function () {
	var imgNumber = 5, imgComplete = 0;
	var onImgLoad = function () {
		imgComplete++;
		if (imgComplete == imgNumber) {
			death = 1;
			dist = 0;
			birdY = (height - 112) / 2;
			nextBirdY = birdY;
			speedDelta = 1;
			birdF = 0;
			birdN = 0;
			birdV = 0;
			birdPos = width * 0.35;
			score = 0;
			realScore = -1;
			pipeSt = 0;
			pipeNumber = 10;
			pipes = [];
			rocks = [];
			pipesDir = [];
			extraPoint = 0;
			lastTimeExtraPoint = 0;
			drawCanvas();
		}
	}

	sky = new Image();
	sky.src = 'images/sky.jpeg';
	sky.onload = onImgLoad;

	land = new Image();
	land.src = 'images/land.png';
	land.onload = onImgLoad;

	bird = new Image();
	bird.src = 'images/bird.png';
	bird.onload = onImgLoad;

	pipe = new Image();
	pipe.src = 'images/pipe.png';
	// pipe.onload = onImgLoad;

	pipeBreak = new Image();
	pipeBreak.src = 'images/pipe-break.png';
	// pipeBreak.onload = onImgLoad;

	dualPipeUp = new Image();
	dualPipeUp.src = 'images/dual-pipe-up.png';
	// dualPipeUp.onload = onImgLoad;

	dualPipeDown = new Image();
	dualPipeDown.src = 'images/dual-pipe-down.png';
	// dualPipeDown.onload = onImgLoad;
	splash = new Image();
	// splash.src = 'images/splash.png';
	// splash.onload = onImgLoad;

	devil = new Image();
	devil.src = 'images/devil.png';
	// devil.onload = onImgLoad;

	rock = new Image();
	rock.src = 'images/rock.png';
	// rock.onload = onImgLoad;

	scoreBubble = new Image();
	scoreBubble.src = 'images/score-bubble.png';
	// scoreBubble.onload = onImgLoad;

	impactPoint = new Image();
	impactPoint.src = 'images/impact-point.png';
	// impactPoint.onload = onImgLoad;

	instro = new Image();
	instro.src = 'images/instro.png';
	instro.onload = onImgLoad;


	instro2 = new Image();
	instro2.src = 'images/instro2.png';
	instro2.onload = onImgLoad;

	blankPipe = new Image();
	blankPipe.src = 'images/blank-pipe.png';
	blankPipe.onload = onImgLoad;
}

function loadSounds(url) {
	soundHit = new Howl({
		src: ['sounds/hit.mp3']
	});
	soundStart = new Howl({
		src: ['sounds/start.mp3']
	});
	soundGameOver = new Howl({
		src: ['sounds/game-over.mp3']
	});
	soundWin = new Howl({
		src: ['sounds/win.mp3']
	});
	soundflapping = new Howl({
		src: ['sounds/flapping-wings.mp3']
	});

	soundEarnPoint = new Howl({
		src: ['sounds/earn-point.mp3']
	});
	soundSpeedUp = new Howl({
		src: ['sounds/speed-up.mp3']
	});
	soundBtnClick = new Howl({
		src: ['sounds/btn-click.mp3']
	});
	soundLeaderBoard = new Howl({
		src: ['sounds/leaderboard.mp3']
	});
	soundBackground = new Howl({
		src: ['sounds/background.mp3'],
		loop: true,
	});

	soundTimUp = new Howl({
		src: ['sounds/time-up.mp3']
	});

	soundCountdown = new Howl({
		src: ['sounds/countdown.mp3']
	});
}
function is_touch_device() {
	try {
		document.createEvent("TouchEvent");
		return true;
	} catch (e) {
		return false;
	}
}

var initCanvas = function () {
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext('2d');
	canvas.width = width = 660;
	canvas.height = height = 876;
	document.getElementById('game').width = '100%';
	document.getElementById('game').height = '100%';
	if (is_touch_device()) {
		canvas.addEventListener("touchend", function (e) { e.preventDefault(); }, false);
		canvas.addEventListener("touchstart", function (e) {

			if (death) {
				jump();
			} else if (isDropMode) {
				jump();
			}
			e.preventDefault();
		}, false);

	}
	else
		canvas.onmousedown = jump;
	// window.onkeydown = jump;
	FastClick.attach(canvas);
	loadImages();
	document.addEventListener('keydown', function (e) {
		var keyCode = e.keyCode;
		if (keyCode === 38) {
			jump();
			e.preventDefault();
		}
		if (keyCode === 40) {
			down();
			e.preventDefault();
		}
	});
	$('.html-jump').click(() => {
		jump();
	})
}

var deathAnimation = function () {
	playedTime = 0;
	if (splash) {
		// ctx.drawImage(splash, width / 2 - 94, height / 2 - 54);
		splash = undefined;
	}
	else {

		if (intervalCountdown) clearInterval(intervalCountdown);
		soundHit.play();
		soundBackground.stop();
		soundCountdown.stop();
		setTimeout(() => {
			soundGameOver.play();
		}, 300);
		ctx.drawImage(impactPoint, birdPos - 90, birdY - 110);
		ctx.drawImage(bird, birdPos, birdY);
		// drawBird();
		openEndScreen();
	}
	// ctx.drawImage(ready, width / 2 - 57, height / 2 + 10);
	maxScore = Math.max(maxScore, score);
}

var drawSky = function () {
	var totWidth = 0;
	while (totWidth < width) {
		ctx.drawImage(sky, totWidth, height - 780);
		totWidth += sky.width;
	}
}

var drawLand = function (numberOfLand) {
	var totWidth = -dist;
	while (totWidth < width) {
		for (let index = 0; index <= numberOfLand; index++) {
			ctx.drawImage(land, totWidth, height - (52 * index));
		}
		totWidth += land.width;
	}
	if (birdY > height - (52 * (numberOfLand + 1))) {
		console.log('death by land');
		death = 1;
		clearInterval(animation);
	}
	dist = dist + 2;
	var tmp = Math.floor(dist - width * 0.65) % 330;
	if (dist >= width * 0.65 && Math.abs(tmp) <= 1) {
		realScore++;
		if (realScore && realScore % 2 == 0 && realScore % 6 != 0) {
			// 2 cột

			extraScore = 24;
			if (realScore % 5 == 0 || realScore % 4 == 0) {
				extraScore = 48;
				console.log('48d');
			}
			// console.log('2 cot',realScore);
		} else if (realScore % 6 == 0 && realScore) {
			// đá rơi 
			extraScore = 24
			// console.log('đá rơi',realScore);
		} else {
			extraScore = 12
		}
		addScore();
	}
}
var addScore = function () {
	score += extraScore;
	lastTimeExtraScore = new Date().getTime();
	soundEarnPoint.play();
}
var drawScoreImg = function () {
	ctx.drawImage(scoreBubble, birdPos + 60, birdY - 60);
	ctx.font = '25px "BTBrikOblique"';
	ctx.lineWidth = 5;
	ctx.fillStyle = '#fff';
	var txt = "" + score;

	const posText = score > 100 ? birdPos + 70 : birdPos + 80;
	// ctx.strokeText(txt, birdPos+65, birdY-8);
	ctx.fillText(txt, posText, birdY - 25);

}

var drawPipe = function (x, y, pipeIndex) {
	const upPipesNumber = Math.round(y / 52);
	const upColumnLength = upPipesNumber * 52;
	const downColumnStart = upColumnLength + 200;
	const downPipesNumber = Math.ceil((height - downColumnStart) / 52);
	const totalPipe = upPipesNumber + downPipesNumber;
	if (pipeIndex % 6 == 0 && pipeIndex) {
		const rockY = rocks[pipeIndex] - 40;
		if (rockY < downColumnStart - 60) {
			drawRock(x, rockY, pipeIndex);
		} else {
			drawRock(x, downColumnStart - 60, pipeIndex);
		}

	}
	for (let i = 0; i < upPipesNumber; i++) {
		if (pipeIndex % 6 == 0 && pipeIndex && i == upPipesNumber - 1) {
			drawPipeItem(x, i * 52, 'up', true)
		} else {
			drawPipeItem(x, i * 52, 'up', false)
		}

	}

	for (let i = 0; i < downPipesNumber; i++) {
		drawPipeItem(x, downColumnStart + (i * 52), 'down', false)
	}


	if (x < birdPos + 32 && x + 50 > birdPos && (birdY < y + 22 || birdY + 22 > y + 144 + delta)) {
		// death = 1;
		// clearInterval(animation);

	}
	else if (x + 40 < 0) {
		pipeSt++;
		pipeNumber++;
		const pipeY = Math.max(Math.floor(Math.random() * (height - 300 - delta) + 10), 160)
		pipes.push(pipeY);
		pipesDir.push((Math.random() > 0.5));
		// rocks.push(pipeY);
		initArrayRocks(pipeY)
	}


}

var drawPipeItem = function (x, y, mode, isBreak, isBlank) {
	if (mode == 'up') {
		isDeathY = Math.abs(birdY - y) < (isBreak ? 0 : 40)
	} else {
		isDeathY = y - birdY < 65;
	}
	if (x < birdPos + 65 && x + 70 > birdPos && isDeathY) {
		death = 1;
		clearInterval(animation);
	}
	if (isBreak) {
		ctx.drawImage(pipeBreak, x, y);
	} else if (isBlank) {
		ctx.drawImage(blankPipe, x, y);
	} else {
		ctx.drawImage(pipe, x, y);
	}

}

var drawDevil = function (x, y) {
	if (x < birdPos + 40 && x + 40 > birdPos && Math.abs(birdY - y) < 30) {
		death = 1;
		clearInterval(animation);
	}
	ctx.drawImage(devil, x, y);
}
var drawRock = function (x, y, indexRock) {
	if (x < birdPos + 45 && x + 50 > birdPos && Math.abs(birdY - y) < 35) {
		death = 1;
		clearInterval(animation);

	}
	const dropPoint = width < 400 ? width : 0.5 * width;
	if (x < dropPoint) {
		rocks[indexRock] = rocks[indexRock] + 1;
		ctx.drawImage(rock, x, y);
	} else {
		ctx.drawImage(rock, birdN, 0, rock.width, rock.height, x, y, rock.width, rock.height);
		birdF = (birdF + 1) % 6;
		if (birdF % 6 == 0)
			birdN = (birdN + 1) % 3;
	}

}
var drawBird = function () {
	// drawScoreImg();
	if (new Date().getTime() - lastTimeExtraScore < 500) {
		drawScoreImg();
	}
	if (new Date().getTime() - startedTime < 4000 && isDropMode) {
		ctx.drawImage(instro2, birdPos - 100, birdY + 75);
	}
	ctx.drawImage(bird, 0, 0, bird.width, 75, birdPos, birdY, bird.width, 75);


	if (isDropMode) {
		// dropmode
		birdY -= birdV;
		birdV -= dropSpeed;
	} else {
		//up down mode
		if (birdY != nextBirdY) {
			birdY += birdV;
		}
	}
	if (birdY + 138 > height) {
		clearInterval(animation);
		death = 1;
	}
	if (death)
		deathAnimation();
}

var drawScore = function () {
	// ctx.font = '40px "Press Start 2P"';
	// ctx.lineWidth = 5;
	// ctx.strokeStyle = '#fff';
	// ctx.fillStyle = '#000';
	// var txt = "" + score;
	// ctx.strokeText(txt, 0, height * 0.15);
	// ctx.fillText(txt, 0, height * 0.15);
}

var drawShadow = function () {
	var left_shadow = "linear, " + ((width * 0.35 - 170) / width * 100.) + "% 0, " + ((width * 0.35 + 60) / width * 100.) + "% 0, from(black), to(rgba(0,0,0,0))";
	var right_shadow = "linear, " + ((width * 0.35 + 190) / width * 100.) + "% 0, " + ((width * 0.35 - 30) / width * 100.) + "% 0, from(black), to(rgba(0,0,0,0))";
	var grd = ctx.createLinearGradient(width * 0.35 - 170, 0, width * 0.35 + 60, 0);
	grd.addColorStop(0, "black");
	grd.addColorStop(1, "rgba(0, 0, 0, 0)");
	ctx.fillStyle = grd;
	ctx.fillRect((width * 0.35 - 170), 0, 230, height);
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, (width * 0.35 - 170), height);
	grd = ctx.createLinearGradient(width * 0.35 - 30, 0, width * 0.35 + 190, 0);
	grd.addColorStop(0, "rgba(0, 0, 0, 0)");
	grd.addColorStop(1, "black");
	ctx.fillStyle = grd;
	ctx.fillRect((width * 0.35 - 30), 0, 220, height);
	ctx.fillStyle = "black";
	ctx.fillRect(width * 0.35 + 190, 0, width * 0.65 - 190, height);
}

var drawHidden = function () {
	ctx.fillStyle = "black";
	ctx.fillRect(width * 0.35, 30, 300, height - 180);
}

var drawCanvas = function () {
	clearCanvas();

	drawSky();
	for (var i = pipeSt; i < pipeNumber; ++i) {
		const pipePost = width - dist + i * 330;
		drawPipe(pipePost, pipes[i], i);
		let specialItem = 0;
		if (i % 2 == 0 && i && i % 6 != 0) {
			specialItem = 1;
			// double pipe
			drawPipe(pipePost + 50, pipes[i], i);
			const dualPipeYItem = pipes[i] - 80;
			if (i % 4 == 0) {
				ctx.drawImage(dualPipeUp, pipePost, dualPipeYItem)
				if (pipePost < birdPos + 30 && pipePost + 50 > birdPos && birdY - dualPipeYItem < 90) {
					death = 1;
					clearInterval(animation);
				}
			}
			if (i % 5 == 0 && i % 4 != 0) {
				ctx.drawImage(dualPipeDown, pipePost, dualPipeYItem)
				if (pipePost < birdPos + 30 && pipePost + 50 > birdPos && birdY - dualPipeYItem < 90) {
					death = 1;
					clearInterval(animation);
				}
			}
		}
		// if (i % 5 == 0 && i && !specialItem) {
		// 	drawDevil(pipePost - 20, pipes[i])
		// }
	}
	// const numberOfLand = Math.max(Math.ceil((height - 821) / 52), 1);
	drawLand(1);
	if (flashlight_switch)
		drawShadow();
	else if (hidden_switch)
		drawHidden();
	drawBird();
	drawScore();
}

var anim = function (time = 1000) {
	animation = setInterval(drawCanvas, time / 60);
}
var jump = function () {
	if (death) {
		dist = 0;
		birdY = (height - 112) / 2;
		nextBirdY = birdY;
		speedDelta = 1;
		birdF = 0;
		birdN = 0;
		birdV = 0;
		death = 0;
		score = 0;
		realScore = -1;
		birdPos = width * 0.35;
		pipeSt = 0;
		pipeNumber = 10;
		pipes = [];
		rocks = [];
		pipesDir = [];
		countDown = 45;
		if (intervalCountdown) clearInterval(intervalCountdown);
		for (var i = 0; i < 10; ++i) {
			const pipeY = Math.max(Math.floor(Math.random() * (height - 300 - delta) + 10), 160)
			pipes.push(pipeY);
			pipesDir.push((Math.random() > 0.5));
			initArrayRocks(pipeY);
		}
		anim();
		startedTime = new Date().getTime();

		soundStart.play();
		setTimeout(() => {
			if (death) return;
			soundBackground.play();
		}, 3000);
		intervalCountdown = setInterval(() => {
			countDown--;
			$('#timer').html(countDown)
			if (countDown == 11) {
				soundCountdown.play();
			}
			if (countDown <= 0) {
				death = 1;
				soundTimUp.play();
				deathAnimation();
				clearInterval(intervalCountdown);
				clearInterval(animation);
			}
		}, 1000);
	}
	// birdV = 6;
	birdV = 4;
}
function initArrayRocks(pipeY) {
	const upPipesNumber = Math.round(pipeY / 52);
	const upColumnLength = upPipesNumber * 52;
	rocks.push(upColumnLength - 22);
}
var easy, normal, hard;
function flashlight() {
	document.getElementById("flashlight").style.background = ["red", "rgba(255, 255, 255, 0.6)"][+flashlight_switch];
	flashlight_switch ^= 1;
}

function hidden() {
	document.getElementById("hidden").style.background = ["red", "rgba(255, 255, 255, 0.6)"][+hidden_switch];
	hidden_switch ^= 1;
}
function up() {
	birdV = -6;
	nextBirdY = birdY - 30;
	soundflapping.stop();
	soundflapping.play();
}
function down() {
	birdV = 6;
	nextBirdY = birdY + 30;
	soundflapping.stop();
	soundflapping.play();
}
function speedUp() {
	if (speedDelta >= 900) {
		return;
	}
	soundSpeedUp.play();
	speedDelta += 300;
	updateSpeed();

	const speedUpLevel = (Math.floor(speedDelta / 100));
	document.getElementById('speedup-level').innerHTML = speedUpLevel;

}
function updateSpeed() {
	// console.log('speed updated', speedDelta);
	clearInterval(animation);
	anim(1000 - (speedDelta));
}
var gameStart = function (mode) {
	isDropMode = mode;
	if (isDropMode == 1) {
		document.getElementById('control-btn-group').classList.add('hide');
	}
	document.getElementById('screen-group').classList.add('hide');
	document.getElementById('screen-start').classList.add('hide');
	setTimeout(() => {
		$('#faster').addClass('hide')
	}, 4000);
	jump();
}
window.onload = function () {

	document.getElementById('screen-start').width = 660;
	document.getElementById('screen-start').height = 876;
	const screenWidth = window.innerWidth;
	const screenHeight = window.innerHeight - (screenWidth > 768 ? 50 : 0);
	let ratio = screenWidth / 660;
	let needContentHeight = ratio * 876;
	while (needContentHeight > screenHeight) {
		ratio = 0.999 * ratio;
		needContentHeight = 0.999 * needContentHeight;
	}


	document.getElementById('content-wrapper').style.transform = `scale(${ratio})`
	console.log(ratio);
	//document.addEventListener("touchend", function(e) { e.preventDefault(); }, false);
	mode = 0;
	score = 0;
	realScore = -1;
	playdata = [0, 0];
	maxScore = 0;
	dropSpeed = 0.2;
	mode = 0;
	delta = 100;
	initCanvas();
	loadSounds();
	// // window.onresize = function () {
	// // 	canvas.width = width = Math.min(875, window.innerWidth);
	// // 	canvas.height = height = Math.min(875, window.innerHeight);
	// // 	drawCanvas();
	// // }
	const newTop = 40 * ratio + '%';
	// $('#content-wrapper').css( "top",newTop )
	console.log(newTop);

}
// handle screens logic
function switchScreen(screenId) {
	$('.screen').removeClass('active');
	$('#' + screenId).addClass('active');
}
function apiSaveScore(name, phone, receipt, score) {
	const url = 'https://uat-api.flowco.io/game/submit-score';
	const data = {
		username: name,
		score: score,
		phone: phone,
		receiptNumber: receipt
	}
	return fetch(url, {
		method: 'POST',
		mode: 'cors',
		cache: 'no-cache',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	}).then(function (res) {
		return res.json()
	})
}

function apiCheckRank(score) {
	const url = 'https://uat-api.flowco.io/game/rank?score=' + score;
	return fetch(url, {
		method: 'GET',
		mode: 'cors',
		cache: 'no-cache',
		headers: {
			'Content-Type': 'application/json'
		},
	}).then(function (res) {
		return res.json()
	})
}
function openEndScreen() {
	soundStart.stop();
	$('#footer-game').addClass('hide')
	// init group screen
	$('#name-invalid').removeClass('show')
	$('#phone-invalid').removeClass('show')
	$('#screen-group').removeClass('hide');
	$('#screen-gameover').removeClass('hide');
	$('#screen-start').addClass('hide');
	$('#table-body').empty();

	$('.scores').html(score);

	$('.btn-playagain').click(function () {
		console.log('play again');
		location.reload();
	});
	setTimeout(() => {
		if (!$('#screen-gameover').attr('class').includes('hide')) {
			$('#screen-gameover').click();
		}
	}, 2000);
	$('#screen-gameover').click(function () {

		apiCheckRank(score).then(res => {
			$('.rank-score').html(res.rank);
			// $('.rank-total-user').html(res.totalPlayer)
			console.log('res:', res);
			if (res.rank < 50) {
				$('.under-top').addClass('hide');
				// $('#header-submit-form').css( "background",'none' )
			} else {
				$('.top-score').addClass('hide')
				$('#form-save-score').removeClass('top-rank-skew')
				$('#form-save-score').addClass('under-rank-skew')
			}
		}).catch(err => {
			console.log(err);
		})
		$('#screen-gameover').addClass('hide');
		$('#container').removeClass('hide');
		$('#share-button').removeClass('hide');

		soundWin.play();
	});

	$('#btn-goto-form').click(function () {
		soundWin.stop();
		switchScreen('screen-form');
		$('#share-button').removeClass('left-120')
		soundBtnClick.play();
	});

	$('#btn-save-score').click(function () {
		soundBtnClick.play();
		var name = $('#name').val();
		var phone = $('#phone').val();
		var receipt = $('#receipt').val();
		if (!name) {
			$('#name-invalid').addClass('show')
		}
		if (!phone) {
			$('#phone-invalid').addClass('show')
		}
		if (name && phone) {
			switchScreen('screen-board');
			apiSaveScore(name, phone, receipt, score).then(function (res) {
				soundLeaderBoard.play();
				for (let i = 0; i < res.length; i++) {
					const el = `<tr>
									<td>${res[i].username}</td>
									<td>${res[i].score}</td>
								</tr>`
					$('#table-body').append(el);
				}
			})
		}
	})
}


async function share(type) {

	let redirectTo = '';
	const imageUrl = await capture();
	const appUrl = imageUrl;
	const content = encodeURIComponent('Beat the Blocks & stand a chance to win exciting prizes - Play Now. https://flowco.io/MnMGame')
	// return
	switch (type) {
		case 'facebook':
			redirectTo = `https://www.facebook.com/sharer/sharer.php?u=${appUrl}&quote=${content}`;
			break;
		case 'twitter':
			redirectTo = `http://twitter.com/share?url=${appUrl}&text=${content}`;
			break;
		case 'whatsapp':
			redirectTo = ` https://wa.me/?text=${encodeURIComponent(appUrl)}`;
			break;
		default:
			break;
	}
	window.open(redirectTo);
}
function closePopup() {
	window.parent.postMessage('closePopup', '*');
}
async function capture() {
	const canvas = await html2canvas(document.querySelector("#content-wrapper"));
	const base64 = canvas.toDataURL();
	const blob = dataURLtoBlob(base64);
	const responseUpload = await uploadFile(blob);
	const url = responseUpload.data[0].url
	return url;
}
async function uploadFile(file) {
	const url = 'https://uat-api.flowco.io/files/upload';
	const formData = new FormData();
	formData.append('appId', 'm2m-game');
	formData.append('fileType', 'images');
	formData.append('files', file)
	return $.ajax({
		type: 'POST',
		url: url,
		data: formData,
		headers: {
			contentType: 'application/json',
		},
		processData: false, // tell jQuery not to process the data
		contentType: false, // tell jQuery not to set contentType
	});
}
function dataURLtoBlob(dataurl) {
	var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
		bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new Blob([u8arr], { type: mime });
}