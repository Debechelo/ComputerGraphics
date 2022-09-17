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

    static vsSourceTrack =`
        attribute vec3 aVertexPosition;
        attribute vec3 aVertexColor;

        varying vec3 vColor;

        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;

        void main() {
            vColor = aVertexColor;
            gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
    }
    `;
}