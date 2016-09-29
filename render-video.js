'use strict';

const ffmpeg = require('fluent-ffmpeg');
const path = require('path');

//let command = new FfmpegCommand();

let filename = 'goprobike.mp4';
let filename2 = 'inputfile.mp4';
let filename3 = 'frame_%5d.png';

let filepath = path.join(__dirname + '/video-sample/' + filename);
let filepath2 = path.join(__dirname + '/video-sample/' + filename2);
let filepath3 = path.join(__dirname + '/image-simple/' + filename3);


// ffmpeg(filepath)
//     .ffprobe(function(err, data) {
//         console.log('file2 metadata:');
//         console.dir(data);
//      });
/*
    ffmpeg(filepath)
        // .videoFilter(      {
        //     filter: 'drawtext',
        //     options: {
        //         fontfile: path.join(__dirname + '/fonts/lucida-grande.ttf'),
        //         text: 'THIS IS TEXT form ROLIQUE!!!',
        //         fontsize: 24,
        //         fontcolor: 'white',
        //     }
        // )
        .complexFilter([
            // Rescale input stream into stream 'rescaled'
            'scale=640:480[rescaled]',
            {
                filter: 'drawtext',
                 inputs: 'rescaled', outputs: 'rescaled2',
                options: {
                    fontfile: path.join(__dirname + '/fonts/lucida-grande.ttf'),
                    text: '111111THIS IS TEXT form ROLIQUE!!!',
                    fontsize: 24,
                    fontcolor: 'white',
                }
            },

            // Duplicate rescaled stream 3 times into streams a, b, and c
            {
              filter: 'split', options: '3',
              inputs: 'rescaled2', outputs: ['a', 'b', 'c']
            },

            // Create stream 'red' by removing green and blue channels from stream 'a'
            {
              filter: 'lutrgb', options: { g: 0, b: 0 },
              inputs: 'a', outputs: 'red'
            },

            // Create stream 'green' by removing red and blue channels from stream 'b'
            {
              filter: 'lutrgb', options: { r: 0, b: 0 },
              inputs: 'b', outputs: 'green'
            },

            // Create stream 'blue' by removing red and green channels from stream 'c'
            {
              filter: 'lutrgb', options: { r: 0, g: 0 },
              inputs: 'c', outputs: 'blue'
            },

            // Pad stream 'red' to 3x width, keeping the video on the left,
            // and name output 'padded'
            {
              filter: 'pad', options: { w: 'iw*3', h: 'ih' },
              inputs: 'red', outputs: 'padded'
            },

            // Overlay 'green' onto 'padded', moving it to the center,
            // and name output 'redgreen'
            {
              filter: 'overlay', options: { x: 'w', y: 0 },
              inputs: ['padded', 'green'], outputs: 'redgreen'
            },

            // Overlay 'blue' onto 'redgreen', moving it to the right
            {
              filter: 'overlay', options: { x: '2*w', y: 0 },
              inputs: ['redgreen', 'blue'], outputs: 'output'
            },
        ], 'output')*/
/*
ffmpeg -itsoffset 30 -i video_pip.mp4 -i video_master.mp4 -filter_complex
"[0]scale=iw/3:ih/3 [pip]; [1][pip] overlay=main_w-overlay_w-10:main_h-overlay_h-10:enable='between(t,30,75)'"
 -profile:v main -level 3.1 -b:v 440k -ar 44100 -ab 128k -s 1920x1080 -vcodec h264 -acodec libfaac output.mp4

*/

ffmpeg(filepath)
.fpsOutput('25')
.setStartTime('00:00:05')
    .setDuration('30')
    //.input(filepath2)
    .addInput(filepath3)
    .complexFilter([
        // '[0]scale=640:480[bg]',
         '[1]scale=1.5*iw:1.5*ih:interl=1[pip]',
        // '[2]scale=640:480[image]',
        {
          filter: 'overlay', options: { x: 10, y: 20},
          inputs: ['[0]', 'pip'], outputs: 'piped'
      },
    //     {
    //       filter: 'overlay', options: { x: 0, y: 0},
    //       inputs: ['bg', 'pip'], outputs: 'piped'
    //   },
      {
          filter: 'drawtext',
           inputs: 'piped', outputs: 'output',
          options: {
              x: 600,
              y: 50,
              fontfile: path.join(__dirname + '/fonts/lucida-grande.ttf'),
              text: 'THIS IS TEXT form ROLIQUE!!!',
              fontsize: 18,
              fontcolor: 'blue',
          }
      },
    ], 'output')

        //.videoCodec('libx264')
//.audioCodec('libmp3lame')
        .on('start', function() {
            console.log('Render started !');
        })
          .on('error', function(err) {
            console.log('An error occurred: ' + err.message);
          })
          .on('end', function() {
            console.log('Processing finished !');
          })
        .save(path.join(__dirname +'/out-video/outputfile.mp4'));
