export default class FShader{
    static fsSourceSpark = `
    precision mediump float;

    uniform sampler2D uSampler;
    varying vec3 vColor;

    void main() {
        vec4 textureColor = texture2D(uSampler, gl_PointCoord);
        gl_FragColor = vec4(textureColor.rgb * vColor.rgb, textureColor.a);
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