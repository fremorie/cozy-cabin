import * as THREE from 'three'
import Experience from '../../Experience.js'
import fragmentShader from '../../../shaders/window/fragment.glsl'
import vertexShader from '../../../shaders/window/vertex.glsl'

export default class CozyWindow {
    constructor(position, rotation) {
        this.position = position
        this.rotation = rotation ?? 0

        this.experience = new Experience()
        this.time = this.experience.time
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.sizes = this.experience.sizes

        this.group = new THREE.Object3D()

        this.setGeometry()
        this.setTextures()
        this.setMaterial()

        this.setRimMesh()
        this.setStickMesh()
        this.setPlaneMesh()
    }

    setGeometry() {
        this.rimGeometry = new THREE.TorusGeometry(
            0.55,
            0.1,
            5,
            4,
        )

        this.stickGeometry = new THREE.BoxGeometry(this.sizes.windowSize, 0.05, 0.1)
        this.planeGeometry = new THREE.PlaneGeometry(
            this.sizes.windowSize,
            this.sizes.windowSize,
        )
    }


    setTextures() {
        this.textures = {}

        this.textures.color = this.resources.items.rimColorTexture
        this.textures.color.colorSpace = THREE.SRGBColorSpace

        this.textures.normal = this.resources.items.rimNormalTexture

        this.textures.displacement = this.resources.items.rimDisplacementTexture

        this.textures.arm = this.resources.items.rimARMTexture
    }

    setMaterial() {
        this.material = new THREE.MeshStandardMaterial({
            color: 0xd7935b,
            map: this.textures.color,
            aoMap: this.textures.arm,
            roughnessMap: this.textures.arm,
            metalnessMap: this.textures.arm,
            normalMap: this.textures.normal,
        })

        this.planeMaterial = new THREE.RawShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                uTime: new THREE.Uniform(0),
            }
        });
    }

    setRimMesh() {
        this.rimMesh = new THREE.Mesh(this.rimGeometry, this.material)

        this.rimMesh.position.copy(this.position)
        this.rimMesh.rotation.z = Math.PI / 4
        this.rimMesh.rotation.y = this.rotation

        this.group.add(this.rimMesh)
    }

    setStickMesh() {
        this.verticalStickMesh = new THREE.Mesh(this.stickGeometry, this.material)
        this.verticalStickMesh.position.copy(this.position)
        this.verticalStickMesh.position.y += 0.05
        this.verticalStickMesh.rotation.y = this.rotation

        this.group.add(this.verticalStickMesh)

        this.horizontalStickMesh = new THREE.Mesh(this.stickGeometry, this.material)
        this.horizontalStickMesh.position.copy(this.position)
        this.horizontalStickMesh.rotation.z = Math.PI / 2
        this.horizontalStickMesh.rotation.y = this.rotation

        this.group.add(this.horizontalStickMesh)
    }

    setPlaneMesh() {
        this.planeMesh = new THREE.Mesh(this.planeGeometry, this.planeMaterial)
        this.planeMesh.position.copy(this.position);
        this.planeMesh.rotation.y = this.rotation

        this.group.add(this.planeMesh)
    }

    update() {
        this.planeMaterial.uniforms.uTime.value = this.time.elapsed * 0.001
    }
}