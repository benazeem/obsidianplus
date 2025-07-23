import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function ThreeScene() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mountRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })

    renderer.setSize(400, 400)
    renderer.setClearColor(0x73a1b2, 0)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    mountRef.current.appendChild(renderer.domElement)

    const createObsidianGeometry = () => {
      const geometry = new THREE.BufferGeometry()

      const vertices = new Float32Array([
        // Top vertices (narrow end)
        0,
        2.0,
        0, // 0 - top point
        -0.3,
        1.7,
        0.2, // 1 - top left front
        0.3,
        1.7,
        0.2, // 2 - top right front
        0.3,
        1.7,
        -0.2, // 3 - top right back
        -0.3,
        1.7,
        -0.2, // 4 - top left back

        // Upper middle vertices
        -0.8,
        1.0,
        0.5, // 5 - upper left front
        0.8,
        1.0,
        0.5, // 6 - upper right front
        0.8,
        1.0,
        -0.5, // 7 - upper right back
        -0.8,
        1.0,
        -0.5, // 8 - upper left back

        // Middle vertices (widest part)
        -1.2,
        0.2,
        0.8, // 9 - middle left front
        1.2,
        0.2,
        0.8, // 10 - middle right front
        1.2,
        0.2,
        -0.8, // 11 - middle right back
        -1.2,
        0.2,
        -0.8, // 12 - middle left back

        // Lower vertices
        -0.9,
        -0.8,
        0.6, // 13 - lower left front
        0.9,
        -0.8,
        0.6, // 14 - lower right front
        0.9,
        -0.8,
        -0.6, // 15 - lower right back
        -0.9,
        -0.8,
        -0.6, // 16 - lower left back

        // Bottom vertices (pointed end)
        -0.4,
        -1.5,
        0.3, // 17 - bottom left front
        0.4,
        -1.5,
        0.3, // 18 - bottom right front
        0.4,
        -1.5,
        -0.3, // 19 - bottom right back
        -0.4,
        -1.5,
        -0.3, // 20 - bottom left back

        0,
        -2.2,
        0, // 21 - bottom point
      ])

      // Define faces to create the Obsidian-like faceted structure
      const indices = new Uint16Array([
        // Top pyramid faces
        0, 1, 2, 0, 2, 3, 0, 3, 4, 0, 4, 1,

        // Top to upper middle faces
        1, 5, 6, 1, 6, 2, 2, 6, 7, 2, 7, 3, 3, 7, 8, 3, 8, 4, 4, 8, 5, 4, 5, 1,

        // Upper middle to middle faces
        5, 9, 10, 5, 10, 6, 6, 10, 11, 6, 11, 7, 7, 11, 12, 7, 12, 8, 8, 12, 9,
        8, 9, 5,

        // Middle to lower faces
        9, 13, 14, 9, 14, 10, 10, 14, 15, 10, 15, 11, 11, 15, 16, 11, 16, 12,
        12, 16, 13, 12, 13, 9,

        // Lower to bottom faces
        13, 17, 18, 13, 18, 14, 14, 18, 19, 14, 19, 15, 15, 19, 20, 15, 20, 16,
        16, 20, 17, 16, 17, 13,

        // Bottom pyramid faces
        17, 21, 18, 18, 21, 19, 19, 21, 20, 20, 21, 17,

        // Additional diagonal faces for more complex geometry
        1, 9, 5, 2, 6, 10, 3, 11, 7, 4, 8, 12,

        // Cross faces for internal structure
        5, 13, 9, 6, 10, 14, 7, 15, 11, 8, 12, 16,
      ])
      geometry.setIndex(new THREE.BufferAttribute(indices, 1))
      geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
      geometry.computeVertexNormals()

      return geometry
    }

    // Create the main Obsidian crystal
    const obsidianGroup = new THREE.Group()
    // Main Obsidian crystal
    const obsidianGeometry = createObsidianGeometry()

    // Create materials for different faces (like the logo)
    const materials = [
      // Dark blue material (left side)
      new THREE.MeshPhongMaterial({
        color: 0x1e3a8a,
        transparent: true,
        opacity: 0.9,
        shininess: 120,
        specular: 0x4a90e2,
      }),
    ]

    // Create multiple versions with different materials to simulate the logo's color sections
    const mainObsidian = new THREE.Mesh(obsidianGeometry, materials[1])
    mainObsidian.castShadow = true
    mainObsidian.receiveShadow = true
    obsidianGroup.add(mainObsidian)

    // Add wireframe for definition (like the black outlines in the logo)
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      wireframe: false,
    //   side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
    })

    const wireframe = new THREE.Mesh(obsidianGeometry, wireframeMaterial)
    wireframe.scale.set(1.001, 1.001, 1.001) // Slightly larger to avoid z-fighting
    obsidianGroup.add(wireframe)

    const edges = new THREE.EdgesGeometry(obsidianGeometry)
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: 0x3b82f6,
      linewidth: 0.001,
      transparent: true,
      opacity: 0.9,
    })
    const edgeLines = new THREE.LineSegments(edges, edgeMaterial)
    obsidianGroup.add(edgeLines)

    scene.add(obsidianGroup)

    camera.position.set(1, 1, 4)
    camera.lookAt(0, 0, 0)

    // Animation loop
    let time = 0
    const animate = () => {
      requestAnimationFrame(animate)
      time += 0.01

      obsidianGroup.rotation.y += 0.005
      obsidianGroup.rotation.x = Math.sin(time * 0.3) * 0.05
      obsidianGroup.position.y = Math.sin(time * 2) * 0.1
      obsidianGroup.position.x = Math.sin(time * 2) * 0.1

      renderer.render(scene, camera)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      if (mountRef.current) {
        const width = mountRef.current.clientWidth
        const height = mountRef.current.clientHeight
        camera.aspect = width / height
        camera.updateProjectionMatrix()
        renderer.setSize(width, height)
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
      window.removeEventListener('resize', handleResize)

      // Clean up geometries and materials
      obsidianGeometry.dispose()
      materials.forEach((material) => material.dispose())
      wireframeMaterial.dispose()
      edgeMaterial.dispose()
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className="flex justify-center items-center w-full h-96 rounded-lg overflow-hidden three-scene-container"
      style={{ minHeight: '200px' }}
    />
  )
}
