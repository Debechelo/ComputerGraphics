export default class FShader{
    static fsSourceSpark = `
    precision mediump float;

    uniform sampler2D uSampler;
    varying vec3 vColor;

    void main() {
        vec4 textureColor = texture2D(uSampler, gl_PointCoord);
        gl_FragColor = vec4(textureColor.rgb * vColor.rgb, textureColor.a);
        vec4 textureColor = texture2D(uSampler, gl_PointCoord);
        gl_FragColor = vec4(textureColor.rgb * vColor.rgb, textureColor.a);
    }   
    `;

    static fsSource = `
    precision highp float;

    uniform sampler2D uSampler;

    varying float attenuation;
    varying vec3 vLightWeighting;
    varying lowp vec4 vColor;
    varying float vRand;
    
    void main(void) {
        vec4 textureColor = texture2D(uSampler, gl_PointCoord);
        gl_FragColor = vec4(textureColor.rgb , 1.0);
    }
    `;
}