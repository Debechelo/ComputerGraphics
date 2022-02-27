"use strict";

// Исходный код вершинного шейдера
const vsSource = `#version 300 es

in vec3 vertexPosition;

void main() {
    float x_angle = 1.0;
    float y_angle = 1.0;

    mat3 transform = mat3(
        
        0, cos(x_angle),  sin(x_angle),
        0, -sin(x_angle), cos(x_angle),
        1, 0, 0
    ) * mat3(
        0, 1, 0,
        cos(y_angle), 0, sin(y_angle),
        
        -sin(y_angle), 0, cos(y_angle)
    );
    gl_Position = vec4(vertexPosition * transform, 1.0);
}
`;

const fsSource = `#version 300 es

precision mediump float;
out vec4 color; 

void main() {
    color = vec4(0.5, 0.5, 0, 1);
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
    // Включаем z-buffer
    gl.enable(gl.DEPTH_TEST);

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

    let p000 = [-0.5, -0.5, -0.5]
    let p001 = [-0.5, -0.5, +0.5]
    let p010 = [-0.5, +0.5, -0.5]
    let p011 = [-0.5, +0.5, +0.5]
    let p100 = [+0.5, -0.5, -0.5]
    let p101 = [+0.5, -0.5, +0.5]
    let p110 = [+0.5, +0.5, -0.5]
    let p111 = [+0.5, +0.5, +0.5]

    const positions = [
            // Нижняя грань
            [p101, p001, p000],
            [p100, p101, p000],
            // Передняя грань
            [p001, p011, p111],
            [p001, p111, p101],
            // Верхняя грань
            [p011, p010, p110],
            [p011, p110, p111],
            // Задняя грань
            [p000, p010, p110],
            [p000, p110, p100],
            // Левая грань
            [p000, p010, p011],
            [p000, p011, p001],
            // Правая грань
            [p110, p111, p101],
            [p110, p101, p100],
        ].flat(2) // Превращаем в плоский массив

    const positionBuffer = makeF32ArrayBuffer(gl, positions);

    return {
        positionBuffer,
        bufferLength: positions.length,
    };
}

function makeF32ArrayBuffer(gl, array) {

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(array),
        gl.STATIC_DRAW
    );
    return buffer
}


function drawScene(gl, programInfo, buffers) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionBuffer);
    gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition,3,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexPosition
    );
    gl.useProgram(programInfo.program);

    gl.drawArrays(gl.TRIANGLES,0,buffers.bufferLength);

}