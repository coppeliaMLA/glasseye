GE_DIR='/Users/simon/Documents/CodeRepos/glasseye/glasseye'
BB_DIR='/Users/simon/Documents/CodeRepos/barbarella/javascript/glasseye/'
GP_DIR='/Users/simon/Documents/CodeRepos/glasseyePages/glasseye'

# Remove the existing files
rm $GE_DIR/js/glasseyeCharts.js
rm $GE_DIR/js/glasseyeCharts.min.js
#And from barbarella
rm  $BB_DIR/js/glasseyeCharts.js
#And from the demo
rm $GE_DIR/demo/js/glasseyeCharts.js
rm -r $GP_DIR/demo

#Concatenate the modules into one script
cat GlasseyeChart.js \
GridChart.js \
BarChart.js \
Parsers.js \
GlobalFunctionsAndVariable.js \
AnimatedBarChart.js \
AnimatedDonut.js \
AnimatedVenn.js \
DrillableVenn.js \
Donut.js \
Force.js \
Gant.js \
LinePlot.js \
NonStandard.js \
ScatterPlot.js \
Thermometers.js \
TimeSeries.js \
Tree.js \
Venn.js \
Dial.js \
LogReg.js \
RandomNumber.js \
AnimatedDensity.js \
PolygonMap.js \
Heatmap.js \
> $GE_DIR/js/glasseyeCharts.js

#And copy it to barbarella
cp  $GE_DIR/js/glasseyeCharts.js $BB_DIR/js/glasseyeCharts.js

#And to the demo area
cp  $GE_DIR/js/glasseyeCharts.js $GE_DIR/demo/js/glasseyeCharts.js

#And to the articles
cp  $GE_DIR/js/glasseyeCharts.js /Users/simon/Documents/CodeRepos/glasseye/articles/js/glasseyeCharts.js

#Also copy across the css
cp $GE_DIR/css/glasseyeCharts.css $BB_DIR/css/glasseyeCharts.css

#And to the demo area
cp $GE_DIR/css/glasseyeCharts.css $GE_DIR/demo/css/glasseyeCharts.css

#And now copy the demo over to the pages dir
cp -r $GE_DIR/demo $GP_DIR/demo

#Minify it
minify $GE_DIR/js/glasseyeCharts.js > $GE_DIR/js/glasseyeCharts.min.js

#Export to pip
#cd ../../..
#python setup.py sdist upload

#Remove current version of glasseyeCharts and reinstall

#pip uninstall glasseye
#pip install glasseye
