var Canvas = require( 'canvas' );
var GoogleMapsAPI = require('googlemaps');
var publicConfig = {
  key: 'AIzaSyCewqy5umSSijEeBBbhwqqVLodmk8anoBo',
  stagger_time:       1000, // for elevationPath
  encode_polylines:   false,
  secure:             true
};
var gmAPI = new GoogleMapsAPI(publicConfig);
var params = {
    size: '200x200',
    markers: [
    {
      location: '49.833288,24.039252',
    },
    {
      location: '49.825625,24.044695',
    }
  ],
};

var fs = require( 'fs' );

var canvasSize = {
    width: 200,
    height: 400
}

var routesSize = {
    width: 194,
    height: 194
}

var create = function ( points ) {

    var canvas = new Canvas( canvasSize.width, canvasSize.height );
    var ctx = canvas.getContext( '2d' );

    ctx.strokeStyle = 'rgba(255,255,255,1)';
    ctx.beginPath();
    ctx.lineWidth = 3;
    var routePadding = {
        top: 3,
        left: 3
    }
    ctx.font = '15px Arial';
    ctx.fillStyle = 'rgba(255,255,255,1)';
    ctx.fillText( 'Speed', 20, 250 );
    ctx.fillText( 'Avg. speed', 100, 250 );
    ctx.fillText( 'Distance', 20, 350 );
    ctx.fillText( 'Duration', 100, 350 );

    ctx.moveTo( points[0].x, points[0].y );

    for ( var i = 1; i < points.length; i ++ ) {

        ctx.clearRect( 0, 250, 200, 50 );
        ctx.clearRect( 0, 350, 200, 50 );

        ctx.lineTo( points[i].x + routePadding.left, points[i].y + routePadding.top );
        ctx.stroke();

        ctx.fillText( 
            points[i].speed.toFixed( 2 ) + 'km/h',
            20,
            280);
        ctx.fillText( 
            points[i].avgSpeed.toFixed( 2 ) + 'km/h',
            100,
            280);
        ctx.fillText( 
            points[i].distance.toFixed( 1 ) + 'km',
            20,
            380);
        ctx.fillText( 
            Math.floor( points[i].time / 3600 ) + 'h ' + 
            Math.floor( points[i].time % 3600 / 60 ) + 'm ' + 
            Math.floor( points[i].time % 60 ) + 's',
            100,
            380);

        var base64Data = canvas.toDataURL().replace( /^data:image\/png;base64,/, "" );
        fs.writeFile( __dirname + '/video/frame_' + ( "00000" + i ).slice( -5 ) + '.png', base64Data, 'base64', function ( err ) {

            if ( err ) console.log( err );

        });
        
    }


};

module.exports = {

    create: create,
    canvasSize: canvasSize,
    routesSize: routesSize

};

gmAPI.staticMap(params, function(err, binaryImage) {
    console.log(err);
  fs.writeFile( __dirname + '/video/agoogle.png', binaryImage, 'binary', function ( err ) {

            if ( err ) console.log( err );

        });
});