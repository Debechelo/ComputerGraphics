export function initBuffers(gl) {
    const positions = [
       // Front face
       -1.0, -1.0, 1.0,
       1.0, -1.0, 1.0,
       1.0, 1.0, 1.0, 
       -1.0, 1.0, 1.0,
       // Back face
       -1.0, -1.0, -1.0,
       1.0, -1.0, -1.0,
       1.0, 1.0, -1.0,
       -1.0, 1.0, -1.0,
       // Top face
       -1.0, 1.0, 1.0,
       1.0, 1.0, 1.0, 
       1.0, 1.0, -1.0,
       -1.0, 1.0, -1.0,
       // Bottom face
       -1.0, -1.0, 1.0,
       1.0, -1.0, 1.0, 
       1.0, -1.0, -1.0,
       -1.0, -1.0, -1.0,
       // Right face
       1.0, -1.0, -1.0,
       1.0, -1.0, 1.0,
       1.0, 1.0, 1.0,
       1.0, 1.0, -1.0,
       // Left face
       -1.0, -1.0, -1.0,
       -1.0, -1.0, 1.0,
       -1.0, 1.0, 1.0,
       -1.0, 1.0, -1.0,
    ]

    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

    const faceNormals = [
        [0.0, 0.0, 1.0], // Front face: white
        [0.0, 0.0, -1.0], // Back face: red
        [0.0, 1.0, 0.0], // Top face:
        [0.0, -1.0, 0.0], // Bottom face:
        [1.0, 0.0, 0.0], // Right face:
        [-1.0, 0.0, 0.0], // Left face: 
    ]

    var normals = []
    for (var j = 0; j < faceNormals.length; j++) {
        const c = faceNormals[j]
        for (var i = 0; i < 4; i++) {
            normals = normals.concat(c)
        }
    }

    const normalsBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, normalsBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals),gl.STATIC_DRAW)

    const faceColors = [
        [1.0, 0.5, 0.5, 1.0], // Front face: white
        [0.5, 0.7, 1, 1.0],
        [0.3, 1, 0.3, 1.0],
        [0.8, 0.9, 0.0, 1.0],
    ]

    var colors = []
    for (var j = 0; j < faceColors.length; j++) {
        const c = faceColors[j]
        for (var i = 0; i < 24; i++) {
            colors = colors.concat(c)
        }
    }

    const colorBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors),gl.STATIC_DRAW)

    const textureFace = [
        [0, 0,
        1, 0,
        1, 1,
        0, 1,]
    ]

    var texture = []
    for (var j = 0; j < textureFace.length; j++) {
        const c = textureFace[j]
        for (var i = 0; i < 6; i++) {
            texture = texture.concat(c)
        }
    }

    const textureBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texture),gl.STATIC_DRAW)

    const indices = [
        0, 1, 2, 0, 2, 3, // front
        4, 5, 6, 4, 6, 7, // back
        8, 9, 10, 8, 10, 11, // top
        12, 13, 14, 12, 14, 15, // bottom
        16, 17, 18, 16, 18, 19, // right
        20, 21, 22, 20, 22, 23, // left
    ];

    const indexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.DYNAMIC_DRAW)

    return {
        position: positionBuffer,
        color: colorBuffer,
        indices: indexBuffer,
        normals: normalsBuffer,
        textureCoord : textureBuffer
    }
}