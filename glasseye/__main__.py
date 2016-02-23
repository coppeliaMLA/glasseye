import sys, os, re, pypandoc as py, shutil as sh
from bs4 import BeautifulSoup

def main():
    #Function to wrap with tags
    def wrap(to_wrap, wrap_in):
        contents = to_wrap.replace_with(wrap_in)
        wrap_in.append(contents)

    #Function to add charts
    def add_chart(chart_id, code_string):
        for d in enumerate(soup.findAll(chart_id)):
            code_string += chart_id + "(" + str(d[1].contents[0]) + ", '#" + chart_id + "_" + str(d[0])
            if d[1].parent.name == "span":
                code_string += "', 'margin'); \n"
            else:
                code_string += "', 'full_page'); \n"
            d[1].name = "span"
            d[1].contents = ""
            d[1]['id'] = chart_id + "_" + str(d[0])
            tag = soup.new_tag("br")
            d[1].insert_after(tag)
        return code_string

    #Get paths and file names
    user_path = os.getcwd() + "/"
    input_file = sys.argv[1]
    glasseye_path = os.path.dirname(os.path.abspath(__file__)) + "/"
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

        template_path = user_path + 'templates/template.html'
        if not(os.path.isfile(template_path)):
            os.mkdir(user_path + 'templates/')
            sh.copy(glasseye_path + tufte_template, template_path)

        tufte_template = template_path

    #Convert markdown to html using pandoc
    py.convert(user_path+input_file, 'html', outputfile = user_path + "pandocHTML.html", extra_args=['--mathjax'])

    #Read in the html and soupify it
    read_html= open(user_path + pandoc_html,'r').read()
    soup = BeautifulSoup(read_html, 'html.parser')

    #Make the changes for the Tufte format
    for a in soup.findAll('marginnote'):
        p = soup.new_tag("p")
        a.replaceWith(p)
        p.insert(0, a)
        a.name = "span"
        a['class'] = "marginnote"

    for a in enumerate(soup.findAll('sidenote')):
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

    standard_charts = ["simplot", "treemap", "dot_plot", "gantt", "donut", "barchart", "tree", "force", "venn", "scatterplot", "timeseries"]

    for s in standard_charts:
        code_string = add_chart(s, code_string)

    #Charts with extra features (will modify the standard charts asap)

    for d in enumerate(soup.findAll('lineplot')):
        if d[1].parent.name == "span":
            size = "margin"
        else:
            size = "full_page"
        arguments = str(d[1].contents[0])
        if "," in arguments and ".csv" in arguments:
            arguments = arguments.split(",", 1)
            code_string += "lineplot(" + arguments[0] + ", " + "'#lineplot_" + str(d[0]) + "','" + size + "'," + arguments[1] + "); \n"
        else:
            code_string += "lineplot(" + str(d[1].contents[0]) + ", " + "'#lineplot_" + str(d[0]) + "','" + size + "'); \n"
        d[1].name = "span"
        d[1].contents = ""
        d[1]['id'] = "lineplot_" + str(d[0])
        tag = soup.new_tag("br")
        d[1].insert_after(tag)


    soup_string = str(soup)

    #Write to file with header and footer from template
    with open(template_path, "r") as template:
         with open(user_path + glasseye_file, "w") as glasseye_file:
             for line in template:
                 if '<div id = "tufte_container">' in line:
                     glasseye_file.write('<div id = "tufte_container">')
                     glasseye_file.write(soup_string)
                 elif '<!--glasseye-->' in line:
                     glasseye_file.write("<script>" + code_string + "</script>")
                 else:
                     glasseye_file.write(line)

if __name__ == '__main__':
    main()
