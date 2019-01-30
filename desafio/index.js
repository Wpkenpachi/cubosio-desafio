'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var moment = require('moment');
require('twix');

/* Variaveis de Ambiente */
const SCHEDULE_DATABASE = 'database/scheduling_rules.json';
/* -- */

app.use(bodyParser.json()); // for parsing application/json
//app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    next();
});

app.get('/', function (req, res) {
  res.send('Hello World!');
});


/* Rotas */
app.get('/list/scheduling/rules', async (req, res) => {
    return await list_sheduling(res)
})

app.post('/register/scheduling/rule', async (req, res) => {

    let hasType = req.body.hasOwnProperty('type');
    if(! hasType ) return res.json({ msg: 'Missing Type Property' })
    return await registering_scheduling( req.body, res )
})

app.post('/remove/scheduling/rule/:id', async (req, res) => {
    let id = req.params.id;
    return await delete_scheduling(id, res)
})

app.get('/list/freetime', async (req, res) => {
    getFreetime( req.query.start, req.query.end ).then( response => {
        res.json( response )
    })
})
/* End Rotas */






/* Controllers */
async function list_sheduling(res) {
    getScheduling().then( (data, err) => {
        res.json( data )
    })
}

async function registering_scheduling ( data, res ){
    addScheduling( data ).then( ( data, err ) => {
        if( data ) {
            res.json({
                status: 200,
                msg: 'Regra de Agendamento registrada com sucesso!'
            })
        }
    });
}

async function delete_scheduling ( id, res ) {
    removeScheduling( id ).then( (data, err) => {
        if ( data ) {
            res.json({
                status: 200,
                msg: `Regra de id: ${id} removida com sucesso!`
            })
        }
    })
}
/* End Controllers */






/* Models */
function getScheduling () {
    return new Promise( (resolve, reject) => {
        fs.readFile( SCHEDULE_DATABASE , function( err, data ){
            //console.log('Terminou!', JSON.parse(data))
            resolve( JSON.parse(data) )
        })
    })
}

function addScheduling ( new_schedule ) {
    return new Promise ( (resolve, reject) => {
        let old_data = [];
        let new_data = [];

        // Manipulando nova regra
        getScheduling().then( (data, err) => {
            old_data = data;

            new_schedule.id = (new Date().getTime()).toString() + (Math.floor((Math.random() * 1000) + 1)).toString();
            old_data.push(new_schedule)
            new_data = JSON.stringify(old_data);

            fs.writeFile(SCHEDULE_DATABASE, new_data, (err) => { // Escrevendo nova regra
                if (err) throw err;
                resolve( true )
            });
        })
    })
}

function removeScheduling ( id ) {
    return new Promise ( (resolve, reject) => {
        let new_data = [];

        getScheduling().then( (data, err) => {
            data.forEach( element => {
                if( element.id !== id ) {
                    new_data.push(element)
                }
            });

            new_data = JSON.stringify(new_data)
            fs.writeFile(SCHEDULE_DATABASE, new_data, (err) => {
                if (err) throw err;
                resolve(true)
            })
        })

        
    })
}

function getFreetime(start, end){
    let scheduling_rules = [];
    let freeTimeArray   = [];
    let moment_start    = moment(start, 'DD-MM-YYYY')
    let moment_end      = moment(end, 'DD-MM-YYYY')
    return getScheduling().then( (data, err) => {
            
        scheduling_rules = data;

        // Iterando pelos daily types
        let dailys = getDaily( scheduling_rules )
        if ( dailys.length ){
            console.log('Iterando Pelos Daily Types')
            dailys.forEach( daily_rule => {
                ( getDatesBetween(start, end) ).forEach( dateString => {
                    let the_date = moment(dateString, 'DD-MM-YYYY')
                    //console.log('1: ' + the_date.isBetween(moment_start, moment_end), the_date.format('DD-MM-YYYY'))
                    if( the_date.isBetween(moment_start, moment_end) || (dateString == start || dateString == end) ){
                        freeTimeArray.push({
                            day: dateString,
                            intervals: daily_rule.data.intervals
                        })
                    }
                })
            });
        }

        // Iterando pelos weekly types
        let weeklys = getWeekly( scheduling_rules )
        if ( weeklys.length ) {
            console.log('Iterando Pelos Weekly Types')
            weeklys.forEach( weekly_rule => {
                ( getDatesBetween(start, end) ).forEach( dateString => {
                    let the_date = moment(dateString, 'DD-MM-YYYY')
                    //console.log('2: ' + the_date.isBetween(moment_start, moment_end), the_date.format('DD-MM-YYYY'))
                    if( the_date.isBetween(moment_start, moment_end) || (dateString == start || dateString == end) ) {
                        if( weekly_rule.data.days.includes( moment(dateString, 'DD-MM-YYYY').day() ) ) {
                            freeTimeArray.push({
                                day: dateString,
                                intervals: weekly_rule.data.intervals
                            })
                        }
                    }
                });
            });
        }

        // Iterando pelos single-day types
        let singleDays = getSingleDays( scheduling_rules )
        if ( singleDays.length ) {
            console.log('Iterando Pelos SingleDay Types')
            singleDays.forEach( singleDay_rule => {
                let the_date = moment(singleDay_rule.data.day, 'DD-MM-YYYY')
                //console.log('3: ' + the_date.isBetween(moment_start, moment_end), the_date.format('DD-MM-YYYY'))
                if( the_date.isBetween(moment_start, moment_end) || (singleDay_rule.data.day == start || singleDay_rule.data.day == end) ) {
                    freeTimeArray.push({
                        day: singleDay_rule.data.day,
                        intervals: singleDay_rule.data.intervals
                    })
                }
            });
        }

        // Resolvendo Dias duplicados
        freeTimeArray = resolveDuplicatedDates(freeTimeArray)
        return freeTimeArray;
    })
}
/* End Models */






/* Check Functions */
function getDaily ( data ) {
    let arr = [];
    arr = data.filter( obj => obj.type == 'daily');
    return arr;
}

function getWeekly ( data ) {
    let arr = [];
    arr = data.filter( obj => obj.type == 'weekly' );
    return arr;
}

function getSingleDays ( data ) {
    let arr = [];
    arr = data.filter( obj => obj.type == 'single-day' );
    return arr;
}
/* End Check Functions */






/* Help Functions */
function getDatesBetween (start, end) {
    var itr = moment(start, 'DD-MM-YYYY').twix(end, 'DD-MM-YYYY').iterate("days");
    var range = [];
    while( itr.hasNext() ){
        range.push(itr.next().format("DD-MM-YYYY"))
    }
    
    return range
}

function resolveDuplicatedDates(array) {
    let new_array               = [];
    let array_already_pushed    = [];
    array.forEach( (item, index) => {
        let new_array_intervals = [];
        let days_equal = array.filter( _item => _item.day == item.day )
        if( days_equal.length >= 1 && !array_already_pushed.includes(item.day) ) {
            days_equal.forEach( day_equal => {
                Array.prototype.push.apply(new_array_intervals, day_equal.intervals);
            });

            new_array.push({
                id: item.id,
                day: item.day,
                intervals:  new_array_intervals
            })
        }

        array_already_pushed.push(item.day)
    });

    new_array.sort( (a,b) => {
        return moment(a.day, 'DD-MM-YYYY') - moment(b.day, 'DD-MM-YYYY');
    });

    return new_array;
}
/* End Help Functions */

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});