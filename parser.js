var fs = require('fs'),
    xml2js = require('xml2js'),
    util = require('util');


var parseNumbers = function ( str ) {

    if ( !isNaN( str ) ) {

      str = str % 1 === 0 ? parseInt( str, 10 ) : parseFloat( str );

    }

    return str;

};

var firstCharLowerCase = function ( str ) {

    return str.charAt( 0 ).toLowerCase() + str.slice( 1 );

};

var parser = new xml2js.Parser({
    explicitArray : false,
    valueProcessors: [parseNumbers],
    attrValueProcessors: [parseNumbers],
    attrNameProcessors: [firstCharLowerCase],
    tagNameProcessors: [firstCharLowerCase]
}); 

var convertFileTCXtoJSON = function ( inputFile, outputFile, callback ) {

    fs.readFile( inputFile, function( err, data ) {

        if ( err ) return callback( err );

        parser.parseString( data, function ( err, result ) {

            if ( err ) return callback( err );

            fs.writeFile( outputFile, JSON.stringify( result, null, 4 ), function ( err ) {

                if ( err ) return callback( err );
                callback( null, result );

            });

        });

    });

};

var convertDataTCXtoJSON = function ( inputData, callback ) {

    parser.parseString( inputData, function ( err, result ) {

        return callback( err, result );

    });

};

module.exports = {
    convertDataTCXtoJSON: convertDataTCXtoJSON,
    convertFileTCXtoJSON: convertFileTCXtoJSON
}

