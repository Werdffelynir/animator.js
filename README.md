animator.js
===========
Simple CSS Animation

## Methods:

#### `animator.from([Object])`
> added animation progress parameters for `from`

#### `animator.to([Object])`
> added animation progress parameters for `to`

#### `animator.step('50%', [Object])`
> added animation progress parameters for percent step

#### `animator.run()`
> start animation

#### `animator.stop()`
> stop animation

#### `animator.isInit()`
> return bool, true if animation is was run

#### `animator.after([animator])`
> run new animator object after end current

#### `animator.duration('3s')`
> duration of animation

#### `animator.effect('ease')`
> animation effects: 
> ease | ease-in | ease-out | ease-in-out | cubic-bezier(<number>, <number>, <number>, <number>)

#### `animator.delay('0s')`
> delay for animation

#### `animator.iteration(1)`
> number of repeat
> 2 | 0 | 1.5 | infinite | 2, 0, infinite

#### `animator.direction('normal')`
> sets whether an animation should play forwards, backwards, or alternating back and forth.
> alternate-reverse | alternate | reverse | normal | inherit | initial | unset

#### `animator.fill('none')`
> sets how a CSS animation applies styles to its target before and after its execution.
> none | backwards | both | forwards | none

#### `animator.state('running')`
> sets whether an animation is running or paused.
> paused | running | inherited | initial | unset



## Example:
```js
const box = document.querySelector('.box');

const boxAnim = animator(box)
    .duration('5s')
    .from({
        'top': '100px',
        'margin-left': '0',
    })
    .step('75%', {
        'top': '200px',
        'margin-left': 'calc(100% - 100px)',
    })
    .to({
        'top': '100px',
        'margin-left': '0px',
    });

boxAnim.run();
```