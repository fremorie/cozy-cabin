import * as THREE from 'three'
import gsap from 'gsap'
import Experience from '../Experience.js'
import { RENDER_ORDER } from '../renderOrder.js'

const PLANE_ANIMATION_DURATION = 5;
const PROGRESS_END_ANIMATION_DURATION = 0.5;

export default class LoaderOverlay {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene

        this.loadingBarElement = document.querySelector('.loading-bar')

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

    dispose() {
        this.scene.remove(this.mesh)
        this.geometry.dispose()
        this.material.dispose()
    }

    onReady() {
        gsap.delayedCall(PROGRESS_END_ANIMATION_DURATION, () => {
            gsap.to(this.material.uniforms.uAlpha, {value: 0, duration: PLANE_ANIMATION_DURATION})
            this.loadingBarElement.classList.add('ended')
            this.loadingBarElement.style.transform = ''
        })

        gsap.delayedCall(
            // Total duration of the previous delayed call
            PROGRESS_END_ANIMATION_DURATION + PLANE_ANIMATION_DURATION,
            () => {
                // Loader overlay is only needed at the beginning of the experience.
                // Doesn't make sense to keep it in memory.
                this.dispose()
            }
        )

        // Btw, no need to kill those manually:
        // https://gsap.com/community/forums/topic/19636-it-is-bad-to-not-kill-the-tweenlitedelayedcall/
    }

    onProgress(itemUrl, itemsLoaded, itemsTotal) {
        const progressRatio = itemsLoaded / itemsTotal
        this.loadingBarElement.style.transform = `scaleX(${progressRatio})`
    }
}