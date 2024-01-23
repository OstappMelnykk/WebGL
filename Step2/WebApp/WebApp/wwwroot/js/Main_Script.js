function webGLStart() {

    var canvas = document.getElementById("canvasGL");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    document.body.style.margin = '0';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.margin = '0';
    document.documentElement.style.overflow = 'hidden';

    var gl = canvas.getContext("webgl", { antialias: false });

    initShaders(gl);

    var u_Pmatrix = gl.getUniformLocation(shaderProgram, 'u_Pmatrix');
    var u_Mmatrix = gl.getUniformLocation(shaderProgram, 'u_Mmatrix');
    var u_Vmatrix = gl.getUniformLocation(shaderProgram, 'u_Vmatrix');


    let x = 0.0
    let vertexes = [
        0.5, 0.5, 0.5,      //0
        0.5, -0.5, 0.5,     //1
        -0.5, -0.5, 0.5,    //2
        -0.5, 0.5, 0.5,     //3

        0.5, 0.5, -0.5,     //4
        0.5, -0.5, -0.5,    //5
        -0.5, -0.5, -0.5,   //6
        -0.5, 0.5, -0.5,    //7

        (0.5 + x), 0.0, (0.5 + x),      //8
        0.0, (-0.5 + x), (0.5 + x),     //9
        (-0.5 + x), 0.0, (0.5 + x),     //10
        0.0, (0.5 + x), (0.5 + x),       //11


        (0.5 + x), (0.5 + x), 0.0,      //12
        (0.5 + x), (-0.5 + x), 0.0,     //13
        (-0.5 + x), (-0.5 + x), 0.0,    //14
        (-0.5 + x), (0.5 + x), 0.0,     //15

        (0.5 + x), 0.0, (-0.5 + x),     //16
        0.0, (-0.5 + x), (-0.5 + x),    //17
        (-0.5 + x), 0.0, (-0.5 + x),    //18
        0.0, (0.5 + x), (-0.5 + x),    //19


        //axes
        //x
        100.0, 0.0, 0.0, //20
        -100.0, 0.0, 0.0, //21

        //y
        0.0, 100.0, 0.0, //22
        0.0, -100.0, 0.0, //23
        //z
        0.0, 0.0, 100.0, //24
        0.0, 0.0, -100.0, //25

    ]
    let indexes = [
        0, 8, 8, 1,
        1, 9, 9, 2,
        2, 10, 10, 3,
        3, 11, 11, 0,
        0, 12, 12, 4,
        4, 19, 19, 7,
        7, 15, 15, 3,
        7, 18, 18, 6,
        6, 17, 17, 5,
        5, 16, 16, 4,
        5, 13, 13, 1,
        6, 14, 14, 2,

        20, 21, 22, 23, 24, 25
    ]

    let indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexes), gl.STATIC_DRAW);

    let vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexes), gl.STATIC_DRAW)
    const positionAttrib = gl.getAttribLocation(shaderProgram, "a_Position");
    //gl.vertexAttribPointer(positionAttrib, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionAttrib);


    var PROJMATRIX = mat4.perspective(40, canvas.width / canvas.height, 1, 100);
    var VIEWMATRIX = mat4.create();
    var MODELMATRIX = mat4.create();

    mat4.identity(MODELMATRIX);
    mat4.identity(VIEWMATRIX);
    // --------------------------------------------------------------
    mat4.translate(VIEWMATRIX, [0.0, 0.0, -5.0]);
    mat4.translate(MODELMATRIX, [0.0, 0.0, 0.0]); //x y z
    mat4.scale(MODELMATRIX, [1.0, 1.0, 1.0]); //x y z
    mat4.rotateX(MODELMATRIX, 10); //x y z
    mat4.rotateY(MODELMATRIX, 10); //x y z
    mat4.rotateZ(MODELMATRIX, 0); //x y z

    gl.clearColor(0.5, 0.5, 0.5, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.uniformMatrix4fv(u_Pmatrix, false, PROJMATRIX);
    gl.uniformMatrix4fv(u_Mmatrix, false, MODELMATRIX);
    gl.uniformMatrix4fv(u_Vmatrix, false, VIEWMATRIX);

    gl.vertexAttribPointer(positionAttrib, 3, gl.FLOAT, false, 0, 0);
    //gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    gl.clearColor(0.5, 0.5, 0.5, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    //gl.drawArrays(gl.LINE_STRIP, 0, 8)
    //gl.drawElements(gl.LINES, indexes.length, gl.UNSIGNED_SHORT, 0);

    var isDragging = false;
    var lastMouseX = 0;
    var lastMouseY = 0;

    var totalangelX = 0;
    var totalangelY = 0;

    canvas.addEventListener('mousedown', function (ev) {
        isDragging = true;
        lastMouseX = ev.clientX;
        lastMouseY = ev.clientY;
    });

    canvas.addEventListener('mouseup', function () {
        isDragging = false;
    });

    canvas.addEventListener('mousemove', function (ev) {
        if (!isDragging) return;

        var deltaX = ev.clientX - lastMouseX;
        var deltaY = ev.clientY - lastMouseY;

        lastMouseX = ev.clientX;
        lastMouseY = ev.clientY;

        let angle = 0.001;

        totalangelX += angle * deltaX
        totalangelY += angle * deltaX

        mat4.rotateY(MODELMATRIX, -angle * deltaX);
        mat4.rotateZ(MODELMATRIX, -angle * deltaY);


        gl.clearColor(0.5, 0.5, 0.5, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.uniformMatrix4fv(u_Mmatrix, false, MODELMATRIX);
        gl.vertexAttribPointer(positionAttrib, 3, gl.FLOAT, false, 0, 0);

        gl.drawElements(gl.LINES, indexes.length, gl.UNSIGNED_SHORT, 0);
        //gl.drawElements(gl.POINTS, indexes.length, gl.UNSIGNED_SHORT, 0);
        gl.drawArrays(gl.POINTS, 0, vertexes.length);
        //gl.drawArrays(gl.LINE_STRIP, 0, 8)
        gl.flush();

    });


    gl.clearColor(0.5, 0.5, 0.5, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawElements(gl.LINES, indexes.length, gl.UNSIGNED_SHORT, 0);
    gl.flush();
}
webGLStart()