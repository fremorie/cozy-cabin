import * as THREE from 'three'
import Experience from '../Experience.js'
import snowVertexShader from '../../shaders/snow/vertex.glsl'
import snowFragmentShader from '../../shaders/snow/fragment.glsl'
import { RENDER_ORDER } from '../renderOrder.js'

export default class Snow {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.sizes = this.experience.sizes
        this.time = this.experience.time

        this.snowflakeCount = 5000

        this.setGeometry()
        this.setTextures()
        this.setMaterial()
        this.setMesh()
    }

    #generatePositions() {
        this.snowflakePositions = new Float32Array(this.snowflakeCount * 3)

        for (let i = 0; i < this.snowflakeCount; i++) {
            const i3 = i * 3

            // Keep snowflake inside the circle (R = 20)
            const planeRadius = this.sizes.sceneWidth / 2 + 3 // just so that they are slightly outside the lit area
            const angle = Math.random() * Math.PI * 2
            const radius = Math.sqrt(Math.random()) * planeRadius

            const x = Math.sin(angle) * radius
            const z = Math.cos(angle) * radius

            // x
            // Random number between [-20, 20]
            this.snowflakePositions[i3] = x
            // y
            // Always positive: we don't want underground snowflakes
            this.snowflakePositions[i3 + 1] = Math.random() * 20
            // z
            // Random number between [-20, 20]
            this.snowflakePositions[i3 + 2] = z
        }
    }

    setGeometry() {
        this.geometry = new THREE.BufferGeometry()
        this.#generatePositions()

        this.geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(this.snowflakePositions, 3)
        )
    }

    setTextures() {
        this.textures = {}
        this.textures.alpha = this.resources.items.snowflakeTexture
    }

    setMaterial() {
        this.material = new THREE.ShaderMaterial({
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            vertexShader: snowVertexShader,
            fragmentShader: snowFragmentShader,
            uniforms: {
                uTexture: { value: this.textures.alpha },
                uTime: { value: 0 },
            },
        })
    }

    setMesh() {
        this.mesh = new THREE.Points(this.geometry, this.material)
        /* This places snow particles in front of the door.
         Transparent objects are sorted per object, not per particle.

          - Cabin door is transparent (uses alpha texture)
          - Particles are transparent

         The door might render after particles,
         effectively hiding them even if particles are closer. */
        this.mesh.renderOrder = RENDER_ORDER.SNOW

        this.scene.add(this.mesh)
    }

    update() {
        this.material.uniforms.uTime.value = this.time.elapsed * 0.001
    }
}