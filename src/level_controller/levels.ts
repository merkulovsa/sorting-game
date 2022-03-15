import { DotColor, LevelSettings } from "./level_controller";

export const LEVELS: LevelSettings[] = [
    // LEVEL 0
    {
        groups: [
            {
                amount: 50,
                leftColor: DotColor.Blue,
                rightColor: DotColor.Red,
                colors: [DotColor.Blue, DotColor.Red, DotColor.Green],
                colorWeights: [8, 1, 1],
                zones: [
                    {start: 1/5},
                    {start: 2/5},
                    {start: 3/5},
                    {start: 4/5},
                ],
                deltaTime: 200,
            },
            {
                amount: 50,
                leftColor: DotColor.Blue,
                rightColor: DotColor.Red,
                colors: [DotColor.Blue, DotColor.Red, DotColor.Green],
                colorWeights: [1, 6, 1],
                zones: [
                    {start: 1/5},
                    {start: 2/5},
                    {start: 3/5},
                    {start: 4/5},
                ],
                deltaTime: 200,
            },
            {
                amount: 50,
                leftColor: DotColor.Green,
                rightColor: DotColor.Red,
                colors: [DotColor.Blue, DotColor.Red, DotColor.Green],
                colorWeights: [1, 1, 6],
                zones: [
                    {start: 1/5},
                    {start: 2/5},
                    {start: 3/5},
                    {start: 4/5},
                ],
                deltaTime: 200,
            },
            {
                amount: 50,
                leftColor: DotColor.Green,
                rightColor: DotColor.Blue,
                colors: [DotColor.Blue, DotColor.Red, DotColor.Green],
                colorWeights: [6, 1, 1],
                zones: [
                    {start: 1/5},
                    {start: 2/5},
                    {start: 3/5},
                    {start: 4/5},
                ],
                deltaTime: 200,
            },
            {
                amount: 25,
                leftColor: DotColor.Red,
                rightColor: DotColor.Blue,
                colors: [DotColor.Blue, DotColor.Red, DotColor.Green],
                colorWeights: [1, 4, 1],
                zones: [
                    {start: 1/5},
                    {start: 2/5},
                    {start: 3/5},
                    {start: 4/5},
                ],
                deltaTime: 150,
                impulse: 200,
            },
            {
                amount: 25,
                leftColor: DotColor.Red,
                rightColor: DotColor.Green,
                colors: [DotColor.Blue, DotColor.Red, DotColor.Green],
                colorWeights: [1, 4, 1],
                zones: [
                    {start: 1/5},
                    {start: 2/5},
                    {start: 3/5},
                    {start: 4/5},
                ],
                deltaTime: 150,
                impulse: 200,
            },
            {
                amount: 50,
                leftColor: DotColor.Red,
                rightColor: DotColor.Green,
                colors: [DotColor.Blue, DotColor.Red, DotColor.Green],
                colorWeights: [1, 1, 4],
                zones: [
                    {start: 1/5},
                    {start: 2/5},
                    {start: 3/5},
                    {start: 4/5},
                ],
                deltaTime: 150,
                impulse: 200,
            },
        ]
    },

    // LEVEL 1
    {
        groups: [
            {
                amount: 20,
                leftColor: DotColor.Red,
                rightColor: DotColor.Green,
                colors: [DotColor.Red],
                zones: [
                    {start: 1/2},
                ],
                deltaTime: 100,
                impulse: 1000,
            },
            {
                deltaTime: 500
            },
            {
                amount: 20,
                leftColor: DotColor.Red,
                rightColor: DotColor.Green,
                colors: [DotColor.Green],
                zones: [
                    {start: 1/2},
                    {start: 3/4},
                ],
                deltaTime: 100,
                impulse: 1000,
            },
            {
                deltaTime: 500
            },
            {
                amount: 40,
                leftColor: DotColor.Blue,
                rightColor: DotColor.Green,
                colors: [DotColor.Blue],
                zones: [
                    {start: 4/7},
                    {start: 5/7},
                    {start: 6/7},
                ],
                deltaTime: 100,
                impulse: 1000,
            },
            {
                amount: 40,
                leftColor: DotColor.Blue,
                rightColor: DotColor.Green,
                colors: [DotColor.Green],
                zones: [
                    {start: 4/7},
                    {start: 5/7},
                    {start: 6/7},
                ],
                deltaTime: 100,
                impulse: 1000,
            },
            {
                amount: 80,
                leftColor: DotColor.Blue,
                rightColor: DotColor.Green,
                colors: [DotColor.Blue],
                zones: [
                    {start: 1/7},
                    {start: 2/7},
                    {start: 3/7},
                    {start: 4/7},
                    {start: 5/7},
                    {start: 6/7},
                ],
                deltaTime: 100,
                impulse: 1000,
            },
            {
                amount: 20,
                leftColor: DotColor.Blue,
                rightColor: DotColor.Red,
                colors: [DotColor.Red],
                zones: [
                    {start: 2/3},
                ],
                deltaTime: 50,
                impulse: 2000,
            },
            {
                amount: 20,
                leftColor: DotColor.Blue,
                rightColor: DotColor.Red,
                colors: [DotColor.Blue],
                zones: [
                    {start: 1/3},
                ],
                deltaTime: 50,
                impulse: 2000,
            },
            {
                amount: 40,
                leftColor: DotColor.Blue,
                rightColor: DotColor.Green,
                colors: [DotColor.Green],
                zones: [
                    {start: 1/3},
                ],
                deltaTime: 50,
                impulse: 2000,
            },
            {
                amount: 20,
                leftColor: DotColor.Blue,
                rightColor: DotColor.Green,
                colors: [DotColor.Green],
                zones: [
                    {start: 2/3},
                ],
                deltaTime: 50,
                impulse: 2000,
            }
        ]
    }
]