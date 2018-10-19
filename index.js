var As = [300, 500];
var Ws = [100, 180, 260];
var mx = 0;
var my = 0;
var Aindex = -1;
var Windex = -1;

var amp;
var wid;

var tarX1, tarX2, tarY1, tarY2;
var startX1, startX2, startY1, startY2;

var ctx;
var canvas;

var countIndex = -1;
var countMax = As.length * Ws.length;

var saveStr = '';
var startTime, endTime;
var saveTimes = new Array(countMax);
var saveAs = new Array(countMax);
var saveWs = new Array(countMax);

var state; //0でスタートクリック前，1でスタートクリック後

var $start = document.getElementById('start');//divとってきてそれを変数名にするときは慣習的に$つける．
var $end = document.getElementById('end');

function draw() {
	SetParam();
	DrawTarget();
}

function SetParam() {
	countIndex++;
	if (countIndex >= countMax) {
		for (var cnt = 0; cnt < saveTimes.length; cnt++) {
			saveStr +=
				saveAs[cnt] + ',' + saveWs[cnt] + ',' + saveTimes[cnt] + '\n';
		}

		fetch('/save', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				data: saveStr,
				name: 'usb'
			})
		})
			.then(function (res) {
				return res.text();
			})
			.then(function (a) {
				console.log(a);
			});

		alert('end\n' + saveStr);
	}

	Aindex = (Aindex + 1) % As.length;
	amp = As[Aindex];
	saveAs[countIndex] = amp;
	Windex = (Windex + 1) % Ws.length;
	wid = Ws[Windex];
	saveWs[countIndex] = wid;

	startX1 = 10;
	startX2 = startX1 + wid;
	startY1 = 10;
	startY2 = startY1 + wid;

	tarX1 = startX1 + amp;
	tarX2 = tarX1 + wid;
	tarY1 = startY1;
	tarY2 = tarY1 + wid;

	state = 0;
}

function DrawTarget() {
	$start.style.visibility = 'visible';
	$start.style.left = startX1 + 'px';
	$start.style.top = startY1 + 'px';
	$start.style.width = wid + 'px';
	$start.style.height = wid + 'px';

	$end.style.left = tarX1 + 'px';
	$end.style.top = startY1 + 'px';
	$end.style.width = wid + 'px';
	$end.style.height = wid + 'px';
}

function EraseStart() {
	$start.style.visibility = 'hidden';
	state = 1;
}

$start.addEventListener('click', function (e) {
	e.stopPropagation();

	if (state === 0) {
		startTime = new Date();
		EraseStart();
	}
});

$end.addEventListener('click', function (e) {
	e.stopPropagation();

	if (state == 1) {
		endTime = new Date();
		saveTimes[countIndex] = endTime - startTime;
		SetParam();
		DrawTarget();
	}
});

document.getElementById('wrapper').addEventListener('click', function () {
	console.log('back');
})

draw();