import { useMemo, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import BODY from './bodyPoints.js';

const vert = `
attribute float aSize; attribute float aSeed;
uniform float uTime; uniform float uPx;
varying float vA; varying float vS;
void main(){
  vec3 p = position;
  p.x += sin(uTime*.6 + aSeed*6.283)*.012;
  p.y += cos(uTime*.5 + aSeed*9.0)*.012;
  p.z += sin(uTime*.4 + aSeed*3.0)*.02;
  vec4 mv = modelViewMatrix * vec4(p,1.0);
  gl_PointSize = aSize * uPx * (3.2 / -mv.z);
  vA = .5 + .5*sin(uTime*1.4 + aSeed*40.0);
  vS = aSeed;
  gl_Position = projectionMatrix * mv;
}`;
const frag = `
uniform vec3 uA; uniform vec3 uB;
varying float vA; varying float vS;
void main(){
  float d = length(gl_PointCoord - .5);
  float a = smoothstep(.5, .0, d); a *= a;
  vec3 c = mix(uA, uB, vS);
  gl_FragColor = vec4(c, a * (.3 + .7*vA));
}`;

const PALETTE = {
  solar: ['#ff9e2c', '#fff0b8'],
  lunar: ['#6f8dff', '#d6e4ff'],
  angel: ['#b98bff', '#78f2ff'],
};

function Body({ kind, x = 0, scale = 1, still }) {
  const g = useRef();
  const mat = useRef();
  const { pointer } = useThree();
  const { geo, uniforms } = useMemo(() => {
    const flat = BODY[kind]; const n = flat.length / 2;
    const extra = 700; const total = n + extra;
    const pos = new Float32Array(total * 3), size = new Float32Array(total), seed = new Float32Array(total);
    let s = kind.length * 977;
    const rnd = () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
    for (let i = 0; i < n; i++) {
      pos[i*3] = flat[i*2]; pos[i*3+1] = flat[i*2+1];
      pos[i*3+2] = (rnd() + rnd() - 1) * .22;
      size[i] = .7 + rnd() * 2.1; seed[i] = rnd();
    }
    for (let i = n; i < total; i++) { // soft aura haze around the body
      const a = rnd() * 6.283, r = .9 + rnd() * 1.3;
      pos[i*3] = Math.cos(a) * r * .9; pos[i*3+1] = Math.sin(a) * r * 1.15; pos[i*3+2] = (rnd() - .5) * 1.2;
      size[i] = .4 + rnd() * 1.1; seed[i] = rnd();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
    const [a, b] = PALETTE[kind];
    return { geo, uniforms: { uTime: { value: 0 }, uPx: { value: 1 }, uA: { value: new THREE.Color(a) }, uB: { value: new THREE.Color(b) } } };
  }, [kind]);
  useFrame(({ clock, gl }) => {
    uniforms.uTime.value = still ? 0 : clock.elapsedTime;
    uniforms.uPx.value = gl.getPixelRatio() * 5;
    if (g.current) {
      const t = still ? 0 : clock.elapsedTime;
      g.current.rotation.y = Math.sin(t * .35 + x) * .28 + pointer.x * .35;
      g.current.rotation.x = pointer.y * -.08;
    }
  });
  const [a] = PALETTE[kind];
  return (
    <group ref={g} position={[x, -.1, 0]} scale={scale}>
      <points geometry={geo}>
        <shaderMaterial ref={mat} uniforms={uniforms} vertexShader={vert} fragmentShader={frag} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
      {kind === 'solar' && <mesh position={[0, 1.0, -.25]}><ringGeometry args={[.5, .515, 96]} /><meshBasicMaterial color={a} transparent opacity={.75} /></mesh>}
      {kind === 'lunar' && <mesh position={[.55, 1.25, -.25]}><ringGeometry args={[.34, .365, 64, 1, .5, 4.4]} /><meshBasicMaterial color="#dfe8ff" transparent opacity={.85} /></mesh>}
      {kind === 'angel' && <mesh position={[0, 1.42, 0]} scale={[1, .26, 1]}><ringGeometry args={[.42, .445, 80]} /><meshBasicMaterial color="#f0e0ff" transparent opacity={.9} /></mesh>}
    </group>
  );
}

function Rig({ still }) {
  const { size } = useThree();
  const aspect = size.width / size.height;
  const s = Math.min(1, aspect / 2.6);
  const gap = 2.6 * s;
  return (<>
    <Body kind="solar" x={-gap} scale={s} still={still} />
    <Body kind="angel" x={0} scale={s} still={still} />
    <Body kind="lunar" x={gap} scale={s} still={still} />
  </>);
}

export function CosmicBodies({ still }) {
  return (
    <Canvas camera={{ position: [0, 0, 4.4], fov: 40 }} dpr={[1, 1.6]} gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }} frameloop={still ? 'demand' : 'always'}>
      <Rig still={still} />
    </Canvas>
  );
}

// ---- Portal galaxy: a spiral of light, tilted toward the viewer ----
function Galaxy({ still }) {
  const ref = useRef();
  const { pointer } = useThree();
  const geo = useMemo(() => {
    const N = 16000, pos = new Float32Array(N * 3), col = new Float32Array(N * 3);
    let s = 4242; const rnd = () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
    const inner = new THREE.Color('#ffd58a'), mid = new THREE.Color('#b08cff'), outer = new THREE.Color('#4a78ff');
    for (let i = 0; i < N; i++) {
      const r = Math.pow(rnd(), 1.6) * 5.2, arm = (i % 3) / 3 * 6.283, ang = arm + r * 1.15;
      const sp = (rnd() - .5) * (.25 + r * .22);
      pos[i*3] = Math.cos(ang) * r + sp * (rnd() - .5) * 2; pos[i*3+1] = (rnd() - .5) * (.35 - r * .04); pos[i*3+2] = Math.sin(ang) * r + sp * (rnd() - .5) * 2;
      const c = r < 1.6 ? inner.clone().lerp(mid, r / 1.6) : mid.clone().lerp(outer, Math.min(1, (r - 1.6) / 3.6));
      col.set([c.r, c.g, c.b], i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    return g;
  }, []);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = still ? 0 : clock.elapsedTime;
    ref.current.rotation.y = t * .05 + pointer.x * .25;
    ref.current.rotation.x = .75 + pointer.y * .1;
  });
  return (
    <points ref={ref} geometry={geo} rotation={[.75, 0, 0]}>
      <pointsMaterial size={.028} sizeAttenuation vertexColors transparent opacity={.9} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

export function PortalGalaxy({ still }) {
  return (
    <Canvas camera={{ position: [0, 1.2, 6.2], fov: 50 }} dpr={[1, 1.5]} gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }} frameloop={still ? 'demand' : 'always'}>
      <Galaxy still={still} />
    </Canvas>
  );
}
