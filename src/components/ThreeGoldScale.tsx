import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * ThreeGoldScale: A 3D interactive Golden Financial Balance Scale
 * Symbolizing equilibrium, accuracy, and financial justice in Egypt.
 * Optimized for headless/software-gl environments with subtle physics oscillation.
 */
export const ThreeGoldScale: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 360;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.appendChild(renderer.domElement);

    // 3. Lighting (Fintech Gold Ambience)
    const ambientLight = new THREE.AmbientLight(0xfff5db, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffdf88, 2.5);
    dirLight1.position.set(5, 8, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x4388cc, 0.8);
    dirLight2.position.set(-5, -4, 3);
    scene.add(dirLight2);

    // 4. Materials (Lustrous Gold & Dark Bronze)
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xd6ae57,
      metalness: 0.85,
      roughness: 0.25,
    });

    const darkGoldMaterial = new THREE.MeshStandardMaterial({
      color: 0x8c6d23,
      metalness: 0.9,
      roughness: 0.35,
    });

    const navyAccentMaterial = new THREE.MeshStandardMaterial({
      color: 0x142b43,
      metalness: 0.6,
      roughness: 0.4,
    });

    // 5. Construct Scale Geometry
    const scaleGroup = new THREE.Group();

    // Base
    const baseGeo = new THREE.CylinderGeometry(1.4, 1.6, 0.25, 32);
    const baseMesh = new THREE.Mesh(baseGeo, darkGoldMaterial);
    baseMesh.position.y = -2.2;
    scaleGroup.add(baseMesh);

    const basePedestalGeo = new THREE.CylinderGeometry(0.5, 1.1, 0.4, 32);
    const basePedestal = new THREE.Mesh(basePedestalGeo, navyAccentMaterial);
    basePedestal.position.y = -1.9;
    scaleGroup.add(basePedestal);

    // Central Pillar
    const pillarGeo = new THREE.CylinderGeometry(0.12, 0.18, 3.6, 24);
    const pillarMesh = new THREE.Mesh(pillarGeo, goldMaterial);
    pillarMesh.position.y = -0.1;
    scaleGroup.add(pillarMesh);

    // Top Crown / Finial
    const topSphereGeo = new THREE.SphereGeometry(0.28, 24, 24);
    const topSphere = new THREE.Mesh(topSphereGeo, goldMaterial);
    topSphere.position.y = 1.75;
    scaleGroup.add(topSphere);

    // Central Pivot Pin
    const pivotPinGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.4, 16);
    pivotPinGeo.rotateX(Math.PI / 2);
    const pivotPin = new THREE.Mesh(pivotPinGeo, darkGoldMaterial);
    pivotPin.position.y = 1.45;
    scaleGroup.add(pivotPin);

    // Rotating Cross Beam
    const beamGroup = new THREE.Group();
    beamGroup.position.y = 1.45;

    const beamBarGeo = new THREE.CylinderGeometry(0.08, 0.08, 4.2, 24);
    beamBarGeo.rotateZ(Math.PI / 2);
    const beamBar = new THREE.Mesh(beamBarGeo, goldMaterial);
    beamGroup.add(beamBar);

    // Left Pan Suspension
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.x = -2.0;

    const panGeo = new THREE.CylinderGeometry(0.85, 0.65, 0.15, 32);
    const leftPan = new THREE.Mesh(panGeo, goldMaterial);
    leftPan.position.y = -1.5;
    leftArmGroup.add(leftPan);

    // Chains (left)
    const chain1Geo = new THREE.CylinderGeometry(0.02, 0.02, 1.5, 8);
    const chain1 = new THREE.Mesh(chain1Geo, darkGoldMaterial);
    chain1.position.set(-0.35, -0.75, 0);
    chain1.rotation.z = -0.18;
    leftArmGroup.add(chain1);

    const chain2 = new THREE.Mesh(chain1Geo, darkGoldMaterial);
    chain2.position.set(0.35, -0.75, 0);
    chain2.rotation.z = 0.18;
    leftArmGroup.add(chain2);

    beamGroup.add(leftArmGroup);

    // Right Pan Suspension
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.x = 2.0;

    const rightPan = new THREE.Mesh(panGeo, goldMaterial);
    rightPan.position.y = -1.5;
    rightArmGroup.add(rightPan);

    const chain3 = new THREE.Mesh(chain1Geo, darkGoldMaterial);
    chain3.position.set(-0.35, -0.75, 0);
    chain3.rotation.z = -0.18;
    rightArmGroup.add(chain3);

    const chain4 = new THREE.Mesh(chain1Geo, darkGoldMaterial);
    chain4.position.set(0.35, -0.75, 0);
    chain4.rotation.z = 0.18;
    rightArmGroup.add(chain4);

    beamGroup.add(rightArmGroup);

    scaleGroup.add(beamGroup);

    // Floating Golden Coins (Fintech EGP vibe)
    const coinGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.06, 24);
    const coin1 = new THREE.Mesh(coinGeo, goldMaterial);
    coin1.position.set(-1.85, -1.35, 0.1);
    coin1.rotation.x = Math.PI / 2.2;
    scaleGroup.add(coin1);

    const coin2 = new THREE.Mesh(coinGeo, goldMaterial);
    coin2.position.set(2.1, -1.35, -0.1);
    coin2.rotation.x = Math.PI / 1.8;
    scaleGroup.add(coin2);

    scene.add(scaleGroup);

    // 6. Animation Loop (Oscillating balance)
    let animationFrameId: number;
    let clock = new THREE.Clock();

    let targetRotY = 0;
    let targetRotX = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotY = x * 0.45;
      targetRotX = y * 0.25;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      const elapsed = clock.getElapsedTime();

      // Gentle natural balance oscillation (equilibrium)
      const tilt = Math.sin(elapsed * 1.6) * 0.08;
      beamGroup.rotation.z = tilt;

      // Keep pans hanging upright despite beam tilt
      leftArmGroup.rotation.z = -tilt;
      rightArmGroup.rotation.z = -tilt;

      // Smooth interactive mouse orientation
      scaleGroup.rotation.y += (targetRotY - scaleGroup.rotation.y) * 0.05;
      scaleGroup.rotation.x += (targetRotX - scaleGroup.rotation.x) * 0.05;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-80 sm:h-96 md:h-[420px] relative flex items-center justify-center cursor-grab active:cursor-grabbing"
      role="img"
      aria-label="مجسم ميزان ذهبي ثلاثي الأبعاد تفاعلي يمثل العدالة والتوازن المالي"
      data-testid="three-gold-scale"
    >
      <div className="absolute bottom-2 text-xs text-[#CBD5E1] bg-[#0B1725]/60 backdrop-blur-md px-3 py-1 rounded-full border border-[#D6AE57]/20 pointer-events-none">
        توازن مالي دقيق • حرك المؤشر للتفاعل
      </div>
    </div>
  );
};
