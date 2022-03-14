import { DotColor, LevelSettings } from "./level_controller";

export const LEVELS: LevelSettings[] = [
    {
        impulseAcc: 0.1,
        cycle: true,
        shuffle: true,
        groups: [
            {
                amount: 20,
                leftColor: DotColor.Blue,
                rightColor: DotColor.Blue,
                colors: [DotColor.Blue],
                zones: [
                    {start: 1/5},
                    {start: 2/5},
                    {start: 3/5},
                    {start: 4/5},
                ],
                deltaTime: 50,
                delayTime: 2e3,
            },
            {
                amount: 20,
                leftColor: DotColor.Red,
                rightColor: DotColor.Blue,
                colors: [DotColor.Blue],
                zones: [
                    {start: 1/5},
                    {start: 2/5},
                ],
                deltaTime: 50,
                delayTime: 2e3,
            },
            {
                amount: 20,
                leftColor: DotColor.Red,
                rightColor: DotColor.Blue,
                colors: [DotColor.Red],
                zones: [
                    {start: 3/5},
                    {start: 4/5},
                ],
                deltaTime: 50,
                delayTime: 2e3,
            },
            {
                amount: 20,
                leftColor: DotColor.Red,
                rightColor: DotColor.Blue,
                colors: [DotColor.Red],
                zones: [
                    {start: 3/5},
                    {start: 4/5},
                ],
                deltaTime: 50,
                delayTime: 2e3,
            },
            // INTERLUDE
            {
                amount: 100,
                leftColor: DotColor.Blue,
                rightColor: DotColor.Red,
                colors: [DotColor.Blue, DotColor.Red, DotColor.Green],
                colorWeights: [4, 1, 1],
                zones: [
                    {start: 1/5},
                    {start: 2/5},
                    {start: 3/5},
                    {start: 4/5},
                ],
                deltaTime: 50,
                delayTime: 2e3,
            },
            {
                amount: 20,
                leftColor: DotColor.Green,
                rightColor: DotColor.Blue,
                colors: [DotColor.Green],
                zones: [
                    {start: 3/5},
                    {start: 4/5},
                ],
                deltaTime: 50,
                delayTime: 2e3,
            },
            {
                amount: 20,
                leftColor: DotColor.Red,
                rightColor: DotColor.Green,
                colors: [DotColor.Green],
                zones: [
                    {start: 1/5},
                    {start: 2/5},
                ],
                deltaTime: 50,
                delayTime: 2e3,
            },

        ]
    }
]