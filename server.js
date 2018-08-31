const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const request = require('request');

app.set('view engine', 'ejs')

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function (req, res) {

    request('https://live.kvv.de/webapp/stops/bylatlon/49.0040079/8.3849635?key=377d840e54b59adbe53608ba1aad70e8', {json: true}, (err, res2, body) => {
        if (err) {
            return console.log(err);
        }

        res.render('stop', {
            data: req.body,
            errors: {},
            stops: body.stops
        });
    });

})


app.get('/routes/:stopid', function (req, res) {

    res.render('route', {
        data: {},
        errors: {},
        stops: [],
        stopid: req.params.stopid,
        routes: RouteEnum
    });
})

app.get('/departures/:stopid/:route', function (req, res) {

    request('https://live.kvv.de/webapp/departures/byroute/' + RouteEnum[req.params.route].name + '/' + req.params.stopid + '?maxInfos=10&key=377d840e54b59adbe53608ba1aad70e8',
        {json: true}, (err, res2, body) => {
            if (err) {
                return console.log(err);
            }

            res.render('departure', {
                data: req.body,
                errors: {},
                stopid: req.params.stopid,
                route: req.params.route,
                departures: body.departures
            });
        });
})


app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})


var RouteEnum = {
    ONE: {name: "1"},
    TWO: {name: "2"},
    THREE: {name: "3"}
};