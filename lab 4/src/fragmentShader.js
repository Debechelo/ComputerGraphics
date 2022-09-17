export default class FShader{
    static fsSource = `
precision highp float;
    
uniform sampler2D uSampler1;
uniform sampler2D uSampler2;
uniform float uForce;
uniform float uAlpha;
uniform int uMetod;

varying highp vec2 vTextureCoord;
varying float attenuation;
varying vec3 vLightWeighting;
varying lowp vec4 vColor;

void main(void) {
    vec4 textureColor1 = texture2D(uSampler1, vTextureCoord);
    vec4 textureColor2 = texture2D(uSampler2, vTextureCoord);
    if(uMetod == 1) 
        gl_FragColor = vec4(textureColor1.rgb * vLightWeighting, 1.0);
    if(uMetod == 2)
        gl_FragColor = vec4(vColor.rgb * textureColor1.rgb * vLightWeighting, 1.0);
    if(uMetod == 3)
        gl_FragColor = vec4(vColor.rgb * textureColor1.rgb * vLightWeighting, vColor.a * textureColor1.a * uAlpha);
    if(uMetod == 4)
        gl_FragColor = vec4(textureColor2.rgb * vLightWeighting, 1.0);
    if(uMetod == 5)
        gl_FragColor = vec4(textureColor1.rgb * textureColor2.rgb * vLightWeighting, 1.0);
    if(uMetod == 6)
        gl_FragColor = vec4(vColor.rgb * textureColor1.rgb * textureColor2.rgb * vLightWeighting, 1.0);
        
}

`;


}