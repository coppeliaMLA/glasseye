##What is glasseye?

Glasseye is something I'm developing to present the results of statistical analysis in an attractive and hopefully interesting way. It brings together three great things that I use a lot:

1. The markdown markup language.
2. The Tufte wide margin layout
3. Visualisation using d3.js

See a full demo [here](http://coppeliamla.github.io/glasseye/glasseye_markdownExample/demo.html)

The idea is to be able to write up work in markdown and have the results transformed into something like a Tufte layoutof which more below. For the Tufte layout I took the excellent tufte.css style sheet developed by [Dave Liepmann and co](https://github.com/daveliepmann/tufte-css) and made a few changes to suit my purpose. Finally I've added some d3 charts (just a small selection at the moment but this will grow) that can easily invoked from within the markdown. 

It's all very very beta at the moment. I'm not claiming it's ready to go. I would like to add lots more charts, redesign the d3 code and improve its overall usability (in particular replace the tags approach with something more in the spirit of markdown) however I thought I'd share it as it is. There's also a lot be done in terms of good design practice (css and all that). Please don't judge me **yet**!

##What it can do

In case it's not obvious this web page was written using glasseye, that it is it was written in markdown with a few extra html-like tags thrown in. 

###Side notes and margin notes
First there's the `<sidenote>` tag. Anything enclosed in these tags will generate a numbered side note in the wide margin as close as possible to the note number in the main text. 

Then there is a `<marginnote>` tag which is the nearly the same as the side note, only there's no number linking it to a particular part in the main text. 

###Latex

I'm using pandoc to convert the markdown to html which means we can take advantage of its ability to transform latex into mathjax. 

However sometimes the mathematical details are not central to a discussion, in which case it's nice to put them in a side note which can be easily done using the side-note or margin-note tags.

###d3 charts

So far I've only a few charts for you to use but hopefully that will expand quite rapidly. I've tried to create charts that are simple and uncluttered with the tooltip taking over some of the work. This is so that they can fit in the margin nicely. I've been thinking about making them as intellegent as possible so that choices are made for you about formatting (for example label positioning). That may prove annoying though so we'll see how it goes. It's easy to include any of the d3 charts into either the main body of the text or into the margin. 

Inserting a plot is again just a matter of using some custom tags. For example to generate a line plot just surround a string containing the path and filname of a csv file with a `<lineplot>` tag. You can optionally supply axis labels.


Alternatively you can write the data in json into the markdown. For example we can create an interactive treemap by inserting the following into the markdown


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


##How it works

At the moment it hangs together with pandoc and the python beautifulsoup library. Pandoc is used to generate the html from the markdown and beautiful soup is used to manipulate the extra tags and make the appropriate substitutions. Until I get my act together with packaging it up you'll need to 

1. Install pandoc from [here](http://pandoc.org)
2. Install python 2.7 and make sure you have the pypandoc and beautifulsoup libraries
3. Download the source code from github 

So for example an install on my mac (presupposing you have git, pandoc and python) looks like this

```
pip install beautifulsoup4
pip install pypandoc
```

Then navigate to where you'd like to place the glass eye repository and clone it

```
cd /Users/simon/CodeRepos
git clone https://github.com/coppeliaMLA/glasseye.git
```

Add the location of the glasseye python module to your PYTHONPATH

```
PYTHONPATH="${PYTHONPATH}:/Users/simon/CodeRepos/glasseye/glasseye"
export PYTHONPATH
```

You should then be able to run the following in a terminal on any markdown file

```
python -m glasseye your_md_file.md
```

You can try out the simple test file included in the repository

```
python -m glasseye test.md
```
It will produce an html file and the supporting js and css directories.

Would be very pleased to hear from anyone giving it a go!





