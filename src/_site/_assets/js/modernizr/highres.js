Modernizr.addTest('highres', function() {

    var dpr = window.devicePixelRatio ||
        (window.screen.deviceXDPI / window.screen.logicalXDPI) ||
        1;

    return dpr > 1;
});