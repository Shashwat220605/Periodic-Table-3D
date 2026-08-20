import { useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import "./OrbitalVisualizer.css";

const ORBITALS={"1s":{n:1,l:0,shape:"s",capacity:2,nodes:0,desc:"Spherical 1s orbital. Electron probability is distributed symmetrically around the nucleus."},"2s":{n:2,l:0,shape:"s",capacity:2,nodes:1,desc:"Larger spherical orbital with one radial node."},"2p":{n:2,l:1,shape:"p",capacity:6,nodes:0,desc:"Dumbbell-shaped p orbital. The p subshell has px, py and pz orientations."},"3s":{n:3,l:0,shape:"s",capacity:2,nodes:2,desc:"Spherical 3s orbital with two radial nodes."},"3p":{n:3,l:1,shape:"p",capacity:6,nodes:1,desc:"P-type orbital with one radial node and three possible orientations."},"3d":{n:3,l:2,shape:"d",capacity:10,nodes:0,desc:"D-type orbital. A d subshell contains five orbitals with distinct angular shapes."},"4s":{n:4,l:0,shape:"s",capacity:2,nodes:3,desc:"Large spherical 4s orbital with three radial nodes."},"4p":{n:4,l:1,shape:"p",capacity:6,nodes:2,desc:"P-type orbital with two radial nodes."},"4d":{n:4,l:2,shape:"d",capacity:10,nodes:1,desc:"D-type orbital with one radial node."},"4f":{n:4,l:3,shape:"f",capacity:14,nodes:0,desc:"F-type orbital. Seven orientations produce complex angular probability density."}};
const LETTER={0:"s",1:"p",2:"d",3:"f"};

function acceptPoint(l,theta,phi,orientation){
  const x=Math.sin(theta)*Math.cos(phi), y=Math.cos(theta), z=Math.sin(theta)*Math.sin(phi);
  if(l===0) return 1;
  if(l===1){
    const axis=orientation===0?x:orientation===1?y:z;
    return Math.pow(Math.abs(axis),2);
  }
  if(l===2){
    if(orientation===0) return Math.pow(Math.sin(theta)*Math.sin(2*phi),2); // dxy
    if(orientation===1) return Math.pow(Math.sin(theta)*Math.cos(2*phi),2); // dx2-y2
    if(orientation===2) return Math.pow((3*y*y-1),2); // dz2
    return Math.pow(y*x,2);
  }
  return Math.pow(Math.sin(theta),6)*Math.pow(Math.cos(3*phi),2);
}

function Cloud({orbital,orientation}){
  const points=useMemo(()=>{
    const a=[]; let guard=0;
    while(a.length<9000 && guard<150000){
      guard++;
      const theta=Math.acos(Math.random()*2-1),phi=Math.random()*Math.PI*2;
      const radial=Math.pow(Math.random(),.38)*2.15;
      const angular=acceptPoint(orbital.l,theta,phi,orientation);
      if(Math.random()>Math.min(1,angular*3.1+.03)) continue;
      if(orbital.nodes>0){
        const nodeSpacing=2.15/(orbital.nodes+1);
        let nearNode=false;
        for(let n=1;n<=orbital.nodes;n++) if(Math.abs(radial-nodeSpacing*n)<.13) nearNode=true;
        if(nearNode) continue;
      }
      const x=radial*Math.sin(theta)*Math.cos(phi),y=radial*Math.cos(theta),z=radial*Math.sin(theta)*Math.sin(phi);
      a.push(x,y,z);
    }
    return new Float32Array(a);
  },[orbital,orientation]);
  return <points><bufferGeometry><bufferAttribute attach="attributes-position" count={points.length/3} array={points} itemSize={3}/></bufferGeometry><pointsMaterial color="#a78bfa" size={.027} transparent opacity={.32} depthWrite={false}/></points>;
}

function Axes(){return <group><mesh><boxGeometry args={[4.6,.008,.008]}/><meshBasicMaterial color="#334155"/></mesh><mesh rotation={[0,0,Math.PI/2]}><boxGeometry args={[4.6,.008,.008]}/><meshBasicMaterial color="#334155"/></mesh><mesh rotation={[0,Math.PI/2,0]}><boxGeometry args={[4.6,.008,.008]}/><meshBasicMaterial color="#334155"/></mesh></group>}

export default function OrbitalVisualizer(){
  const[open,setOpen]=useState(false),[key,setKey]=useState("2p"),[orientation,setOrientation]=useState(1),[axes,setAxes]=useState(true);
  const o=ORBITALS[key],label=LETTER[o.l];
  const changeOrbital=(k)=>{setKey(k);setOrientation(1)};
  return <><button className="orbital-launcher" onClick={()=>setOpen(true)}><span>◌</span><div><small>QUANTUM MODEL</small><b>ORBITAL CLOUDS</b></div></button>{open&&<div className="orbital-overlay"><div className="orbital-panel"><div className="orbital-header"><div><small>QUANTUM PROBABILITY</small><h2>Real Orbital Visualization</h2><p>Switch orbitals and watch the probability cloud change shape.</p></div><button onClick={()=>setOpen(false)}>×</button></div><div className="orbital-layout"><div className="orbital-canvas"><Canvas camera={{position:[0,0,5.5],fov:42}}><ambientLight intensity={1.1}/>{axes&&<Axes/>}<Cloud key={`${key}-${orientation}`} orbital={o} orientation={orientation}/><mesh><sphereGeometry args={[.1,32,32]}/><meshBasicMaterial color="#f8fafc"/></mesh><Text position={[0,-2.3,0]} fontSize={.12} color="#64748b">{key} · probability density</Text><OrbitControls enablePan={false} autoRotate autoRotateSpeed={.35}/></Canvas><div className="orbital-canvas-label">{key} · n={o.n} · l={o.l} · {label} subshell</div></div><div className="orbital-info"><div className="orbital-label">SELECT ORBITAL</div><div className="orbital-tabs">{Object.keys(ORBITALS).map(k=><button className={k===key?"selected":""} key={k} onClick={()=>changeOrbital(k)}>{k}</button>)}</div><h3>{key}</h3><p>{o.desc}</p><div className="orbital-stat"><span>SUBSHELL</span><b>{label}</b></div><div className="orbital-stat"><span>MAX ELECTRONS</span><b>{o.capacity}</b></div><div className="orbital-stat"><span>RADIAL NODES</span><b>{o.nodes}</b></div><div className="orbital-stat"><span>ANGULAR MOMENTUM l</span><b>{o.l}</b></div>{o.l>0&&<><div className="orbital-label orbital-orientation-label">ORIENTATION</div><div className="orbital-orientations">{(o.l===1?["px","py","pz"]:o.l===2?["dxy","dx²−y²","dz²"]:["f₁","f₂","f₃"]).map((v,i)=><button className={orientation===i?"selected":""} key={v} onClick={()=>setOrientation(i)}>{v}</button>)}</div></>}<div className="orbital-controls"><button onClick={()=>setAxes(v=>!v)}>{axes?"HIDE AXES":"SHOW AXES"}</button></div><div className="orbital-note">The cloud represents probability density: denser regions indicate where an electron is more likely to be detected. An orbital is a quantum state, not a classical trajectory. This is an educational visualization, not a numerical solution of the Schrödinger equation.</div></div></div></div></div>}
