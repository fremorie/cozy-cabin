import * as THREE from 'three'
import Experience from '../Experience.js'
import { RENDER_ORDER } from '../renderOrder.js'
import vertexShader from '../../shaders/floor/vertex.glsl'
import fragmentShader from '../../shaders/floor/fragment.glsl'

export default class Floor {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.sizes = this.experience.sizes
        this.time = this.experience.time

        this.setGeometry()
        this.setTextures()
        this.setMaterial()
        this.setMesh()
    }

    setGeometry() {
        this.geometry = new THREE.PlaneGeometry(
            this.sizes.sceneWidth,
            this.sizes.sceneWidth,
        )
    }

    setTextures() {
        this.textures = {}

        this.textures.perlinNoise = this.resources.items.perlinNoiseTexture
        this.textures.perlinNoise.wrapS = THREE.RepeatWrapping
        this.textures.perlinNoise.wrapT = THREE.RepeatWrapping
        this.textures.perlinNoise.repeat.set(10, 10)

        this.textures.baked = this.resources.items.floorBakedTexture
        // this.textures.baked.colorSpace = THREE.SRGBColorSpace
        // this.textures.baked.flipY = false;

        this.textures.color = this.resources.items.floorColorTexture
        this.textures.color.colorSpace = THREE.SRGBColorSpace
        this.textures.color.repeat.set(2, 2)
        this.textures.color.wrapS = THREE.RepeatWrapping
        this.textures.color.wrapT = THREE.RepeatWrapping

        this.textures.normal = this.resources.items.floorNormalTexture
        this.textures.normal.repeat.set(2, 2)
        this.textures.normal.wrapS = THREE.RepeatWrapping
        this.textures.normal.wrapT = THREE.RepeatWrapping

        this.textures.displacement = this.resources.items.floorDisplacementTexture
        this.textures.displacement.repeat.set(2, 2)
        this.textures.displacement.wrapS = THREE.RepeatWrapping
        this.textures.displacement.wrapT = THREE.RepeatWrapping

        this.textures.arm = this.resources.items.floorARMTexture
        this.textures.arm.repeat.set(2, 2)
        this.textures.arm.wrapS = THREE.RepeatWrapping
        this.textures.arm.wrapT = THREE.RepeatWrapping

        this.textures.alpha = this.resources.items.floorAlphaTexture
    }

    setMaterial() {
        this.material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            transparent: true,
            uniforms: {
                uBakedTexture: { value: this.textures.baked},
                uAlphaTexture: { value: this.textures.alpha },
                uLightColor: { value: new THREE.Color('#b3c0c6') },
                uPerlinNoise: { value: this.textures.perlinNoise },
                uTime: { value: 0 }
            },
        })
    }

    setMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.rotation.x = - Math.PI * 0.5
        this.mesh.receiveShadow = true
        this.mesh.renderOrder = RENDER_ORDER.FLOOR
        this.scene.add(this.mesh)
    }

    update() {
        this.material.uniforms.uTime.value = this.time.elapsed * 0.001
    }
}