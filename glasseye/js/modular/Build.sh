GE_DIR='/Users/simon/Documents/CodeRepos/glasseye/glasseye'
BB_DIR='/Users/simon/Documents/CodeRepos/barbarella/javascript/glasseye/'

# Remove the existing files
rm $GE_DIR/js/GlasseyeCharts.js
rm $GE_DIR/js/GlasseyeCharts.min.js
#And from barbarella
rm  $BB_DIR/js/GlasseyeCharts.js
#And from the demo
rm $GE_DIR/demo/js/GlasseyeCharts.js

#Concatenate the modules into one script
cat GlasseyeChart.js \
GridChart.js \
BarChart.js \
Parsers.js \
GlobalFunctionsAndVariable.js \
AnimatedBarChart.js \
AnimatedDonut.js \
AnimatedVenn.js \
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
> $GE_DIR/js/GlasseyeCharts.js

#And copy it to barbarella
cp  $GE_DIR/js/GlasseyeCharts.js $BB_DIR/js/GlasseyeCharts.js

#And to the demo area
cp  $GE_DIR/js/GlasseyeCharts.js $GE_DIR/demo/js/GlasseyeCharts.js

#Also copy across the css
#cp $GE_DIR/css/glasseyeCharts.css $BB_DIR/css/glasseyeCharts.css

#Minify it
minify $GE_DIR/js/GlasseyeCharts.js > $GE_DIR/js/GlasseyeCharts.min.js

#Export to pip
#cd ../../..
#python setup.py sdist upload

#Remove current version of glasseyeCharts and reinstall

#pip uninstall glasseye
#pip install glasseye
