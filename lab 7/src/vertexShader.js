export default class VShader{
    static vsSource = `
	
	  varying vec2 vertexUV;
	  varying vec3 vNormal;
	  varying vec3 vWorldPosition;

	void main(void){
		vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
		
		vertexUV = uv;
    	vec3 vNormal = normalize(modelMatrix * vec4(normal, 0)).xyz;

		gl_Position	= projectionMatrix * viewMatrix * vec4(vWorldPosition,1.0);
	}
    `;
}