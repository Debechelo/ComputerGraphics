export default class FShader{    
    static fsSource = `

    precision mediump float;

    uniform sampler2D u_image;
    uniform float u_angle;

    varying vec2 v_res;
    varying vec2 v_texCoord;

    void main() {

        float dis = distance(v_texCoord, vec2(0.5, 0.5));

        // float sinA = mix(sin(u_angle /  (0.4 - dis))  , sin(u_angle / dis), step(0.2 ,dis));
        // float cosA = mix(cos(u_angle / (0.4 - dis)) , cos(u_angle / dis), step(0.2 ,dis));

        // float sinA = mix(sin(u_angle /  (0.4 - dis))  , sin(u_angle / dis), step(0.2 ,dis));
        // float cosA = mix(cos(u_angle / (0.4 - dis)) , cos(u_angle / dis), step(0.2 ,dis));

        float sinA = sin(u_angle*dis*10.0);
        float cosA = cos(u_angle*dis*10.0);
        float x = 0.5 + (v_texCoord.x - 0.5) * cosA - (v_texCoord.y - 0.5) * sinA;
        float y = 0.5 + (v_texCoord.x - 0.5) * sinA + (v_texCoord.y - 0.5) * cosA;

        
        gl_FragColor = texture2D(u_image,vec2(x, y));
    }
    `;

}