---
name: White Dots
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

    float s = 3.0;
    vec2 uvS = uv * s - vec2(s * 0.5, s * 0.5 * 9.0 / 16.0);
    float r = 0.8;
    float y = 0.77;
    uvS.x = mod(uvS.x + iTime - floor(uvS.y * y + y * 0.6 + 0.5) * 1.95, r) - 0.5 * r;
    uvS.y = mod(uvS.y, r) - 0.5 * r;
    float polka = .45-length(uvS);
    col = mix(vec4(1,1,1,1), vec4(0,0,0,0), 1.0 - polka);


    // Output to screen
    fragColor = col;
}

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}