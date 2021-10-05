function main() {
    /**
* @type {HTMLCanvasElement} canvas
*/
var canvas = document.getElementById('myCanvas');

/**
* @type {WebGLRenderingContext} gl
*/
var gl = canvas.getContext('webgl');


const depan ={
   color_kertas: [0.25, 0.45, 0.85],
   color_isi: [0.25, 0.45, 0.85],
   
   point_b1 : [-0.725, -0.600],
   point_b2 : [-0.220, -0.600],
   point_b3 : [-0.700, 0.550],
   point_b4 : [-0.250, 0.550],
   
   point_t1 : [-0.550, 0.200],
   point_t2 : [-0.350, 0.200],
   point_t3 : [-0.550, 0.100],
   point_t4 : [-0.350, 0.100],

   point_t5 : [-0.500, 0.095],
   point_t6 : [-0.400, 0.095],
   point_t7 : [-0.500, 0.045],
   point_t8 : [-0.400, 0.045],
};


const kiri ={
   color_kertas1: [0.25, 0.45, 0.85],

   point_b1 : [0.725, -0.100],
   point_b2 : [0.175, -0.100],       
   point_b3 : [0.800, 0.600],
   point_b4 : [0.100, 0.600],
};

const vertices=[
   ...depan.point_b1, ...depan.color_kertas,
   ...depan.point_b2, ...depan.color_kertas,
   ...depan.point_b3, ...depan.color_kertas,

   ...depan.point_b2, ...depan.color_kertas,
   ...depan.point_b4, ...depan.color_kertas,
   ...depan.point_b3, ...depan.color_kertas,

   ...depan.point_t1, ...depan.color_isi,
   ...depan.point_t2, ...depan.color_isi,
   ...depan.point_t3, ...depan.color_isi,

   ...depan.point_t2, ...depan.color_isi,
   ...depan.point_t4, ...depan.color_isi,
   ...depan.point_t3, ...depan.color_isi,

   ...depan.point_t5, ...depan.color_isi,
   ...depan.point_t6, ...depan.color_isi,
   ...depan.point_t7, ...depan.color_isi,

   ...depan.point_t6, ...depan.color_isi,
   ...depan.point_t8, ...depan.color_isi,
   ...depan.point_t7, ...depan.color_isi,

   ...kiri.point_b1, ...kiri.color_kertas1,
   ...kiri.point_b2, ...kiri.color_kertas1,
   ...kiri.point_b3, ...kiri.color_kertas1,

   ...kiri.point_b2, ...kiri.color_kertas1,
   ...kiri.point_b4, ...kiri.color_kertas1,
   ...kiri.point_b3, ...kiri.color_kertas1,
];

var vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, null);


var buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);


var vertexShaderSource = `
   attribute vec2 aPosition;
   attribute vec3 aColor;
   varying vec3 vColor;
   uniform float uChange;
   void main() {
       gl_Position = vec4(aPosition.x, aPosition.y, 1.0, 1.0);
       vColor = aColor;
   }
`;

var fragmentShaderSource = `
   precision mediump float;
   varying vec3 vColor;
   void main() {
       gl_FragColor = vec4(vColor, 1.0);
   }
`;

var vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexShaderSource);
var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragmentShaderSource);


gl.compileShader(vertexShader);
gl.compileShader(fragmentShader);

//file .exe --> compileable for GPU
var shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);
gl.useProgram(shaderProgram);


var aPosition = gl.getAttribLocation(shaderProgram, "aPosition");
gl.vertexAttribPointer( aPosition, 2, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 0);
gl.enableVertexAttribArray(aPosition);

var aColor = gl.getAttribLocation(shaderProgram, "aColor");
gl.vertexAttribPointer(aColor,3,gl.FLOAT,false,5 * Float32Array.BYTES_PER_ELEMENT,
   2 * Float32Array.BYTES_PER_ELEMENT);
gl.enableVertexAttribArray(aColor);

var speed = 0.0107;
var change = 0;
var uChange = gl.getUniformLocation(shaderProgram, "uChange");

console.log(vertices.length);
   
function moveVertices() {
   if (vertices[91] < -1.0 || vertices[111] > 1.0) {
       speed = speed * -1;
   }

   for (let i = 91; i < vertices.length; i += 5) {
       vertices[i] = vertices[i] + speed;
   }
}

function render() {
   moveVertices();
   gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
   change = change + speed;
   gl.uniform1f(uChange, change);

   gl.clearColor(0.6, 0.75, 0.46, 0.90);
   gl.clear(gl.COLOR_BUFFER_BIT);
   gl.drawArrays(gl.TRIANGLES, 0, 30);
   requestAnimationFrame(render);
}
requestAnimationFrame(render)
}