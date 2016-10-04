// normalize routes to canvas size
var normalizeData = function ( parsedData, routesScaleToSize, startDate, duration ) {

    var data = parsedData.trainingCenterDatabase.activities.activity.lap;

    var compare = function ( item1, item2 ) {

        if ( new Date(item1.time) > new Date(item2) ) return 1;
        if ( new Date(item1.time) < new Date(item2) ) return -1;
        if ( +new Date(item1.time) == +new Date(item2) ) return 0;

    }
    var tempDate = new Date( startDate );
    var startIndex = binaryIndexOf( data.track.trackpoint, startDate, compare);
    var finishIndex = binaryIndexOf( data.track.trackpoint, tempDate.setSeconds( tempDate.getSeconds() + duration ), compare);

    var points = data.track.trackpoint.slice( startIndex, finishIndex + 3 );
    var startTime =  new Date( data.$.startTime );

    var pointsLatitude = points.map( function ( item ) {

        return item.position[ 'latitudeDegrees' ];

    });

    var pointsLongitude = points.map( function ( item ) {

        return item.position[ 'longitudeDegrees' ];

    });

    minLatitude = Math.min.apply( null, pointsLatitude );
    maxLatitude = Math.max.apply( null, pointsLatitude );
    minLongitude = Math.min.apply( null, pointsLongitude );
    maxLongitude = Math.max.apply( null, pointsLongitude );

    console.log(minLatitude,maxLatitude, minLongitude,maxLongitude);

    var coffLatitude = routesScaleToSize.width / ( maxLatitude - minLatitude );
    var coffLongitude = routesScaleToSize.height / ( maxLongitude - minLongitude );

    points = points.map( function ( item ) {

        var time = ( new Date( item.time ) - startTime ) / 1000;
        return { 
            x: Math.round( ( item.position.latitudeDegrees - minLatitude ) * coffLatitude ),
            y: Math.round( ( item.position.longitudeDegrees - minLongitude ) * coffLongitude ),
            time: time,
            distance: item.distanceMeters,
            avgSpeed: item.distanceMeters / ( time / 3600 )
        };

    });

    for ( var i = 1; i < points.length - 1; i ++ ) {

        points[ i ].speed = ( ( points[ i  + 1 ].distance - points[ i - 1 ].distance ) * 3600 / ( points[ i + 1 ].time - points[ i - 1 ].time ) );

    }

    var result = [];
    var j = 0;
    var item = {};
    var curSec = ( startDate - startTime ) / 1000;

    for ( var i = 0; i <= duration; i ++ ) {
        
        while ( curSec > points[ j + 1 ].time ) {

            j++;

        }

        var coff = ( curSec - points[ j ].time ) / ( points[ j + 1 ].time - points[ j ].time ); if (coff>1) console.log(curSec,points[ j ].time,points[ j + 1 ].time);
        item = {
            x: Math.round( points[ j ].x + ( points[ j + 1 ].x - points[ j ].x ) * coff ),
            y: Math.round( points[ j ].y + ( points[ j + 1 ].y - points[ j ].y ) * coff ),
            time: curSec,
            distance: points[ j ].distance + ( points[ j + 1 ].distance - points[ j ].distance ) * coff,
            avgSpeed: points[ j + 1 ].avgSpeed,
            speed: points[ j ].speed + ( points[ j + 1 ].speed - points[ j ].speed ) * coff || points[ j + 1 ].speed 
        }
        result.push(item);

        curSec ++;
    }

    return result;

};

// binary search point in data the nearest to startDate
var binaryIndexOf = function ( array, searchElement, compare ) {
    'use strict';
 
    var minIndex = 0;
    var maxIndex = array.length - 1;
    var currentIndex;
    var currentElement;
 
    while ( minIndex <= maxIndex ) {

        currentIndex = ( minIndex + maxIndex ) / 2 | 0;
        currentElement = array[ currentIndex ]; 
    
        if ( maxIndex - minIndex === 1 && new Date( searchElement ) > new Date( array[ minIndex].time ) && searchElement < new Date( array[ maxIndex].time ) ) {

            return minIndex;

        }
        if ( maxIndex - minIndex === 0 ) {

            return minIndex;

        }
        if ( compare(currentElement,searchElement) === -1 ) {

            minIndex = currentIndex;

        } else if ( compare(currentElement, searchElement) === 1 ) {

            maxIndex = currentIndex;

        } else {

            return currentIndex;

        }

    }
 
    return -1;

}

module.exports = {
    normalizeData: normalizeData
};

