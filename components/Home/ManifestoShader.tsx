"use client"
import { useEffect, useRef } from "react"
import * as THREE from "three"

export function ManifestoShader() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer
    animationId: number
  } | null>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current

    const vertexShader = `void main() { gl_Position = vec4(position, 1.0); }`

    const fragmentShader = `
      #define TWO_PI 6.2831853072
      #define PI 3.14159265359
      precision highp float;
      uniform vec2 resolution;
      uniform float time;

      void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
        float t = time * 0.03;
        float lineWidth = 0.0015;
        vec3 color = vec3(0.0);

        // Paleta dorada/champagne en lugar de RGB
        vec3 gold   = vec3(0.79, 0.66, 0.43);
        vec3 bronze = vec3(0.45, 0.35, 0.20);
        vec3 white  = vec3(0.85, 0.80, 0.72);

        float ring = 0.0;
        for(int i = 0; i < 6; i++){
          ring += lineWidth * float(i*i) / abs(fract(t + float(i)*0.015)*5.0 - length(uv) + mod(uv.x+uv.y, 0.25));
        }

        color = mix(bronze, gold, ring) + white * ring * 0.3;
        color = clamp(color, 0.0, 1.0);

        // Viñeta oscura en bordes
        float vignette = 1.0 - smoothstep(0.5, 1.4, length(uv));
        color *= vignette * 0.6;

        gl_FragColor = vec4(color, 0.9);
      }
    `

    const camera = new THREE.Camera()
    camera.position.z = 1
    const scene = new THREE.Scene()
    const geometry = new THREE.PlaneGeometry(2, 2)
    const uniforms = {
      time: { value: 1.0 },
      resolution: { value: new THREE.Vector2() },
    }
    const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader, transparent: true })
    scene.add(new THREE.Mesh(geometry, material))

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)
    renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;opacity:0.6;"

    const resize = () => {
      const w = container.clientWidth, h = container.clientHeight
      renderer.setSize(w, h)
      uniforms.resolution.value.set(renderer.domElement.width, renderer.domElement.height)
    }
    resize()
    window.addEventListener("resize", resize)

    let animId = 0
    const animate = () => {
      animId = requestAnimationFrame(animate)
      uniforms.time.value += 0.04
      renderer.render(scene, camera)
    }
    sceneRef.current = { renderer, animationId: animId }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", resize)
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement)
      renderer.dispose()
      geometry.dispose()
      material.dispose()
    }
  }, [])

  return <div ref={containerRef} style={{ position:"absolute", inset:0, zIndex:0 }} />
}
