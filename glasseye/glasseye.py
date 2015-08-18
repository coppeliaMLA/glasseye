import sys, os, re, pypandoc as py, shutil as sh
from bs4 import BeautifulSoup

#Function to wrap with tags
def wrap(to_wrap, wrap_in):
    contents = to_wrap.replace_with(wrap_in)
    wrap_in.append(contents)

#Function to add charts
def add_chart(chart_id, code_string):
    for d in enumerate(soup.findAll(chart_id)):
        code_string += chart_id + "(" + str(d[1].contents[0]) + ", " + "'#" + chart_id + "_" + str(d[0]) + "'); \n"
        d[1].name = "span"
        d[1].contents = ""
        d[1]['id'] = chart_id + "_" + str(d[0])
        tag = soup.new_tag("br")
        d[1].insert_after(tag)
    return code_string

#Get paths and file names
user_path = os.getcwd() + "/"
input_file = sys.argv[1]
glasseye_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) + "/"
pandoc_html = "pandocHTML.html"
stem = os.path.splitext(input_file)[0]
glasseye_file = stem + ".html"
tufte_template = "templates/tufteTemplate.html"

#Copy across directories to the user location
if user_path != glasseye_path:
    css_path = user_path + "css"
    if os.path.exists(css_path):
        sh.rmtree(css_path)
    sh.copytree(glasseye_path + "css", css_path)

    js_path = user_path + "js"
    if os.path.exists(js_path):
        sh.rmtree(js_path)
    sh.copytree(glasseye_path + "js", js_path)

#Convert markdown to html using pandoc
py.convert(user_path+input_file, 'html', outputfile = user_path + "pandocHTML.html", extra_args=['--mathjax'])

#Read in the html and soupify it
read_html= open(user_path + pandoc_html,'r').read()
soup = BeautifulSoup(read_html, 'html.parser')

#Make the changes for the Tufte format
for a in soup.findAll('margin-note'):
    p = soup.new_tag("p")
    a.replaceWith(p)
    p.insert(0, a)
    a.name = "span"
    a['class'] = "marginnote"

for a in enumerate(soup.findAll('side-note')):
    a[1].name = "span"
    a[1]['class'] = "marginnote"
    a[1].insert(0, str(a[0]+1) + ". ")
    tag = soup.new_tag("sup")
    tag.string = str(a[0]+1)
    a[1].insert_before(tag)

for a in soup.findAll('checklist'):
    l = a.parent.findNext('ul')
    l['class'] = "checklist"
    a.extract()

if soup.ol != None:
    for ol in soup.findAll('ol'):
       if ol.parent.name != 'li':
           wrap(ol, soup.new_tag("div", **{'class':'list-container'}))

if soup.ul != None:
   for ul in soup.findAll('ul'):
       if ul.parent.name != 'li':
           wrap(ul, soup.new_tag("div", **{'class':'list-container'}))


#Process the charts
code_string = ""

#Standard charts

standard_charts = ["sim_plot", "treemap", "dot_plot"]

for s in standard_charts:
    code_string = add_chart(s, code_string)

#Charts with extra features (will modify the standard charts asap)

for d in enumerate(soup.findAll('donut')):
    if d[1].parent.name == "span":
        code_string += "donut(" + str(d[1].contents[0]) + ", " + "'#donut_" + str(d[0]) + "', 'margin'); \n"
    else:
        code_string += "donut(" + str(d[1].contents[0]) + ", " + "'#donut_" + str(d[0]) + "', 'full_page'); \n"
    d[1].name = "span"
    d[1].contents = ""
    d[1]['id'] = "donut_" + str(d[0])
    tag = soup.new_tag("br")
    d[1].insert_after(tag)

for d in enumerate(soup.findAll('line_plot')):
    arguments = str(d[1].contents[0])
    if "," in arguments:
        arguments = arguments.split(",", 1)
        code_string += "line_plot(" + arguments[0] + ", " + "'#line_plot_" + str(d[0]) + "'," + arguments[1] + "); \n"
    else:
        code_string += "line_plot(" + str(d[1].contents[0]) + ", " + "'#line_plot_" + str(d[0]) + "'); \n"
    d[1].name = "span"
    d[1].contents = ""
    d[1]['id'] = "line_plot_" + str(d[0])
    tag = soup.new_tag("br")
    d[1].insert_after(tag)

soup_string = str(soup)

#Write to file with header and footer from template
with open(glasseye_path + tufte_template, "r") as template:
     with open(user_path + glasseye_file, "w") as glasseye_file:
         for line in template:
             if '<div id = "tufte_container">' in line:
                 glasseye_file.write('<div id = "tufte_container">')
                 glasseye_file.write(soup_string)
             elif '<!--glasseye-->' in line:
                 glasseye_file.write("<script>" + code_string + "</script>")
             else:
                 glasseye_file.write(line)

