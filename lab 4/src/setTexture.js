import tex1 from './texture/1.jpg';
import tex2 from './texture/2.jpg';
import tex3 from './texture/3.jpg';
import tex4 from './texture/4.jpg';
import tex5 from './texture/ice.jpg';
import tex6 from './texture/leaf.jpg';
import tex7 from './texture/rock.jpg';
import tex8 from './texture/tree.jpg';

export function setTextures(gl){
    let texture = []
    texture.push(makeTextures(gl, tex1))
    texture.push(makeTextures(gl, tex2))
    texture.push(makeTextures(gl, tex3))
    texture.push(makeTextures(gl, tex4))
    texture.push(makeTextures(gl, tex5))
    texture.push(makeTextures(gl, tex6))
    texture.push(makeTextures(gl, tex7))
    texture.push(makeTextures(gl, tex8))
    return texture
}


function makeTextures(gl, tex){
    var textures = [];
    let texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    const pixel = new Uint8Array([0, 0, 255, 255]); // непрозрачный синий
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixel);

    var image = new Image();
    image.src = tex

    image.onload = function() {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE) 

    }
    return texture
}

