// One easing vocabulary for the whole page. Mixing a different curve per
// component is what makes a site feel assembled rather than authored, so
// every entrance and every spring below pulls from here.

// Expo-out. Commits immediately, then takes its time landing. Entrances.
export const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1]

// Quart-out, gentler on the front end. Anything that reacts to the user
// mid-gesture, where a hard commit reads as a snap.
export const EASE_SOFT: [number, number, number, number] = [0.25, 0.8, 0.3, 1]

// Reveal timing. Slower than the usual 0.6s default: at this scale the
// extra 300ms is the difference between "it appeared" and "it arrived".
export const REVEAL = { duration: 0.95, ease: EASE_OUT }

// Pointer-tracked springs. Heavier than Motion's defaults (lower stiffness,
// higher mass) so tilt and magnetic pull feel like they have weight instead
// of snapping to the cursor.
export const SPRING_HEAVY = { stiffness: 130, damping: 20, mass: 0.6 }
export const SPRING_LIGHT = { stiffness: 160, damping: 19, mass: 0.45 }
