var parser = require( './parser' );
var processingData = require( './processingData' );
var createImages = require( './createImages' );

parser.convertFileTCXtoJSON( __dirname + '/3.tcx', __dirname + '/3.json', function ( err, rawData ) {

    if  ( err ) return;

    var data = processingData.normalizeData( rawData, createImages.routesSize, new Date("2016-10-01T07:12:57Z"), 150, 25 );
    createImages.create( data );

});