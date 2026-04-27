import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Floor {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.setGeometry()
        this.setTextures()
        this.setMaterial()
        this.setMesh()
    }

    setGeometry() {
        this.geometry = new THREE.CircleGeometry(5, 64)
    }

    setTextures() {
        this.textures = {}

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
        this.material = new THREE.MeshStandardMaterial({
            transparent: true,
            alphaMap: this.textures.alpha,
            map: this.textures.color,
            aoMap: this.textures.arm,
            roughnessMap: this.textures.arm,
            metalnessMap: this.textures.arm,
            normalMap: this.textures.normal,
            displacementMap: this.textures.displacement,
            displacementScale: 0.5,
            displacementBias: -0.2,
        })
    }

    setMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.rotation.x = - Math.PI * 0.5
        this.mesh.receiveShadow = true
        this.scene.add(this.mesh)
    }
}