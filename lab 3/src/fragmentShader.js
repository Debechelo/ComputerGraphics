export default class FShader{

    static fsSourcePhong = `
    precision mediump float;
    
    uniform float uForce;

    varying float attenuation;
    varying vec3 vLightWeighting;
    varying lowp vec4 vColor;
    
    void main(void) {
        gl_FragColor = vec4(vColor.rgb * vLightWeighting * uForce / attenuation , vColor.a);
    }
    `;

    static fsSourceGyro = `
    precision mediump float;
    
    uniform float uForce;

    varying float attenuation;
    varying vec3 vLightWeighting;
    varying lowp vec4 vColor;
    
    void main(void) {
        gl_FragColor = vec4(vColor.rgb * vLightWeighting.rgb * uForce / attenuation , vColor.a);
    }
    `;

    static fsSourceLambert = `
    precision mediump float;

    uniform float uForce;

    varying float attenuation;
    varying vec3 vLightWeighting;
    varying lowp vec4 vColor;
    
    void main(void) {
        gl_FragColor = vec4(vColor.rgb * vLightWeighting.rgb * uForce / attenuation , vColor.a);
    }
    `;

    static fsSourceBlinnPhong = `
    precision mediump float;

    uniform float uForce;

    varying float attenuation;
    varying vec3 vLightWeighting;
    varying lowp vec4 vColor;
    
    void main(void) {
        gl_FragColor = vec4(vColor.rgb * vLightWeighting.rgb * uForce / attenuation , vColor.a);
    }
    `;

    static fsSourceToon = `
    precision mediump float;
    varying vec3 normal;

    uniform float uForce;

    varying float attenuation;
    varying lowp vec4 vColor;
    varying vec3 vLightWeighting;
	
	void main()
	{
		float intensity;
		vec4 color;
		
		intensity = (vLightWeighting.r + vLightWeighting.g + vLightWeighting.b)/3.0;
		
		if (intensity > 0.80)
			color = vec4(vColor.rgb, 1.0);
		else if (intensity > 0.5)
			color = vec4(vColor.rgb/2.0, 1.0);
		else if (intensity > 0.25)
			color = vec4(vColor.rgb/4.0,1.0);
		else
			color = vec4(vColor.rgb/5.0,1.0);
		
		gl_FragColor = vec4(color.rgb, 1.0);
	} 
    `;

}