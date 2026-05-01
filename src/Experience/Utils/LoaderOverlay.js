import * as THREE from 'three'
import gsap from 'gsap'
import Experience from '../Experience.js'
import { RENDER_ORDER } from '../renderOrder.js'

export default class LoaderOverlay {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene

        this.resources = this.experience.resources
        this.sizes = this.experience.sizes
        this.time = this.experience.time

        this.setGeometry()
        this.setMaterial()
        this.setMesh()
    }

    setGeometry() {
        this.geometry = new THREE.PlaneGeometry(2, 2, 1, 1)
    }

    setMaterial() {
        this.material = new THREE.ShaderMaterial({
            transparent: true,
            uniforms: {
                uAlpha: new THREE.Uniform(1)
            },
            vertexShader: `
                void main() {
                    gl_Position = vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float uAlpha;
                
                void main() {
                    gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
                }
            `
        })
    }

    setMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.renderOrder = RENDER_ORDER.LOADING_OVERLAY
        this.scene.add(this.mesh)
    }

    onReady() {
        gsap.to(this.material.uniforms.uAlpha, {value: 0, duration: 5})
    }
}