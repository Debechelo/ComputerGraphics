export default class FShader{  
    static fsSource = `
    precision mediump float;

    uniform vec3 uLightPosition;
    uniform vec3	uAmbientLightColor;
		uniform vec3	uDiffuseLightColor;
		uniform vec3	uSpecularLightColor;
	
		uniform sampler2D	uBumpTex;
    uniform vec3 color;
     
    const float shininess = 16.0;

    varying vec2 vertexUV;
		varying vec3 vNormal;
		varying vec3 vWorldPosition;

  vec3 bumpNorm(sampler2D bumpMap, vec2 vertexUV,vec3 normal){
    float size = 0.01;
    vec4 texColorx1 = texture2D(uBumpTex, vec2(vertexUV.x - size, vertexUV.y));
    vec4 texColorx2 = texture2D(uBumpTex, vec2(vertexUV.x + size, vertexUV.y));
    vec4 texColory1 = texture2D(uBumpTex, vec2(vertexUV.x, vertexUV.y - size));
    vec4 texColory2 = texture2D(uBumpTex, vec2(vertexUV.x, vertexUV.y + size));
    vec4 xGradient = texColorx2 - texColorx1;
    vec4 yGradient = texColory2 - texColory1;
    xGradient.x = mix(xGradient.x / 1.4, yGradient.x, step(20.0, xGradient.x));
    xGradient.y = mix(xGradient.y / 1.4, yGradient.y, step(20.0, yGradient.y));


    return normal + vec3(xGradient.x, 0.0, 0.0) + vec3(0.0, yGradient.y, 0.0);
  }

	void main(void){
    vec3 newNormal = bumpNorm(uBumpTex, vertexUV, vNormal);

    vec3 lightDirection = normalize(uLightPosition - vWorldPosition);

    float diffuseLightDot = max(dot(newNormal, lightDirection), 0.0);
    vec3 diffuse = uDiffuseLightColor * diffuseLightDot;

    vec3 reflectionVector = normalize(-reflect(lightDirection, newNormal));
    vec3 viewVectorEye = normalize(-vWorldPosition);
    float specularLightDot = max(dot(reflectionVector, viewVectorEye), 0.0);
    float specularLightParam = pow(specularLightDot, shininess);
    vec3 specular = clamp(uSpecularLightColor * specularLightParam, 0.0, 1.0);

    vec3 vLightWeighting = uAmbientLightColor + diffuse + specular;

		gl_FragColor = vec4(color * vLightWeighting, 1.0);
	}
    `;
    
}
//color * vLightWeighting
// x_gradient = pixel(x-1, y) - pixel(x+1, y)
// y_gradient = pixel(x, y-1) - pixel(x, y+1)
// New_Normal= Normal+(U*x_gradient)+(V*y_gradient)


