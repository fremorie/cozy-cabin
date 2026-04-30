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

        this.setRenderTarget()
        this.setInstance()
        this.setRenderPass()
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

    resize() {
        this.effectComposer.setSize(this.sizes.width, this.sizes.height)
        this.effectComposer.setPixelRatio(this.sizes.pixelRatio)
    }

    update() {
        this.effectComposer.render()
    }
}