Bar Charts with Brains
======================

By Simon Raper

Created for [Coppelia](http://www.coppelia.io) with [glasseye](https://github.com/coppeliaMLA/glasseye)

Bar charts are not going away. They once blew our minds <sidenote>I'm afraid I can't remember where I read about the reaction to William Playfair's first bar charts. AT the time they were considered extremely difficult to understand. I think it was in a copy of [Significance](https://www.statslife.org.uk/significance).</sidenote> but are now so much part of our visual language that it is hard to remember ever being taught how to use them. Novel mappings of data onto shapes demand additional brain resource from your audience at a moment when there might not be much to go around, which explains the following familiar scenario: you've spent hours on your highly original data visualisation that captures exactly what is interesting about the data only to meet with scowls, squints and a gruffly delivered "Where have the bar charts gone".
Your heart sinks.

But there are things we can do to bar charts to smarten them up while preserving their familiarity.<sidenote>The idea behind glasseye is to develop d3 charts for the presentation rather than the exploration of data. These are two very different activities and their confusion is behind many dull or incomprehensible presentations.</sidenote> For one thing we can give them a layer of intelligence that will help the user make better decisions. Here is our version of a bar chart that helps makes sense of some multiple choice survey data.<sidenote>As with all glasseye charts a smaller version is available for the margin <barchart>{"label": ["Apples", "Pears", "Oranges"], "value": [100, 230, 265]}</barchart></sidenote> 

Work it by clicking on pairs of bars and observing the commentary that appears below.


<barchart>{"label": ["Red Party", "Blue Party", "Green Party", "Yellow Party"], "value": [40, 23, 19, 8]}</barchart>


The great danger with this kind of presentation is that the user acts on an apparent difference between a pair of bars when in truth that difference is only there because the analysis is based on a sample.

In this example we see that the blue party is ahead of the green party in the poll. What we'd love to know is how probable it is that they truly are ahead in the population at large. If we click on the blue party bar and then on the green party bar we get this information.<sidenote>Note that we generate these probabilities by simulating draws from a probability distribution. The more draws we make the more accurate our estimate of the probability but of course that also slows things down. Each simulation produces a slightly different result so you may see slightly different estimates each time the page loads.</sidenote> Even more valuable is to try it the other way around and click on first the green party bar and then blue. Of course this is simply the one minus the previous probability but the chart seems to trick us into not even entertaining this possibility.


If the mathematical detail doesn't interest you then all you need to know is

1. We are using a Bayesian approach to statistics and this allows us to give you these very straightforward sounding probabilities rather some confusing talk about significance tests
2. Comparing each pair of bars at a time would usually mean we fall foul of the multiple comparisons problem <sidenote>The more comparisons you make the more likely you are to identify something as 'interesting' when it is in actual fact just due to noise </sidenote> but the Bayesian approach provides some protection against this.<sidenote>Although I need to do some maths to check this (see below)</sidenote>
3. The shadow behind each bar gives a 'shrunken' estimate of its mean. You can think of this as a more conservative estimate that balances what the data tells us against a starting assumption that there are no differences between the parties.<sidenote>The smaller the sample the more importance is attached to this starting assumption. Compare the shadows on this chart based on a sample of 18 with those based on a sample of 90 in the original chart. You'll notice that they are more 'shrunk' towards the middle.<barchart>{"label": ["Red Party", "Blue Party", "Green Party", "Yellow Party"], "value": [6, 2, 19, 1]}</barchart></sidenote>

We go into more detail below. But first...

Some additional braininess
--------------------------

I've tried to automate as many of the mind numbing bar chart formatting tasks as possible, giving the glasseye barchart slightly more brains. As described [here](https://github.com/coppeliaMLA/glasseye) the chart is invoked with by using an tag in markdown.


    <barchart>{"label": ["Red Party", "Blue Party", "Green Party", "Yellow Party"], "value": [40, 23, 19, 8]}</barchart>


Then the rest is handled for you. First of all it does some decluttering of the labelling based on the data giving it a nice minimalist look.

It also handles automatic rotation of long labels

<barchart>{"label": ["A long label", "An even longer label", "The longest label of all"], "value": [100, 23, 89]}</barchart>

The tooltips and axis labels automatically get appropriate number formatting (here for example both are given a unit of a million).

<barchart>{"label": ["Duck", "Rabbit", "Penguin"], "value": [10000000, 23400000, 12002034]}</barchart>

A bit controversial this one but it also changes the point of intersection with the y-axis if all values are sufficiently close. I'm in two minds about removing this. On the one hand it can be misleading but on the other it can bring out patterns that are otherwise difficult to see. We could also argue that the commentary provides a corrective. 

<barchart>{"label": ["Duck", "Rabbit", "Penguin"], "value": [100, 110, 120]}</barchart>

Stack, Unstack
--------------

The stacked an unstacked chart are so close to the same thing that I thought it much more economical to combine them. Click on the bars to stack and unstack them. The colours are automatically chosen from [colorbrewer](http://colorbrewer2.org) via d3 based on the number of items in the stack.

<barchart>"stack.csv"</barchart>

Some details about the Bayesian approach
----------------------------------------

In creating these charts I was partly motivated by some of the well intentioned but slightly horrifying attempts that I've come across to add robustness to the analysis or survey results. These usually involve pairwise z-tests of the differences between counts of answers to mutually exclusive multiple choice questions. There are many reasons this is wrong not least the fact that we are not sampling from two different populations. The correct frequentist approach to the problem is to create a log linear model and then test the parameters of this model for equality.
 
 But there are two problems with this approach
 
 1. The results need to be couched in the painful language of the frequentist with its counter intuitive significance tests and its angst about talking about probabilities when it comes to population statistics.<sidenote>For example we wouldn't be able to say that there is an x% probability of A being greater than B in the population (such a thing is a yes or no fact and does not admit probabilities). We can only say that given the null of hypothesis of their being no difference between A and B in the population, the probability of observing the test statistic as great as Z is x.</sidenote>
 2. If there are n bars, then you have C(n,2)<sidenote>For example with 8 bars you have 28 possible comparisons.</sidenote> pairwise comparisons to account for which means your are running into the problem of multiple comparisons and will need to adjust your the threshold for your significance tests.
 
The first is addressed directly by the Bayesian approach to statistics <sidenote>Obviously a big subject! If you are interested I can recommend Bayesian Data Analysis by Gelman etc al</sidenote>. The second is also less of a problem according to [this](http://www.stat.columbia.edu/~gelman/research/published/multiple2f.pdf) paper by Andrew Gelman et al (although in truth I've yet to follow the calculations through for the particular example we are looking at.)

So finally to how we create the probabilities for the bar chart.

Let $\textbf{n} = n_1, n_2 ... n_k$ be the observed counts and $N$ be the total.

We treat the $\underline{n}$ as being generated by a multinomial distribution with parameters $\textbf{p} = p_1, p_2 ... p_k$ so that 

$$p(\textbf{n} \mid \textbf{p}) = \frac{N!}{n_1!\cdots n_k!} p_1^{n_1} \cdots p_k^{n_k}$$

The conjugate prior for this multinomial distribution is a Dirichlet distribution with parameters $\alpha  = \alpha_1, \alpha_2 ... \alpha_k$. We create an uninformative prior by setting $\alpha_1 = \alpha_2 ...  = \alpha_k = 1$. This gives us a very simple posterior distribution in that it is Dirichlet with parameters $n_1+1, n_2+1 ... n_k+1$

The shrunken values for the bar totals are then 

$$\mu_i = N \frac{n_i + 1}{\sum n_i + k}$$

To get the probabilities for the differences between the bars we simulate draws from the posterior distribution and the calculate the pairwise differences between the $p_1, p_2 ... p_k$. This gives us a probability distribution for the difference in each case.<sidenote>Hence why I needed a random number generator for a Dirichlet distribution. See [this](http://www.coppelia.io/2016/02/animated-densities/) post!</sidenote>
