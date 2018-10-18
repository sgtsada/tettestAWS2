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

onload = function() {
    draw();
};
function draw() {
    /* canvas要素のノードオブジェクト */
    canvas = document.getElementById('canvassample');
    /* canvas要素の存在チェックとCanvas未対応ブラウザの対処 */
    if (!canvas || !canvas.getContext) {
        return false;
    }
    canvas.style.backgroundColor = 'rgb(200,200,250)';

    /* 2Dコンテキスト（なんのために必要かは分からない: canvas変数とは違う？　heightを取得できるのはどっち？） */
    ctx = canvas.getContext('2d');
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
            .then(function(res) {
                return res.text();
            })
            .then(function(a) {
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
    ctx.fillStyle = 'rgb(200,200,250)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgb(200, 0, 0)';
    ctx.fillRect(startX1, startY1, wid, wid);

    ctx.fillStyle = 'rgb(0, 0, 200)';
    ctx.fillRect(tarX1, tarY1, wid, wid);
}

function EraseStart() {
    ctx.fillStyle = 'rgb(200,200,250)';
    ctx.fillRect(startX1, startY1, wid, wid);
    state = 1;
}

ontouchstart = function(e) {
    mx = e.touches[0].clientX;
    my = e.touches[0].clientY;
    if (state == 0) {
        if (startX1 <= mx && mx <= startX2 && startY1 <= my && my <= startY2) {
            startTime = new Date();
            EraseStart();
        }
    } else if (state == 1) {
        if (tarX1 <= mx && mx <= tarX2 && tarY1 <= my && my <= tarY2) {
            endTime = new Date();
            saveTimes[countIndex] = endTime - startTime;
            SetParam();
            DrawTarget();
        }
    }
};