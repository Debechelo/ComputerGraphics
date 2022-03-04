"use strict";

const vsSource = `#version 300 es
in vec2 vertexPosition;
void main() {
    gl_Position = vec4(vertexPosition, 0.0, 1.0);
}
`;


const fsSource = `#version 300 es
precision mediump float;
out vec4 color;
void main() {
    color = vec4(1, 0, 0, 1);
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

    let radius = 0.5
    let pos = []
    for(let i=0; i<5; i++){
        let x = radius * Math.sin(Math.PI*2/5 * i);
        let y = radius * -Math.cos(Math.PI*2/5 * i);
        pos.push([x, y])
      }
      const positions = [
        [pos[0], pos[1], pos[2]],
        [pos[0], pos[2], pos[3]],
        [pos[0], pos[3], pos[4]],
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

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(array),gl.STATIC_DRAW);

    return buffer
}

function drawScene(gl, programInfo, buffers) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionBuffer);
    gl.vertexAttribPointer(

    programInfo.attribLocations.vertexPosition,2,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

    gl.useProgram(programInfo.program);
    gl.drawArrays(gl.TRIANGLES,0,buffers.bufferLength/2);

}