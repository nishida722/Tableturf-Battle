---
name: White Stripes
type: fragment
author: 
---

precision highp float;

uniform float time;
uniform vec2 resolution;

#define iTime time
#define iResolution resolution

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord / iResolution.x;

    vec4 col = vec4(0,0,0,0);    

    float stripe = sin((uv.x - uv.y) * 15.0 + (-iTime * 3.0));
    col = mix(vec4(0,0,0,0), vec4(1,1,1,1), stripe);


    // Output to screen
    fragColor = col;
}

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}