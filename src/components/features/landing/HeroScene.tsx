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

  // Signal the render loop when dissolution completes
  useEffect(() => {
    if (visible) activeRef.current = true
  }, [visible])

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const isMobile = window.matchMedia('(pointer: coarse)').matches
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const radius = isMobile ? 1.8 : 2.5

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, mount.clientWidth / mount.clientHeight, 0.1, 100)
    camera.position.z = 6

    const geo = new THREE.IcosahedronGeometry(radius, 1)
    const mat = new THREE.MeshBasicMaterial({
      color: 0xf0ede6,
      wireframe: true,
      transparent: true,
      opacity: 0,
    })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.scale.setScalar(0.5)
    scene.add(mesh)

    const mouse = { x: 0, y: 0 }
    const lerpedMouse = { x: 0, y: 0 }
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    if (!isMobile) window.addEventListener('mousemove', onMouseMove)

    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }
    window.addEventListener('resize', onResize)

    let textShown = false
    let animId: number

    const tick = () => {
      animId = requestAnimationFrame(tick)

      mesh.rotation.y += 0.002
      mesh.rotation.x += 0.001

      if (!isMobile && !isReduced) {
        lerpedMouse.x += (mouse.x - lerpedMouse.x) * 0.05
        lerpedMouse.y += (mouse.y - lerpedMouse.y) * 0.05
        mesh.rotation.y += lerpedMouse.x * 0.003
        mesh.rotation.x += lerpedMouse.y * 0.002
      }

      // Fade-in only after dissolution is signaled via activeRef
      if (activeRef.current) {
        if (mat.opacity < 0.15) {
          mat.opacity = Math.min(mat.opacity + 0.006, 0.15)
        }
        const s = mesh.scale.x
        if (s < 1) {
          mesh.scale.setScalar(s + (1 - s) * 0.04)
        }
        if (!textShown && mat.opacity > 0.07) {
          textShown = true
          setTextVisible(true)
          setTimeout(() => setText2Visible(true), 500)
        }
      }

      if (isReduced && activeRef.current) {
        mat.opacity = 0.15
        mesh.scale.setScalar(1)
      }

      renderer.render(scene, camera)
    }
    tick()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
      if (!isMobile) window.removeEventListener('mousemove', onMouseMove)
      renderer.dispose()
      geo.dispose()
      mat.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div
      ref={mountRef}
      style={{ position: 'absolute', inset: 0, zIndex: 0 }}
    >
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
