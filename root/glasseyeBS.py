import sys, os, re, pypandoc as py
from bs4 import BeautifulSoup, Tag

#Get system info
path = os.getcwd() + "/"
#input = sys.argv[1]
input = "markdownExample.md"

def wrap(to_wrap, wrap_in):
    contents = to_wrap.replace_with(wrap_in)
    wrap_in.append(contents)

#Convert markdown to html using pandoc
py.convert(path+input, 'html', outputfile = path + "pandocHTML.html", extra_args=['--mathjax'])

#Set names of files used in processing
pandoc_html = "pandocHTML.html"
glasseye = "glasseyeOut.html"
tufte_template = "tufteTemplate.html"

print path+pandoc_html
read_html= open(path + pandoc_html,'r').read()
soup = BeautifulSoup(read_html, 'html.parser')

for a in soup.findAll('margin-note'):
    p = soup.new_tag("p")
    a.replaceWith(p)
    p.insert(0, a)
    a.name = "span"
    a['class'] = "marginnote"

for a in soup.findAll('side-note'):
    a['name'] = "span"
    a['class'] = "marginnote"

if soup.ol != None:
    wrap(soup.ol, soup.new_tag("div", **{'class':'list-container'}))

if soup.ul != None:
    wrap(soup.ul, soup.new_tag("div", **{'class':'list-container'}))

#Process the charts

code_string = ""

for d in enumerate(soup.findAll('donut')):
    code_string += "donut(" + str(d[1].contents[0]) + ", " + "'#donut_" + str(d[0]) + "'); \n"
    d[1].name = "span"
    d[1].contents = ""
    d[1]['id'] = "donut_" + str(d[0])

for d in enumerate(soup.findAll('line_chart')):
    code_string += "line_chart(" + str(d[1].contents[0]) + ", " + "'#line_chart_" + str(d[0]) + "'); \n"
    d[1].name = "span"
    d[1].contents = ""
    d[1]['id'] = "line_chart_" + str(d[0])

for d in enumerate(soup.findAll('treemap')):
    code_string += "treemap(" + str(d[1].contents[0]) + ", " + "'#treemap_" + str(d[0]) + "'); \n"
    d[1].name = "span"
    d[1].contents = ""
    d[1]['id'] = "treemap_" + str(d[0])


print code_string
print soup
soup_string = str(soup)

#Write to file with header and footer from template
with open(path + tufte_template, "r") as template:
     with open(path + glasseye, "w") as glasseye_file:
         for line in template:
             if '<div id = "tufte_container">' in line:
                 glasseye_file.write('<div id = "tufte_container">')
                 glasseye_file.write(soup_string)
             elif '<!--glasseye-->' in line:
                 glasseye_file.write("<script>" + code_string + "</script>")
             else:
                 glasseye_file.write(line)

