import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Environment {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug
        
        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('environment')
        }

        this.setSunLight()
        this.setAmbientLight()
        this.setFog()
    }

    setFog() {
        this.scene.background = new THREE.Color('#191D3B')
        this.scene.fog = new THREE.Fog('#191D3B', 10, 40)
    }

    setSunLight() {
        this.sunLight = new THREE.DirectionalLight('#F5F0BF', 4.4)
        this.sunLight.castShadow = true

        this.sunLight.shadow.mapSize.set(1024, 1024)
        this.sunLight.shadow.normalBias = 0.05

        this.sunLight.position.set(20, 5.5, 1.6)

        this.sunLight.shadow.camera.top = 20
        this.sunLight.shadow.camera.right = 20
        this.sunLight.shadow.camera.bottom = -20
        this.sunLight.shadow.camera.left = -20
        this.sunLight.shadow.camera.near = -10
        this.sunLight.shadow.camera.far = 80

        this.scene.add(this.sunLight)

        // Debug
        if (this.debug.active) {
            this.debugFolder
                .add(this.sunLight, 'intensity')
                .name('sunLightIntensity')
                .min(0)
                .max(10)
                .step(0.001)
            
            this.debugFolder
                .add(this.sunLight.position, 'x')
                .name('sunLightX')
                .min(- 5)
                .max(5)
                .step(0.001)
            
            this.debugFolder
                .add(this.sunLight.position, 'y')
                .name('sunLightY')
                .min(- 5)
                .max(5)
                .step(0.001)
            
            this.debugFolder
                .add(this.sunLight.position, 'z')
                .name('sunLightZ')
                .min(- 5)
                .max(5)
                .step(0.001)
        }
    }

    setAmbientLight() {
        this.ambientLight = new THREE.AmbientLight('#ffffff', 0.7)
        this.scene.add(this.ambientLight)
    }
}