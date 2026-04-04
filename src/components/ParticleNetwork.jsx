import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Particles({ count = 120 }) {
  const mesh = useRef();
  const lines = useRef();

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = [];
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      velocities.push({
        x: (Math.random() - 0.5) * 0.01,
        y: (Math.random() - 0.5) * 0.01,
        z: (Math.random() - 0.5) * 0.005,
      });
    }
    return { positions, velocities };
  }, [count]);

  const lineGeom = useMemo(() => new THREE.BufferGeometry(), []);

  useFrame((state) => {
    if (!mesh.current) return;
    const pos = mesh.current.geometry.attributes.position.array;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      pos[i * 3] += particles.velocities[i].x + Math.sin(time * 0.3 + i) * 0.002;
      pos[i * 3 + 1] += particles.velocities[i].y + Math.cos(time * 0.2 + i) * 0.002;
      pos[i * 3 + 2] += particles.velocities[i].z;

      // Boundary wrap
      for (let j = 0; j < 3; j++) {
        const limit = j === 2 ? 5 : 10;
        if (pos[i * 3 + j] > limit) pos[i * 3 + j] = -limit;
        if (pos[i * 3 + j] < -limit) pos[i * 3 + j] = limit;
      }
    }
    mesh.current.geometry.attributes.position.needsUpdate = true;

    // Draw connections
    const linePositions = [];
    const threshold = 3;
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = pos[i * 3] - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < threshold) {
          linePositions.push(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);
          linePositions.push(pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]);
        }
      }
    }

    if (lines.current) {
      lineGeom.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(linePositions, 3)
      );
      lines.current.geometry = lineGeom;
    }
  });

  return (
    <>
      <points ref={mesh}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={particles.positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          color="#2980b9"
          transparent
          opacity={0.8}
          sizeAttenuation
        />
      </points>
      <lineSegments ref={lines}>
        <bufferGeometry />
        <lineBasicMaterial color="#2980b9" transparent opacity={0.15} />
      </lineSegments>
    </>
  );
}

function FloatingOrb({ position, color, scale = 1, speed = 1 }) {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * speed;
    ref.current.position.y = position[1] + Math.sin(t) * 0.5;
    ref.current.position.x = position[0] + Math.cos(t * 0.7) * 0.3;
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.15 * scale, 16, 16]} />
      <meshBasicMaterial color={color} transparent opacity={0.6} />
    </mesh>
  );
}

export default function ParticleNetwork() {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        style={{ background: 'transparent' }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.5} />
        <Particles count={100} />
        <FloatingOrb position={[-4, 2, -2]} color="#2980b9" scale={2} speed={0.8} />
        <FloatingOrb position={[5, -1, -3]} color="#e8531e" scale={1.5} speed={1.2} />
        <FloatingOrb position={[2, 3, -1]} color="#3498db" scale={1} speed={0.6} />
        <FloatingOrb position={[-3, -2, -2]} color="#f06529" scale={1.8} speed={1} />
      </Canvas>
    </div>
  );
}
