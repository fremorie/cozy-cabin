import * as THREE from 'three'
import { Sky } from 'three/addons'
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

        this.debugObject = {
            fogColor: '#1c242c',
            sunColor: '#b3c0c6',
        }

        this.setSunLight()
        this.setAmbientLight()
        this.setFog()
        this.setSky()
    }

    setFog() {
        this.scene.background = new THREE.Color(this.debugObject.fogColor)
        this.scene.fog = new THREE.Fog(this.debugObject.fogColor, 10, 40)

        if (this.debug.active) {
            this.debugFolder.addColor(this.debugObject, 'fogColor').onChange(() => {
                this.scene.background = new THREE.Color(this.debugObject.fogColor)
                this.scene.fog.color = new THREE.Color(this.debugObject.fogColor)
            })
        }
    }

    setSunLight() {
        this.sunLight = new THREE.DirectionalLight(this.debugObject.sunColor, 10)
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
                .addColor(this.debugObject, 'sunColor')
                .onChange(() => {
                    this.sunLight.color = new THREE.Color(this.debugObject.sunColor)
                })

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

    setSky() {
        this.sky = new Sky();
        this.sky.scale.setScalar(10000);
        this.scene.add(this.sky);

        this.sun = new THREE.Vector3();

        const effectController = {
            turbidity: 0.2,
            rayleigh: 0,
            mieCoefficient: 0.089,
            mieDirectionalG: 0.257,
            elevation: 14.8,
            azimuth: 56.1,
            cloudCoverage: 0.37,
            cloudDensity: 0.79,
            cloudElevation: 0.11,
            showSunDisc: true
        };

        const guiChanged = () => {
            const uniforms = this.sky.material.uniforms;
            uniforms[ 'turbidity' ].value = effectController.turbidity;
            uniforms[ 'rayleigh' ].value = effectController.rayleigh;
            uniforms[ 'mieCoefficient' ].value = effectController.mieCoefficient;
            uniforms[ 'mieDirectionalG' ].value = effectController.mieDirectionalG;
            uniforms[ 'cloudCoverage' ].value = effectController.cloudCoverage;
            uniforms[ 'cloudDensity' ].value = effectController.cloudDensity;
            uniforms[ 'cloudElevation' ].value = effectController.cloudElevation;

            const phi = THREE.MathUtils.degToRad( 90 - effectController.elevation );
            const theta = THREE.MathUtils.degToRad( effectController.azimuth );

            this.sun.setFromSphericalCoords( 1, phi, theta );
            this.sunLight.position.setFromSphericalCoords( 1, phi, theta );
            this.sunLight.position.y += 0.4

            uniforms[ 'sunPosition' ].value.copy( this.sun );
        }

        guiChanged();

        // Debug
        if (this.debug.active) {
            this.debugFolder.add(effectController, 'turbidity', 0.0, 20.0, 0.1).onChange(guiChanged);
            this.debugFolder.add(effectController, 'rayleigh', 0.0, 4, 0.001).onChange(guiChanged);
            this.debugFolder.add(effectController, 'mieCoefficient', 0.0, 0.1, 0.001).onChange(guiChanged);
            this.debugFolder.add(effectController, 'mieDirectionalG', 0.0, 1, 0.001).onChange(guiChanged);
            this.debugFolder.add(effectController, 'elevation', 0, 90, 0.1).onChange(guiChanged);
            this.debugFolder.add(effectController, 'azimuth', -180, 180, 0.1).onChange(guiChanged);
            const folderClouds = this.debugFolder.addFolder('Clouds');
            folderClouds.add(effectController, 'cloudCoverage', 0, 1, 0.01).name('coverage').onChange(guiChanged);
            folderClouds.add(effectController, 'cloudDensity', 0, 1, 0.01).name('density').onChange(guiChanged);
            folderClouds.add(effectController, 'cloudElevation', 0, 1, 0.01).name('elevation').onChange(guiChanged);
        }
    }
}