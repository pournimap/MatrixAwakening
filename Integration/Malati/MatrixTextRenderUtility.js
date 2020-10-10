// JavaScript source code

function fontMetrics( font, pixel_size, more_line_gap = 0.0 ) {
    // We use separate scale for the low case characters
    // so that x-height fits the pixel grid.
    // Other characters use cap-height to fit to the pixels
    var cap_scale   = pixel_size / font.cap_height;
    var low_scale   = Math.round( font.x_height * cap_scale ) / font.x_height;
    
    // Ascent should be a whole number since it's used to calculate the baseline
    // position which should lie at the pixel boundary
    var ascent      = Math.round( font.ascent * cap_scale );
    
    // Same for the line height
    var line_height = Math.round( cap_scale * ( font.ascent + font.descent + font.line_gap ) + more_line_gap );
    
    return { cap_scale   : cap_scale,
             low_scale   : low_scale,
             pixel_size  : pixel_size,
             ascent      : ascent,
             line_height : line_height
           };
}

function charRect( pos, font, font_metrics, font_char, kern = 0.0 ) {
    // Low case characters have first bit set in 'flags'
    var lowcase = ( font_char.flags & 1 ) == 1;

    // Pen position is at the top of the line, Y goes up
    var baseline = pos[1] - font_metrics.ascent;

    // Low case chars use their own scale
    var scale = lowcase ? font_metrics.low_scale : font_metrics.cap_scale;

    // Laying out the glyph rectangle
    var g      = font_char.rect;
    var bottom = baseline - scale * ( font.descent + font.iy );
    var top    = bottom   + scale * ( font.row_height );
    var left   = pos[0]   + scale * ( font_char.bearing_x + kern - font.ix );
    var right  = left     + scale * ( g[2] - g[0] );
    var p = [ left, top, right, bottom ];    

    // Advancing pen position
    var new_pos_x = pos[0] + scale * ( font_char.advance_x );

    // Signed distance field size in screen pixels
    var sdf_size  = 2.0 * font.iy * scale;

    var vertices = [
        p[0], p[1],  g[0], g[1],  sdf_size,
        p[2], p[1],  g[2], g[1],  sdf_size,
        p[0], p[3],  g[0], g[3],  sdf_size,

        p[0], p[3],  g[0], g[3],  sdf_size,
        p[2], p[1],  g[2], g[1],  sdf_size,
        p[2], p[3],  g[2], g[3],  sdf_size ];

    return { vertices : vertices, pos : [ new_pos_x, pos[1] ] };
}


function writeString( string, font, font_metrics, pos, vertex_array, str_pos = 0, array_pos = 0 ) {
    var prev_char = " ";  // Used to calculate kerning
    var cpos      = pos;  // Current pen position
    var x_max     = 5.0;  // Max width - used for bounding box
    var scale     = font_metrics.cap_scale;
    
    for(;;) {
        if ( str_pos == string.length ) break;
        var glyph_float_count = 6 * 5; // two rectangles, 5 floats per vertex
        if ( array_pos + glyph_float_count >= vertex_array.length ) break;
        
        var schar = string[ str_pos ];
        str_pos++;
        
        if ( schar == "\n" ) {
            if ( cpos[0] > x_max ) x_max = cpos[0]; // Expanding the bounding rect
            cpos[0]  = pos[0];                      
            cpos[1] -= font_metrics.line_height;    
            prev_char = " ";
            continue;
        }

        if ( schar == " " ) {
            cpos[0] += font.space_advance * scale; 
            prev_char = " ";
            continue;
        }

        var font_char = font.chars[ schar ];
        if ( !font_char ) {                         // Substituting unavailable characters with '?'
            schar = "?";
            font_char = font.chars[ "?" ];
        }

        var kern = font.kern[ prev_char + schar ];
        if ( !kern ) kern = 0.0;
        
        // calculating the glyph rectangle and copying it to the vertex array
        
        var rect = charRect( cpos, font, font_metrics, font_char, kern );
        
        for ( var i = 0; i < rect.vertices.length; ++i ) {
            vertex_array[ array_pos ] = rect.vertices[i];
            array_pos++;
        }

        prev_char = schar;
        cpos = rect.pos;
    }
    
    var res = {
        rect : [ pos[0], pos[1], x_max - pos[0], pos[1] - cpos[1] + font_metrics.line_height ],
        string_pos : str_pos,
        array_pos : array_pos
    }

    return res;
}

function initAttribs( gl, attribs, offset = 0 ) {
    var stride = 0;

    for ( var i = 0; i < attribs.length; ++i ) {
        var a = attribs[i];
        if ( !a.type ) {
            a.type = gl.FLOAT;
        }
        if ( a.type == gl.FLOAT ) a.bsize = 4;
        if ( a.type == gl.BYTE  || a.type == gl.UNSIGNED_BYTE )  a.bsize = 1;
        if ( a.type == gl.SHORT || a.type == gl.UNSIGNED_SHORT ) a.bsize = 2;
        if ( !a.norm ) a.norm = false;
        
        a.offset = offset + stride;
        stride += a.bsize * a.size;
    }

    for ( var i = 0; i < attribs.length; ++i ) {
        attribs[ i ].stride = stride;
    }
}


function bindAttribs( gl, attribs ) {
    for ( var i = 0; i < attribs.length; ++i ) {
        var a = attribs[i];
        gl.vertexAttribPointer( a.loc, a.size, a.type, a.norm, a.stride, a.offset );
        gl.enableVertexAttribArray( a.loc );
    }
}