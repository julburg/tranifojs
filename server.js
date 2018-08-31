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
            stops: body.stops,
            routes: RouteEnum
        });
    });

})


app.get('/routes/:stopid', function (req, res) {
    console.log(req.params.stopid);

    res.render('route', {
        data: {},
        errors: {},
        stops: [],
        stopid: req.params.stopid,
        routes: RouteEnum
    });
})

app.get('/departures/:stopid/:route', function (req, res) {
    console.log(req.params.stopid);
    console.log(req.params.route);
    console.log('https://live.kvv.de/webapp/departures/byroute/' + RouteEnum.properties[RouteEnum[req.params.route]].name + '/' + req.params.stopid + '?maxInfos=10&key=377d840e54b59adbe53608ba1aad70e8')
    request('https://live.kvv.de/webapp/departures/byroute/' + RouteEnum.properties[RouteEnum[req.params.route]].name + '/' + req.params.stopid + '?maxInfos=10&key=377d840e54b59adbe53608ba1aad70e8',
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
    ONE: 1,
    TWO: 2,
    THREE: 3,
    properties: {
        1: {name: "1", value: 1},
        2: {name: "2", value: 2},
        3: {name: "3", value: 3}
    }
};