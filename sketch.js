const scales = data["scales"]
const startingScale = scales["d_diatonic"]
var canvas;
var curr_scale = "d_diatonic";
var lastclick;
var selectedMidi;
var lastAutoPChange;
var autopilotIsRunning = false;

var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);


//make the keys navigate the same journey as the touch
//maybe just add 49 rather than using a dictionary
const num_convert = {
    49: 0,
    50: 1,
    51: 2,
    52: 3,
    53: 4,
    54: 5
};

$(document).ready(function() {
    $('#purpose').on('change', function() {
        console.log(this.value);
        if (this.value == '0') {
            $("#mandolin_container").show();
        } else if (this.value == '1') {
            $("#guitar_container").show();
        } else if (this.value == '2') {
            $("#banjo_container").show();
        } else if (this.value == '3') {
            $("#ukulele_container").show();
        } else if (this.value == '4') {
            $("#flute_container").show();
        } else if (this.value == '5') {
            $("#piano_container").show();
        } else if (this.value == '6') {
            $("#notation_container").show();
        } else if (this.value == '7') {
            $("#chordstext_container").show();
        } else if (this.value == '8') {
            $("#chordcircle_container").show();
        } else if (this.value == '9') {
            $("#snharp_container").show();
        } else if (this.value == '10') {
            $("#midi_container").show();} 
        // else if (this.value == '11') {
        //     $("#graph_container").show();
        // }


    });
});

function drawGradient() {
    rectMode(CENTER);
    noStroke();
    fill('white');
    rect($(".scalenav_container").width() / 2, $(".scalenav_container").height() / 2, $(".scalenav_container").width(), $(".scalenav_container").height());
}

function setup() {
    if (isChrome == true){
        document.getElementById("output_port_selector").addEventListener("change", function(evt) {
            selectedMidi = evt.target.value;
            console.log(selectedMidi);
        })

    }
    
    ellipseMode(RADIUS);
    canvas = createCanvas($(".scalenav_container").width(), $(".scalenav_container").height());
    canvas.parent('scale_navigator');
    drawGradient();
    pick_scale(curr_scale);
    frameRate(30); //there are other ways to do timing, like setInterval()
}

var midi;
function on_midi_success(arg_midi) {
    console.log("MIDI connection was successful");
    midi = arg_midi;

    const outputs = arg_midi.outputs;
    for (let output of outputs.values()){
        var opt = document.createElement("option");
        opt.text = output.name;
        document.getElementById("output_port_selector").add(opt);
    }
}

function on_midi_failure(error_code) {
    console.error("Could not connect to MIDI: error code " + error_code);
}

if (isChrome == true){
    navigator.requestMIDIAccess().then(on_midi_success, on_midi_failure);
}


//abstract the logic in here into separate classes

const no_fly_list = [];
no_fly_list.unshift(curr_scale);

// var RoomJoined = false;
// if( $('#available-rooms').has('option').length > 0 ) {
//     RoomJoined = true;
//     console.log("room joined!", RoomJoined);
// }


// if ((document.getElementById("host-select") === null || document.getElementById("host-select").value === false) && (RoomJoined === true)){
//     check if you are the host. if no, then disable "am host" checkbox and "autopilot" checkbox
    //document.getElementById("myCheck").disabled = true;
// } 


$(function(){
    //Store the test paragraph node
    var el = $('#scale_from_firebase');

    //Observe the paragraph
    this.observer = new MutationObserver( function(mutations) {
        if (document.getElementById("send_to_firebase").innerHTML === document.getElementById("scale_from_firebase").innerHTML){
        return;
        } else {
            key = document.getElementById("scale_from_firebase").innerHTML;
            touch_data = [];
            drawGradient();
            pick_scale(key);

        }

        
    }.bind(this));
    this.observer.observe(el.get(0), {characterData: true, childList: true});
});


if ("ontouchstart" in document.documentElement) {
    console.log("your device IS a touch screen device.");

    function touchEnded() {
        if (event.type != 'mouseup') {
            lastclick = frameCount;
            autopilotIsRunning = false;
            //console.log("touch data", touch_data);
            var key;
            for (let i = 0; i < touch_data.length; i++) {
                if (Math.abs(mouseX - touch_data[i].x) < touch_data[i].ssize && Math.abs(mouseY - touch_data[i].y) < touch_data[i].ssize) {
                    key = touch_data[i].k;
                    touch_data = [];
                    drawGradient();
                }
            }
            if (key === undefined) {
                return;
            }
            pick_scale(key);
            no_fly_list.unshift(key);

            if (no_fly_list.length > 6) {
                no_fly_list.pop();
            }
        }
    }
} else {
    console.log("your device is NOT a touch device");

    function mouseClicked() {


        lastclick = frameCount;
        autopilotIsRunning = false;
        //console.log("touch data", touch_data);
        var key;
        for (let i = 0; i < touch_data.length; i++) {
            if (Math.abs(mouseX - touch_data[i].x) < touch_data[i].ssize && Math.abs(mouseY - touch_data[i].y) < touch_data[i].ssize) {
                key = touch_data[i].k;
                touch_data = [];
                drawGradient();
            }
        }
        if (key === undefined) {
            return;
        }


        pick_scale(key);
        no_fly_list.unshift(key);

        if (no_fly_list.length > 6) {
            no_fly_list.pop();
        }
        //console.log('the no fly list:', no_fly_list, no_fly_list.length);
    }
}

function autopilot(key) {
    autopilotIsRunning = true;
    lastAutoPChange = frameCount;
    touch_data = [];
    drawGradient();
    //console.log("autopilot Is Running", key);
    // for random adjacent
    // keep track of last scale name
    // get random adjacent from last scale name
    // instead of random scale - get random adjacent from last randomKey
    fly_list = scales[key].adjacent_scales;

    no_fly_list.unshift(key);


    if (no_fly_list.length > 6) {
        no_fly_list.pop();
    }

    fly_list = fly_list.filter(function(val) {
        return no_fly_list.indexOf(val) == -1;
    });
    // console.log('flylist', fly_list);

    var r = random(fly_list);
    var random_scale = [r];
    pick_scale(random(random_scale));


    //console.log('the no fly list:', no_fly_list, no_fly_list.length);


}

var rhythms = [1, 2];


function draw() {
    var check_box = document.getElementById("autopilot_checkbox");
    if ((frameCount - lastclick) >= 300 && autopilotIsRunning == false && check_box.checked == true) {

        autopilot(touch_data[0].k);
        // once autopilot is enabled - we need a boolean to say whether its running
        autopilotIsRunning = true;

    } else if ((frameCount - lastAutoPChange) >= 600 * random(rhythms) && autopilotIsRunning == true && check_box.checked == true) {
        autopilot(touch_data[0].k);
    }
}

function windowResized() {
    resizeCanvas($(".scalenav_container").width(), $(".scalenav_container").height());
    pick_scale(touch_data[0].k);

}

// function takes chord A and chord br
// returns true or false whether or not transition is OK

function mod(a, b) {
    return ((a % b) + b) % b;
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

var note_names = ["C", "D♭", "D", "E♭", "E", "F", "F#", "G", "A♭", "A", "B♭", "B"];

var currTritoneRoot;
currTritoneRoot = 1;
var currMajThirdRoot;
currMajThirdRoot = 0;

function pick_scale(key) {
    
    document.getElementById("send_to_firebase").innerHTML = key;

    console.log(key);
    render_notation(key);

    showPianoNotes(scales[key].pitch_classes);
    displayFluteDiagrams(scales[key].pitch_classes);
    showGuitarNotes(scales[key].pitch_classes);
    showCircleChords(scales[key].chords);
    index = num_convert[keyCode];

    if (index !== undefined && (index) < scales[key].adjacent_scales.length) {
        key = scales[key].adjacent_scales[index];
        curr_scale = key;
    }

    drawScale(key, $(".scalenav_container").width() / 2, $(".scalenav_container").height() / 2, 1, [], -1);
    document.getElementById("chords1").innerHTML = scales[key].chords;
    document.getElementById("chords1").style.fontSize = '30px';

    function rgb(r, g, b){
      return "rgb("+r+","+g+","+b+")";
    }

    if (scales[key].scale_class == "whole_tone") {
        fill(map(scales[key].root % 2, 0, 1, 200, 150));
        fontcolor = map(scales[key].root % 2, 0, 1, 200, 150);
        document.getElementById("logo").style.color=rgb(fontcolor,fontcolor,fontcolor);
    } else if (scales[key].scale_class == "octatonic") {
        fill(map(scales[key].root % 3, 0, 2, 200, 133));
        fontcolor = map(scales[key].root % 3, 0, 2, 200, 133);
        document.getElementById("logo").style.color=rgb(fontcolor,fontcolor,fontcolor);
    } else if (scales[key].scale_class == "hexatonic") {
        fill(map(scales[key].root % 4, 0, 3, 200, 100));
        fontcolor = map(scales[key].root % 4, 0, 3, 200, 100);
        document.getElementById("logo").style.color=rgb(fontcolor,fontcolor,fontcolor);
    } else {
        fill(hsvToRgb(map((scales[key].root * 7) % 12, 11, 0, 0, 1),
            map((scales[key].root * 7) % 12, 0, 11, 0.1, 0.5),
            1));
        fontcolor = hsvToRgb(map((scales[key].root * 7) % 12, 11, 0, 0, 1),
            map((scales[key].root * 7) % 12, 0, 11, 0.1, 0.5),
            1);
        document.getElementById("logo").style.color=rgb(fontcolor[0],fontcolor[1],fontcolor[2]);
    }

    var tritoneList = [];
    var majorThirdList = [];

    for( let i = 0; i < scales[key].pitch_classes.length; i++ ) {
        for( let j = 0; j < scales[key].pitch_classes.length; j++ ) {

            if((scales[key].pitch_classes[i] != scales[key].pitch_classes[j]) && ((scales[key].pitch_classes[i]-scales[key].pitch_classes[j])%6==0)){
                //console.log(scales[key].pitch_classes[i], " minus ", scales[key].pitch_classes[j], "modulo 6 equals ", (scales[key].pitch_classes[i]-scales[key].pitch_classes[j])%6);
                if ((scales[key].pitch_classes[i] < 6)&&(scales[key].pitch_classes[i])>-6){
                    tritoneList.push(scales[key].pitch_classes[i]);
                    tritoneList.push(scales[key].pitch_classes[i]-12);
                }
                
            }
        }
    }
    var num = currTritoneRoot;
    
    
    var tritoneList = tritoneList.sort((a, b) => Math.abs(a - num) - Math.abs(b - num));
    
    
    console.log("ttlist, ", tritoneList);
    currTritoneRoot = tritoneList[0];
    console.log("from that, weve decided the tt is now ",currTritoneRoot);


    
    if (!midi) {
        return;
    }
    midi.outputs.forEach(function (port, port_id) {
        if (port.name == selectedMidi ) {
            for( let i = 0; i < 127; i++ ) {
                port.send([146, i, 0]);
            }
            for( let i = 0; i < 127; i++ ) {
                port.send([147, i, 0]);
            }
            for( let i = 0; i < 127; i++ ) {
                port.send([148, i, 0]);
            }
            for( let i = 0; i < 127; i++ ) {
                port.send([149, i, 0]);
            }
            for( let i = 0; i < 127; i++ ) {
                port.send([150, i, 0]);
            }
            port.send([146, scales[key].video_index-1, 127]); 
            port.send([147, scales[key].pitch_classes[0], 127]); 
            port.send([148, scales[key].root, 127]); 
            port.send([150, 127, 127]); 
            sleep(20);
            for( let i = 0; i < scales[key].pitch_classes.length; i++ ) {
                port.send([149, scales[key].pitch_classes[i], 127]);
            }
            sleep(20);
            port.send([150, 0, 127]); 

        }
    });
}

function polygon(x, y, radius, npoints, sClass) {
    noStroke();
    angle = TWO_PI / npoints;
    beginShape();
    for (let a = 0; a < TWO_PI; a += angle) {
        if (npoints == 12) {
            let sx = x + cos(a + (TWO_PI / 24)) * radius;
            let sy = y + sin(a + (TWO_PI / 24)) * radius;
            vertex(sx, sy);
        }

        if (npoints == 6) {
            if (sClass == "diatonic") {
                let sx = x + cos(a + (TWO_PI / 12)) * radius;
                let sy = y + sin(a + (TWO_PI / 12)) * radius;
                vertex(sx, sy);
            }
            if (sClass == "acoustic") {
                vertex(x + radius, y + radius * 0.5);
                vertex(x - radius, y + radius * 0.5);
                vertex(x - radius, y - radius * 0.5);
                vertex(x + radius, y - radius * 0.5);
            }
            if (sClass == "whole_tone") {
                vertex(x - radius * 0.5, y - radius);
                vertex(x + radius * 0.5, y - radius);
                vertex(x + radius * 0.5, y + radius);
                vertex(x - radius * 0.5, y + radius);
            }
            if (sClass == "hexatonic") {
                vertex(x + radius * 0.65, y + radius);
                vertex(x + radius * 0.65, y - radius);
                vertex(x - radius, y + radius * 0.01);
            }
            if (sClass == "harmonic_major") {
                vertex(x + radius, y + radius * 0.25);
                vertex(x - radius, y + radius * 1.25);
                vertex(x - radius, y - radius * 0.25);
                vertex(x + radius, y - radius * 1.75);
            }
            if (sClass == "harmonic_minor") {
                vertex(x + radius, y + radius * 1.25);
                vertex(x - radius, y + radius * 0.25);
                vertex(x - radius, y - radius * 1.75);
                vertex(x + radius, y - radius * 0.25);
            }

        }
    }
    endShape(CLOSE);
}


//delete this later, use p5 native hsv mode
function hsvToRgb(h, s, v) {
    var r, g, b;

    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);

    switch (i % 6) {
        case 0:
            r = v, g = t, b = p;
            break;
        case 1:
            r = q, g = v, b = p;
            break;
        case 2:
            r = p, g = v, b = t;
            break;
        case 3:
            r = p, g = q, b = v;
            break;
        case 4:
            r = t, g = p, b = v;
            break;
        case 5:
            r = v, g = p, b = q;
            break;
    }

    return [r * 255, g * 255, b * 255];
}

function noteToFreq(note) {
    let a = 440; //frequency of A (coomon value is 440Hz)
    return (a / 32) * (2 ** ((note - 9) / 12));
}

//keep tally of wha's been printed so far
const nodes_visited = {};

var touch_data = [];

var fontcolor;

//pass angle into recersive function
function drawScale(key, x, y, level, ancestors, offset) {
    //function drawscale(key, x, y, level, angle)
    //copy the array so that we dont modify the original with recursion
    ancestors = ancestors.slice();
    //add it to the ancestors array
    ancestors.push(key);


    if (scales[key].scale_class == "whole_tone") {
        fill(map(scales[key].root % 2, 0, 1, 200, 150));
        fontcolor = map(scales[key].root % 2, 0, 1, 200, 150);
    } else if (scales[key].scale_class == "octatonic") {
        fill(map(scales[key].root % 3, 0, 2, 200, 133));
        fontcolor = map(scales[key].root % 3, 0, 2, 200, 133);
    } else if (scales[key].scale_class == "hexatonic") {
        fill(map(scales[key].root % 4, 0, 3, 200, 100));
        fontcolor = map(scales[key].root % 4, 0, 3, 200, 100);
    } else {
        fill(hsvToRgb(map((scales[key].root * 7) % 12, 11, 0, 0, 1),
            map((scales[key].root * 7) % 12, 0, 11, 0.1, 0.5),
            1));
        fontcolor = hsvToRgb(map((scales[key].root * 7) % 12, 11, 0, 0, 1),
            map((scales[key].root * 7) % 12, 0, 11, 0.1, 0.5),
            1);
    }

    // console.log("fonty colory", fontcolor);
    const shape_size = ($(".scalenav_container").height() * (0.15) / level);

    //all of the babie
    let filt_adjacent_scales = scales[key].adjacent_scales;

    //filter out all ancestors

    filt_adjacent_scales = filt_adjacent_scales.filter(function(item) {
        return ancestors.indexOf(item) === -1;

    });

    if (level < 3) {
        touch_data.push({
            x: x,
            y: y,
            ssize: shape_size,
            k: key
        });
    }

    //color scheme by scale class
    polygon(x, y, shape_size, scales[key].adjacent_scales.length, scales[key].scale_class);

    stroke(0);
    fill(0, 0, 0);
    const font_size_1 = 32 / level;
    //textSize(font_size_1);
    //text(note_names[scales[key].root], x-(9 / level)-1, y-1);
    //text(scales[key].scale_class, x-(54 / level)-1, y+(33 / level)-1); //print out scale class
    fill(80, 80, 80);
    const font_size_2 = 30 / level;
    textSize(font_size_2);
    text(note_names[scales[key].root], x - (8 / level), y);
    textAlign(CENTER);
    var scale_class = scales[key].scale_class.replace("_", "\n");
    text(scale_class, x - (9 / level), y + (33 / level)); //print out scale class
    fill(0);

    if (level > 1) {
        return
    }

    for (let i = 0; i < filt_adjacent_scales.length; i++) {


        var angle;
        let divisor = pow(2, level);

        if (level == 1) {
            angle = map(i, 0, filt_adjacent_scales.length, 0, (TWO_PI));
        } else {
            // angle = map(i, 0, filt_adjacent_scales.length, 0, (PI)); 
            let middle = Math.round((filt_adjacent_scales.length - 1) / 2);
            let pos = i - middle;
            angle = map(pos, 0, filt_adjacent_scales.length, offset - (PI / divisor), offset + (PI / divisor)) + (PI / divisor);
        }


        let theta = map(i, 0, scales[key].adjacent_scales.length, 0, (TWO_PI / (level * level)));
        if (level > 1) {
            // angle = angle + theta;
        }
        let newX = x + sin(angle + TWO_PI) * (($(".scalenav_container").width() * 0.42) / level);
        let newY = y + cos(angle + TWO_PI) * (($(".scalenav_container").height() * 0.36) / level);
        //rotate(cos(TWO_PI/adjacent_scales.length));

        drawScale(filt_adjacent_scales[i], newX, newY, level + 1, ancestors, angle);
    }
}