const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const request = require('request');

app.set('view engine', 'ejs')

app.use(express.static('.'));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function (req, res) {

    res.render('stop', {
        data: req.body,
        errors: {},
        stops: [],
        routes: []
    });

})

app.get('/stops/:lon/:lat', function (req, res) {

    request('https://live.kvv.de/webapp/stops/bylatlon/' + req.params.lat + '/' + req.params.lon + '?key=377d840e54b59adbe53608ba1aad70e8', {json: true}, (err, res2, body) => {
        if (err) {
            return console.log(err);
        }

        res.render('stops', {
            data: req.body,
            errors: {},
            stops: body.stops
        });
    });

})

app.get('/routes/:stopid', function (req, res) {

    request('https://live.kvv.de/webapp/departures/bystop/' + req.params.stopid + '?key=377d840e54b59adbe53608ba1aad70e8',
        {json: true}, (err, res2, body) => {
            if (err) {
                return console.log(err);
            }

            let routes = [];
            if (body.departures) {
                routes = body.departures.map(departure => departure.route);
            }

            res.render('routes', {
                data: {},
                errors: {},
                stops: [],
                stopid: req.params.stopid,
                routes: new Set(routes)
            });
        });
})

app.get('/departures/:stopid/:route', function (req, res) {

    request('https://live.kvv.de/webapp/departures/byroute/' + req.params.route + '/' + req.params.stopid + '?maxInfos=10&key=377d840e54b59adbe53608ba1aad70e8',
        {json: true}, (err, res2, body) => {
            if (err) {
                return console.log(err);
            }

            let departures = [];
            if (body.departures) {
                departures = body.departures;
            }

            res.render('departure', {
                data: req.body,
                errors: {},
                stopid: req.params.stopid,
                route: req.params.route,
                departures: departures
            });
        });
})


app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})
