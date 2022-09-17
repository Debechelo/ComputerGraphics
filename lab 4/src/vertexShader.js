export default class VShader{
    static vsSource = `
    attribute vec3 aVertexPosition;
    attribute vec4 aVertexColor;
    attribute vec3 aVertexNormal;
    attribute vec2 aTextureCoord;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uModelMatrix;
    uniform mat4 uProjectionMatrix;
    uniform mat3 uNormalMatrix;

    uniform vec3 uLightPosition;
    uniform vec3 uAmbientLightColor;
    uniform vec3 uDiffuseLightColor;
    uniform vec3 uSpecularLightColor;

    float uLineAttenuation = 0.005;
    float uQuadAttenuation = 0.005;
    float shininess = 16.0;

    varying highp vec2 vTextureCoord;
    varying float attenuation;
    varying lowp vec4 vColor;
    varying vec3 vLightWeighting;

    void main(void) {
        vec3 worldPosition = (uModelMatrix * vec4(aVertexPosition, 1.0)).xyz;
        vec3 lightDirection = normalize(uLightPosition - worldPosition);

        vec3 normal = normalize(uModelMatrix * vec4(aVertexNormal, 0)).xyz;

        float distance = max(distance(worldPosition, uLightPosition), 1.0);
        attenuation = 1.0 + (distance * uLineAttenuation) + (distance * distance * uQuadAttenuation);

        float diffuseLightDot = max(dot(normal, lightDirection), 0.0);
        vec3 diffuse = uDiffuseLightColor * diffuseLightDot;

        vec3 reflectionVector = normalize(-reflect(lightDirection, normal));
        vec3 viewVectorEye = normalize(worldPosition);
        float specularLightDot = max(dot(reflectionVector, viewVectorEye), 0.0);
        float specularLightParam = pow(specularLightDot, shininess);
        //vec3 specular = clamp(uSpecularLightColor * specularLightParam, 0.0, 1.0);
        vec3 specular = uSpecularLightColor * specularLightParam;

        vLightWeighting = uAmbientLightColor + diffuse + specular;

        gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(worldPosition, 1.0) ;

        vColor = aVertexColor;

        vTextureCoord = aTextureCoord;
    }
    `;


}