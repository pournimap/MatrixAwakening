// For Shader 
var shaderProgramObject_city;
var vertexShaderObject_city;
var fragmentShaderObject_city;


var scaleStarting=15.0;
var scaleEnd=3.0;
var scaleQuadA=scaleStarting;
var scaleQuadS=0.0;

var scaleQuadT=0.0;
var scaleQuadR=0.0;

var scaleQuadO=0.0;
var scaleQuadM=0.0;

var scaleQuadE=0.0;
var scaleQuadD=0.0;


var scaleQuadI=0.0;
var scaleQuadC=0.0;
var scaleQuadO2=0.0;
var scaleQuadM2=0.0;

var scaleQuadP=0.0;


var leftLetter=-16.0;
var disBetLetter=4.0;

var translateZ=-20.0;
var resetFlow=true;



var vao_city;
var vbo_city;
var vbo_color_city;
var vbo_texture_city;
var mvpUniform_city;
var mvpUniform_cityFlex;

//Stack
var stackMatrix_city;
var sizeStrackMatrix_city=0;

var startCameraPosition=15.0;
var translateX_city=0.0;
var translateZ_city=-25.0;
var translateY_city=0.0;
var cameraPositionZ_city=startCameraPosition;
var cameraPositionX_city=0.0;
var cameraPositionY_city=0.0;
var cameraAngleX_city=0.0;
var cameraAngleY_city=0.0;
var cameraCentreX_city=0.0;
var cameraCentreY_city=10.0;
var cameraCentreZ_city=-85.0;

var centre;
var cameraPos;
var cameraUp;


//var normalFlow=true;
var cameraToTheStartPositionInReverse=false;

//Zoom
var zoom=false;

var texture_building1=0;
var texture_building2=0;
var texture_building3=0;
var texture_building4=0;
var texture_building5=0;
var texture_building6=0;
var texture_road=0;
var texture_ashram=0;
var texture_astromedicomp=0;
var texture_lionking=0;
var texture_whiteQuad=0;
var texture_manyavar = 0;

var a_texture=0;
var s_texture=0;
var t_texture=0
var r_texture=0;
var o_texture=0;
var m_texture=0;
var e_texture=0;
var d_texture=0;
var i_texture=0;
var c_texture=0;
var p_texture=0;

var lookTowardsMainFlex=0;

var uniform_sampler2d;
var uniform_sampler2dFlex;

//Ashram Details
var ashramPositionX=6.5;
var ashramPositionY=0.0;
var ashramPositionZ=translateZ_city+30;
	
var ashramCentreX=8.5;
var ashramCentreY=3.0;
var ashramCentreZ=translateZ_city+30;


//Front flex 
var frontFlexPositionX=0.0;
var frontFlexPositionY=0.0;
var frontFlexPositionZ=2.0;
	
var frontFlexCentreX=-7.0;
var frontFlexCentreY=8.0;
var frontFlexCentreZ=frontFlexPositionZ;

function City_Initialize()
{	
	var vertexShaderSourceCode=
	"#version 300 es"+
	"\n"+
	"in vec4 vPosition;" +
	"in vec2 inTexcoord;"+
	"out vec2 outTexcoord;"+
	"in vec3 vColor;" +
	"out vec3 outColor;"+
	"uniform mat4 u_mvp_uniform;"+
	"void main()"+
	"{"+
	"outColor=vColor;"+
	"gl_Position=u_mvp_uniform * vPosition;"+
	"outTexcoord=inTexcoord;"+
	"}";

	vertexShaderObject_city=gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShaderObject_city,vertexShaderSourceCode);
	gl.compileShader(vertexShaderObject_city);

	if(gl.getShaderParameter(vertexShaderObject_city,gl.COMPILE_STATUS)==false)
	{
		var error=gl.getShaderInfoLog(vertexShaderObject_city);
		if(error.length>0)
		{
			alert("VertexShaderError:"+error);
			City_Uninitialize();
		}

	}

	var fragmentShaderSourceCode=
	"#version 300 es"+
	"\n"+
	"precision highp float;"+
	"in vec3 outColor;"+
	"out vec4 fragColor;"+
	"in vec2 outTexcoord;"+
	"uniform highp sampler2D u_texcoord;"+
	"void main(void)"+
	"{"+
	"fragColor=texture(u_texcoord,outTexcoord);"+
	"}";

	fragmentShaderObject_city=gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShaderObject_city,fragmentShaderSourceCode);
	gl.compileShader(fragmentShaderObject_city);

	if(gl.getShaderParameter(fragmentShaderObject_city,gl.COMPILE_STATUS)==false)
	{
		var error=gl.getShaderInfoLog(fragmentShaderObject_city);
		if(error.length>0)
		{

			alert("FragmentShaderErrror:"+error);
			City_Uninitialize();
		}
	}

	
	shaderProgramObject_city=gl.createProgram();
	gl.attachShader(shaderProgramObject_city,vertexShaderObject_city);
	gl.attachShader(shaderProgramObject_city,fragmentShaderObject_city);


	gl.bindAttribLocation(shaderProgramObject_city,WebGLMacros.AMC_ATTRIBUTE_POSITION,"vPosition");
	gl.bindAttribLocation(shaderProgramObject_city,WebGLMacros.AMC_ATTRIBUTE_COLOR,"vColor");
	gl.bindAttribLocation(shaderProgramObject_city,WebGLMacros.AMC_ATTRIBUTE_TEXTURE,"inTexcoord");


	//Linking the Program
	gl.linkProgram(shaderProgramObject_city);
	if(!gl.getProgramParameter(shaderProgramObject_city,gl.LINK_STATUS))
	{
		var error=gl.getProgramInfoLog(shaderProgramObject_city)
		if(error.length>0)
		{
			alert("Shader Program Link Error:"+error);
			City_Uninitialize();
		}
	}


	mvpUniform_city=gl.getUniformLocation(shaderProgramObject_city,"u_mvp_uniform");
	uniform_sampler2d=gl.getUniformLocation(shaderProgramObject_city,"u_texcoord");
	
	
	
	

	texture_building1=gl.createTexture();
	texture_building1.image=new Image();
	texture_building1.image.src="resources/City/textureBuilding1.jpg";
	texture_building1.image.onload=function ()
	{
	
		gl.bindTexture(gl.TEXTURE_2D,texture_building1);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
		gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,texture_building1.image);
		//gl.GenerateMipmap(gl.TEXTURE_2D);
		gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);
		gl.bindTexture(gl.TEXTURE_2D,null);
	
	}
	
	texture_building2=gl.createTexture();
	texture_building2.image=new Image();
	texture_building2.image.src="resources/City/textureBuilding2.jpg";
	texture_building2.image.onload=function ()
	{
	
		gl.bindTexture(gl.TEXTURE_2D,texture_building2);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
		gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,texture_building2.image);
		gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);
		gl.bindTexture(gl.TEXTURE_2D,null);
	
	}
	
	
	texture_building3=gl.createTexture();
	texture_building3.image=new Image();
	texture_building3.image.src="resources/City/textureBuilding3.jpg";
	texture_building3.image.onload=function ()
	{
	
		gl.bindTexture(gl.TEXTURE_2D,texture_building3);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
		gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,texture_building3.image);
		gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);
		gl.bindTexture(gl.TEXTURE_2D,null);
	
	}
	
	texture_building4=gl.createTexture();
	texture_building4.image=new Image();
	texture_building4.image.src="resources/City/textureBuilding4.jpg";
	texture_building4.image.onload=function ()
	{
	
		gl.bindTexture(gl.TEXTURE_2D,texture_building4);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
		gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,texture_building4.image);
		gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);
		gl.bindTexture(gl.TEXTURE_2D,null);
	
	}
	
	texture_building5=gl.createTexture();
	texture_building5.image=new Image();
	texture_building5.image.src="resources/City/textureBuilding5.jpg";
	texture_building5.image.onload=function ()
	{
	
		gl.bindTexture(gl.TEXTURE_2D,texture_building5);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
		gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,texture_building5.image);
		gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);
		gl.bindTexture(gl.TEXTURE_2D,null);
	
	}
	
	texture_building6=gl.createTexture();
	texture_building6.image=new Image();
	texture_building6.image.src="resources/City/textureBuilding6.jpg";
	texture_building6.image.onload=function ()
	{
	
		gl.bindTexture(gl.TEXTURE_2D,texture_building6);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
		gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,texture_building6.image);
		gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);
		gl.bindTexture(gl.TEXTURE_2D,null);
	
	}
	
	
	texture_road=gl.createTexture();
	texture_road.image=new Image();
	texture_road.image.src="resources/City/Roads.png";
	texture_road.image.onload=function ()
	{
	
		gl.bindTexture(gl.TEXTURE_2D,texture_road);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
		gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,texture_road.image);
		gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);
		gl.bindTexture(gl.TEXTURE_2D,null);
	
	}


	texture_astromedicomp=gl.createTexture();
	texture_astromedicomp.image=new Image();
	texture_astromedicomp.image.src="resources/City/textureAstromedicomp.png";
	texture_astromedicomp.image.onload=function ()
	{
	
		gl.bindTexture(gl.TEXTURE_2D,texture_astromedicomp);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
		gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,texture_astromedicomp.image);
		gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);
		gl.bindTexture(gl.TEXTURE_2D,null);	
	
	}


	texture_ashram=gl.createTexture();
	texture_ashram.image=new Image();
	texture_ashram.image.src="resources/City/textureAshram.jpg";
	texture_ashram.image.onload=function ()
	{
	
		gl.bindTexture(gl.TEXTURE_2D,texture_ashram);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
		gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,texture_ashram.image);
		gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);
		gl.bindTexture(gl.TEXTURE_2D,null);
	
	}



	texture_lionking=gl.createTexture();
	texture_lionking.image=new Image();
	texture_lionking.image.src="resources/City/textureLionKing.png";
	texture_lionking.image.onload=function ()
	{
	
		gl.bindTexture(gl.TEXTURE_2D,texture_lionking);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
		gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,texture_lionking.image);
		gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);
		gl.bindTexture(gl.TEXTURE_2D,null);
	
	}

	texture_whiteQuad=gl.createTexture();
	texture_whiteQuad.image=new Image();
	texture_whiteQuad.image.src="resources/City/textureWhiteQuad.png";
	texture_whiteQuad.image.onload=function ()
	{
	
		gl.bindTexture(gl.TEXTURE_2D,texture_whiteQuad);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
		gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,texture_whiteQuad.image);
		gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);
		gl.bindTexture(gl.TEXTURE_2D,null);
	
	}
	
	texture_manyavar=gl.createTexture();
	texture_manyavar.image=new Image();
	texture_manyavar.image.src="resources/City/textureManyawar.jpg";
	texture_manyavar.image.onload=function ()
	{
	
		gl.bindTexture(gl.TEXTURE_2D,texture_manyavar);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
		gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,texture_manyavar.image);
		gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);
		gl.bindTexture(gl.TEXTURE_2D,null);
	
	}
	

	// Give Triangle Vertices
	var triangleVertices_city=new Float32Array([
					0.0,1.0,0.0, //Appex
					0.0,-1.0,0.0, //Left-Bottom
					1.0,-1.0,0.0,	//Right-Bottom
					1.0,-1.0,0.0,
					1.0,1.0,1.0

					]);


	var triangleColor_city=new Float32Array([
					1.0,0.0,0.0, //Appex
					0.0,1.0,0.0, //Left-Bottom
					0.0,0.0,1.0	//Right-Bottom
					]);
				
	var triangleTexture_city=new Float32Array([
					1.0,1.0,
					0.0,1.0,
					0.0,0.0
					]);
					



	vao_city=gl.createVertexArray();
	gl.bindVertexArray(vao_city);

	vbo_city=gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,vbo_city);
	//gl.bufferData(gl.ARRAY_BUFFER,triangleVertices,gl.DYNAMIC_DRAW);
	gl.bufferData(gl.ARRAY_BUFFER,triangleVertices_city,gl.DYNAMIC_DRAW,0,triangleVertices_city.length);
	gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_POSITION,3,gl.FLOAT,false,0,0);
	gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_POSITION);
	gl.bindBuffer(gl.ARRAY_BUFFER,null);


	vbo_color_city=gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,vbo_color_city);
	//gl.bufferData(gl.ARRAY_BUFFER,triangleColor,gl.DYNAMIC_DRAW);
	gl.bufferData(gl.ARRAY_BUFFER,triangleColor_city,gl.DYNAMIC_DRAW,0,triangleColor_city.length);
	gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_COLOR,3,gl.FLOAT,false,0,0);
	gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_COLOR);
	gl.bindBuffer(gl.ARRAY_BUFFER,null);



	vbo_texture_city=gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,vbo_texture_city);
	//gl.bufferData(gl.ARRAY_BUFFER,triangleColor,gl.DYNAMIC_DRAW);
	gl.bufferData(gl.ARRAY_BUFFER,triangleTexture_city,gl.DYNAMIC_DRAW,0,triangleTexture_city.length);
	gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_TEXTURE,2,gl.FLOAT,false,0,0);
	gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_TEXTURE);
	gl.bindBuffer(gl.ARRAY_BUFFER,null);

	

	gl.bindVertexArray(null);

	//cameraCentreZ_city=cameraPositionZ_city-1.0;
	//cameraAngleY_city=Math.atan(((cameraCentreZ_city-cameraPositionZ_city)/(cameraCentreX_city-cameraPositionX_city) ));
	//cameraAngleX_city=Math.atan(((cameraCentreZ_city-cameraPositionZ_city)/(cameraCentreY_city-cameraPositionY_city) ));

	//Initialize the Camera at the Same leel to the Ashram building
	cameraPositionZ_city=ashramPositionZ;
	cameraPositionY_city=ashramPositionY;
	cameraPositionX_city=ashramPositionX-3.0;
	
	cameraCentreX_city=ashramCentreX;
	cameraCentreY_city=ashramCentreY;
	cameraCentreZ_city=ashramCentreZ;
	 centre=[cameraCentreX_city,cameraCentreY_city,cameraCentreZ_city];
	 
	 
	 //adjustment for Front Flex
	 // cameraPositionZ_city=startCameraPosition;
	 // cameraPositionX_city=0.0;
	 // cameraPositionY_city=0.0;

		// cameraCentreX_city=0.0;
		// cameraCentreY_city=10.0;
		// cameraCentreZ_city=-85.0;
	 
	 //Initialize the Camera at the Last flex
	 

	 cameraUp=[0.0,1.0,0.0];
	 cameraPos=[cameraPositionX_city,cameraPositionY_city,cameraPositionZ_city];//x,y,z

	//mat4.perspective(perspectiveProjectionMatrix,45.0,parseFloat(canvas.width)/parseFloat(canvas.height),0.1,100.0);


	//gl.clearColor(0.6017,0.4627,0.3255,1.0);

	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);

}

function FlexShaderInitialization()
{
	var vertexShaderFlexSourceCode=
		"#version 300 es"+
	"\n"+
	"in vec4 vPosition;"+
	"in vec2 inTexcoord;"+
	"in vec3 inColor;"+
	"out vec3 outColor;"+
	"out vec2 outTexcoord;"+
	"uniform mat4 u_mvp_uniform;"+
	"void main(void)"+
	"{"+
	"gl_Position=u_mvp_uniform*vPosition;"+
	"outTexcoord=inTexcoord;"+
	"}";//Preamble

	vertexShaderFlexObject_city=gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShaderFlexObject_city,vertexShaderFlexSourceCode);
	gl.compileShader(vertexShaderFlexObject_city);

	if(gl.getShaderParameter(vertexShaderFlexObject_city,gl.COMPILE_STATUS)==false)
	{
		var error=gl.getShaderInfoLog(vertexShaderFlexObject_city);
		if(error.length>0)
		{
			alert("VertexShaderError:"+error);
			City_Uninitialize();
		}

	}

	
	var fragmentShaderFlexSourceCode=
	"#version 300 es"+
"\n"+
"precision highp float;"+
"out vec4 fragColor;"+
"in vec3 outColor;"+
"in vec2 outTexcoord;"+
"uniform highp sampler2D u_texcoord;"+
"void main(void)"+
"{"+
"vec4 color=texture(u_texcoord,outTexcoord);"+
"if(color.r>0.8 && color.g>0.8 && color.b>0.8)"+
"discard;"+
"fragColor=color;"+
"}";

	fragmentShaderFlexObject_city=gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShaderFlexObject_city,fragmentShaderFlexSourceCode);
	gl.compileShader(fragmentShaderFlexObject_city);

	if(gl.getShaderParameter(fragmentShaderFlexObject_city,gl.COMPILE_STATUS)==false)
	{
		var error=gl.getShaderInfoLog(fragmentShaderFlexObject_city);
		if(error.length>0)
		{

			alert("FragmentShaderErrror:"+error);
			City_Uninitialize();
		}
	}
	shaderProgramFlexObjcet_city=gl.createProgram();
	gl.attachShader(shaderProgramFlexObjcet_city,vertexShaderFlexObject_city);
	gl.attachShader(shaderProgramFlexObjcet_city,fragmentShaderFlexObject_city);


	gl.bindAttribLocation(shaderProgramFlexObjcet_city,WebGLMacros.AMC_ATTRIBUTE_POSITION,"vPosition");
	gl.bindAttribLocation(shaderProgramFlexObjcet_city,WebGLMacros.AMC_ATTRIBUTE_TEXTURE,"inTexcoord");


	//Linking the Program
	gl.linkProgram(shaderProgramFlexObjcet_city);
	if(!gl.getProgramParameter(shaderProgramFlexObjcet_city,gl.LINK_STATUS))
	{
		var error=gl.getProgramInfoLog(shaderProgramFlexObjcet_city)
		if(error.length>0)
		{
			alert("Shader Program Link Error:"+error);
			City_Uninitialize();
		}
	}


	mvpUniform_cityFlex=gl.getUniformLocation(shaderProgramFlexObjcet_city,"u_mvp_uniform");
	uniform_sampler2dFlex=gl.getUniformLocation(shaderProgramFlexObjcet_city,"u_texcoord");
	

	
}
function City_Draw_Normal()
{
	normalFlowNageshScene=true;
	City_Draw();
}

function City_Draw_Reverse()
{
	
	normalFlowNageshScene=false;
	City_Draw();
}


function City_Draw()
{
	// Set Clear Color
	//gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

	var one = new Float32Array([1.0 ]);
	var black = new Float32Array ([ 0.0 , 0.0 , 0.0 , 1.0  ]);
	
	gl.useProgram(shaderProgramObject_city);
	//Frame Buffer
	// gl.bindFramebuffer(gl.FRAMEBUFFER, n_fbo);
		
		// gl.clearBufferfv(gl.COLOR, 0, black);
		// gl.clearBufferfv(gl.DEPTH, 0, one);
		// if (bFullscreen) {
			// gl.viewport(0, 0, canvas.width - 384, canvas.height + 456);
		// }
		// else {
			// gl.viewport(0, 0, canvas.width, canvas.height);
		// }
		
		
	// gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	
	
	
	var modelViewMatrix=mat4.create();
	var modelViewProjectionMatrix=mat4.create();
	/*translateY+=2.0;
	if(translateY>=0.0)
		translateY=-20.0;*/
	translateY_city=-2.0;
	//var normalFlowSlowSteps=1.0;
	//if(cameraPositionZ_city<=-30.0)
	//normalFlowSlowSteps=(40.0+cameraPositionZ_city)/10.0;
	
	var normalFlowSlowSteps=1.0;

	
	var viewMatrix=mat4.create();

	//Loo at Front Flex
	// if(cameraCentreX_city>=frontFlexCentreX)
	// {
		// cameraCentreX_city-=0.05;
		// cameraCentreY_city=goFromAtoB(cameraCentreY_city,frontFlexCentreY,(0.05)*(Math.abs(frontFlexCentreY-10.0))/(Math.abs(0.0-frontFlexCentreX)));
		// cameraCentreZ_city=goFromAtoB(cameraCentreZ_city,frontFlexCentreZ,(0.05)*(Math.abs(frontFlexCentreZ-(-85.0)))/(Math.abs(0.0-frontFlexCentreX)));
	// }
	// else if(cameraPositionZ_city>=frontFlexPositionZ+5.0)
	// {
		// cameraPositionZ_city-=0.07;
		// //cameraPositionX_city-=(0.07)*(Math.abs(frontFlexPositionX-(frontFlexCentreX+5.0)))/(Math.abs(startCameraPosition-(frontFlexPositionZ+5.0)));
		// cameraPositionX_city-=(0.07)*(Math.abs(0.0-(frontFlexCentreX+4.0)))/(Math.abs(startCameraPosition-(frontFlexPositionZ+5.0)));
		// cameraPositionY_city+=(0.07)*(Math.abs(frontFlexCentreY-0.0))/(Math.abs(startCameraPosition-(frontFlexPositionZ+5.0)));
	// }
	
	
	/*
	if(normalFlowNageshScene==true)
	{
	if(cameraPositionX_city>0.0 )
	{
		cameraPositionX_city-=0.1;
	}
	else if(cameraPositionX_city<0.0)
	{
		normalFlowNageshScene=false;
		cameraPositionX_city=0.0
	}
	}
	else
	{
		if(cameraPositionX_city<4.0)
	{
		cameraPositionX_city+=0.1;
		
	}
	else
	{
		
		normalFlowNageshScene=true;
	}
	}*/
	
	
	if(normalFlowNageshScene==true)
	{
		if(cameraPositionX_city>0.0001 )
		{//Zoom out from ashram
	
			if(cameraPositionX_city<=1.5)
				normalFlowSlowSteps=(Math.abs(0.0-cameraPositionX_city)/1.5)
			cameraPositionX_city-=normalFlowSlowSteps*0.06;
			cameraPositionY_city=goFromAtoB(cameraPositionY_city,0.0,(normalFlowSlowSteps*0.06)*(Math.abs(ashramPositionY-(0.0)))/(Math.abs((ashramPositionX-3.0)-0.0)));
			//console.log("CameraPositionY"+(0.06)*(Math.abs(ashramPositionY-(0.0)))/(Math.abs(ashramPositionX-0.0)));
		}
		else if(cameraCentreX_city>0.0)
		{
			//rotate the Camera towards main Flex
			 //Adjustments are present  here
			cameraCentreX_city-=0.06;
			cameraCentreZ_city-=(0.02)*((ashramCentreZ-(-85.0))/(ashramCentreX-3.0));
			cameraCentreY_city+=(0.02)*(10.0-ashramCentreY)/(ashramCentreX-3.0);
			//PrintInfo();
		}
		else if(cameraPositionZ_city>=-39.9)
		{
			
			if(cameraPositionZ_city<=-30.0)
				normalFlowSlowSteps=(40.0+cameraPositionZ_city)/10.0;

			cameraPositionX_city=0.0;
			cameraCentreZ_city=-85.0;
			cameraCentreY_city=10.0;
			
			cameraPositionZ_city-=(normalFlowSlowSteps)*0.1;
			
		}
		else if(lookTowardsMainFlex<150)
		{
			lookTowardsMainFlex++;
		}
		else if(cameraPositionZ_city>=-59)
		{
			cameraPositionZ_city-=0.1;
			cameraPositionY_city+=(0.1)*(8.0/20.0);
			cameraCentreY_city+=(0.1)*(2.0/20.0);
			
		}
		else
		{
			normalFlowNageshScene=false;
			finishNageshsFourthScene = true;
		}
		
	}	
	else
	{//console.log("else part");
		var multFactor=5.0;
		if(cameraPositionZ_city<=-40.0)
		{
			
			cameraPositionZ_city+=0.1;
			cameraPositionY_city-=(0.1)*(8.0/20.0);
			cameraCentreY_city-=(0.1)*(2.0/20.0);

		}
		else if(cameraPositionZ_city<=startCameraPosition && cameraToTheStartPositionInReverse==false)
		{
			cameraPositionZ_city+=multFactor*(0.1);
		}
		else if(cameraCentreX_city>=frontFlexCentreX)
		{cameraToTheStartPositionInReverse=true;
			cameraCentreX_city-=0.1;
			cameraCentreY_city=goFromAtoB(cameraCentreY_city,frontFlexCentreY,(0.1)*(Math.abs(frontFlexCentreY-startCameraPosition)/(Math.abs(0.0-frontFlexCentreX))));
			cameraCentreZ_city=goFromAtoB(cameraCentreZ_city,frontFlexCentreZ,(0.1)*(Math.abs(frontFlexCentreZ-(-85.0)))/(Math.abs(0.0-frontFlexCentreX)));
		}
		else if(cameraPositionZ_city>=frontFlexPositionZ+5.0)
	{
		cameraPositionZ_city-=0.07;
		//cameraPositionX_city-=(0.07)*(Math.abs(frontFlexPositionX-(frontFlexCentreX+5.0)))/(Math.abs(startCameraPosition-(frontFlexPositionZ+5.0)));
		cameraPositionX_city-=(0.07)*(Math.abs(0.0-(frontFlexCentreX+4.0)))/(Math.abs(startCameraPosition-(frontFlexPositionZ+5.0)));
		cameraPositionY_city+=(0.07)*(Math.abs(frontFlexCentreY-0.0))/(Math.abs(startCameraPosition-(frontFlexPositionZ+5.0)));
	}
	
		else
		{
			normalFlowNageshScene=true;
			finishNageshsSixthScene = true;
		}
		
	}
	
	
	// else if(cameraPositionZ_city>=frontFlexPositionZ+5.0)
	// {
		// cameraPositionZ_city-=0.1;
		// cameraPositionX_city-=(0.1)*(Math.abs(frontFlexPositionX-(frontFlexCentreX+5.0)))/(Math.abs(startCameraPosition-(frontFlexPositionZ+5.0)));
		// cameraPositionY_city+=(0.1)*(Math.abs(frontFlexCentreY-0.0))/(Math.abs(startCameraPosition-(frontFlexPositionZ+5.0)));
	// }
	
		  //centre=[cameraCentreX_city,cameraCentreY_city,cameraCentreZ_city];
	 centre=[cameraCentreX_city,cameraCentreY_city,cameraCentreZ_city];
	 cameraPos=[cameraPositionX_city,cameraPositionY_city,cameraPositionZ_city];//x,y,z


	mat4.lookAt(viewMatrix,cameraPos,centre,cameraUp);
	//mat4.rotateY(viewMatrix,viewMatrix,3.14/2.0);

	//viewMatrix=mat4.create();
	//mat4.translate(viewMatrix,viewMatrix,[0.0,0.0,translateZ-0.1]);
	var modelMatrix=mat4.create();

	mat4.translate(modelMatrix,modelMatrix,[0.0,0.0,translateZ_city]);

	//Adjustment

	mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);


	mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrix);

	gl.uniformMatrix4fv(mvpUniform_city,false,modelViewProjectionMatrix);


	

	road();
	

	//Adjustment
	modelMatrix=mat4.create();

	mat4.translate(modelMatrix,modelMatrix,[0.0,0.0,translateZ_city-35.0]);

	//Adjustment

	mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);


	mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrix);

	gl.uniformMatrix4fv(mvpUniform_city,false,modelViewProjectionMatrix);

	mainFlexFunction(0.0,0.0,translateZ_city-35.0,viewMatrix);
	
	
	
	 gl.bindTexture(gl.TEXTURE_2D,texture_building1);
	 gl.uniform1i(uniform_sampler2d,0);

	modelMatrix=mat4.create();

	mat4.translate(modelMatrix,modelMatrix,[2.0,0.0,translateZ_city]);

	//Adjustment

	mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);


	mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrix);

	gl.uniformMatrix4fv(mvpUniform_city,false,modelViewProjectionMatrix);
	//building(2.0,3.0,1.0,1);



	modelMatrix=mat4.create();
	mat4.translate(modelMatrix,modelMatrix,[-2.0,0.0,translateZ_city]);
	
	mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);

	mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrix);

	gl.uniformMatrix4fv(mvpUniform_city,false,modelViewProjectionMatrix);
	
	//building(2.0,3.0,1.0,2);


	//Building Behind the Flex


		//Ashram Building Draw:

	modelMatrix=mat4.create();
	mat4.translate(modelMatrix,modelMatrix,[ashramPositionX,0.0,ashramPositionZ]);

	mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);

	mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrix);

	gl.uniformMatrix4fv(mvpUniform_city,false,modelViewProjectionMatrix);

	if(normalFlowNageshScene == true)
	{
		AshramBuilding(3.0,6.0,10.0);
		//texture_manyavar
	}	
	else{
		building(2.0,3.0,4.0,1);
	}
	


	modelMatrix=mat4.create();
	mat4.translate(modelMatrix,modelMatrix,[frontFlexPositionX,frontFlexPositionY,frontFlexPositionZ]);

	mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);

	mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrix);

	gl.uniformMatrix4fv(mvpUniform_city,false,modelViewProjectionMatrix);

	//building(3.0,3.0,3.0,3);
	frontFlexFunction();
	
	
	
	excessiveBuildings(viewMatrix);

	gl.useProgram(null);

}

 function AshramBuilding(length,height,width)
 {
	 	 gl.bindTexture(gl.TEXTURE_2D,texture_ashram);
	 gl.uniform1i(uniform_sampler2d,0);

	 
	length=length/2.0;
	height=height;
	width=width/2.0;
	
	
	var buildingVertices_city=new Float32Array([


					length,height,width, //Appex
					(-1.0)*length,height,width, //Left-Bottom
					(-1.0)*length,-1.0,width,	//Right-Bottom
					length,-1.0,width,

					//Right
					length,height,(-1.0)*width,
					length,height,width,
					length,-1.0,width,
					length,-1.0,(-1.0)*width,

					//Back
					(-1.0)*length,height,(-1.0)*width,
					length,height,(-1.0)*width,
					length,-1.0,(-1.0)*width,
					(-1.0)*length,-1.0,(-1.0)*width,

					//Left
					(-1.0)*length,height,width,
					(-1.0)*length,height,(-1.0)*width,
					(-1.0)*length,-1.0,(-1.0)*width,
					(-1.0)*length,-1.0,width



					]);
					
					
	var buildingTextureCity=new Float32Array([
					1.0,1.0,
					0.0,1.0,
					0.0,0.0,
					1.0,0.0,
					
					1.0,1.0,
					0.0,1.0,
					0.0,0.0,
					1.0,0.0,
					
					1.0,1.0,
					0.0,1.0,
					0.0,0.0,
					1.0,0.0,
					
					1.0,1.0,
					0.0,1.0,
					0.0,0.0,
					1.0,0.0
					]);


	var buildingColor_city=new Float32Array([
					1.0,0.0,0.0, //Appex
					1.0,0.0,0.0, //Appex
					1.0,0.0,0.0, //Appex
					1.0,0.0,0.0, //Appex

					
					0.0,1.0,0.0, //Appex
					0.0,1.0,0.0, //Appex
					0.0,1.0,0.0, //Appex
					0.0,1.0,0.0, //Appex


					1.0,0.0,1.0, //Appex
					1.0,0.0,1.0, //Appex
					1.0,0.0,1.0, //Appex
					1.0,0.0,1.0, //Appex

					
					1.0,1.0,0.0, //Appex
					1.0,1.0,0.0, //Appex
					1.0,1.0,0.0, //Appex
					1.0,1.0,0.0 //Appex
					]);




	//vao=gl.createVertexArray();
	gl.bindVertexArray(vao_city);

	//vbo=gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,vbo_city);
	gl.bufferData(gl.ARRAY_BUFFER,buildingVertices_city,gl.DYNAMIC_DRAW,0,buildingVertices_city.length);
	gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_POSITION,3,gl.FLOAT,false,0,0);
	gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_POSITION);
	gl.bindBuffer(gl.ARRAY_BUFFER,null);



	//vbo_color=gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,vbo_color_city);
	gl.bufferData(gl.ARRAY_BUFFER,buildingColor_city,gl.DYNAMIC_DRAW,0,buildingColor_city.length);
	gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_COLOR,3,gl.FLOAT,false,0,0);
	gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_COLOR);
	gl.bindBuffer(gl.ARRAY_BUFFER,null);



	gl.bindBuffer(gl.ARRAY_BUFFER,vbo_texture_city);
	gl.bufferData(gl.ARRAY_BUFFER,buildingTextureCity,gl.DYNAMIC_DRAW,0,buildingTextureCity.length);
	gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_TEXTURE,2,gl.FLOAT,false,0,0);
	gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_TEXTURE);
	gl.bindBuffer(gl.ARRAY_BUFFER,null);
	

	gl.drawArrays(gl.TRIANGLE_FAN,0,4);

	gl.drawArrays(gl.TRIANGLE_FAN,4,4);

	gl.drawArrays(gl.TRIANGLE_FAN,8,4);

	gl.drawArrays(gl.TRIANGLE_FAN,12,4);
	gl.bindVertexArray(null);

	
	 
 }


function excessiveBuildings(viewMatrix)
{

	var modelMatrix=mat4.create();
	var modelViewMatrix=mat4.create();
	var modelViewProjectionMatrix=mat4.create();
	
	
	
	
	
	
	
	/*
	-----------------------------------------------%%%%%%%%%%%%%%%%%%%%%-------------------------------------
								
	~~~~~~~~~~~~~~~~				Part 1  :  Left Side Of The Road					~~~~~~~~~~~~~~~~~~									
								
	------------------------------------------------$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$-------------------------------------
	*/	
	modelMatrix=mat4.create();
	mat4.translate(modelMatrix,modelMatrix,[-4.5,0.0,translateZ_city+2.0]);
	mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);
	
	mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrix);

	gl.uniformMatrix4fv(mvpUniform_city,false,modelViewProjectionMatrix);

	building(2.5,8.0,2.2,2);
	
	
	
	
	
	modelMatrix=mat4.create();
	mat4.translate(modelMatrix,modelMatrix,[-4.5,0.0,translateZ_city+4.0]);
	mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);
	
	mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrix);

	gl.uniformMatrix4fv(mvpUniform_city,false,modelViewProjectionMatrix);

	building(3.5,8.0,2.2,4);
	
	
	
	
		
	
	
	modelMatrix=mat4.create();
	mat4.translate(modelMatrix,modelMatrix,[-4.5,0.0,translateZ_city+10.0]);
	mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);
	
	mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrix);

	gl.uniformMatrix4fv(mvpUniform_city,false,modelViewProjectionMatrix);

	building(3.5,20.0,2.2,6);
	
	
	modelMatrix=mat4.create();
	mat4.translate(modelMatrix,modelMatrix,[-4.5,0.0,translateZ_city+7.0]);
	mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);
	
	mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrix);

	gl.uniformMatrix4fv(mvpUniform_city,false,modelViewProjectionMatrix);

	building(3.5,20.0,2.2,1);
	
	modelMatrix=mat4.create();
	mat4.translate(modelMatrix,modelMatrix,[-4.5,0.0,translateZ_city+18.0]);
	mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);
	
	mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrix);

	gl.uniformMatrix4fv(mvpUniform_city,false,modelViewProjectionMatrix);

	building(4.5,13.0,2.2,1);
	
	
	
	modelMatrix=mat4.create();
	mat4.translate(modelMatrix,modelMatrix,[-4.5,0.0,translateZ_city+15.0]);
	mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);
	
	mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrix);

	gl.uniformMatrix4fv(mvpUniform_city,false,modelViewProjectionMatrix);

	building(4.5,13.0,2.2,3);
	
	
	
	
	modelMatrix=mat4.create();
	mat4.translate(modelMatrix,modelMatrix,[-4.5,0.0,translateZ_city+20.0]);
	mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);
	
	mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrix);

	gl.uniformMatrix4fv(mvpUniform_city,false,modelViewProjectionMatrix);

	building(4.5,13.0,2.2,4);
	
	modelMatrix=mat4.create();
	mat4.translate(modelMatrix,modelMatrix,[-4.5,0.0,translateZ_city-2.0]);
	mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);

	mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrix);

	gl.uniformMatrix4fv(mvpUniform_city,false,modelViewProjectionMatrix);

	building(3.5,8.0,2.2,3);
	
	
	
	
	
	modelMatrix=mat4.create();
	mat4.translate(modelMatrix,modelMatrix,[-4.5,0.0,translateZ_city-3.0]);
	mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);
	
	mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrix);

	gl.uniformMatrix4fv(mvpUniform_city,false,modelViewProjectionMatrix);

	building(4.5,8.0,2.2,5);
	
	
	
	modelMatrix=mat4.create();
	mat4.translate(modelMatrix,modelMatrix,[-10.5,0.0,translateZ_city-1.0]);
	mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);
	mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrix);

	gl.uniformMatrix4fv(mvpUniform_city,false,modelViewProjectionMatrix);

	building(4.5,15.0,2.2,2);
	
	
	
	
	
	modelMatrix=mat4.create();
	mat4.translate(modelMatrix,modelMatrix,[-14.5,0.0,translateZ_city-4.0]);
	mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);
	mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrix);

	gl.uniformMatrix4fv(mvpUniform_city,false,modelViewProjectionMatrix);

	building(4.5,15.0,5.2,3);
	
	
	
	
	modelMatrix=mat4.create();
	mat4.translate(modelMatrix,modelMatrix,[-17,0.0,translateZ_city-8.0])
	mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);
	mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrix);

	gl.uniformMatrix4fv(mvpUniform_city,false,modelViewProjectionMatrix);

	building(4.5,15.0,2.2,5);
	
	
	
	
	
	
	modelMatrix=mat4.create();
	mat4.translate(modelMatrix,modelMatrix,[-4.5,0.0,translateZ_city-10.0]);
	mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);
	mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrix);

	gl.uniformMatrix4fv(mvpUniform_city,false,modelViewProjectionMatrix);

	building(4.5,15.0,2.2,6);
	
	
	
	
	
	
	modelMatrix=mat4.create();
	mat4.translate(modelMatrix,modelMatrix,[-10.5,0.0,translateZ_city-1.0]);
	mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);
	mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrix);

	gl.uniformMatrix4fv(mvpUniform_city,false,modelViewProjectionMatrix);

	building(4.5,15.0,2.2,1);
	
	
	modelMatrix=mat4.create();
	mat4.translate(modelMatrix,modelMatrix,[-5.5,0.0,translateZ_city-20.0]);
	mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);
	mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrix);

	gl.uniformMatrix4fv(mvpUniform_city,false,modelViewProjectionMatrix);

	building(4.5,10.0,2.2,3);
	
	
	modelMatrix=mat4.create();
	mat4.translate(modelMatrix,modelMatrix,[-4.5,0.0,translateZ_city-13.0]);
	mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);
	mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrix);

	gl.uniformMatrix4fv(mvpUniform_city,false,modelViewProjectionMatrix);

	building(4.5,13.0,2.2,5);
	
	
	modelMatrix=mat4.create();
	mat4.translate(modelMatrix,modelMatrix,[-4.5,0.0,translateZ_city-17.0]);
	mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);
	mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrix);

	gl.uniformMatrix4fv(mvpUniform_city,false,modelViewProjectionMatrix);

	building(4.5,10.0,2.2,3);
	
	
	modelMatrix=mat4.create();
	mat4.translate(modelMatrix,modelMatrix,[-5.5,0.0,translateZ_city-23.0]);
	mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);
	mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrix);

	gl.uniformMatrix4fv(mvpUniform_city,false,modelViewProjectionMatrix);

	building(4.5,10.0,2.2,4);
	
	
	modelMatrix=mat4.create();
	mat4.translate(modelMatrix,modelMatrix,[-5.5,0.0,translateZ_city-28.0]);
	mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);
	mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrix);

	gl.uniformMatrix4fv(mvpUniform_city,false,modelViewProjectionMatrix);

	building(4.5,10.0,2.2,2);
	
	
	
	modelMatrix=mat4.create();
	mat4.translate(modelMatrix,modelMatrix,[-5.5,0.0,translateZ_city-33.0]);
	mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);
	mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrix);

	gl.uniformMatrix4fv(mvpUniform_city,false,modelViewProjectionMatrix);

	building(4.5,10.0,2.2,4);



	modelMatrix=mat4.create()
	mat4.translate(modelMatrix,modelMatrix,[-5.5,0.0,translateZ_city-36.0]);
	mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);
	mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrix);

	gl.uniformMatrix4fv(mvpUniform_city,false,modelViewProjectionMatrix);

	building(4.5,10.0,2.2,4);
	
	
	
	modelMatrix=mat4.create()
	mat4.translate(modelMatrix,modelMatrix,[-5.5,0.0,translateZ_city-43.0]);
	mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);
	mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrix);

	gl.uniformMatrix4fv(mvpUniform_city,false,modelViewProjectionMatrix);

	building(4.5,40.0,2.2,4);
	
	
	
	
	/*
	-----------------------------------------------%%%%%%%%%%%%%%%%%%%%%-------------------------------------
						
	~~~~~~~~~~~~~~~~				Part 2  :  Right Side OF the Road				~~~~~~~~~~~~~~~~~~									
								
	------------------------------------------------$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$-------------------------------------
	*/
	
	
	
	
	
	modelMatrix=mat4.create();
	mat4.translate(modelMatrix,modelMatrix,[4.5,0.0,translateZ_city+5.0]);
	mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);
	
	mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrix);

	gl.uniformMatrix4fv(mvpUniform_city,false,modelViewProjectionMatrix);

	building(3.5,8.0,2.2,1);
	
	
	modelMatrix=mat4.create();
	mat4.translate(modelMatrix,modelMatrix,[4.5,0.0,translateZ_city-3.0]);
	mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);
	
	mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrix);

	gl.uniformMatrix4fv(mvpUniform_city,false,modelViewProjectionMatrix);

	building(3.5,8.0,2.2,3);
	
	
	
	modelMatrix=mat4.create();
	mat4.translate(modelMatrix,modelMatrix,[4.5,0.0,translateZ_city-3.0]);
	mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);
	
	mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrix);

	gl.uniformMatrix4fv(mvpUniform_city,false,modelViewProjectionMatrix);

	building(3.5,8.0,2.2,3);
	
	modelMatrix=mat4.create();
	mat4.translate(modelMatrix,modelMatrix,[4.5,0.0,translateZ_city+10.0]);
	mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);
	
	mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrix);

	gl.uniformMatrix4fv(mvpUniform_city,false,modelViewProjectionMatrix);

	building(3.5,10.0,2.2,5);
	
	
	modelMatrix=mat4.create();
	mat4.translate(modelMatrix,modelMatrix,[4.5,0.0,translateZ_city+18.0]);
	mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);
	
	mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrix);

	gl.uniformMatrix4fv(mvpUniform_city,false,modelViewProjectionMatrix);

	building(3.5,13.0,2.2,2);
	
	
	modelMatrix=mat4.create();
	mat4.translate(modelMatrix,modelMatrix,[4.5,0.0,translateZ_city+14.0]);
	mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);
	
	mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrix);

	gl.uniformMatrix4fv(mvpUniform_city,false,modelViewProjectionMatrix);

	building(3.5,10.0,2.2,6);
	
	
	
	modelMatrix=mat4.create();
	mat4.translate(modelMatrix,modelMatrix,[4.5,0.0,translateZ_city+10.0]);
	mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);
	
	mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrix);

	gl.uniformMatrix4fv(mvpUniform_city,false,modelViewProjectionMatrix);

	building(4.5,19.0,2.2,5);
	
	
	
	modelMatrix=mat4.create();
	mat4.translate(modelMatrix,modelMatrix,[4.5,0.0,translateZ_city+15.0]);
	mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);
	
	mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrix);

	gl.uniformMatrix4fv(mvpUniform_city,false,modelViewProjectionMatrix);

	building(4.5,13.0,2.2,5);
	
	
	
	modelMatrix=mat4.create();
	mat4.translate(modelMatrix,modelMatrix,[4.5,0.0,translateZ_city+12.0]);
	mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);
	
	mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrix);

	gl.uniformMatrix4fv(mvpUniform_city,false,modelViewProjectionMatrix);

	building(4.5,13.0,2.2,6);
	
	
	modelMatrix=mat4.create();
	mat4.translate(modelMatrix,modelMatrix,[4.5,0.0,translateZ_city+22.0]);
	mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);
	
	mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrix);

	gl.uniformMatrix4fv(mvpUniform_city,false,modelViewProjectionMatrix);

	building(4.5,13.0,2.2,1);
	
	
	
	modelMatrix=mat4.create();

	mat4.translate(modelMatrix,modelMatrix,[4.5,0.0,translateZ_city+2.0]);
	mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);
	
	mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrix);

	gl.uniformMatrix4fv(mvpUniform_city,false,modelViewProjectionMatrix);

	building(3.5,10.0,3.2,2);
	
	
	
	modelMatrix=mat4.create();

	mat4.translate(modelMatrix,modelMatrix,[4.5,0.0,translateZ_city-5.0]);
	mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);
	
	mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrix);

	gl.uniformMatrix4fv(mvpUniform_city,false,modelViewProjectionMatrix);

	building(3.5,8.0,2.2,2);
	
	
	
	
	modelMatrix=mat4.create();
	mat4.translate(modelMatrix,modelMatrix,[4.5,0.0,translateZ_city-10.0]);
	mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);
	
	mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrix);

	gl.uniformMatrix4fv(mvpUniform_city,false,modelViewProjectionMatrix);

	building(3.5,8.0,2.2,6);
	
	
	modelMatrix=mat4.create();
	mat4.translate(modelMatrix,modelMatrix,[4.5,0.0,translateZ_city-15.0]);
	mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);
	
	mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrix);

	gl.uniformMatrix4fv(mvpUniform_city,false,modelViewProjectionMatrix);

	building(3.5,10.0,2.2,3);
	
	
	modelMatrix=mat4.create();
	mat4.translate(modelMatrix,modelMatrix,[7.5,0.0,translateZ_city-4.0]);
	mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);
	mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrix);

	gl.uniformMatrix4fv(mvpUniform_city,false,modelViewProjectionMatrix);

	building(4.5,25.0,2.2,1);
	
	
	
	
	
	modelMatrix=mat4.create();
	mat4.translate(modelMatrix,modelMatrix,[10.5,0.0,translateZ_city-4.0]);
	mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);
	mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrix);

	gl.uniformMatrix4fv(mvpUniform_city,false,modelViewProjectionMatrix);

	building(4.5,15.0,2.2,4);
	
	
	
	modelMatrix=mat4.create();
	mat4.translate(modelMatrix,modelMatrix,[5.5,0.0,translateZ_city-20.0]);
	mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);
	mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrix);

	gl.uniformMatrix4fv(mvpUniform_city,false,modelViewProjectionMatrix);

	building(4.5,10.0,2.2,2);
	
	
	
	
	modelMatrix=mat4.create();
	mat4.translate(modelMatrix,modelMatrix,[4.5,0.0,translateZ_city-13.0]);
	mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);
	mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrix);

	gl.uniformMatrix4fv(mvpUniform_city,false,modelViewProjectionMatrix);

	building(4.5,13.0,2.2,2);
	
	
	
	
	modelMatrix=mat4.create();
	mat4.translate(modelMatrix,modelMatrix,[4.5,0.0,translateZ_city-17.0]);
	mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);
	mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrix);

	gl.uniformMatrix4fv(mvpUniform_city,false,modelViewProjectionMatrix);

	building(4.5,10.0,2.2,3);
	
	
	
	
	
	
	modelMatrix=mat4.create();
	mat4.translate(modelMatrix,modelMatrix,[5.5,0.0,translateZ_city-23.0]);
	mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);
	mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrix);

	gl.uniformMatrix4fv(mvpUniform_city,false,modelViewProjectionMatrix);

	building(4.5,10.0,2.2,4);
	
	
	
	
	modelMatrix=mat4.create();
	mat4.translate(modelMatrix,modelMatrix,[5.5,0.0,translateZ_city-28.0]);
	mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);
	mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrix);

	gl.uniformMatrix4fv(mvpUniform_city,false,modelViewProjectionMatrix);

	building(4.5,10.0,2.2,6);
	
	
	//Buildings Parallel To the Y Junstion
	
	
	
	
	
	
	
	
	modelMatrix=mat4.create()
	mat4.translate(modelMatrix,modelMatrix,[5.5,0.0,translateZ_city-33.0]);
	mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);
	mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrix);

	gl.uniformMatrix4fv(mvpUniform_city,false,modelViewProjectionMatrix);

	building(4.5,10.0,2.2,4);
	
	
	
	
	modelMatrix=mat4.create()
	mat4.translate(modelMatrix,modelMatrix,[5.5,0.0,translateZ_city-36.0]);
	mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);
	mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrix);

	gl.uniformMatrix4fv(mvpUniform_city,false,modelViewProjectionMatrix);

	building(4.5,10.0,2.2,4);
	
	
	
	
	/*
	-----------------------------------------------%%%%%%%%%%%%%%%%%%%%%-------------------------------------
								
	~~~~~~~~~~~~~~~~				Part 3  :  Behind The Main Flex						~~~~~~~~~~~~~~~~~~									
								
	------------------------------------------------$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$-------------------------------------
	*/


	
	modelMatrix=mat4.create();
	mat4.translate(modelMatrix,modelMatrix,[0.0,0.0,translateZ_city-30.0]);
	mat4.rotateY(modelMatrix,modelMatrix,4.0/30.0);
	mat4.translate(modelMatrix,modelMatrix,[-3.5,0.0,-25.0]);

	mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);

	mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrix);

	gl.uniformMatrix4fv(mvpUniform_city,false,modelViewProjectionMatrix);
	
	building(3.0,15.0,2.0,5);
	
	
	
	modelMatrix=mat4.create();
	mat4.translate(modelMatrix,modelMatrix,[0.0,0.0,translateZ_city-30.0]);
	mat4.rotateY(modelMatrix,modelMatrix,4.0/30.0);
	mat4.translate(modelMatrix,modelMatrix,[-2.5,0.0,-15.0]);

	mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);

	mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrix);

	gl.uniformMatrix4fv(mvpUniform_city,false,modelViewProjectionMatrix);
	
	building(2.0,10.0,1.0,1);
	
	
	
	modelMatrix=mat4.create();
	mat4.translate(modelMatrix,modelMatrix,[0.0,0.0,translateZ_city-30.0]);
	mat4.rotateY(modelMatrix,modelMatrix,4.0/30.0);
	mat4.translate(modelMatrix,modelMatrix,[-4.5,0.0,-8.0]);

	mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);

	mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrix);

	gl.uniformMatrix4fv(mvpUniform_city,false,modelViewProjectionMatrix);
	
	building(3.0,10.0,2.0,2);
	
	
	
	//Right Side
	
	modelMatrix=mat4.create();
	mat4.translate(modelMatrix,modelMatrix,[0.0,0.0,translateZ_city-30.0]);
	mat4.rotateY(modelMatrix,modelMatrix,-4.0/30.0);
	mat4.translate(modelMatrix,modelMatrix,[3.5,0.0,-35.0]);

	mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);

	mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrix);

	gl.uniformMatrix4fv(mvpUniform_city,false,modelViewProjectionMatrix);
	
	building(3.0,15.0,2.0,3);
	
	
	modelMatrix=mat4.create();
	mat4.translate(modelMatrix,modelMatrix,[0.0,0.0,translateZ_city-30.0]);
	mat4.rotateY(modelMatrix,modelMatrix,-4.0/30.0);
	mat4.translate(modelMatrix,modelMatrix,[3.5,0.0,-27.0]);

	mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);

	mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrix);

	gl.uniformMatrix4fv(mvpUniform_city,false,modelViewProjectionMatrix);
	
	building(3.0,12.0,2.0,6);
	
	
	modelMatrix=mat4.create();
	mat4.translate(modelMatrix,modelMatrix,[0.0,0.0,translateZ_city-30.0]);
	mat4.rotateY(modelMatrix,modelMatrix,-4.0/30.0);
	mat4.translate(modelMatrix,modelMatrix,[2.5,0.0,-20.0]);

	mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);

	mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrix);

	gl.uniformMatrix4fv(mvpUniform_city,false,modelViewProjectionMatrix);

	building(2.0,8.0,2.0,5);


	modelMatrix=mat4.create();
	mat4.translate(modelMatrix,modelMatrix,[0.0,0.0,translateZ_city-30.0]);
	mat4.rotateY(modelMatrix,modelMatrix,-4.0/30.0);
	mat4.translate(modelMatrix,modelMatrix,[3.5,0.0,-17.0]);

	mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);

	mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrix);

	gl.uniformMatrix4fv(mvpUniform_city,false,modelViewProjectionMatrix);
	
	building(3.0,8.0,2.0,1);



	modelMatrix=mat4.create();
	mat4.translate(modelMatrix,modelMatrix,[0.0,0.0,translateZ_city-30.0]);
	mat4.rotateY(modelMatrix,modelMatrix,-4.0/30.0);
	mat4.translate(modelMatrix,modelMatrix,[4.5,0.0,-8.0]);

	mat4.multiply(modelViewMatrix,viewMatrix,modelMatrix);

	mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrix);

	gl.uniformMatrix4fv(mvpUniform_city,false,modelViewProjectionMatrix);
	
	building(3.0,10.0,2.0,2);
	
	
}


function mainFlexFunction(xTranslate,yTranslate,zTranslate,viewMatrix)
{
	
	
	// gl.useProgram(null);
	// gl.useProgram(shaderProgramFlexObjcet_city);
	
    // var modelViewMatrixFlex=mat4.create();
	// var modelViewProjectionMatrix=mat4.create();

	// mat4.translate(modelViewMatrixFlex,modelViewMatrixFlex,[0.0,0.0,-25.0]);
	// mat4.multiply(modelViewMatrixFlex,viewMatrix,modelViewMatrixFlex);
	// mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrixFlex);

	// gl.uniformMatrix4fv(mvpUniform_cityFlex,false,modelViewProjectionMatrix);



	 // gl.bindTexture(gl.TEXTURE_2D,texture_whiteQuad);

	 // gl.uniform1i(uniform_sampler2dFlex,0);
	 
	 if(normalFlowNageshScene == true)
	 {
	 gl.bindTexture(gl.TEXTURE_2D,texture_astromedicomp);
	 }
	 else{
		 gl.bindTexture(gl.TEXTURE_2D,texture_manyavar);
	 }
	 gl.uniform1i(uniform_sampler2d,0);
	
	var Flex=new Float32Array([
			
			3.0,10.0,0.0,
			-3.0,10.0,0.0,
			-3.0,5.0,0.0,
			3.0,5.0,0.0

					]);
					
	var FlexTexture=new Float32Array([
			
			1.0,1.0,
			0.0,1.0,
			0.0,0.0,
			1.0,0.0
					]);
					
					
					
	gl.bindVertexArray(vao_city);

	//vbo=gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,vbo_city);
	//gl.bufferData(gl.ARRAY_BUFFER,roadLineCoordinates,gl.DYNAMIC_DRAW);
	gl.bufferData(gl.ARRAY_BUFFER,Flex,gl.DYNAMIC_DRAW,0,Flex.length);
	gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_POSITION,3,gl.FLOAT,false,0,0);
	gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_POSITION);
	gl.bindBuffer(gl.ARRAY_BUFFER,null);



	//vbo_color=gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,vbo_texture_city);
	//gl.bufferData(gl.ARRAY_BUFFER,roadLineColor,gl.DYNAMIC_DRAW);
	gl.bufferData(gl.ARRAY_BUFFER,FlexTexture,gl.DYNAMIC_DRAW,0,FlexTexture.length);
	gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_TEXTURE,2,gl.FLOAT,false,0,0);
	gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_TEXTURE);
	gl.bindBuffer(gl.ARRAY_BUFFER,null);


	gl.drawArrays(gl.TRIANGLE_FAN,0,4);
	gl.bindVertexArray(null);
	
	
	
	//For new Shader
	/*
	gl.useProgram(null);
	gl.useProgram(shaderProgramFlexObjcet_city);
	
    var modelViewMatrixFlex=mat4.create();
	var modelViewProjectionMatrix=mat4.create();


mat4.translate(modelViewMatrixFlex,modelViewMatrixFlex,[xTranslate,yTranslate,zTranslate]);
	
	
	

	mat4.multiply(modelViewMatrixFlex,viewMatrix,modelViewMatrixFlex);
	mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrixFlex);

	gl.uniformMatrix4fv(mvpUniform_cityFlex,false,modelViewProjectionMatrix);



	 gl.bindTexture(gl.TEXTURE_2D,texture_astromedicomp);

	 gl.uniform1i(uniform_sampler2dFlex,0);
	
	
	var Flex=new Float32Array([
			
			1.0,10.0,0.0,
			-1.0,10.0,.0,
			-1.0,5.0,0.0,
			1.0,5.0,0.0

					]);
					
	var FlexTexture=new Float32Array([
			
			1.0,1.0,
			0.0,1.0,
			0.0,0.0,
			1.0,0.0
					]);
					
					
					
	gl.bindVertexArray(vao_city);

	//vbo=gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,vbo_city);
	//gl.bufferData(gl.ARRAY_BUFFER,roadLineCoordinates,gl.DYNAMIC_DRAW);
	gl.bufferData(gl.ARRAY_BUFFER,Flex,gl.DYNAMIC_DRAW,0,Flex.length);
	gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_POSITION,3,gl.FLOAT,false,0,0);
	gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_POSITION);
	gl.bindBuffer(gl.ARRAY_BUFFER,null);



	//vbo_color=gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,vbo_texture_city);
	//gl.bufferData(gl.ARRAY_BUFFER,roadLineColor,gl.DYNAMIC_DRAW);
	gl.bufferData(gl.ARRAY_BUFFER,FlexTexture,gl.DYNAMIC_DRAW,0,FlexTexture.length);
	gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_TEXTURE,2,gl.FLOAT,false,0,0);
	gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_TEXTURE);
	gl.bindBuffer(gl.ARRAY_BUFFER,null);

	//gl.drawArrays(gl.TRIANGLE_FAN,0,4);
	gl.bindVertexArray(null);

	



	
	
	
	
	
	gl.useProgram(null);
	gl.useProgram(shaderProgramObject_city);
*/
}


function road()
{

	 gl.bindTexture(gl.TEXTURE_2D,texture_road);
	 gl.uniform1i(uniform_sampler2d,0);

	var roadLineCoordinates_city=new Float32Array([

					-1.0,-1.0,40.0, //Appex
					-1.0,-1.0,-30.0, //Left-Bottom
					1.0,-1.0,-30.0,
					1.0,-1.0,40.0


					]);

	var roadLineColor_city=new Float32Array([
					1.0,0.0,0.0,
					0.0,1.0,0.0, 
					0.0,0.0,1.0,	
					1.0,1.0,1.0
					]);

	// Junction Point Y Point
	
	var slopeRoad=4.0/30;
	var roadWidth=3.0;
	var distance=10.0;
	
	var roadLineYJunction_city=new Float32Array([

					// -1.0,-1.0,-30.0, 
					// -5.0,-1.0,-60.0,
					// -2.0,-1.0,-60.0,
					// 0.0,-1.0,-30.0,
					// 1.0,-1.0,-30.0,
					// 5.0,-1.0,-60.0,
					// 2.0,-1.0,-60.0,
					// 0.0,-1.0,-30.0
					
					-1.0,-1.0,-30.0, 
					-7.0,-1.0,-80.0,
					-3.0,-1.0,-80.0,
					0.0,-1.0,-30.0,
					1.0,-1.0,-30.0,
					7.0,-1.0,-80.0,
					3.0,-1.0,-80.0,
					0.0,-1.0,-30.0

					]);
	var roadLineYJunctionColor_city=new Float32Array([
					1.0,1.0,0.0,
					0.0,1.0,1.0,
					1.0,0.0,1.0,
					0.0,0.0,1.0,
					1.0,1.0,0.0,
					0.0,1.0,1.0,
					1.0,0.0,1.0,
					0.0,0.0,1.0
					]);



	//vao=gl.createVertexArray();
	gl.bindVertexArray(vao_city);

	//vbo=gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,vbo_city);
	//gl.bufferData(gl.ARRAY_BUFFER,roadLineCoordinates,gl.DYNAMIC_DRAW);
	gl.bufferData(gl.ARRAY_BUFFER,roadLineCoordinates_city,gl.DYNAMIC_DRAW,0,roadLineCoordinates_city.length);
	gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_POSITION,3,gl.FLOAT,false,0,0);
	gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_POSITION);
	gl.bindBuffer(gl.ARRAY_BUFFER,null);



	//vbo_color=gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,vbo_color_city);
	//gl.bufferData(gl.ARRAY_BUFFER,roadLineColor,gl.DYNAMIC_DRAW);
	gl.bufferData(gl.ARRAY_BUFFER,roadLineColor_city,gl.DYNAMIC_DRAW,0,roadLineColor_city.length);
	gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_COLOR,3,gl.FLOAT,false,0,0);
	gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_COLOR);
	gl.bindBuffer(gl.ARRAY_BUFFER,null);


	gl.drawArrays(gl.TRIANGLE_FAN,0,4);
	gl.bindVertexArray(null);




	//Y Junction Left Drawing
	gl.bindVertexArray(vao_city);

	//vbo=gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,vbo_city);
	//gl.bufferData(gl.ARRAY_BUFFER,roadLineCoordinates,gl.DYNAMIC_DRAW);
	gl.bufferData(gl.ARRAY_BUFFER,roadLineYJunction_city,gl.DYNAMIC_DRAW,0,roadLineYJunction_city.length);
	gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_POSITION,3,gl.FLOAT,false,0,0);
	gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_POSITION);
	gl.bindBuffer(gl.ARRAY_BUFFER,null);



	//vbo_color=gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,vbo_color_city);
	//gl.bufferData(gl.ARRAY_BUFFER,roadLineColor,gl.DYNAMIC_DRAW);
	gl.bufferData(gl.ARRAY_BUFFER,roadLineYJunctionColor_city,gl.DYNAMIC_DRAW,0,roadLineYJunctionColor_city.length);
	gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_COLOR,3,gl.FLOAT,false,0,0);
	gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_COLOR);
	gl.bindBuffer(gl.ARRAY_BUFFER,null);


	gl.drawArrays(gl.TRIANGLE_FAN,0,4);
	gl.drawArrays(gl.TRIANGLE_FAN,4,4);

	gl.bindVertexArray(null);
	
	
	//YJunction Building

	 gl.bindTexture(gl.TEXTURE_2D,texture_building6);

	 gl.uniform1i(uniform_sampler2d,0);
	
	var YJunctionBuilding=new Float32Array([
			
			0.0,8.0,-35.0,
			0.0,-1.0,-35.0,
			1.5,-1.0,-55.0,
			1.0,8.0,-55.0,
			
			0.0,8.0,-35.0,
			0.0,-1.0,-35.0,
			-1.5,-1.0,-55.0,
			-1.0,8.0,-55.0
			
					]);
					
	var YJunctionBuildingColor=new Float32Array([
			
			1.0,0.0,0.0,
			1.0,1.0,0.0,
			0.0,1.0,1.0,
			1.0,1.0,1.0,
			
			
			1.0,0.0,0.0,
			1.0,1.0,0.0,
			0.0,1.0,1.0,
			1.0,1.0,1.0
			
					]);
	
	
	
	
	//Y Junction Left Drawing
	gl.bindVertexArray(vao_city);

	//vbo=gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,vbo_city);
	//gl.bufferData(gl.ARRAY_BUFFER,roadLineCoordinates,gl.DYNAMIC_DRAW);
	gl.bufferData(gl.ARRAY_BUFFER,YJunctionBuilding,gl.DYNAMIC_DRAW,0,YJunctionBuilding.length);
	gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_POSITION,3,gl.FLOAT,false,0,0);
	gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_POSITION);
	gl.bindBuffer(gl.ARRAY_BUFFER,null);



	//vbo_color=gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,vbo_color_city);
	//gl.bufferData(gl.ARRAY_BUFFER,roadLineColor,gl.DYNAMIC_DRAW);
	gl.bufferData(gl.ARRAY_BUFFER,YJunctionBuildingColor,gl.DYNAMIC_DRAW,0,YJunctionBuildingColor.length);
	gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_COLOR,3,gl.FLOAT,false,0,0);
	gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_COLOR);
	gl.bindBuffer(gl.ARRAY_BUFFER,null);


	gl.drawArrays(gl.TRIANGLE_FAN,0,8);
	gl.bindVertexArray(null);
	
	
	//Flex
	// gl.useProgram(null);
	// gl.useProgram(shaderProgramFlexObject_city);

	//--------------------------------------------------------------------------------------------------------------------------********************
	
	 // gl.bindTexture(gl.TEXTURE_2D,texture_astromedicomp);

	 // gl.uniform1i(uniform_sampler2d,0);
	
	// var Flex=new Float32Array([
			
			// 3.0,10.0,-35.0,
			// -3.0,10.0,-35.0,
			// -3.0,5.0,-35.0,
			// 3.0,5.0,-35.0

					// ]);
					
	// var FlexColor=new Float32Array([
			
			// 1.0,1.0,1.0,
			// 1.0,1.0,1.0,
			// 1.0,1.0,1.0,
			// 1.0,1.0,1.0
					// ]);
					
					
					
	// gl.bindVertexArray(vao_city);

	// //vbo=gl.createBuffer();
	// gl.bindBuffer(gl.ARRAY_BUFFER,vbo_city);
	// //gl.bufferData(gl.ARRAY_BUFFER,roadLineCoordinates,gl.DYNAMIC_DRAW);
	// gl.bufferData(gl.ARRAY_BUFFER,Flex,gl.DYNAMIC_DRAW,0,Flex.length);
	// gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_POSITION,3,gl.FLOAT,false,0,0);
	// gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_POSITION);
	// gl.bindBuffer(gl.ARRAY_BUFFER,null);



	// //vbo_color=gl.createBuffer();
	// gl.bindBuffer(gl.ARRAY_BUFFER,vbo_color_city);
	// //gl.bufferData(gl.ARRAY_BUFFER,roadLineColor,gl.DYNAMIC_DRAW);
	// gl.bufferData(gl.ARRAY_BUFFER,FlexColor,gl.DYNAMIC_DRAW,0,FlexColor.length);
	// gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_COLOR,3,gl.FLOAT,false,0,0);
	// gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_COLOR);
	// gl.bindBuffer(gl.ARRAY_BUFFER,null);


	// gl.drawArrays(gl.TRIANGLE_FAN,0,4);
	// gl.bindVertexArray(null);
	
	
	
	  {
	// //Front Flex
	// var FrontFlexZ=0.0
	// var FrontFlexLeftX=-12.0;
	// var FrontFlexBottomY=3.0;
	// var FrontFlexWidth=10.0;
	// var FrontFlexHeight=10.0;
	
	// var FrontFlexVertices=new Float32Array([

			// FrontFlexLeftX+FrontFlexWidth,FrontFlexBottomY+FrontFlexHeight,FrontFlexZ,
			// FrontFlexLeftX,FrontFlexBottomY+FrontFlexHeight,FrontFlexZ,
			// FrontFlexLeftX,FrontFlexBottomY,FrontFlexZ,
			// FrontFlexLeftX+FrontFlexWidth,FrontFlexBottomY,FrontFlexZ
					// ]);
	// var FrontFlexColor=new Float32Array([
			// 1.0,1.0,1.0,
			// 1.0,1.0,1.0,
			// 1.0,1.0,1.0,
			// 1.0,1.0,1.0
	
				// ]);
	
			
		
			
					
					
	// gl.bindVertexArray(vao_city);

	// //vbo=gl.createBuffer();
	// gl.bindBuffer(gl.ARRAY_BUFFER,vbo_city);
	// //gl.bufferData(gl.ARRAY_BUFFER,roadLineCoordinates,gl.DYNAMIC_DRAW);
	// gl.bufferData(gl.ARRAY_BUFFER,FrontFlexVertices,gl.DYNAMIC_DRAW,0,FrontFlexVertices.length);
	// gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_POSITION,3,gl.FLOAT,false,0,0);
	// gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_POSITION);
	// gl.bindBuffer(gl.ARRAY_BUFFER,null);



	// //vbo_color=gl.createBuffer();
	// gl.bindBuffer(gl.ARRAY_BUFFER,vbo_color_city);
	// //gl.bufferData(gl.ARRAY_BUFFER,roadLineColor,gl.DYNAMIC_DRAW);
	// gl.bufferData(gl.ARRAY_BUFFER,FrontFlexColor,gl.DYNAMIC_DRAW,0,FrontFlexColor.length);
	// gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_COLOR,3,gl.FLOAT,false,0,0);
	// gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_COLOR);
	// gl.bindBuffer(gl.ARRAY_BUFFER,null);


	// gl.drawArrays(gl.TRIANGLE_FAN,0,4);
	// gl.bindVertexArray(null);
	
	
	
	
	// //Poles
	
	// var FrontFlexLeftPole=new Float32Array([
			// FrontFlexLeftX+2.0,-2.0,FrontFlexZ,
			// FrontFlexLeftX+2.2,-2.0,FrontFlexZ,
			// FrontFlexLeftX+2.2,FrontFlexBottomY,FrontFlexZ,
			// FrontFlexLeftX+2.0,FrontFlexBottomY,FrontFlexZ
			// ]);
			
	// var FrontFlexPoleColor=new Float32Array([
			// 0.0,0.0,0.0,
			// 0.0,0.0,0.0,
			// 0.0,0.0,0.0,
			// 0.0,0.0,0.0
	
				// ]);	
	// var FrontFlexRightPole=new Float32Array([
			// FrontFlexLeftX+FrontFlexWidth-2.0,-2.0,FrontFlexZ,
			// FrontFlexLeftX+FrontFlexWidth-1.8,-2.0,FrontFlexZ,
			// FrontFlexLeftX+FrontFlexWidth-1.8,FrontFlexBottomY,FrontFlexZ,
			// FrontFlexLeftX+FrontFlexWidth-2.0,FrontFlexBottomY,FrontFlexZ
			// ]);
	
	
	// gl.bindVertexArray(vao_city);

	// //vbo=gl.createBuffer();
	// gl.bindBuffer(gl.ARRAY_BUFFER,vbo_city);
	// //gl.bufferData(gl.ARRAY_BUFFER,roadLineCoordinates,gl.DYNAMIC_DRAW);
	// gl.bufferData(gl.ARRAY_BUFFER,FrontFlexLeftPole,gl.DYNAMIC_DRAW,0,FrontFlexLeftPole.length);
	// gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_POSITION,3,gl.FLOAT,false,0,0);
	// gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_POSITION);
	// gl.bindBuffer(gl.ARRAY_BUFFER,null);



	// //vbo_color=gl.createBuffer();
	// gl.bindBuffer(gl.ARRAY_BUFFER,vbo_color_city);
	// //gl.bufferData(gl.ARRAY_BUFFER,roadLineColor,gl.DYNAMIC_DRAW);
	// gl.bufferData(gl.ARRAY_BUFFER,FrontFlexPoleColor,gl.DYNAMIC_DRAW,0,FrontFlexPoleColor.length);
	// gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_COLOR,3,gl.FLOAT,false,0,0);
	// gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_COLOR);
	// gl.bindBuffer(gl.ARRAY_BUFFER,null);


	// gl.drawArrays(gl.TRIANGLE_FAN,0,4);
	// gl.bindVertexArray(null);
	
	// //Right Pole
	
	// gl.bindVertexArray(vao_city);

	// //vbo=gl.createBuffer();
	// gl.bindBuffer(gl.ARRAY_BUFFER,vbo_city);
	// //gl.bufferData(gl.ARRAY_BUFFER,roadLineCoordinates,gl.DYNAMIC_DRAW);
	// gl.bufferData(gl.ARRAY_BUFFER,FrontFlexRightPole,gl.DYNAMIC_DRAW,0,FrontFlexRightPole.length);
	// gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_POSITION,3,gl.FLOAT,false,0,0);
	// gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_POSITION);
	// gl.bindBuffer(gl.ARRAY_BUFFER,null);



	// //vbo_color=gl.createBuffer();
	// gl.bindBuffer(gl.ARRAY_BUFFER,vbo_color_city);
	// //gl.bufferData(gl.ARRAY_BUFFER,roadLineColor,gl.DYNAMIC_DRAW);
	// gl.bufferData(gl.ARRAY_BUFFER,FrontFlexPoleColor,gl.DYNAMIC_DRAW,0,FrontFlexPoleColor.length);
	// gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_COLOR,3,gl.FLOAT,false,0,0);
	// gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_COLOR);
	// gl.bindBuffer(gl.ARRAY_BUFFER,null);


	// gl.drawArrays(gl.TRIANGLE_FAN,0,4);
	// gl.bindVertexArray(null);
	  }
	
	
	
	
	
	
	
	
}

function goFromAtoB(pointA,pointB,rate)
{
	
	var isBGreater=(pointB>=pointA)?true:false;
	if(isBGreater==true)
	{
		pointA+=rate;
		return pointA;
	}
	else
	{
		pointA-=rate;
		return pointA;
	}
}

function frontFlexFunction()
{
	if(normalFlowNageshScene==true)
	{
	 gl.bindTexture(gl.TEXTURE_2D,texture_astromedicomp);

	 gl.uniform1i(uniform_sampler2d,0);
	}
	else
	{
		
	 gl.bindTexture(gl.TEXTURE_2D,texture_lionking);

	 gl.uniform1i(uniform_sampler2d,0);
	}
	
	var FrontFlexZ=0.0
	var FrontFlexLeftX=-12.0;
	var FrontFlexBottomY=3.0;
	var FrontFlexWidth=10.0;
	var FrontFlexHeight=10.0;
	
	var FrontFlexVertices=new Float32Array([

			FrontFlexLeftX+FrontFlexWidth,FrontFlexBottomY+FrontFlexHeight,(-1.0)*FrontFlexWidth/2.0,
			FrontFlexLeftX,FrontFlexBottomY+FrontFlexHeight,(+1.0)*FrontFlexWidth/2.0,
			FrontFlexLeftX,FrontFlexBottomY,(+1.0)*FrontFlexWidth/2.0,
			FrontFlexLeftX+FrontFlexWidth,FrontFlexBottomY,(-1.0)*FrontFlexWidth/2.0
					]);
	var FrontFlexColor=new Float32Array([
			1.0,1.0,1.0,
			1.0,1.0,1.0,
			1.0,1.0,1.0,
			1.0,1.0,1.0
	
				]);
	
			
					
	gl.bindVertexArray(vao_city);

	//vbo=gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,vbo_city);
	//gl.bufferData(gl.ARRAY_BUFFER,roadLineCoordinates,gl.DYNAMIC_DRAW);
	gl.bufferData(gl.ARRAY_BUFFER,FrontFlexVertices,gl.DYNAMIC_DRAW,0,FrontFlexVertices.length);
	gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_POSITION,3,gl.FLOAT,false,0,0);
	gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_POSITION);
	gl.bindBuffer(gl.ARRAY_BUFFER,null);



	//vbo_color=gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,vbo_color_city);
	//gl.bufferData(gl.ARRAY_BUFFER,roadLineColor,gl.DYNAMIC_DRAW);
	gl.bufferData(gl.ARRAY_BUFFER,FrontFlexColor,gl.DYNAMIC_DRAW,0,FrontFlexColor.length);
	gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_COLOR,3,gl.FLOAT,false,0,0);
	gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_COLOR);
	gl.bindBuffer(gl.ARRAY_BUFFER,null);


	gl.drawArrays(gl.TRIANGLE_FAN,0,4);
	gl.bindVertexArray(null);
	
	
	
	
	//Poles
	
	var FrontFlexLeftPole=new Float32Array([
			FrontFlexLeftX+2.0,-2.0,(1.0)*(FrontFlexWidth/2.0)-2.0,
			FrontFlexLeftX+2.2,-2.0,(1.0)*(FrontFlexWidth/2.0)-2.0,
			FrontFlexLeftX+2.2,FrontFlexBottomY,(1.0)*(FrontFlexWidth/2.0)-2.0,
			FrontFlexLeftX+2.0,FrontFlexBottomY,(1.0)*(FrontFlexWidth/2.0)-2.0
			]);
			
	var FrontFlexPoleColor=new Float32Array([
			0.0,0.0,0.0,
			0.0,0.0,0.0,
			0.0,0.0,0.0,
			0.0,0.0,0.0
	
				]);	
	var FrontFlexRightPole=new Float32Array([
			FrontFlexLeftX+FrontFlexWidth-2.0,-2.0,(-1.0)*(FrontFlexWidth/2.0)+2.0,
			FrontFlexLeftX+FrontFlexWidth-1.8,-2.0,(-1.0)*(FrontFlexWidth/2.0)+2.0,
			FrontFlexLeftX+FrontFlexWidth-1.8,FrontFlexBottomY,(-1.0)*(FrontFlexWidth/2.0)+2.0,
			FrontFlexLeftX+FrontFlexWidth-2.0,FrontFlexBottomY,(-1.0)*(FrontFlexWidth/2.0)+2.0
			]);
	
	
	gl.bindVertexArray(vao_city);

	 gl.bindTexture(gl.TEXTURE_2D,texture_astromedicomp);

	 gl.uniform1i(uniform_sampler2d,0);
	 
	//vbo=gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,vbo_city);
	//gl.bufferData(gl.ARRAY_BUFFER,roadLineCoordinates,gl.DYNAMIC_DRAW);
	gl.bufferData(gl.ARRAY_BUFFER,FrontFlexLeftPole,gl.DYNAMIC_DRAW,0,FrontFlexLeftPole.length);
	gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_POSITION,3,gl.FLOAT,false,0,0);
	gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_POSITION);
	gl.bindBuffer(gl.ARRAY_BUFFER,null);



	//vbo_color=gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,vbo_color_city);
	//gl.bufferData(gl.ARRAY_BUFFER,roadLineColor,gl.DYNAMIC_DRAW);
	gl.bufferData(gl.ARRAY_BUFFER,FrontFlexPoleColor,gl.DYNAMIC_DRAW,0,FrontFlexPoleColor.length);
	gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_COLOR,3,gl.FLOAT,false,0,0);
	gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_COLOR);
	gl.bindBuffer(gl.ARRAY_BUFFER,null);


	gl.drawArrays(gl.TRIANGLE_FAN,0,4);
	gl.bindVertexArray(null);
	
	//Right Pole
	
	gl.bindVertexArray(vao_city);

	//vbo=gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,vbo_city);
	//gl.bufferData(gl.ARRAY_BUFFER,roadLineCoordinates,gl.DYNAMIC_DRAW);
	gl.bufferData(gl.ARRAY_BUFFER,FrontFlexRightPole,gl.DYNAMIC_DRAW,0,FrontFlexRightPole.length);
	gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_POSITION,3,gl.FLOAT,false,0,0);
	gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_POSITION);
	gl.bindBuffer(gl.ARRAY_BUFFER,null);



	//vbo_color=gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,vbo_color_city);
	//gl.bufferData(gl.ARRAY_BUFFER,roadLineColor,gl.DYNAMIC_DRAW);
	gl.bufferData(gl.ARRAY_BUFFER,FrontFlexPoleColor,gl.DYNAMIC_DRAW,0,FrontFlexPoleColor.length);
	gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_COLOR,3,gl.FLOAT,false,0,0);
	gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_COLOR);
	gl.bindBuffer(gl.ARRAY_BUFFER,null);


	gl.drawArrays(gl.TRIANGLE_FAN,0,4);
	gl.bindVertexArray(null);
	
}

function pushMatrix( newMartix)
{


	
}



function building(length,height,width,textureOption)
{
	length=length/2.0;
	height=height;
	width=width/2.0;
	
	switch(textureOption)
	{
		
		case 1:
		
		 gl.bindTexture(gl.TEXTURE_2D,texture_building1);
		 gl.uniform1i(uniform_sampler2d,0);
		break;
		case 2:
		
		 gl.bindTexture(gl.TEXTURE_2D,texture_building2);
		 gl.uniform1i(uniform_sampler2d,0);
		
		break;
		
		case 3:
		
		 gl.bindTexture(gl.TEXTURE_2D,texture_building3);
		 gl.uniform1i(uniform_sampler2d,0);
		
		break;
		case 4:
		
		 gl.bindTexture(gl.TEXTURE_2D,texture_building4);
		 gl.uniform1i(uniform_sampler2d,0);
		
		break;
		case 5:
	
		 gl.bindTexture(gl.TEXTURE_2D,texture_building5);
		 gl.uniform1i(uniform_sampler2d,0);
		
		break;
		case 6:
	
		 gl.bindTexture(gl.TEXTURE_2D,texture_building6);
		 gl.uniform1i(uniform_sampler2d,0);
		
		break;
		
	}
	

	var buildingVertices_city=new Float32Array([


					length,height,width, //Appex
					(-1.0)*length,height,width, //Left-Bottom
					(-1.0)*length,-1.0,width,	//Right-Bottom
					length,-1.0,width,

					//Right
					length,height,(-1.0)*width,
					length,height,width,
					length,-1.0,width,
					length,-1.0,(-1.0)*width,

					//Back
					(-1.0)*length,height,(-1.0)*width,
					length,height,(-1.0)*width,
					length,-1.0,(-1.0)*width,
					(-1.0)*length,-1.0,(-1.0)*width,

					//Left
					(-1.0)*length,height,width,
					(-1.0)*length,height,(-1.0)*width,
					(-1.0)*length,-1.0,(-1.0)*width,
					(-1.0)*length,-1.0,width



					]);
					
					
	var buildingTextureCity=new Float32Array([
					1.0,1.0,
					0.0,1.0,
					0.0,0.0,
					1.0,0.0,
					
					1.0,1.0,
					0.0,1.0,
					0.0,0.0,
					1.0,0.0,
					
					1.0,1.0,
					0.0,1.0,
					0.0,0.0,
					1.0,0.0,
					
					1.0,1.0,
					0.0,1.0,
					0.0,0.0,
					1.0,0.0
					]);


	var buildingColor_city=new Float32Array([
					1.0,0.0,0.0, //Appex
					1.0,0.0,0.0, //Appex
					1.0,0.0,0.0, //Appex
					1.0,0.0,0.0, //Appex

					
					0.0,1.0,0.0, //Appex
					0.0,1.0,0.0, //Appex
					0.0,1.0,0.0, //Appex
					0.0,1.0,0.0, //Appex


					1.0,0.0,1.0, //Appex
					1.0,0.0,1.0, //Appex
					1.0,0.0,1.0, //Appex
					1.0,0.0,1.0, //Appex

					
					1.0,1.0,0.0, //Appex
					1.0,1.0,0.0, //Appex
					1.0,1.0,0.0, //Appex
					1.0,1.0,0.0 //Appex
					]);




	//vao=gl.createVertexArray();
	gl.bindVertexArray(vao_city);

	//vbo=gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,vbo_city);
	gl.bufferData(gl.ARRAY_BUFFER,buildingVertices_city,gl.DYNAMIC_DRAW,0,buildingVertices_city.length);
	gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_POSITION,3,gl.FLOAT,false,0,0);
	gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_POSITION);
	gl.bindBuffer(gl.ARRAY_BUFFER,null);



	//vbo_color=gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,vbo_color_city);
	gl.bufferData(gl.ARRAY_BUFFER,buildingColor_city,gl.DYNAMIC_DRAW,0,buildingColor_city.length);
	gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_COLOR,3,gl.FLOAT,false,0,0);
	gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_COLOR);
	gl.bindBuffer(gl.ARRAY_BUFFER,null);



	gl.bindBuffer(gl.ARRAY_BUFFER,vbo_texture_city);
	gl.bufferData(gl.ARRAY_BUFFER,buildingTextureCity,gl.DYNAMIC_DRAW,0,buildingTextureCity.length);
	gl.vertexAttribPointer(WebGLMacros.AMC_ATTRIBUTE_TEXTURE,2,gl.FLOAT,false,0,0);
	gl.enableVertexAttribArray(WebGLMacros.AMC_ATTRIBUTE_TEXTURE);
	gl.bindBuffer(gl.ARRAY_BUFFER,null);
	

	gl.drawArrays(gl.TRIANGLE_FAN,0,4);

	gl.drawArrays(gl.TRIANGLE_FAN,4,4);

	gl.drawArrays(gl.TRIANGLE_FAN,8,4);

	gl.drawArrays(gl.TRIANGLE_FAN,12,4);
	gl.bindVertexArray(null);

}

function PrintInfo()
{	
			console.log("PrintfInfo");
			console.log("\ncameraCentreX_city:"+cameraCentreX_city+" cameraCentreY"+cameraCentreY_city+" cameraCentreZ"+cameraCentreZ_city);
			console.log("\ncameraPositionX_city:"+cameraPositionX_city+" cameraPositionY_city"+cameraPositionY_city+" cameraPositionZ_city"+cameraPositionZ_city);

}






function City_Uninitialize()
{
	if(texture_building1)
	{
		gl.deleteTexture(texture_building1);
		texture_building1=0
	}
	
	
	if(texture_building2)
	{
		gl.deleteTexture(texture_building2);
		texture_building2=0
	}
	
	
	if(texture_building3)
	{
		gl.deleteTexture(texture_building3);
		texture_building3=0
	}
	
	if(texture_building4)
	{
		gl.deleteTexture(texture_building4);
		texture_building4=0
	}
	
	
	if(texture_building5)
	{
		gl.deleteTexture(texture_building5);
		texture_building5=0
	}
	
	
	if(texture_building6)
	{
		gl.deleteTexture(texture_building6);
		texture_building6=0
	}
	
	
	if(texture_ashram)
	{
		gl.deleteTexture(texture_ashram);
		texture_ashram=0
	}
	
	
	if(texture_astromedicomp)
	{
		gl.deleteTexture(texture_astromedicomp);
		texture_astromedicomp=0
	}
	
	
	if(texture_road)
	{
		gl.deleteTexture(texture_road);
		texture_road=0
	}
	
	if(vbo_city)
	{
	gl.deleteBuffer(vbo_city);
	vbo_city=null;
	}
	if(vao_city)
	{
	gl.deleteBuffer(vao_city);
	vao_city=null;

	}

	if(shaderProgramObject_city)
	{

		if(fragmentShaderObject_city)
		{
		gl.detachShader(shaderProgramObject_city,fragmentShaderrObject_city);
		gl.deleteShader(fragmentShaderObject_city);
		fragmentShaderObject_city=null;
		}

		if(vertexShadeObject_city)
		{
		gl.detachShader(shaderProgramObject_city,vertexShaderObjct_city);
		gl.deleteShader(vertexShaderObjcet_city);
		vertexShaderObjcet_city=null;

		}

		gl.deleteProgram(shaderProgramObjcet_city);
		shaderProgramObject_city=null;
	}
}