import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Fox {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug

        // Debug
        if(this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('fox')
        }

        // Resource
        this.resource = this.resources.items.foxModel

        // Animation
        this.state = 'walking'
        // Fox runs in circles
        this.trajectoryRadius = 10
        // Radians per second
        this.angularSpeed = 0.2
        this.angle = - Math.PI / 2
        this.hasStopped = false
        this.stoppedTime = null

        this.setModel()
        this.setAnimation()
    }

    setModel() {
        this.model = this.resource.scene
        this.model.scale.setScalar(0.015)
        this.model.position.set(-20, 0 ,8)
        this.model.rotation.y = Math.PI / 2
        this.scene.add(this.model)

        this.model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true
                child.receiveShadow = true
            }
        })
    }

    setAnimation() {
        this.animation = {}
        
        // Mixer
        this.animation.mixer = new THREE.AnimationMixer(this.model)
        
        // Actions
        this.animation.actions = {}
        
        this.animation.actions.idle = this.animation.mixer.clipAction(this.resource.animations[0])
        this.animation.actions.walking = this.animation.mixer.clipAction(this.resource.animations[1])
        this.animation.actions.running = this.animation.mixer.clipAction(this.resource.animations[2])
        
        this.animation.actions.current = this.animation.actions.walking
        this.animation.actions.current.play()

        // Play the action
        this.animation.play = (name) => {
            this.state = name
            const newAction = this.animation.actions[name]
            const oldAction = this.animation.actions.current

            newAction.reset()
            newAction.play()
            newAction.crossFadeFrom(oldAction, 1)

            this.animation.actions.current = newAction
        }

        // Debug
        if (this.debug.active) {
            const debugObject = {
                playIdle: () => { this.animation.play('idle') },
                playWalking: () => { this.animation.play('walking') },
                playRunning: () => { this.animation.play('running') }
            }
            this.debugFolder.add(debugObject, 'playIdle')
            this.debugFolder.add(debugObject, 'playWalking')
            this.debugFolder.add(debugObject, 'playRunning')
        }
    }

    update() {
        this.animation.mixer.update(this.time.delta * 0.001)

        const reachedStopPoint = this.model.position.x >= 3
        const idleTimeDone = this.stoppedTime && this.time.elapsed - this.stoppedTime > 2.5 * 1000

        if (
            this.state === 'walking' &&
            reachedStopPoint &&
            !this.hasStopped
        ) {
            this.animation.play('idle')
            this.stoppedTime = this.time.elapsed
            this.hasStopped = true
        } else if (
            this.state === 'idle' && idleTimeDone
        ) {
            this.animation.play('walking')
            this.stoppedTime = null
        }

        if (this.state === 'walking') {
            const prevX = this.model.position.x
            const prevZ = this.model.position.z

            // Move on the circle
            this.angle -= this.time.delta * 0.001 * this.angularSpeed
            this.model.position.x = Math.cos(this.angle) * this.trajectoryRadius
            this.model.position.z = Math.sin(this.angle) * this.trajectoryRadius

            // Compute direction of movement
            const dx = this.model.position.x - prevX
            const dz = this.model.position.z - prevZ

            this.model.rotation.y = Math.atan2(dx, dz)
        }
    }
}