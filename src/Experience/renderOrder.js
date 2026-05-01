// Transparent loading overlay messes with other transparent objects,
// so we need to keep an eye on the render order.
// Without it, door, floor and snow won't be visible.
export const RENDER_ORDER = {
    DOOR: 0,
    FLOOR: 1,
    SNOW: 2,
    LOADING_OVERLAY: 3,
}