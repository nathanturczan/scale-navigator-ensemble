// Helper functions

$(document).ready(function() {
    $('#select_instrument').on('change', function() {
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
        } 
    });
});

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