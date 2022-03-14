import { DotColor, LevelSettings } from "./level_controller";

export const LEVELS: LevelSettings[] = [
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
    }
]