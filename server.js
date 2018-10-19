var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', express.static(__dirname));

app.post('/save', function(req, res) {
    fs.writeFile(
        'data/' + req.body.name + Date.now() + '.csv',
        req.body.data,
        'utf-8',
        function(err) {
            if (err) {
                // エラーのときの処理

                res.send('error');
            } else {
                // だいじょうぶだったとき

                res.send('ok');
            }
        }
    );
});

app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});