varying float vOpacity;

void main() {

    vec2 coord = gl_PointCoord * 2.0 - 1.0;

    float dist = length(coord);

    if(dist > 1.0) discard;

    float alpha = vOpacity * smoothstep(1.0,0.7,dist);

    vec3 snowColor = vec3(0.9,0.95,1.0);

    gl_FragColor = vec4(snowColor, alpha);
}