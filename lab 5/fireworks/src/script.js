import Firework from './firework'
import VShader from '/src/vertexShader'
import FShader from '/src/fragmentShader'
import tex1 from './texture/spark.png';
    
const {mat2, mat3, mat4, vec2, vec3, vec4} = glMatrix;

const sparksCount = 800;

var fireworks = []

for(var i = 0; i < 3; i++){
    fireworks.push(new Firework(i * 1500))
}


main();
    
function main() {
    const canvas = document.querySelector('#glcanvas')
    const gl = canvas.getContext('webgl2') || canvas.getContext('experimental-webgl2')

    if (!gl) {
        alert('Unable to initialize WebGL. Your browser or machine may not support it.')
        return
    }
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE)
    

    const vsSourceTrack = VShader.vsSourceTrack
    const fsSourceTrack = FShader.fsSourceTrack
    var programTrack = webglUtils.createProgramFromSources(gl, [vsSourceTrack, fsSourceTrack]);

    const vsSourceSpark = VShader.vsSourceSpark
    const fsSourceSpark = FShader.fsSourceSpark
    var programSpark = webglUtils.createProgramFromSources(gl, [vsSourceSpark, fsSourceSpark]);

    const programSparkInfo = {
        programSpark: programSpark,
        attribLocations: {
            positionAttributeLocationSpark: gl.getAttribLocation(programSpark, 'aVertexPosition'),
            colorAttributeLocationSpark: gl.getAttribLocation(programSpark, 'aVertexColor'),
        },
        uniformLocations: {
            pMatrixUniformLocationSpark: gl.getUniformLocation(programSpark, 'uProjectionMatrix'),
            mvMatrixUniformLocationSpark: gl.getUniformLocation(programSpark, 'uModelViewMatrix'),
            textureLocationSpark: gl.getUniformLocation(programSpark, 'uSampler'),
        }
    }

    const programTrackInfo = {
        programTrack: programTrack,
        attribLocations: {
            positionAttributeLocationTrack: gl.getAttribLocation(programTrack, 'aVertexPosition'),
            colorAttributeLocationTrack: gl.getAttribLocation(programTrack, 'aVertexColor'),
        },
        uniformLocations: {
            pMatrixUniformLocationTrack: gl.getUniformLocation(programTrack, 'uProjectionMatrix'),
            mvMatrixUniformLocationTrack: gl.getUniformLocation(programTrack, 'uModelViewMatrix'),
        }
    }

    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    var image = new Image();
    image.src = tex1;

    const pixel = new Uint8Array([0, 0, 255, 255]); // непрозрачный синий
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixel);

    image.onload = function (){
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.bindTexture(gl.TEXTURE_2D, null);

        requestAnimationFrame(drawScene);
    }
    
    var mvMatrix = mat4.create();
    var pMatrix = mat4.create();
    
    function drawSparks(positions, colors) {
        gl.useProgram(programSparkInfo.programSpark);
        gl.uniformMatrix4fv(programSparkInfo.uniformLocations.pMatrixUniformLocationSpark, false, pMatrix);
        gl.uniformMatrix4fv(programSparkInfo.uniformLocations.mvMatrixUniformLocationSpark, false, mvMatrix);

        var positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
        gl.vertexAttribPointer(programSparkInfo.attribLocations.positionAttributeLocationSpark, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(programSparkInfo.attribLocations.positionAttributeLocationSpark);

        var colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        gl.vertexAttribPointer(programTrackInfo.attribLocations.colorAttributeLocationTrack, 3, gl.FLOAT, false, 24, 0);
        gl.enableVertexAttribArray(programTrackInfo.attribLocations.colorAttributeLocationTrack);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(programSparkInfo.uniformLocations.textureLocationSpark, 0);

        gl.drawArrays(gl.POINTS, 0, positions.length / 3);
    }

    function drawTracks(positionsFromCenter, colors) {

        gl.useProgram(programTrackInfo.programTrack);

        gl.uniformMatrix4fv(programTrackInfo.uniformLocations.pMatrixUniformLocationTrack, false, pMatrix);
        gl.uniformMatrix4fv(programTrackInfo.uniformLocations.mvMatrixUniformLocationTrack, false, mvMatrix);

        var positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionsFromCenter), gl.STATIC_DRAW);

        gl.vertexAttribPointer(programTrackInfo.attribLocations.positionAttributeLocationTrack, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(programTrackInfo.attribLocations.positionAttributeLocationTrack);

        var colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        gl.vertexAttribPointer(programTrackInfo.attribLocations.colorAttributeLocationTrack, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(programTrackInfo.attribLocations.colorAttributeLocationTrack);

        gl.drawArrays(gl.LINES, 0, positionsFromCenter.length / 3);
    }

    function drawScene(now) {
        // обновляем размер canvas на случай, если он растянулся или сжался вслед за страницей
        webglUtils.resizeCanvasToDisplaySize(gl.canvas);

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        mat4.perspective(pMatrix, 45, gl.canvas.width / gl.canvas.height, 0.1, 100.0);
        mat4.identity(mvMatrix);
        mat4.translate(mvMatrix, mvMatrix, [0, 0, -5]);

        fireworks.forEach( firework =>{

            firework.sparks.forEach(spark =>{
                spark.move()
    
            })
            firework.timeFirework(now)
    
            var positions = [];
            firework.sparks.forEach(item =>{
                positions.push(item.x);
                positions.push(item.y);
                // искры двигаются только в одной плоскости xy
                positions.push(0);
            });

            var colors = [];
            var positionsFromCenter = [];
            for (var i = 0; i < positions.length; i += 3) {
                positionsFromCenter.push(firework.position[0], firework.position[1], firework.position[2]);
                positionsFromCenter.push(positions[i], positions[i + 1], positions[i + 2]);
                for(var j = 0; j < 6; j++)
                    {
                    colors.push(firework.color[j]);
                }
            }
    
            drawTracks(positionsFromCenter, colors);
            drawSparks(positions, colors);
        })
        requestAnimationFrame(drawScene);
    
    }
}    


