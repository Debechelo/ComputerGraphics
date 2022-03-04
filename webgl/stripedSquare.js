"use strict";

const vsSource = `#version 300 es

// Координаты вершины. Атрибут, инициализируется через буфер.
in vec2 vertexPosition;
out vec2 vPosition;
void main() {
    gl_Position = vec4(vertexPosition, 0.0, 1.0);
    vPosition = vertexPosition;
}
`;

const fsSource = `#version 300 es
precision mediump float;

out vec4 color;
in vec2 vPosition;
void main() {
float k = 20.0;
int sum = int(vPosition.x * k);
if(vPosition.x < 0.0){
    if ((sum % 2) == 0 ) {
            color = vec4(1, 1, 1, 1);
    } else {
            color = vec4(0, 0.8, 0.8, 1);
    }
} else {
    if ((sum % 2) == 0 ) {
        color = vec4(0, 0.8, 0.8, 1);
    } else {
        color = vec4(1, 1, 1, 1); 
    }
}
}
`;

window.onload = function main() {

    const canvas = document.querySelector("#gl_canvas");
    const gl = canvas.getContext("webgl2");

    if (gl === null) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'vertexPosition'),
        },
    };

    const buffers = initBuffer(gl)
    drawScene(gl, programInfo, buffers);
}

function loadShader(gl, type, source) {
    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

function initShaderProgram(gl, vsSource, fsSource) {

    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    return shaderProgram;
}

function initBuffer(gl) {

    let p00 = [-0.5, -0.5]
    let p01 = [-0.5, 0.5]
    let p11 = [0.5, 0.5]
    let p10 = [0.5, -0.5]
    const positions = [
        [p00, p01, p11],
        [p00, p10, p11],
        ].flat(2)

    const positionBuffer = makeF32ArrayBuffer(gl, positions);
    return {
        positionBuffer,
        bufferLength: positions.length,
    };
}

function makeF32ArrayBuffer(gl, array) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(array),gl.STATIC_DRAW);
    return buffer
}

function drawScene(gl, programInfo, buffers) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionBuffer);
    gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition,2,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
    gl.useProgram(programInfo.program);
    gl.drawArrays(gl.TRIANGLES,0,buffers.bufferLength/2);
}