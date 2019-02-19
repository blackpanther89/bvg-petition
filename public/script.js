//logic for the canvas element

(() => {
    var canvas = document.getElementById('canvas');

    var ctx = canvas.getContext('2d');
    var input = document.querySelector('.canvas');
    var register = document.getElementById('register');

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';

    let onX = 0;
    let onY = 0;
    let userDrawing = false;

    function draw(e) {
        if (!userDrawing) return;
        ctx.beginPath();
        ctx.moveTo(onX, onY);
        ctx.lineTo(e.offsetX, e.offsetY);
        onX = e.offsetX;
        onY = e.offsetY;
        ctx.stroke();
    }

    canvas.addEventListener(`mousedown`, e => {
        userDrawing = true;
        onX = e.offsetX;
        onY = e.offsetY;
    });
    canvas.addEventListener(`mousemove`, draw);

    canvas.addEventListener(`mouseup`, () => {
        userDrawing = false;
    });

    register.addEventListener(`click`, () => {
        input.value = canvas.toDataURL();
        console.log(input.value);
    });
})();
