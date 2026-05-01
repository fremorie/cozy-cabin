import * as THREE from 'three'
import Experience from '../../Experience.js'
import { RENDER_ORDER } from '../../renderOrder.js'

export default class Door {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.sizes = this.experience.sizes

        this.setGeometry()
        this.setTextures()
        this.setMaterial()
        this.setMesh()
    }

    setGeometry() {
        this.geometry = new THREE.PlaneGeometry(
            this.sizes.houseMeasurements.doorWidth,
            this.sizes.houseMeasurements.doorHeight,
            100,
            100,
        )
    }

    setTextures() {
        this.textures = {}

        this.textures.color = this.resources.items.doorColorTexture
        this.textures.color.colorSpace = THREE.SRGBColorSpace

        this.textures.normal = this.resources.items.doorNormalTexture
        this.textures.displacement = this.resources.items.doorHeightTexture
        this.textures.alpha = this.resources.items.doorAlphaTexture
        this.textures.ambientOcclusion = this.resources.items.doorAmbientOcclusionTexture
        this.textures.roughness = this.resources.items.doorRoughnessTexture
        this.textures.metalness = this.resources.items.doorMetalnessTexture
    }

    setMaterial() {
        this.material = new THREE.MeshStandardMaterial({
            color: 0x6B6B6B,
            transparent: true,
            alphaMap: this.textures.alpha,
            map: this.textures.color,
            aoMap: this.textures.ambientOcclusion,
            displacementMap: this.textures.displacement,
            displacementScale: 0.15,
            roughnessMap: this.textures.roughness,
            metalnessMap: this.textures.metalness,
            normalMap: this.textures.normal,
        })
    }

    setMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.position.z = this.sizes.houseMeasurements.depth / 2
        this.mesh.position.y = this.sizes.houseMeasurements.doorHeight / 2

        /* This places snow particles in front of the door.
         Transparent objects are sorted per object, not per particle.

          - Cabin door is transparent (uses alpha texture)
          - Particles are transparent

         The door might render after particles,
         effectively hiding them even if particles are closer. */
        this.mesh.renderOrder = RENDER_ORDER.DOOR
    }
}