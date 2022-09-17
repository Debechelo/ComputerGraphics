import {initBuffers} from './buffers'
import {makeShaders} from './makeShaders'

const {mat2, mat3, mat4, vec2, vec3, vec4} = glMatrix;

const rotations = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
let distance = [-10.0, 0.0, 0.0]

let cube = 0;
let force = 1.0
let lightPosition = [0.0, 0.0, 0.0]
let cameraPosition = [0.0, 0.0, -20.0]
1
function incRotation() {
    rotations[cube] += 0.1;
}

function decRotation() {
    rotations[cube] -= 0.1;
}

function decR() {
    distance[0] += 0.3;
}

function incR() {
    distance[0] -= 0.3;
}

function decU() {
    distance[2] += 0.3;
}

function incU() {
    distance[2] -= 0.3;
}

function incForce() {
    force += 0.05;
}

function decForce() {
    if(force > 0.0)
        force -= 0.05;
}

main()

function main() {

    const canvas = document.querySelector('#glcanvas')
    const gl = canvas.getContext('webg2') || canvas.getContext('experimental-webgl')

    if (!gl) {
        alert('Unable to initialize WebGL. Your browser or machine may not support it.')
        return
    }

    var shaders = makeShaders(gl)
    const buffers = initBuffers(gl)
    let programInfo = makeProgramInfo(gl, shaders[0])

    var then = 0
    window.onkeydown = (e) => {
        if (e.code === 'Digit1')
            cube = 0
        else if (e.code === 'Digit2')
            cube = 1
        else if (e.code === 'Digit3')
            cube = 2
        else if (e.code === 'Digit4')
            cube = 3
        else if (e.code === 'Digit5')
            cube = 4
        else if (e.code === 'Digit6')
            cube = 5
        else if (e.code === 'ArrowRight')
            incRotation()
        else if (e.code === 'ArrowLeft')
            decRotation()
        else if (e.code === 'KeyD')
            decR()
        else if (e.code === 'KeyA')
            incR()
        else if (e.code === 'KeyW')
            incU()
        else if (e.code === 'KeyS')
            decU()
        else if (e.code === 'KeyE')
            incForce()
        else if (e.code === 'KeyQ')
            decForce()
        else if (e.code === 'Numpad1')
            programInfo = makeProgramInfo(gl, shaders[0])
        else if (e.code === 'Numpad2')
            programInfo = makeProgramInfo(gl, shaders[1])
        else if (e.code === 'Numpad3')
            programInfo = makeProgramInfo(gl, shaders[2])
        else if (e.code === 'Numpad4')
            programInfo = makeProgramInfo(gl, shaders[3])
        else if (e.code === 'Numpad5')
            programInfo = makeProgramInfo(gl, shaders[4])
    }

    requestAnimationFrame(render)
    function render(now) {
        now *= 0.001 // convert to seconds
        const deltaTime = now - then
        then = now

        drawScene(gl, programInfo, buffers, deltaTime)
        requestAnimationFrame(render)
    }
}

function drawScene(gl, programInfo, buffers, deltaTime) {
    gl.useProgram(programInfo.program)
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clearDepth(1.0)
    gl.enable(gl.DEPTH_TEST)
    gl.depthFunc(gl.LEQUAL)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    const projectionMatrix = mat4.create()
    const modelViewMatrix = mat4.create()
    const normalMatrix = mat3.create()

    mat4.perspective(projectionMatrix, 45 * Math.PI / 180,
        gl.canvas.clientWidth / gl.canvas.clientHeight, 0.01, 100.0)
    mat4.translate(modelViewMatrix, modelViewMatrix, cameraPosition)
    mat4.rotate(modelViewMatrix, modelViewMatrix, 0.2, [1, -1, 0])

    //Свет/////
    gl.uniform3fv(programInfo.uniformLocations.lightPosition, lightPosition);
    gl.uniform3fv(programInfo.uniformLocations.ambientLightColor, [0.1, 0.1, 0.1]);
    gl.uniform3fv(programInfo.uniformLocations.diffuseLightColor, [0.7, 0.7, 0.7]);
    gl.uniform3fv(programInfo.uniformLocations.specularLightColor, [1.0, 1.0, 1.0]);

    gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix)
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix)
    gl.uniformMatrix3fv(programInfo.uniformLocations.cameraPosition, false, cameraPosition)
    gl.uniform1f(programInfo.uniformLocations.force, force)
    
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition)
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position)
    gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0)

    gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor)

    gl.enableVertexAttribArray(programInfo.attribLocations.vertexNormal)
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normals)
    gl.vertexAttribPointer(programInfo.attribLocations.vertexNormal, 3, gl.FLOAT, false, 0, 0)

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices)

    const modelMatrix = mat4.create()
        //----------------------------------------------------- 1 квадрат

    mat4.rotate(modelMatrix, modelMatrix, rotations[5], [0, 1, 0])
    mat4.translate(modelMatrix, modelMatrix, distance)
    mat4.rotate(modelMatrix, modelMatrix, rotations[4], [0, 1, 0])
    mat4.translate(modelMatrix, modelMatrix, [-2.3, 0.0, 0.0])
    mat4.rotate(modelMatrix, modelMatrix, rotations[0], [0, 1, 0])

    mat3.normalFromMat4(normalMatrix, modelMatrix)
    gl.uniformMatrix3fv(programInfo.uniformLocations.normalMatrix, false, normalMatrix)
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelMatrix, false, modelMatrix)

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color)
    gl.vertexAttribPointer(programInfo.attribLocations.vertexColor, 4, gl.FLOAT, false, 0, 0)

    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0)
        //-----------------------------------------------------2 квадрат

    mat4.identity(modelMatrix);

    mat4.rotate(modelMatrix, modelMatrix, rotations[5], [0, 1, 0])
    mat4.translate(modelMatrix, modelMatrix, distance)
    mat4.rotate(modelMatrix, modelMatrix, rotations[4], [0, 1, 0])
    mat4.rotate(modelMatrix, modelMatrix, rotations[1], [0, 1, 0])

    mat3.normalFromMat4(normalMatrix, modelMatrix)
    gl.uniformMatrix3fv(programInfo.uniformLocations.normalMatrix, false, normalMatrix)
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelMatrix, false, modelMatrix)

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color)
    gl.vertexAttribPointer(programInfo.attribLocations.vertexColor, 4, gl.FLOAT, false, 0, 384)
    
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0)

    //----------------------------------------------------- 3 квадрат

    mat4.identity(modelMatrix);

    mat4.rotate(modelMatrix, modelMatrix, rotations[5], [0, 1, 0])
    mat4.translate(modelMatrix, modelMatrix, distance)
    mat4.rotate(modelMatrix, modelMatrix, rotations[4], [0, 1, 0])
    mat4.translate(modelMatrix, modelMatrix, [2.3, 0.0, 0.0])
    mat4.rotate(modelMatrix, modelMatrix, rotations[2], [0, 1, 0])

    mat3.normalFromMat4(normalMatrix, modelMatrix)
    gl.uniformMatrix3fv(programInfo.uniformLocations.normalMatrix, false, normalMatrix)
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelMatrix, false, modelMatrix)

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color)
    gl.vertexAttribPointer(programInfo.attribLocations.vertexColor, 4, gl.FLOAT, false, 0, 768)

    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0)

    // //----------------------------------------------------- 4 квадрат

    mat4.identity(modelMatrix);

    mat4.rotate(modelMatrix, modelMatrix, rotations[5], [0, 1, 0])
    mat4.translate(modelMatrix, modelMatrix, distance)
    mat4.rotate(modelMatrix, modelMatrix, rotations[4], [0, 1, 0])
    mat4.translate(modelMatrix, modelMatrix, [0.0, 2.0, 0.0])
    mat4.rotate(modelMatrix, modelMatrix, rotations[3], [0, 1, 0])

    mat3.normalFromMat4(normalMatrix, modelMatrix)
    gl.uniformMatrix3fv(programInfo.uniformLocations.normalMatrix, false, normalMatrix)
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelMatrix, false, modelMatrix)

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color)
    gl.vertexAttribPointer(programInfo.attribLocations.vertexColor, 4, gl.FLOAT, false, 0, 1152)

    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0)

    // //----------------------------------------------------- квадрат света

    mat4.identity(modelMatrix);
    
    mat4.translate(modelMatrix, modelMatrix, lightPosition)
    mat4.scale(modelMatrix, modelMatrix, [0.1,0.1,0.1])

    gl.uniformMatrix4fv(programInfo.uniformLocations.modelMatrix, false, modelMatrix)

    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0)
}


function makeProgramInfo(gl, shaderProgram){
    return {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
            vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
            vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
            cameraPosition: gl.getUniformLocation(shaderProgram, 'uCameraPosition'),
            modelMatrix: gl.getUniformLocation(shaderProgram, 'uModelMatrix'),
            normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
            lightPosition: gl.getUniformLocation(shaderProgram, 'uLightPosition'),
            ambientLightColor: gl.getUniformLocation(shaderProgram, 'uAmbientLightColor'),
            diffuseLightColor: gl.getUniformLocation(shaderProgram, 'uDiffuseLightColor'),
            specularLightColor: gl.getUniformLocation(shaderProgram, 'uSpecularLightColor'),
            force: gl.getUniformLocation(shaderProgram, 'uForce'),
        }
    }

}

function setupLights(gl,programInfo) {

}		



