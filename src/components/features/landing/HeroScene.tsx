'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

interface HeroSceneProps {
  visible: boolean
}

export function HeroScene({ visible }: HeroSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef(false)
  const [textVisible, setTextVisible] = useState(false)
  const [text2Visible, setText2Visible] = useState(false)

  useEffect(() => {
    if (visible) activeRef.current = true
  }, [visible])

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const isMobile = window.matchMedia('(pointer: coarse)').matches
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // ── Renderer ────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    // ── Scene + Camera ──────────────────────────────────────────
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 100)
    camera.position.z = 4.5
    camera.lookAt(0, 0, 0)

    // ── Shared material (chrome/metal look) ─────────────────────
    const mat = new THREE.MeshStandardMaterial({
      color: 0xf0ede6,
      metalness: 0.95,
      roughness: 0.08,
      transparent: true,
      opacity: 0,
    })

    // ── Male symbol geometry ────────────────────────────────────
    // Circle: torus centered at origin
    const torusGeo = new THREE.TorusGeometry(1.2, 0.06, 16, 64)
    const torus = new THREE.Mesh(torusGeo, mat)

    // Arrow shaft: cylinder along Y, rotated -45° around Z → points NE
    // Center of circle top-right: (1.2*cos45, 1.2*sin45) ≈ (0.849, 0.849)
    // Shaft length 0.9 → tip at (0.849 + 0.636, 0.849 + 0.636) = (1.485, 1.485)
    // Shaft center: (1.167, 1.167)
    const shaftGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.9, 16)
    const shaft = new THREE.Mesh(shaftGeo, mat)
    shaft.position.set(1.167, 1.167, 0)
    shaft.rotation.z = -Math.PI / 4

    // Arrow cone: tip at end of shaft, same rotation
    // Cone center = shaft tip + half-height along NE direction
    // Shaft tip: (1.485, 1.485), half cone height 0.125 along NE → (1.485+0.088, 1.485+0.088)
    const coneGeo = new THREE.ConeGeometry(0.12, 0.25, 16)
    const cone = new THREE.Mesh(coneGeo, mat)
    cone.position.set(1.573, 1.573, 0)
    cone.rotation.z = -Math.PI / 4

    // Group — center of bounding box: x in [-1.2, 1.66], y in [-1.2, 1.66]
    // Center = (0.23, 0.23). Shift all children by (-0.23, -0.23) to put center at origin.
    const offset = new THREE.Vector3(-0.23, -0.23, 0)
    torus.position.add(offset)
    shaft.position.add(offset)
    cone.position.add(offset)

    const symbol = new THREE.Group()
    symbol.add(torus, shaft, cone)
    symbol.position.set(0, 0, 0)
    const scale = isMobile ? 0.7 : 1
    symbol.scale.setScalar(scale)
    scene.add(symbol)

    // ── Lighting ────────────────────────────────────────────────
    const ambient = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambient)

    const dirLight = new THREE.DirectionalLight(0xffffff, 2)
    dirLight.position.set(-2, 3, 2)
    scene.add(dirLight)

    // Orbiting amber point light
    const amberLight = new THREE.PointLight(0xff8c00, 0.8, 10)
    scene.add(amberLight)

    // ── Mouse ───────────────────────────────────────────────────
    const mouse = { x: 0, y: 0 }
    const lerpedMouse = { x: 0, y: 0 }
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    if (!isMobile) window.addEventListener('mousemove', onMouseMove)

    // ── Resize ──────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }
    window.addEventListener('resize', onResize)

    // ── Render loop ─────────────────────────────────────────────
    let time = 0
    let textShown = false
    let animId: number

    const tick = () => {
      animId = requestAnimationFrame(tick)
      time += 0.01

      // Orbiting amber light
      amberLight.position.set(
        Math.cos(time * 0.6) * 3,
        Math.sin(time * 0.4) * 2,
        Math.sin(time * 0.6) * 3,
      )

      // Base rotation
      if (!isReduced) {
        symbol.rotation.y += 0.005
        symbol.rotation.x = Math.sin(time * 0.5) * 0.1
      }

      // Mouse influence
      if (!isMobile && !isReduced) {
        lerpedMouse.x += (mouse.x - lerpedMouse.x) * 0.05
        lerpedMouse.y += (mouse.y - lerpedMouse.y) * 0.05
        symbol.rotation.y += lerpedMouse.x * 0.003
        symbol.rotation.x += lerpedMouse.y * 0.002
      }

      // Fade-in after dissolution
      if (activeRef.current) {
        if (mat.opacity < 1) {
          mat.opacity = Math.min(mat.opacity + 0.008, 1)
        }
        if (!textShown && mat.opacity > 0.4) {
          textShown = true
          setTextVisible(true)
          setTimeout(() => setText2Visible(true), 500)
        }
      }

      if (isReduced && activeRef.current) {
        mat.opacity = 1
      }

      renderer.render(scene, camera)
    }
    tick()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
      if (!isMobile) window.removeEventListener('mousemove', onMouseMove)
      torusGeo.dispose()
      shaftGeo.dispose()
      coneGeo.dispose()
      mat.dispose()
      renderer.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div ref={mountRef} style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
      {/* Overlay texts */}
      <div
        style={{
          position: 'absolute',
          bottom: '22%',
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-inter), sans-serif',
            fontWeight: 300,
            fontSize: 'clamp(0.8rem, 1.8vw, 1rem)',
            color: '#666666',
            opacity: textVisible ? 1 : 0,
            transform: textVisible ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          Uno domina tu vida
        </p>
        <p
          style={{
            fontFamily: 'var(--font-inter), sans-serif',
            fontWeight: 300,
            fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)',
            color: '#888888',
            opacity: text2Visible ? 1 : 0,
            transform: text2Visible ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          ¿Cuál es el tuyo?
        </p>
      </div>
    </div>
  )
}
