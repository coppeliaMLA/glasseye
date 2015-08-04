import sys, os, re, pypandoc as py

#Get system info
path = os.getcwd() + "/"
print path
#input = sys.argv[1]
input = "markdownExample.md"
print path+input

#Convert markdown to html using pandoc
py.convert(path+input, 'html', outputfile = path + "pandocHTML.html", extra_args=['--mathjax'])

#Set names of files used in processing
pandoc_html = "pandocHTML.html"
glasseye = "glasseyeOut.html"
tufte_template = "tufteTemplate.html"

#Regex expressions and substitutions
sub_pairs = [('<margin-note>', '<p><span class="marginnote">'),
             ('</margin-note>','</span><p>'),
             ('<side-note>','<span class="marginnote">'),
             ('</side-note>','</span>'),
             ('<ol.*?>','<div class = "list-container"><ol>'),
             ('</ol>','</ol></div>'),
             ('<ul.*?>','<div class = "list-container"><ul>'),
             ('</ul>','</ul></div>')
             ]

#Make substitutions
glass_eye_string = ""
with open(path + pandoc_html) as markdown:

    for line in markdown:
        for s in sub_pairs:
            line = re.sub(s[0],s[1], line)
        glass_eye_string = glass_eye_string + line

#Remove all paragraph tags in margin notes
#TBC

#

#Write to file with header and footer from template
with open(path + tufte_template, "r") as template:
    with open(path + glasseye, "w") as glasseye_file:
        for line in template:
            if '<div id = "tufte_container">' in line:
                glasseye_file.write('<div id = "tufte_container">')
                glasseye_file.write(glass_eye_string)
            else:
                glasseye_file.write(line)

            #If line begins with line chart tag then replace with div and add code to javascript block to be appended