export namespace MathUtils {
    export function lerp(a: number, b: number, t: number): number {
        return (b - a) * t + a
    }

    export function randomBetween(a: number, b: number): number {
        return lerp(a, b, Math.random())
    }

    export function randomIntBetween(a: number, b: number): number {
        return Math.floor(lerp(a, b, Math.random()))
    }

    export function weighedRandom(weights: number[]): number {
        let weightSum: number = 0
        for (const weight of weights) {
            weightSum += weight
        }
        let rnd: number = weightSum * Math.random()
        for (let i = 0; i < weights.length; ++i) {
            if (rnd < weights[i]) {
                return i
            }
            rnd -= weights[i]
        }
    }

    export function randomValue<T>(arr: Array<T>): T {
        return arr[randomIntBetween(0, arr.length)]
    }

    export function randomWeightedValue<T>(arr: Array<T>, weights: number[]): T {
        return arr[weighedRandom(weights)]
    }

    export function shuffle<T>(arr: Array<T>): Array<T> {
        let currentIndex: number = arr.length, randomIndex

        // While there remain elements to shuffle...
        while (currentIndex != 0) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex)
            --currentIndex;

            // And swap it with the current element.
            [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]]
        }

        return arr
    }

    export function clamp(value: number, min: number, max: number): number {
        return Math.min(Math.max(value, min), max)
    }

    export function clamp01(value: number): number {
        return clamp(value, 0, 1)
    }

    export function clampNegative(value: number) {
        return clamp(value, -Infinity, 0)
    }

    export function clampPositive(value: number) {
        return clamp(value, 0, Infinity)
    }

    export function distance(x1: number, y1: number, x2: number, y2: number): number {
        return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1))
    }
}
