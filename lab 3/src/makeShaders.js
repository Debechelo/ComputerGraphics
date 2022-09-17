import VShader from '/src/vertexShader'
import FShader from '/src/fragmentShader'

export function makeShaders(gl){
    let shaders = []

    const vsSourcePhong = VShader.vsSourcePhong
    const fsSourcePhong = FShader.fsSourcePhong
    shaders.push(initShaderProgram(gl, vsSourcePhong, fsSourcePhong))

    const vsSourceGyro = VShader.vsSourceGyro
    const fsSourceGyro = FShader.fsSourceGyro
    shaders.push(initShaderProgram(gl, vsSourceGyro, fsSourceGyro))

    const vsSourceLambert = VShader.vsSourceLambert
    const fsSourceLambert = FShader.fsSourceLambert
    shaders.push(initShaderProgram(gl, vsSourceLambert, fsSourceLambert))

    const vsSourceBlinnPhong = VShader.vsSourceBlinnPhong
    const fsSourceBlinnPhong = FShader.fsSourceBlinnPhong
    shaders.push(initShaderProgram(gl, vsSourceBlinnPhong, fsSourceBlinnPhong))

    const vsSourceToon = VShader.vsSourceToon
    const fsSourceToon = FShader.fsSourceToon
    shaders.push(initShaderProgram(gl, vsSourceToon, fsSourceToon))

    return shaders
}

function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource)
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource)

    const shaderProgram = gl.createProgram()
    gl.attachShader(shaderProgram, vertexShader)
    gl.attachShader(shaderProgram, fragmentShader)
    gl.linkProgram(shaderProgram)

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram))
        return null
    }

    return shaderProgram
}

function loadShader(gl, type, source) {
    const shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
        return null
    }

    return shader
}
