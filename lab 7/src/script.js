
import {initBuffers} from './buffers'
import {makeShaders} from './makeShaders'
import {setTextures} from './SetTexture'

import tex from './texture/orange.png';
import VShader from '/src/vertexShader'
import FShader from '/src/fragmentShader'

//import ball from './texture/scene.gltf'


const {mat2, mat3, mat4, vec2, vec3, vec4} = glMatrix;


let lightPosition = [0.0, 0.0, 0.0]
let cameraPosition = [0.0, 10.0, 10.0]


main()

function main() {

    var ren
    const canvas = document.querySelector('#glcanvas')
    var width = window.innerWidth
    var height = window.innerHeight

    canvas.setAttribute('width', width)
    canvas.setAttribute('height', height)

    var renderer = new THREE.WebGLRenderer({canvas: canvas})
    renderer.setClearColor(0xaaaaaa)

    var ball = {
        rotationY: 0,
        rotationX: 0
    }

    var gui = new dat.GUI()
    gui.add(ball, 'rotationY').min(-0.02).max(0.02).step(0.0001)
    gui.add(ball, 'rotationX').min(-0.02).max(0.02).step(0.0001)


    
    var camera = new THREE.PerspectiveCamera(45 , width / height, 0.01, 2000.0)
    camera.position.set(0, 0, 200)

    var scene = new THREE.Scene()


    var geometry = new THREE.SphereGeometry(50, 64, 64)
    var material = new THREE.ShaderMaterial({
        //color: 0xec9f1b,
        // wireframe: true
        uniforms: {
            uLightPosition: { value: new THREE.Vector3(1000.0, 1000.0, 1500.0) },
            uAmbientLightColor: { value:  new THREE.Vector3(0.6, 0.6, 0.6) },
            uDiffuseLightColor: { value: new THREE.Vector3(1.0, 1.0, 1.0) }, 
            uSpecularLightColor: { value: new THREE.Vector3(0.7, 0.7, 0.7) },
            uBumpTex: { type: 't', value: new THREE.TextureLoader().load(tex, () => {
                requestAnimationFrame(render)})},
            color: { value: new THREE.Vector4(1.0, 0.6, 0.0, 1.0) },
        },
        vertexShader: VShader.vsSource,
        fragmentShader: FShader.fsSource
    })


    var mesh = new THREE.Mesh(geometry, material)
    mesh.position.y -=10
    mesh.rotation.x -=0.4
    scene.add(mesh)

    var then = 0

    //requestAnimationFrame(render)
    function render(now) {
        now *= 0.001 
        const deltaTime = now - then
        then = now
        mesh.rotation.y +=ball.rotationY
        mesh.rotation.x +=ball.rotationX
        renderer.render(scene, camera)
        requestAnimationFrame(render)
    }
}