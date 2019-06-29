var rotateSpeed = 60e3, // 1 minute
    isoAngle = 35,
    isoAngle2 = 90,
    lineCount = 140,
    noiseLevel = 50, // 40 percent noise
    pixelDoubling = 2; // doubled (1 for @1x, 2 for @0.5x, 4 for @0.25x, etc.)

// Work
window.addEventListener('load', kickOff, false);

function kickOff() {
    var canvas = document.createElement('canvas'),
        context = canvas.getContext('2d'),
        width = canvas.width = window.innerWidth / pixelDoubling,
        height = canvas.height = window.innerHeight / pixelDoubling,
        axisValue = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)) * 3;

    document.body.insertBefore(canvas, document.body.firstChild);

    var frameRate = 60,
        lastFrame = Date.now();

    context.fillStyle = 'white';
    context.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    context.strokeWidth = 0.5;

    var bgGradient = context.createRadialGradient(
            (width / 2) | 0,
            (height / 2) | 0,
            10,
            (width / 2) | 0,
            (height / 2) | 0,
            axisValue / 2),
        overlay = context.createLinearGradient(
            width / 2,
            height / 2,
            width / 2,
            height);

    bgGradient.addColorStop(0, 'rgba(40, 40, 40, 1)');
    bgGradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
    overlay.addColorStop(0, 'rgba(0, 0, 0, 0.5)');
    overlay.addColorStop(1, 'rgba(0, 0, 0, 0)');

    // Draws cycling isometric grid behind logo. In future, will switch to a
    // proper isometric projection, so data visualisation can be easily drawn
    // on the grid.
    (function runLoop(time) {
        var tau = Math.PI * 2,
            cameraX = Math.sin(((time % rotateSpeed) / rotateSpeed) * tau),
            cameraY = Math.cos(((time % rotateSpeed) / rotateSpeed) * tau),
            projectedCentreX = (width * 0.5) - (cameraX * width * 0.5),
            projectedCentreY = (height * 0.5) - (cameraY * height * 0.5),
            lineWidth = (axisValue / lineCount) | 0,
            lineHeight = (axisValue / lineCount) | 0,
            horizontalAngle = Math.sin(((isoAngle * -1) / 360) * tau),
            horizontalAngleInv = Math.sin((isoAngle / 360) * tau),
            verticalAngle = Math.sin(((isoAngle2 * -1) / 360) * tau),
            verticalAngleInv = Math.sin((isoAngle2 / 360) * tau),
            scaledNoise = (100 - noiseLevel) / 100;

        context.clearRect(0, 0, axisValue, axisValue);
        context.fillStyle = bgGradient;
        context.fillRect(0, 0, width, height);
        addNoise(context, width, height, scaledNoise);

        for (var lineIndex = 0; lineIndex < lineCount; lineIndex++) {
            var leftDistance = lineWidth * lineIndex,
                rightDistance = width - lineWidth * lineIndex,
                topDistance = leftDistance,
                bottomDistance = height - lineWidth * lineIndex,

                // line coords
                lineX1 = 0,
                lineY1 = (
                    (leftDistance * horizontalAngle) +
                        projectedCentreY + (axisValue / 5)),
                lineX2 = width,
                lineY2 = (
                    (rightDistance * horizontalAngleInv) +
                        projectedCentreY + (axisValue / 5));

            context.strokeStyle =
                'rgba(40, 40, 40, ' + (lineIndex % 4 ? '0.2' : '0.7') + ')';

            context.beginPath();
            context.moveTo(lineX1, lineY1);
            context.lineTo(lineX2, lineY2);
            context.stroke();

            // line coords
            var line2X1 = 0,
                line2Y1 = ((topDistance * verticalAngleInv) - projectedCentreX),
                line2X2 = width,
                line2Y2 = ((bottomDistance * verticalAngle) - projectedCentreX);

            context.beginPath();
            context.moveTo(line2X1, line2Y1);
            context.lineTo(line2X2, line2Y2);
            context.stroke();
        }

        context.fillStyle = overlay;
        context.fillRect(0, 0, width, height);

        frameRate = 1000 / (Date.now() - lastFrame);
        lastFrame = Date.now();

        window.requestAnimationFrame(runLoop, canvas);
    })(0);
}

// Adds image noise
function addNoise(context, width, height, amount) {
    var data = context.getImageData(0, 0, width, height);
    for (var pixIdx = 0; pixIdx < data.data.length; pixIdx += 4) {
        data.data[pixIdx + 3] = (
            data.data[pixIdx + 3] *
                (Math.random() + amount) | 0);
    }

    context.putImageData(data, 0, 0);
}
