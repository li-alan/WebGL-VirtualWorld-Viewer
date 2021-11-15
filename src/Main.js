//fror camera
let rotation = [-90,40];
let eyePos = [0, 30, 30];
let lookAt = [0, 0, 0];
let up = [0, 1, 0];
var x;
var z;
var radianX;
var radianY;
var canvas;
var gl;
var n;
var c = [0, 0, 0, 0, 0, 0, 0, 0];
var currentOrientationX;
var currentOrientationY;
var hold=false;
var projectionMatrix;
var viewingMatrix;

// 32 x 32 x 4 map lay out of map
var mapLayout = [
  [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [3, 2, 1, 1, 1, 1, 1, 1, 4, 2, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 2, 4, 1, 1, 1, 1, 1, 1, 1, 2, 3],
  [3, 2, 1, 1, 1, 1, 1, 1, 4, 2, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 2, 4, 1, 1, 1, 1, 1, 1, 1, 2, 3],
  [3, 2, 1, 1, 1, 1, 1, 1, 4, 2, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 2, 4, 1, 1, 1, 1, 1, 1, 1, 2, 3],
  [3, 2, 1, 1, 1, 1, 1, 1, 4, 2, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 2, 4, 1, 1, 1, 1, 1, 1, 1, 2, 3],
  [3, 2, 1, 1, 1, 1, 1, 1, 4, 2, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 2, 4, 1, 1, 1, 1, 1, 1, 1, 2, 3],
  [3, 2, 1, 1, 1, 1, 1, 1, 4, 2, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 2, 4, 1, 1, 1, 1, 1, 1, 1, 2, 3],
  [3, 2, 1, 1, 1, 1, 1, 1, 4, 2, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 2, 4, 1, 1, 1, 1, 1, 1, 1, 2, 3],
  [3, 2, 1, 1, 1, 1, 1, 1, 4, 2, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 2, 4, 1, 1, 1, 1, 1, 1, 1, 2, 3],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
  [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
];


function main() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  gl = getWebGLContext(canvas, false);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Set the vertex information
  n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

  // Set the clear color and enable the depth test
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  // Get the storage location of u_MvpMatrix
  var u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_MvpMatrix');
    return;
  }

  // Get the storage location of u_ViewingMatrix
  var u_ViewingMatrix = gl.getUniformLocation(gl.program, 'u_ViewingMatrix');
  if (!u_ViewingMatrix) {
    console.log('Failed to get the storage location of u_ViewingMatrix');
    return;
  }

  //var viewProjMatrix = new Matrix4();
  viewingMatrix = new Matrix4();
  projectionMatrix = new Matrix4();


  // from asgn 1
  canvas.onmousedown = function(ev){
    var x = ev.clientX; //x coordinate of mouse pointer
    var y = ev.clientY; //y coordinate of mouse pointer
    var rect = ev.target.getBoundingClientRect();
    currentOrientationX = ((x - rect.left) - canvas.height/2)/(canvas.height/2);
    currentOrientationY = (canvas.width/2 - (y - rect.top))/(canvas.width/2);
    click(ev, gl, canvas, u_ProjectionMatrix, u_ViewingMatrix)
    hold=true;
  }
  canvas.onmousemove= function(ev) {
    if(hold==true){
      click(ev, gl, canvas, u_ProjectionMatrix, u_ViewingMatrix)
    }
  }
  canvas.onmouseup=function(ev) {
    hold=false;
  }


  document.onkeydown = function(ev){
    keydown(ev, gl, u_ProjectionMatrix, u_ViewingMatrix);
  };

  projectionMatrix.setPerspective(60, canvas.width / canvas.height, 1, 150);
  viewingMatrix.setLookAt(eyePos[0], eyePos[1], eyePos[2], eyePos[0]+lookAt[0], eyePos[1]+lookAt[1],eyePos[2]+ lookAt[2], up[0], up[1], up[2]);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projectionMatrix.elements);
  gl.uniformMatrix4fv(u_ViewingMatrix, false, viewingMatrix.elements);

  // Clear color and depth buffer
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  draw(gl, u_ProjectionMatrix, u_ViewingMatrix);
}
