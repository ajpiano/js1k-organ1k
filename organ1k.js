/*
 * Organ1k: JS1k contest entry - 8/10/2010
 * http://benalman.com/code/projects/js1k-organ1k/organ1k.html
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */

(function(fps,colors,num_items,max_blips){
  
  var doc = document,
      style = doc.body.style,
      canvas = doc.getElementById( 'c' ),
      context = canvas.getContext( '2d' ),
      
      math = Math,
      pi = math.PI,
      pi_over_180 = pi / 180,
      min = math.min,
      sin = math.sin,
      cos = math.cos,
      rnd = math.random,
      
      theta = rnd() * 360,
      dir = rnd() < 0.5 ? 1 : -1,
      
      items = [],
      blips = [],
      
      num_colors = colors.length,
      
      blip_min_size = 4,
      blip_max_size = 7,
      
      frame,
      blip_current,
      math_mode,
      last_n = frame = blip_current = math_mode = style.margin = 0,
      
      cycle_speed,
      delay_speed = cycle_speed = 2;
  
  style.overflow = 'hidden';
  
  // "int main(void)"
  setInterval(function(width,height,max_radius,origin_x,origin_y,blip_scale,x,y,i,tmp,tmp2){
    
    // Automated random mode changer.
    frame = ++frame % fps;
    if ( !frame ) {
      // Change a mode, as long as it's not the last mode changed.
      while ( last_n == ~~( tmp = rnd() * 6 ) ) {};
      last_n = ~~tmp;
      
      // This random value drives most of the following modes.
      tmp2 = rnd();
      
      // Change directions.
      tmp < 0.4 ? ( dir = -dir )
      // Cycle colors.
      : tmp < 2 ? colors.push( colors.shift() )
      // Change the overall pattern / shape.
      : tmp < 3 ? ( math_mode = tmp2 * 7 )
      // Change the rotational velocity.
      : tmp < 4 ? ( cycle_speed = tmp2 * 8 + 1 )
      // Change the "tightness".
      : tmp < 5 ? ( delay_speed = tmp2 * 3 + 1 )
      // Change blip pulse sizes.
      : blip_min_size = min( blip_max_size = tmp2 * 10 + 5, rnd() * 5 + 5 ) - 2;
    }
    
    // Set these values in each iteration to allow the window to be resized.
    width = canvas.width = innerWidth;
    height = canvas.height = innerHeight;
    max_radius = min( origin_x = width / 2, origin_y = height / 2 );
    blip_scale = max_radius / 400;
    max_radius -= 20 * blip_scale;
    
    // Let's do some math!
    if ( math_mode <= 1 ) {
      // Circle.
      theta -= cycle_speed * dir * 4;
      
      x = sin( theta * pi_over_180 ) * max_radius;
      y = cos( theta * pi_over_180 ) * max_radius;
      
    } else {
      // Spiro.
      theta -= cycle_speed * dir * 2;
      
      tmp = math.abs( x = sin( theta * pi_over_180 ) * max_radius );
      
      x = tmp * cos( tmp2 = math.atan2( 0, x ) + theta * pi_over_180 / math_mode );
      y = tmp * sin( tmp2 );
    }
    
    // Update items. The items work like "mouse trails" and the blips are
    // just drawn from where the items are at a given point in time.
    for ( i = 0; i < num_items; i++ ) {
      tmp = items[i] = items[i] || { x: 0, y: 0 };
      
      tmp2 = items[ i - 1 ];
      
      tmp.x = i ? tmp.x + ( tmp2.x - tmp.x ) / delay_speed : x;
      tmp.y = i ? tmp.y + ( tmp2.y - tmp.y ) / delay_speed : y;
    }
    
    // Add new (or replace existing) blips.
    i = 0;
    while ( tmp = items[ ~~( i * ( num_items - 1 ) / ( num_colors - 1 ) ) ] ) {
      
      blips[ blip_current++ % max_blips ] = {
        s: 1,
        d: 1,
        c: colors[i++],
        x: tmp.x,
        y: tmp.y
      };
    }
    
    // BG fill
    context.fillRect( i = 0, 0, width, height );
    
    // Draw items
    /*
    for ( i = num_items; i; i-- ) {
      context.fillStyle = '#fff';
      context.beginPath();
      context.arc( origin_x + items[i-1].x, origin_y + items[i-1].y, 5, 0, pi * 2, 0 );
      context.fill();
    }
    */
    
    // Draw blips.
    while ( tmp = blips[i++] ) {
      
      // Pulse the blip.
      tmp.s += tmp.d;
      tmp.d = tmp.s > blip_max_size ? -1
            : tmp.s < blip_min_size ? 1
            : tmp.d;
      
      // Draw the blip.
      context.fillStyle = '#' + tmp.c;
      context.beginPath();
      context.arc( origin_x + tmp.x, origin_y + tmp.y, tmp.s * blip_scale, 0, pi * 2, 0 );
      context.fill();
    }
    
  }, 1000 / fps )
  
})(33,'f001fa01ff0107010ff100f14081e8e'.split(1),32,300)
