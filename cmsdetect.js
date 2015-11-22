// REQUIRE
// ------------------------------------
var casper = require('casper').create({
  pageSettings: {
    loadImages: false,
    loadPlugins: false
  }
});
var fs = require('fs');


// VARS
// ------------------------------------
var sourcePath = "sites.txt";
var links = [];
var cms = [];
var resultsCsv = fs.touch('results.csv', 'r');


// APP
// ------------------------------------

// Setup the links array
readList();

// Init casper
casper.start();

// Loop on each link of the links array
// Find if the meta tag generator exists, otherwise try to find it on spip log page
casper.start().each(links, function(self, link) {
  self.thenOpen(link, function(response) {
    var cmsdetect = this.getElementAttribute('meta[name="generator"]', 'content');
    if (cmsdetect === null) {
      self.thenOpen(link + "/spip.php?page=login&url=%2Fecrire%2F", function(response) {
        var spipdetect = this.getElementAttribute('meta[name="generator"]', 'content');
        writeResults(link + "; " + spipdetect.replace(";", " "));
        console.log(link + " : " + spipdetect.replace(";", " "));
      });
    } else {
      writeResults(link + "; " + cmsdetect.replace(";", " "));
      console.log(link + " : " + cmsdetect.replace(";", " "));
    }
  });
});

// Launch casper
casper.run();


// FUNCTIONS
// ------------------------------------

// READ LIST
// Read all websites in a csv file and add it to the links array
// Add http:// if doesn't exist
// -------------
function readList() {
  var stream = fs.open(sourcePath, 'r');
  var line = stream.readLine();
  var patt = new RegExp("/^http:\/\//");
  var i = 0;
  while(line) {
    var headUrl = !patt.test(line) ? "http://" : "";
    links[i] = headUrl + line;
    line = stream.readLine();
  	i++;
  }
  stream.close();
}

// WRITE RESULTS
// Write all the result within the results array
// -------------
function writeResults(data) {
  var stream = fs.open('results.csv','aw');
  stream.writeLine(data);
  stream.flush();
  stream.close();
}
