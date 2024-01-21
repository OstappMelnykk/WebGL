function getShader(gl, id, str) {

    var shader;
    if (id == 'vs')
        shader = gl.createShader(gl.VERTEX_SHADER);
    else if (id == 'fs')
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    else
        return null;

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}

function initShaders(gl) {
    var VS = getShader(gl, 'vs', VSHADER_SOURCE);
    var FS = getShader(gl, 'fs', FSHADER_SOURCE);

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, VS);
    gl.attachShader(shaderProgram, FS);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);
}
