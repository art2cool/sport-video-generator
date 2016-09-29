var fs = require('fs');
var Canvas = require( 'canvas' );
var parser = require( './parser' );

var canvas = new Canvas( 200, 300 );
var ctx = canvas.getContext( '2d' );

var data;
parser.convertFileTCXtoJSON( __dirname + '/1.tcx', __dirname + '/1.json', function ( err, result ) {

    if  ( err ) return;

    data = result.trainingCenterDatabase.activities.activity.lap;

    var startTime =  new Date( data.$.startTime );
    var points = data.track.trackpoint;
    var pointsLatitude = points.map(function (item) {
        return item.position['latitudeDegrees'];
    });
    var pointsLongitude = points.map(function (item) {
        return item.position['longitudeDegrees'];
    });

    minLatitude = Math.min.apply(null, pointsLatitude);
    maxLatitude = Math.max.apply(null, pointsLatitude);
    minLongitude = Math.min.apply(null, pointsLongitude);
    maxLongitude = Math.max.apply(null, pointsLongitude);


    var coffLatitude = 200/(maxLatitude - minLatitude);
    var coffLongitude = 200/(maxLongitude - minLongitude);
    points = points.map( function( item ) {
        return { 
            x: Math.round( ( item.position.latitudeDegrees - minLatitude ) * coffLatitude ),
            y: Math.round( ( item.position.longitudeDegrees - minLongitude ) * coffLongitude ),
            time: ( new Date( item.time ) - startTime ) / 1000
        };
    });

    ctx.strokeStyle = 'rgba(255,255,255,1)';
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.font = '20px Arial';
    ctx.fillStyle='rgba(255,255,255,1)';
    ctx.fillText('Duration', 20, 250);

    ctx.moveTo( points[0].x, points[0].y );

    for ( var i = 1; i < points.length; i ++ ) {

        ctx.clearRect(0,250,200,100);
        ctx.lineTo( points[i].x, points[i].y );
        ctx.stroke();
        ctx.fillText(Math.floor(points[i].time/3600) + 'h ' + Math.floor(points[i].time%3600/60) + 'm ' + Math.floor(points[i].time%60) + 's', 20, 280);
        var base64Data = canvas.toDataURL().replace(/^data:image\/png;base64,/, "");
        fs.writeFile( __dirname + '/video/frame_' + ("00000" + i).slice(-5) + '.png', base64Data, 'base64', function (err) {
            if ( err ) console.log(err);
        });
    }

});

