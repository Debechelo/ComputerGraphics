export default class VShader{
    static vsSourceSpark = `
    attribute vec3 aVertexPosition;
    attribute vec3 aVertexColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying vec3 vColor;

    void main() {
        gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);

        vColor = aVertexColor;
        gl_PointSize = 16.0;
    }
    `;

    static vsSource = `
    attribute vec3 aVertexPosition;
    attribute vec4 aVertexColor;
    attribute vec3 aVertexNormal;
    attribute float aRand;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    uniform vec3 uLightPosition;
    uniform vec3 uAmbientLightColor;
    uniform vec3 uDiffuseLightColor;
    uniform vec3 uSpecularLightColor;

    float uLineAttenuation = 0.5;
    float uQuadAttenuation = 0.5;
    float shininess = 16.0;

    varying float vRand;
    varying float attenuation;
    varying lowp vec4 vColor;
    varying vec3 vLightWeighting;

    void main(void) {
        vec4 vertexPositionEye4 = vec4(aVertexPosition, 1.0);
        vec3 vertexPositionEye3 = vertexPositionEye4.xyz / vertexPositionEye4.w;

        vec3 lightDirection = normalize(uLightPosition - vertexPositionEye3);

        float distance = max(distance(vertexPositionEye3, uLightPosition),1.0);
        attenuation = 1.0 + (distance * uLineAttenuation) + (distance * distance * uQuadAttenuation);

        float diffuseLightDot = max(dot(aVertexNormal, lightDirection), 0.0);
        vec3 reflectionVector = normalize(reflect(-lightDirection, aVertexNormal));
        vec3 viewVectorEye = -normalize(vertexPositionEye3);
        float specularLightDot = max(dot(reflectionVector, viewVectorEye), 0.0);
        float specularLightParam = pow(specularLightDot, shininess);

        vLightWeighting = uAmbientLightColor + uDiffuseLightColor * diffuseLightDot + uSpecularLightColor * specularLightParam;

        gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0) ;

        vRand = aRand;
        vColor = aVertexColor;
        gl_PointSize = 50.0;

    }
    `;

}