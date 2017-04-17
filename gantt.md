Adding some simple Gantt charts to a Glasseye document
======================================================

Here's a way of adding a simple Gantt chart into your glasseye<sidenote>A program built in python and javascript to combine markdown, d3 and a Tufte inspired layout. See below</sidenote> document. I find a simple version of a Gantt chart useful when creating plans and proposals. It gives a rough idea of the time scales involved. The syntax is as follows:

```
<gantt>
		[{"task": "Analysis phase", "start": "01/03/2015", "end": "12/03/2015"}, 
		{"task": "Build phase", "start": "13/03/2015", "end": "24/03/2015"},
		{"task": "Testing phase", "start": "25/03/2015", "end": "15/04/2015"}]
</gantt>
```

This will give you the following

<gantt>
		[{"task": "Analysis phase", "start": "01/03/2015", "end": "12/03/2015"}, 
		{"task": "Build phase", "start": "13/03/2015", "end": "24/03/2015"},
		{"task": "Testing phase", "start": "25/03/2015", "end": "15/04/2015"}]
</gantt>

As with all the charts in the glasseye package it is also designed to appear in the margin<sidenote>
An example of a Gantt chart in the margin.
<gantt>
		[{"task": "Analysis phase", "start": "01/03/2015", "end": "12/03/2015"}, 
		{"task": "Build phase", "start": "13/03/2015", "end": "24/03/2015"},
		{"task": "Testing phase", "start": "25/03/2015", "end": "15/04/2015"}]
</gantt>
</sidenote> To do this you'll need to wrap it in the `<marginnote>` or `<sidenote>` tags.

## What is glasseye?

Glasseye<sidenote>See the [github repository](https://github.com/coppeliaMLA/glasseye) for the source code</sidenote> is something I'm developing to present the results of statistical analysis in an attractive and hopefully interesting way. It brings together three great things that I use a lot:

1. The markdown markup language.
2. The Tufte wide margin layout
3. Visualisation using d3.js

The idea is to be able to write up work in markdown<sidenote>Markdown is a lightweight markup language with a simple easy-to-use syntax. Text written in markdown can be converted into HTML as well as a many other formats</sidenote> and have the results transformed into something like a Tufte layout. For the Tufte layout I took the excellent tufte.css style sheet developed by [Dave Liepmann and co](https://github.com/daveliepmann/tufte-css) and made a few changes to suit my purpose. Finally I've added some d3 charts (just a small selection at the moment but this will grow) that can easily invoked from within the markdown. 

It's all very very beta at the moment. I'm not claiming it's ready to go. I would like to add lots more charts, redesign the d3 code and improve its overall usability (in particular replace the tags approach with something more in the spirit of markdown) however I thought I'd share it as it is. There's also a lot be done in terms of good design practice (css and all that). Please don't judge me **yet**!

## What it can do

In case it's not obvious this web page was written using glasseye<sidenote>You can view the markdown [here](viewMarkdown.txt)</sidenote>, that it is it was written in markdown with a few extra html-like tags thrown in. 

### Side notes and margin notes
First there's the `<sidenote>` tag. Anything enclosed in these tags will generate a numbered side note in the wide margin as close as possible to the note number in the main text. For example, I've used one here<sidenote>I'm a side note! Use me for commentary, links, bits of maths, anything that's peripheral to the main discussion.</sidenote>. 

Then there is a `<marginnote>` tag which is the nearly the same as the side note, only there's no number linking it to a particular part in the main text. You'll see to the right an example of a margin note containing a d3 donut.

Read more on [github](https://github.com/coppeliaMLA/glasseye) or on the [main demo page](demo.html).
