Adding some simple Gantt charts to a Glasseye document
======================================================

Here's a way of adding a simple Gantt chart into your glasseye document. I find a simple version of Gantt chart useful when creating plans and proposals. They give a rough idea of the time scales involved. The syntax is as follows:

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

##Some Ispsum Lorem so you can see how it looks.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer facilisis, massa a dapibus mollis, libero eros aliquet risus, eu porttitor lorem tellus non lectus. Etiam sollicitudin elit eget feugiat accumsan. Integer varius dolor ut neque finibus sagittis. Morbi condimentum nunc aliquam purus posuere ornare laoreet vel elit. Fusce sed pharetra leo. Phasellus condimentum vestibulum tellus elementum rutrum. Ut bibendum et urna pulvinar viverra. Duis vitae ultrices lacus. Cras elementum luctus magna nec posuere. Nullam ac felis vel tortor dapibus aliquam eu sed ipsum. Quisque fringilla viverra ligula. Proin aliquet enim tincidunt enim fermentum dictum. In nec augue a dolor aliquet sollicitudin.


Phasellus sed enim auctor, elementum nibh eget, sagittis velit. Nam vestibulum, justo sed pharetra malesuada, sem dolor sodales elit, vitae tempor ante nisi eu libero. Mauris nec tellus vulputate, fringilla risus id, ultrices quam. Nam posuere risus sit amet fringilla porta. Vivamus pharetra consequat felis. Integer at ligula venenatis, molestie sapien eu, pellentesque neque. Duis eget enim lacus. Vivamus turpis dui, convallis vel metus facilisis, ullamcorper vestibulum urna. Sed sed velit magna. In magna magna, tristique non finibus a, egestas in erat.
