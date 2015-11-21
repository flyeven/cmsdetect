# cms detect
Retrieve meta "generator" to get cms name and its version


## Requirements
Make sure you have installed
  * [phantomjs](http://phantomjs.org/)
  * [casperjs](http://casperjs.org/)


## Use
Take a file of domains in entry, ex:
```
http://domainname.com
domainname.fr
```
*don't forget to set the `sourcePath` var in `cmsdetect.js`*

It returns a csv with meta's generator content, ex:
```
http://domainname.com; null
http://domainname.fr; WordPress 4.0.8
```


## Run
  * `casperjs cmsdetect.js`
