export default class FShader{
    static fsSourceSpark = `
    precision mediump float;

    uniform sampler2D uSampler;

    void main() {
        gl_FragColor = texture2D(uSampler, gl_PointCoord);
    }   
    `;
    
    static fsSourceTrack = `
    precision mediump float;
    varying vec3 vColor;

    void main() {
        gl_FragColor = vec4(vColor, 1.0);
    }
    `;
}