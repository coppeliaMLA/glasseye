import sys, os, re, pypandoc as py, shutil as sh
from bs4 import BeautifulSoup

#Function to wrap with tags
def wrap(to_wrap, wrap_in):
    contents = to_wrap.replace_with(wrap_in)
    wrap_in.append(contents)

#Get paths and file names
user_path = os.getcwd() + "/"
input_file = sys.argv[1]
glasseye_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) + "/"
print glasseye_path
pandoc_html = "pandocHTML.html"
stem = os.path.splitext(input_file)[0]
glasseye_file = stem + ".html"
tufte_template = "templates/tufteTemplate.html"

#Make a glasseye directory at use location

glasseye_dir = user_path + "glasseye_" + stem + "/"
if not os.path.exists(glasseye_dir):
    os.makedirs(glasseye_dir)

#Copy across directories to the user location
css_path = glasseye_dir + "css"
if os.path.exists(css_path):
    sh.rmtree(css_path)
sh.copytree(glasseye_path + "css", css_path)

js_path = glasseye_dir + "js"
if os.path.exists(js_path):
    sh.rmtree(js_path)
sh.copytree(glasseye_path + "js", js_path)

#Convert markdown to html using pandoc
py.convert(user_path+input_file, 'html', outputfile = glasseye_dir + "pandocHTML.html", extra_args=['--mathjax'])

#Read in the html and soupify it
read_html= open(glasseye_dir + pandoc_html,'r').read()
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

for d in enumerate(soup.findAll('donut')):
    if d[1].parent.name == "span":
        #d[1].parent['class'] == "marginnote":
        code_string += "donut(" + str(d[1].contents[0]) + ", " + "'#donut_" + str(d[0]) + "', 'margin'); \n"
    else:
        code_string += "donut(" + str(d[1].contents[0]) + ", " + "'#donut_" + str(d[0]) + "', 'full_page'); \n"
    d[1].name = "span"
    d[1].contents = ""
    d[1]['id'] = "donut_" + str(d[0])
    #wrap(d[1], soup.new_tag("p"))

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

for d in enumerate(soup.findAll('treemap')):
    code_string += "treemap(" + str(d[1].contents[0]) + ", " + "'#treemap_" + str(d[0]) + "'); \n"
    d[1].name = "span"
    d[1].contents = ""
    d[1]['id'] = "treemap_" + str(d[0])

for d in enumerate(soup.findAll('sim_plot')):
    code_string += "sim_plot(" + str(d[1].contents[0]) + ", " + "'#sim_plot_" + str(d[0]) + "'); \n"
    d[1].name = "span"
    d[1].contents = ""
    d[1]['id'] = "sim_plot_" + str(d[0])

for d in enumerate(soup.findAll('dot_plot')):
    code_string += "dot_plot(" + str(d[1].contents[0]) + ", " + "'#dot_plot_" + str(d[0]) + "'); \n"
    d[1].name = "span"
    d[1].contents = ""
    d[1]['id'] = "dot_plot_" + str(d[0])

for d in enumerate(soup.findAll('led_sim')):
    code_string += "led_sim(" + str(d[1].contents[0]) + ", " + "'#led_sim_" + str(d[0]) + "'); \n"
    d[1].name = "span"
    d[1].contents = ""
    d[1]['id'] = "led_sim_" + str(d[0])

soup_string = str(soup)

#Write to file with header and footer from template
with open(glasseye_path + tufte_template, "r") as template:
     with open(glasseye_dir + glasseye_file, "w") as glasseye_file:
         for line in template:
             if '<div id = "tufte_container">' in line:
                 glasseye_file.write('<div id = "tufte_container">')
                 glasseye_file.write(soup_string)
             elif '<!--glasseye-->' in line:
                 glasseye_file.write("<script>" + code_string + "</script>")
             else:
                 glasseye_file.write(line)

