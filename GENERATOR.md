
==========
```
Formal syntax
<single-animation>#
where 
<single-animation> = <time> || <timing-function> || <time> || <single-animation-iteration-count> || <single-animation-direction> || <single-animation-fill-mode> || <single-animation-play-state> || [ none | <keyframes-name> ]

where 
<timing-function> = linear | <cubic-bezier-timing-function> | <step-timing-function>
<single-animation-iteration-count> = infinite | <number>
<single-animation-direction> = normal | reverse | alternate | alternate-reverse
<single-animation-fill-mode> = none | forwards | backwards | both
<single-animation-play-state> = running | paused
<keyframes-name> = <custom-ident> | <string>

where 
<cubic-bezier-timing-function> = ease | ease-in | ease-out | ease-in-out | cubic-bezier(<number>, <number>, <number>, <number>)
<step-timing-function> = step-start | step-end | steps(<integer>[, <step-position>]?)

where 
<step-position> = jump-start | jump-end | jump-none | jump-both | start | end
```


==========
```css
/* @keyframes duration | timing-function | delay | 
iteration-count | direction | fill-mode | play-state | name */
animation: 3s ease-in 1s 2 reverse both paused slidein;

/* @keyframes duration | timing-function | delay | name */
animation: 3s linear 1s slidein;

/* @keyframes duration | name */
animation: 3s slidein;
```


==========
```css
@keyframes slidein {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}

/*  
animation: 3s ease-in 1s 2 reverse both paused slidein;
animation: 3s linear 1s slidein;
animation: 3s slidein;
*/
```


==========




