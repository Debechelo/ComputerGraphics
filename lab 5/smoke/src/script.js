import Spark from './spark'
import VShader from '/src/vertexShader'
import FShader from '/src/fragmentShader'
import tex1 from './texture/cir.png';

    
const {mat2, mat3, mat4, vec2, vec3, vec4} = glMatrix;

const sparksCount = 2000;

let lightPosition = [0.0, 5.0, -5.0]

var sparks = [];
for (var i = 0; i < sparksCount; i++) {
    var position = genPos()
    sparks.push(new Spark(position[0], position[1], position[2]));
}


function genPos(){
    return [
        Math.random() * 0.25 - 0.2,
        Math.random() * 0.25 - 0.1,
        Math.random() * 0.25 - 0.5,
    ]
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
    gl.disable(gl.DEPTH_TEST)


    const vsSource = VShader.vsSource
    const fsSource = FShader.fsSource
    var programSpark = webglUtils.createProgramFromSources(gl, [vsSource, fsSource]);

    const programSparkInfo = {
        programSpark: programSpark,
        attribLocations: {
            positionAttributeLocationSpark: gl.getAttribLocation(programSpark, 'aVertexPosition'),
            colorAttributeLocationSpark: gl.getAttribLocation(programSpark, 'aVertexColor'),
            vertexNormal: gl.getAttribLocation(programSpark, 'aVertexNormal'),
            random: gl.getAttribLocation(programSpark, 'aRand')
        },
        uniformLocations: {
            pMatrixUniformLocationSpark: gl.getUniformLocation(programSpark, 'uProjectionMatrix'),
            mvMatrixUniformLocationSpark: gl.getUniformLocation(programSpark, 'uModelViewMatrix'),
            lightPosition: gl.getUniformLocation(programSpark, 'uLightPosition'),
            ambientLightColor: gl.getUniformLocation(programSpark, 'uAmbientLightColor'),
            diffuseLightColor: gl.getUniformLocation(programSpark, 'uDiffuseLightColor'),
            specularLightColor: gl.getUniformLocation(programSpark, 'uSpecularLightColor'),
            textureLocationSpark: gl.getUniformLocation(programSpark, 'uSampler')
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

    
    const color = [0.9, 0.9, 0.9]
    var colors = [];
    for (var i = 0; i < sparksCount; i++) {
        colors.push(1.0, 1.0, 1.0);
    }
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    
    const faceNormals = [1.0, 1.0, 1.0] // Front face: white

    var normals = []
    for (var j = 0; j < sparksCount; j++) {
        normals.push(1.0, 1.0, 1.0);
    }

    const normalsBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, normalsBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals),gl.STATIC_DRAW)

    var rand = [];
    for (var i = 0; i < sparksCount; i++) {
        rand.push(Math.random()+1.0);
    }
    const randBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, randBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(rand), gl.STATIC_DRAW);

    var mvMatrix = mat4.create();
    var pMatrix = mat4.create();

    requestAnimationFrame(drawScene);

    function drawScene(now) {
        // обновляем размер canvas на случай, если он растянулся или сжался вслед за страницей
        webglUtils.resizeCanvasToDisplaySize(gl.canvas);

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        mat4.perspective(pMatrix, 45, gl.canvas.width / gl.canvas.height, 0.1, 100.0);
        mat4.identity(mvMatrix);
        mat4.translate(mvMatrix, mvMatrix, [0, 0, -1]);

        sparks.map(spark =>{
            spark.move()
        })
    
        var positions = [];
        sparks.forEach(item =>{
            positions.push(item.x);
            positions.push(item.y);
            positions.push(item.z);
        });

        drawSparks(positions);
        
        requestAnimationFrame(drawScene);
    }

    function drawSparks(positions) {
        gl.useProgram(programSparkInfo.programSpark);
        gl.uniformMatrix4fv(programSparkInfo.uniformLocations.pMatrixUniformLocationSpark, false, pMatrix);
        gl.uniformMatrix4fv(programSparkInfo.uniformLocations.mvMatrixUniformLocationSpark, false, mvMatrix);

        gl.uniform3fv(programSparkInfo.uniformLocations.lightPosition, lightPosition);
        gl.uniform3fv(programSparkInfo.uniformLocations.ambientLightColor, [0.1, 0.1, 0.1]);
        gl.uniform3fv(programSparkInfo.uniformLocations.diffuseLightColor, [0.7, 0.7, 0.7]);
        gl.uniform3fv(programSparkInfo.uniformLocations.specularLightColor, [1.0, 1.0, 1.0]);

        var positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
        gl.vertexAttribPointer(programSparkInfo.attribLocations.positionAttributeLocationSpark, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(programSparkInfo.attribLocations.positionAttributeLocationSpark);

        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.vertexAttribPointer(programSparkInfo.attribLocations.colorAttributeLocationSpark, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(programSparkInfo.attribLocations.colorAttributeLocationSpark);

        gl.bindBuffer(gl.ARRAY_BUFFER, normalsBuffer)
        gl.vertexAttribPointer(programSparkInfo.attribLocations.vertexNormal, 3, gl.FLOAT, false, 0, 0)
        gl.enableVertexAttribArray(programSparkInfo.attribLocations.vertexNormal)

        gl.bindBuffer(gl.ARRAY_BUFFER, randBuf)
        gl.vertexAttribPointer(programSparkInfo.attribLocations.random, 1, gl.FLOAT, false, 0, 0)
        gl.enableVertexAttribArray(programSparkInfo.attribLocations.random)

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(programSparkInfo.uniformLocations.textureLocationSpark, 0);

        gl.drawArrays(gl.POINTS, 0, positions.length / 3);
    }
}    




