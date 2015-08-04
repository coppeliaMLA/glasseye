Blueprint
=================

Getting started
---------------

###What is Blueprint for?

Blueprint is intended to be a framework any analytics project that comes your way, large or small

It should: 

* Help you organise your thoughts and produce well reasoned arguments to show how the available data should impact business decisions.
* Help you plan your analytics project effectively, so that you spend your time and effort on the things that matter to the client.
* Serve as a both a *to-do list* to guide you through your project and a *checklist* to make sure you haven't missed out anything crucial.
* Guide you in the use of tools and techniques.
* Once completed this template will also be a professional technical document describing your approach and findings. As such it will be another important deliverable from your project. 

###What is Markdown?

Markdown is a lightweight mark up language. This means you can use a simple WYSIWYG text editor to write a document and add symbols to indicate how that text will look once transferred into a richer format like html and pdf. You can read all about markdown [here](http://daringfireball.net/projects/markdown/). It is now fairly ubiquitous on the web and you'll find that many online collaborative tools use some form of it (see for example github, stackoverflow and wikipedia).

###Why are we using it?

There are several very good reasons for adopting markdown as your standard language for writing documents:

* It almost magically does away with all the frustrations of using a word processing application like Word. There are fewer options for formatting with markdown but somehow this makes for a more elegant document. By limiting input to what can be typed you'll find your thoughts flow more freely. When the button is pressed to render the markdown into html or pdf you'll find that the document is laid out well without you ever having to think about it. In short it makes it about content rather than form.

* Markdown can be easily transformed into
	* HTML (Click here to see the html rendering of this document)
	* PDF
	* Word
	* Slides
	
	Chances are you are reading it in one of these forms right now. The point is to work in a language that is upstream from all of these formats so that you can easily accommodate whatever format your client desires.
* You can easily build in interactive features, e.g. include hyperlinks to sources

* For our purposes it allows use to create a template that is effortlessly adaptable. Simply delete sections you don't want or modify the text. Make any change you want. It's not going to destroy the layout.

###How to use Markdown


####Setting it up

You can either

* Download an application that works in your local environment. For example you could use [Mou](http://25.io/mou/) on a mac or [Markdownpad](http://markdownpad.com) on windows
* Use a browser based app if you are working in the cloud (e.g. [stackedit](https://stackedit.io) on google docs)

####A guide to the syntax

The syntax is incredibly easy to learn. For example

	Title
	=====
	
renders a title. Asterisks either side of a word render it in *italics*

	*italics*
	
You can find a full guide to the syntax [here](http://daringfireball.net/projects/markdown/syntax). It will take you not longer than five minutes to learn.


###What is glasseye?

glasseye is an application developed by Coppelia that

1. 	Renders markdown into html with an attractive [Tufte](http://www.latextemplates.com/template/tufte-style-book) layout
2. 	Uses a shorthand within markdown to create interactive d3 charts to be inserted into the Tufte layout 

<margin-note 
If you are using glasseye then this paragraph will appear in a wide margin when rendered in HTML. If not you'll see it inside a pair of tags.
</margin-note

The idea is to help analysts display their work in an attractive, interactive format.

####Setting up glasseye

To be confirmed


Thinking with Blueprint
------

In this section we will provide some explanation for the methods we propose you follow when solving problems followed by a checklist that you can use to ensure you are keeping to the methods. 

###Reasoning

You role as analyst/data scientist is to work out how data impacts decisions. These might be human decisions (to be taken by your clients) or these might be decisions that are built into a system in some automated way (which product offer to send to which customer). Either way you are likely to be faced with the task of building up an argument to describe how you have reached your recommendation or design. 

####Some philosophy

Although it might seem pretentious there are several tools from philosophy that should come in handy. Philosophy after all is concerned about how to think carefully about abstract things so in a ways it's unsurprising that it should be useful to us

#####The Socratic method

Many of the works of Plato are presented as dialogues between Socrates and his pupils. This is useful as a way of laying out arguments because both the pupil and Socrates will (hopefully) ask the same questions as the reader would at each stage of the discussion. These are questions that come not from the position of an expert but from someone on the outside who is trying to understand each move in the argument. As a result, although simple, they are usually the right questions. If you can work through complex ideas and chains of analysis by imagining a dialogue between two people (at least one of them a healthy sceptic) then chances are you will arrive at something that 

1. Answers all the questions that a client would fire at you
2. Proceeds in a logical manner, carefully developing the argument
3. Goes somewhere interesting

Here is an example. It can seem a bit ridiculous at first but it pays off
>A: What's the most interesting thing about these web stats?

>B: Probably the ratio of unique users to visits. It's almost two to one

>A: Why is that interesting isn't that normal?

>B: Not for this category. The usual ratio is about 5 visits to one unique user

>A: So what does it tell us?

>B: That people visit once or twice and don't come back

>A: Is that true though? We are looking at an overall ratio. But that there might be two distinct groups here. A small group of very dedicated users and another group who visit the site only once.

>B: No, I've checked. Aside from one or two outliers that might be admin staff the average behaviour is pretty uniform.

Note that this method prevented us from possibly drawing a false conclusion from an overall ratio

I apply this method to any analysis work I do and even when I am planning work. It is also useful when checking the work (see section below)


#####Analytical philosophy

We can also borrow some of the tools and techniques of modern analytical philosophy. In particular:

1. If the problem is complex then break it down into pieces that are simpler. Example: The forecasting tool can be broken into components. You might need components to:
	 * Read in the raw data
     * Transform the data for modelling
	 * Chose the correct model
	 * etc
2. Adopt a reductionist strategy. That is:
	1. Define your basic terms. Hours are wasted pointlessly in misunderstandings between people who are unaware that they using slightly different definitions. Lay down your definitions right at the beginning of your project to avoid this. Example: For our purposes a customer is a person who has made at least one purchase in the UK since 1st January 2006. 
	4. Build up your argument by making claims and showing how one follows from another. Move forward from simple to complex. If you start with something complicated with lots of unknowns, then chances are neither you nor anyone else will understand it. If on the other hand you start simple and add complexity you will understand your solution and be able to explain how you got there. The first is like being dropped blindfolded into the middle of a forest. The second is like cutting your own path from the outside of the forest to the centre!
5. Clarifying a problem can be as good as solving it. It's a mistake to think that your clients/decision makers are only ever looking for a single answer. Sometimes they just want to understand the lay of the land. It can as useful to say something like: if we accept that X is true then you should do Y but if we do not accept this you should do Z.

#####The role of maths and statistics


Organising with Blueprint
------

###Picking the right tool for the job

###Project management

###Quality control

####The three tests

* Triangulation
* The spot check
* The bastard test

###Using the Blueprint template

The idea is that you start with the Blueprint template and then through a series of deletions, additions and substitutions end up with useful and well designed business document. In what follows you will find

1. Explanatory sections which you can delete after you have read them 
2. Check lists which you can keep in the document until you have completed them
3. Placeholder sections where you can replace the text with your own to complete the document

##Checklists

###Checklist for thinking

<checklist>

* I have questioned each step that I have taken (using, if it helps, the dialogue method)
* If the problem is complex I have broken into simpler pieces
* I have defined all the terms in the problem even if they seem obvious to me
* I have stated clearly all the important relationships
* I have stated all common sense assumptions
* I have stated all the logical assumptions
* I have started my argument from a simple position that everyone understands and I have added in complexity step by step until I have a solution that no more complex than it needs to be
* I have only used statistics when ...

</checklist>

###Checklist for tool selection

<checklist>

* I have researched the available tools and have chosen one appropriate to the job
* If I am building a tool I have made sure it does not already exist (for example as an R package)

</checklist>

###Checklist for project management

<checklist>

* If coding is involved I have set up a code repository
* I have listed the project stakeholders
* I have listed and communicated the issues and risks
* I have broken the project into broad tasks (e.g. data preparation)
* I have set these tasks out in a Gantt chart
* I have estimated how much time is needed to complete the project
* I have allowed some contingency time for unexpected events

</checklist>

###Checklist for quality control

<checklist>

* I have done the triangulation test
* I have done the spot test check
* I have done the bastard check

</checklist>

#Now what would you like a blueprint template for?

###[To pitch an idea to the central team](Pitch.md)

###[To run an analytics project](Project.md)


















