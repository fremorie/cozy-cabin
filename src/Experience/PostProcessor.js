import * as THREE from 'three'
import {
    EffectComposer,
    RenderPass,
    DotScreenPass,
    GlitchPass,
    ShaderPass,
    RGBShiftShader,
    GammaCorrectionShader,
    SMAAPass,
    UnrealBloomPass,
} from 'three/addons'

import Experience from './Experience.js'

export default class PostProcessor {
    constructor() {
        this.experience = new Experience()
        this.renderer = this.experience.renderer
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.camera = this.experience.camera

        this.debug = this.experience.debug

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Post-processing')
        }

        this.setRenderTarget()
        this.setInstance()
        this.setRenderPass()
        this.setUnrealBloom()
        this.setTintShader()
    }

    setRenderTarget() {
        this.renderTarget = new THREE.WebGLRenderTarget(
            800,
            600,
            {
                samples: this.renderer.instance.getPixelRatio() === 1 ? 2 : 0,
            }
        )
    }

    setInstance() {
        this.effectComposer = new EffectComposer(
            this.renderer.instance,
            this.renderTarget
        )
        this.effectComposer.setPixelRatio(this.sizes.pixelRatio)
        this.effectComposer.setSize(this.sizes.width, this.sizes.height)
    }

    setRenderPass() {
        this.renderPass = new RenderPass(this.scene, this.camera.instance)
        this.effectComposer.addPass(this.renderPass)
    }

    setUnrealBloom() {
        this.unrealBloomPass = new UnrealBloomPass()
        this.unrealBloomPass.strength = 0.219
        this.unrealBloomPass.radius = 0.066
        this.unrealBloomPass.threshold = 0.898
        this.effectComposer.addPass(this.unrealBloomPass)

        if (this.debug.active) {
            this.debugFolder
                .add(this.unrealBloomPass, 'enabled')
                .name('Unreal bloom enabled')

            this.debugFolder
                .add(this.unrealBloomPass, 'strength')
                .min(0)
                .max(2)
                .step(0.001)
                .name('Unreal bloom strength')

            this.debugFolder
                .add(this.unrealBloomPass, 'radius')
                .min(0)
                .max(2)
                .step(0.001)
                .name('Unreal bloom radius')

            this.debugFolder
                .add(this.unrealBloomPass, 'threshold')
                .min(0)
                .max(1)
                .step(0.001)
                .name('Unreal bloom threshold')
        }
    }

    setTintShader() {
        this.tintShader = {
            uniforms: {
                // Previous pass. Added automatically
                tDiffuse: { value: null },
                uTint: { value: null },
            },
            vertexShader: `
                varying vec2 vUv;
            
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D tDiffuse;
                uniform vec3 uTint;
                
                varying vec2 vUv;
                
                void main() {
                    vec4 color = texture2D(tDiffuse, vUv);
                    color.rgb += uTint;
                    gl_FragColor = color;
                }
            `,
        }

        this.tintPass = new ShaderPass(this.tintShader)
        this.tintPass.material.uniforms.uTint.value = new THREE.Vector3(0.198, 0.211, 0.262)
        this.effectComposer.addPass(this.tintPass)

        if (this.debug.active) {
            this.debugFolder
                .add(this.tintPass, 'enabled')
                .name('Tint pass enabled')

            this.debugFolder
                .add(this.tintPass.material.uniforms.uTint.value, 'x')
                .min(0)
                .max(1)
                .step(0.001)
                .name('Tint red')

            this.debugFolder
                .add(this.tintPass.material.uniforms.uTint.value, 'y')
                .min(0)
                .max(1)
                .step(0.001)
                .name('Tint green')

            this.debugFolder
                .add(this.tintPass.material.uniforms.uTint.value, 'z')
                .min(0)
                .max(1)
                .step(0.001)
                .name('Tint blue')
        }
    }

    resize() {
        this.effectComposer.setSize(this.sizes.width, this.sizes.height)
        this.effectComposer.setPixelRatio(this.sizes.pixelRatio)
    }

    update() {
        this.effectComposer.render()
    }
}