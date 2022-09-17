import tex from './texture/oasis.png'
import VShader from '/src/vertexShader'
import FShader from '/src/fragmentShader'

"use strict";

var angle = 0.0


main();

function main() {
    const canvas = document.querySelector('#glcanvas')
    const gl = canvas.getContext('webg2') || canvas.getContext('experimental-webgl')

    if (!gl) {
        alert('Unable to initialize WebGL. Your browser or machine may not support it.')
        return
    }

  var program = webglUtils.createProgramFromSources(gl, [VShader.vsSource, FShader.fsSource]);

  const programInfo = {
    program: program,
    positionLocation: gl.getAttribLocation(program, "a_position"),
    texcoordLocation: gl.getAttribLocation(program, "a_texCoord"),
    resolutionLocation: gl.getUniformLocation(program, "u_resolution"),
    angle: gl.getUniformLocation(program, "u_angle"),
    sampler: gl.getUniformLocation(program, 'u_image'),
    }

    var texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        0.0,  0.0,
        1.0,  0.0,
        0.0,  1.0,
        0.0,  1.0,
        1.0,  0.0,
        1.0,  1.0,
    ]), gl.STATIC_DRAW);



    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    var x1 = 0;
    var x2 = 0 + canvas.width;
    var y1 = 0;
    var y2 = 0 + canvas.height;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        x1, y1,
        x2, y1,
        x1, y2,
        x1, y2,
        x2, y1,
        x2, y2,
    ]), gl.STATIC_DRAW);

    const buffers = {
        positionBuffer: positionBuffer,
        texcoordBuffer: texcoordBuffer,
    }
    
    var image = new Image();
    var texture = gl.createTexture();
    image.src = tex
    image.onload = function() {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

        requestAnimationFrame(render);
    }

    window.onkeydown = (e) => {
        if (e.code === 'ArrowRight')
            angle+=0.001
        else if (e.code === 'ArrowLeft')
            angle-=0.001
        }

    var then = 0
    function render(now) {
        now *= 0.001 // convert to seconds
        const deltaTime = now - then
        then = now

        drawScene()
        requestAnimationFrame(render)
    }

    function drawScene() {
        webglUtils.resizeCanvasToDisplaySize(gl.canvas);
      
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
      
        gl.useProgram(programInfo.program);
      
        gl.enableVertexAttribArray(programInfo.positionLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionBuffer);
        gl.vertexAttribPointer(programInfo.positionLocation, 2, gl.FLOAT, false, 0, 0);
      
        gl.enableVertexAttribArray(programInfo.texcoordLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.texcoordBuffer);
        gl.vertexAttribPointer(programInfo.texcoordLocation, 2, gl.FLOAT, false, 0, 0);
      
        gl.uniform1f(programInfo.angle, angle);
        gl.uniform1i(programInfo.sampler, 0);
        gl.uniform2f(programInfo.resolutionLocation, canvas.width, canvas.height);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture)
      
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    
      }

      
      
  };

