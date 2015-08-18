A Glasseye Demo
----------------

##What is glasseye?

Glasseye<side-note>See the [github repository](https://github.com/coppeliaMLA/glasseye) for the source code</side-note> is something I developed to present the results of statistical analysis in an attractive and hopefully interesting way. It brings together three great things that I use a lot:

1. The markdown markup language.
2. The Tufte wide margin layout
3. Visualisation using d3.js

The idea is to be able to write up work in markdown<side-note>Markdown is a lightweight markup language with a simple easy-to-use syntax. Text written in markdown can be converted into HTML as well as a many other formats</side-note> and have the results transformed into something like a Tufte layout<side-note>The Tufte layout makes extenive use of a wide margin to display notes, images and charts<br><br>![](Tufte.gif)</side-note> of which more below. For the Tufte layout I took the excellent tufte.css style sheet developed by [Dave Liepmann and co](https://github.com/daveliepmann/tufte-css) and made a few changes to suit my purposes. Finally I've added some d3 charts (just a small selection at the moment but this will grow) that can easily invoked from within the markdown. 

It's all very very beta at the moment. I'm not claiming it's ready to go. I would like to add lots more charts, redesign the d3 code and improve it's overall usability (in particular replace the tags approach with something more in the spirit of markdown) however I thought I'd share it as it is. There's also a lot be done in terms of good design practice (css and all that). Please don't judge me **yet**!

##What it can do

In case it's not obvious this web page was written using glasseye<side-note>You can view the markdown here</side-note>, that it is it was written in markdown with a few extra html-like tags thrown in. 

###Side notes and margin notes
First there's the `<side-note>` tag. Anything enclosed in these tags will generate a numbered side note in the wide margin as close as possible to the note number in the main text. For example, I've used one here<side-note>I'm a side note! Use me for commentary, links, bits of maths, anything that's peripheral to the main discussion.</side-note>. 

Then there is a `<margin-note>` tag which is the nearly the same as the side note, only there's no number linking it to a particular part in the main text. You'll see to the right an example of a margin note containing a d3 donut.

<margin-note>
An example of margin note containing a donut plot. Because a tooltip is available we can create a less cluttered chart with labels for the smaller segments demoted to the tooltip.<donut>"data/share.csv"</donut><br>Including d3 charts in a glasseye document is very easy. You just need to surround the name of the file containing the data with tags specfying the type of chart. For example this chart was generated using `<donut>"data/share.csv"</donut>`
</margin-note>

###Latex

I'm using pandoc to convert the markdown to html which means we can take advantage of its ability to transform latex into mathjax. For example the formula below was written in latex.

$$E[L]= \frac{1}{B(\alpha)}\int \cdots \int_\mathbf{D}\ \sum_{j=1}^N \theta_{j}^2 \ \prod_{j=1}^N \theta_j^{\alpha_j-1} \ d\theta_1 \!\cdots d\theta_N $$

However sometimes the mathematical details are not central to a discussion, in which case it's nice to put them in a side note which can be easily done using the side-note or margin-note tags<side-note>
Here's an example of some maths that has been placed in a side note $$ f(\theta_1,\dots, \theta_N; \alpha_1,\dots, \alpha_N) = \frac{1}{\mathrm{B}(\alpha)} \prod_{i=1}^N \theta_i^{\alpha_i - 1} $$
Where the normalising constant is:
$$ \mathrm{B}(\alpha) = \frac{\prod_{i=1}^N \Gamma(\alpha_i)}{\Gamma\bigl(\sum_{i=1}^N \alpha_i\bigr)},\qquad\alpha=(\alpha_1,\dots,\alpha_N)$$
</side-note>

###d3 charts

So far I've only a few charts for you to use but hopefully that will expand quite rapidly. I've tried to create charts that are simple and uncluttered with the tooltip taking over some of the work. This is so that can fit in the margin nicely. I've been thinking about making them as intellegent as possible so that choices are made for you about formatting (for example label positioning). That my prove annoying though so we'll see how it goes. It's easy to include any of the d3 charts into either the main body of the text or into the margin. 

Inserting a plot is again just a matter of using some custom tags. For example to generate a line plot just surround a string containing the path and filname of a csv file with a `<line_plot>` tag. You can optionally supply axis labels.<side-note>
An example of a line plot. Note the tooltip means we don't need y axis tick labels.<br>
<line_plot>"data/lineplotExample.csv", ["Size", "Number of explosions"]</line_plot><br>
This plot was created by inserting the following line into the markdown. `<line_plot>"data/lineplotExample.csv", ["Size", "Number of explosions"]</line_plot><br>
`


Alternatively you can write the data in json into the markdown. For example we can create an interactive treemap<side-note>An example of an intreactive treemap. Click on the rectangles to zoom in <br>
<br><treemap>{ "name": "All", "children": [{ "name": "Bakery", "size": 34 }, { "name": "Tinned Goods", "children": [{ "name": "Beans", "size": 34 }, { "name": "Soups", "size": 56 }, { "name": "Puddings", "children": [{ "name": "Fruit", "children": [{ "name": "Tangerines", "size": 15 }, { "name": "Pears", "size": 17 }]}, { "name": "Apricots", "size": 89 } ] }] }, { "name": "Meat and Fish", "children": [{ "name": "Meat", "children": [{ "name": "Poultry", "size": 15 }, { "name": "Beef", "size": 17 }]}, { "name": "Fish", "size": 89 } ] }] }</treemap>
</side-note>
 by inserting the following into the markdown


```
<treemap>{ "name": "All", "children": [{ "name": "Bakery", "size": 34 }, 
	{ "name": "Tinned Goods", "children": [{ "name": "Beans", "size": 34 }, 
	{ "name": "Soups", "size": 56 }, { "name": "Puddings", "children": 
	[{ "name": "Fruit", "children": [{ "name": "Tangerines", "size": 15 }, 
	{ "name": "Pears", "size": 17 }]}, { "name": "Apricots", "size": 89 } ] }] }, 
	{ "name": "Meat and Fish", "children": [{ "name": "Meat", "children": 
	[{ "name": "Poultry", "size": 15 }, { "name": "Beef", "size": 17 }]}, 
	{ "name": "Fish", "size": 89 } ] }] }</treemap>
```

Javascript charts also allow us to animate content which can be useful. I created a chart type `<sim_plot>` for a project using agent based simulation. It animates a time line which helps bring home the fact that the data is computer generated

<sim_plot>"data/activeDecidedSim.csv"</sim_plot><br>

##How it works

At the moment it hangs together with pandoc and the python beautiful soup library. Pandoc is used to generate the html from the markdown and beautiful soup is used to manipulate the extra tags and make the appropriate substitutions. Until I get my act together with packaging it up you'll need to 

1. Install pandoc from [here](http://pandoc.org)
2. Install python 2.7 and make sure you have the pypandoc and beautifulsoup libraries
3. Download the source code from github

Then you should be able to run the following in a terminal

```
python glasseye.py your_md_file.md
```

It will produce a directory containing all the necessary html, js and css.

Would be very pleased to hear from anyone giving it a go!





