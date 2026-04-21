import urllib.request
url='https://unpkg.com/mermaid@10/dist/mermaid.min.js'
out='docs/javascripts/mermaid.min.js'
print('Downloading',url)
resp=urllib.request.urlopen(url)
data=resp.read()
open(out,'wb').write(data)
print('Wrote',out,'size',len(data))
