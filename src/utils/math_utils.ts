export namespace MathUtils {
    export function lerp(a: number, b: number, t: number): number {
        return (b - a) * t + a
    }

    export function randomBetween(a: number, b: number): number {
        return lerp(a, b, Math.random())
    }

    export function randomIntBetween(a: number, b: number): number {
        return Math.floor(lerp(a, b - 1, Math.random()))
    }
}
