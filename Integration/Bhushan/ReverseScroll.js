//Gloable variable


var indexR =1;

var PaperBodyRev;

//var Revbodytranslate = -6.7;
//var Revlastbodytranslate = 5.7;
//var Revvideoscenbodytranslate = 1.2;
//var Revstadybodytranslate = 0.5;

var Revbodytranslate = 0.3;
var Revlastbodytranslate = 5.7;
var Revvideoscenbodytranslate = 1.2;
var Revstadybodytranslate = 0.5;

var RevpaperXtranslate = 0.0;
var RevpaperYtranslate = -1.98;
var RevpaperZtranslate = 0.0;
var RevpaperXscale = 1.55;
var RevpaperYscale = -0.1;
var RevpaperZscale = 1.5;

//var RevpaperXtranslate = 0.0;
//var RevpaperYtranslate = -1.98;
//var RevpaperZtranslate = -3.7;
//var RevpaperXscale = 1.55;
//var RevpaperYscale = -0.1;
//var RevpaperZscale = 1.5;

var Revfirstflag = false;
var Revsecondflag = false;
var Revthirdflag = false;
var Revfourthflag = false;

var RevCount = 0;
var RevCountnew = 0;
function OnLineReverce_Paper_init()
{
	
	
	
	
	//Load Reverse Paper texture
	PaperBodyRev = gl.createTexture();
	PaperBodyRev.image = new Image();
	PaperBodyRev.image.src = "resources/webNews/PaperBodyRev.png";
	PaperBodyRev.image.onload = function()
	{
		gl.bindTexture(gl.TEXTURE_2D, PaperBodyRev);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,PaperBodyRev.image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER,gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,gl.LINEAR);
		gl.bindTexture(gl.TEXTURE_2D, null);
		
	}
	
	
	
	
	
}

/*function Reintialise_MousePointer_init()
{
	cursor_X = 0.0;
	cursor_Y = 0.0;
}*/


function OnLineReverce_Paper_draw()
{
	
	//code
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	gl.useProgram(Video_shaderProgramObject);
	
	var modelViewMatrix=mat4.create();
	var modelViewProjectionMatrix=mat4.create();
	var ViewMatrix=mat4.create();
	//Draw Title Bar	
	mat4.identity(modelViewMatrix);
	mat4.identity(modelViewProjectionMatrix);
	mat4.translate(modelViewMatrix,modelViewMatrix,[RevpaperXtranslate,1.49,RevpaperZtranslate]);
	mat4.scale(modelViewMatrix, modelViewMatrix, [RevpaperXscale, RevpaperYscale-0.31, RevpaperZscale]);
	mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrix);
	gl.uniformMatrix4fv(video_mvpUniform, false,modelViewProjectionMatrix);
	gl.bindTexture(gl.TEXTURE_2D, TitleBar);
	gl.uniform1i(video_uniform_texture0_sampler,0);
	gl.bindVertexArray(video_vao_rectangle);
	gl.drawArrays(gl.TRIANGLE_FAN,0,4);
	gl.bindVertexArray(null);
	gl.useProgram(null);
	
	
	// Draw PaperBodyRev
	gl.useProgram(Video_shaderProgramObject);
	
	mat4.identity(modelViewMatrix);
	mat4.identity(modelViewProjectionMatrix);
	mat4.translate(modelViewMatrix,modelViewMatrix,[RevpaperXtranslate-0.05,Revbodytranslate,RevpaperZtranslate-0.1]);
	mat4.scale(modelViewMatrix, modelViewMatrix, [1.05, 5.5, 1.0]); 
	mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrix);
	gl.uniformMatrix4fv(video_mvpUniform, false,modelViewProjectionMatrix);
	gl.bindTexture(gl.TEXTURE_2D, PaperBodyRev);
	gl.uniform1i(video_uniform_texture0_sampler,0);
	gl.bindVertexArray(video_vao_rectangle);
	gl.drawArrays(gl.TRIANGLE_FAN,0,4);
	gl.bindVertexArray(null);
	gl.useProgram(null);
	
	
	// Draw Baground
	gl.useProgram(Video_shaderProgramObject);
	
	mat4.identity(modelViewMatrix);
	mat4.identity(modelViewProjectionMatrix);
	mat4.translate(modelViewMatrix,modelViewMatrix,[RevpaperXtranslate-0.05,0.0,RevpaperZtranslate-1.0]);
	mat4.scale(modelViewMatrix, modelViewMatrix, [5.0, 5.0, 5.0]); 
	mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrix);
	gl.uniformMatrix4fv(video_mvpUniform, false,modelViewProjectionMatrix);
	gl.bindTexture(gl.TEXTURE_2D, Baground);
	gl.uniform1i(video_uniform_texture0_sampler,0);
	gl.bindVertexArray(video_vao_rectangle);
	gl.drawArrays(gl.TRIANGLE_FAN,0,4);
	gl.bindVertexArray(null);
	gl.useProgram(null);
	
	
	// Draw Task Bar
	gl.useProgram(Video_shaderProgramObject);
	
	mat4.identity(modelViewMatrix);
	mat4.identity(modelViewProjectionMatrix);
	
	mat4.translate(modelViewMatrix,modelViewMatrix,[RevpaperXtranslate,RevpaperYtranslate,RevpaperZtranslate]);
	mat4.scale(modelViewMatrix, modelViewMatrix, [RevpaperXscale, RevpaperYscale, RevpaperZscale]); 
	mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrix);
	gl.uniformMatrix4fv(video_mvpUniform, false,modelViewProjectionMatrix);
	gl.bindTexture(gl.TEXTURE_2D, TaskBar);
	gl.uniform1i(video_uniform_texture0_sampler,0);
	gl.bindVertexArray(video_vao_rectangle);
	gl.drawArrays(gl.TRIANGLE_FAN,0,4);
	gl.bindVertexArray(null);
	gl.bindTexture(gl.TEXTURE_2D, null);
	
	
	
	if(RevpaperZtranslate > -3.69)
	{
		RevpaperZtranslate = RevpaperZtranslate - 0.025;
		RevCount = 0;
	}
	else if (RevpaperZtranslate < -3.6)
	{
		RevpaperZtranslate = -3.7;
		Revfirstflag = true;
	}
		
    if(true == Revfirstflag)
	{
		RevCount = RevCount + 1;
	}
	
	
	if((RevCount > 50) && (Revlastbodytranslate > Revbodytranslate)&&(Revsecondflag == false))
	{
		RevCount = 51;
		Revbodytranslate = Revbodytranslate + 0.04;
	}
	else if ((Revlastbodytranslate < Revbodytranslate)&&(Revsecondflag == false))
	{
			Revsecondflag = true;
			Revfirstflag = false;
	}
	
	if((true == Revsecondflag)&&(Revbodytranslate > -6.7))
	{
		Revbodytranslate = Revbodytranslate - 0.13;
		RevCount = 9;
		
		if( Revbodytranslate < -6.7)
		{
			Revthirdflag = true;
		}
		
	}
	
	
	if(Revthirdflag == true)
	{
		if(video_cursor_X < 1.97)
		{
			video_cursor_X = video_cursor_X + 0.02;
			video_cursor_Y = video_cursor_Y + 0.0107;
		}
		else if((video_cursor_X > 1.95) && (RevCountnew < 35))
		{
			RevCountnew = RevCountnew + 1;
			
		}
		else if(RevCountnew > 30)
		{
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			Revfourthflag = true;
		}
				
	}
	
	if(false == Revfourthflag)
	{
		mat4.identity(modelViewMatrix);
		mat4.translate(modelViewMatrix, modelViewMatrix, [video_cursor_X, video_cursor_Y, -2.0]);
		mat4.rotateZ(modelViewMatrix,modelViewMatrix,degToRad(45.0));
		
		mat4.multiply(modelViewProjectionMatrix,perspectiveProjectionMatrix,modelViewMatrix);
		gl.uniformMatrix4fv(video_mvpUniform, false,modelViewProjectionMatrix);
		video_drawCursor();
	}
	else{
		finishBhushansSeventhScene = true;
	}
	gl.useProgram(null);
	
	
	
}


