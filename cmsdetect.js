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

    // If there is something on the url, search for any meta generator on both
    // landing page and spip admin if nothing found on first page
    if (response.status !== null) {

      // Get the meta generator
      var cmsdetect = getMeta(this);

      // If there isn't any meta, try the spip admin page
      // Find if the meta exists, and write the response to the results.csv
      if (cmsdetect === null) {
        self.thenOpen(link + "/spip.php?page=login&url=%2Fecrire%2F", function(response) {
          // Get the meta generator
          var spipdetect = getMeta(this);
          // Results
          writeResults(link + "; " + spipdetect);
          console.log(link + " : " + spipdetect);
        });
      } else {
        writeResults(link + "; " + cmsdetect);
        console.log(link + " : " + cmsdetect);
      }
    // 404 Error
    } else if (response.status === 404) {
      writeResults(link + "; 404");
      console.log(link + " : 404");
    // 500 Error
    } else if (response.status === 500) {
      writeResults(link + "; 500");
      console.log(link + " : 500");
    // Unknown host
    } else {
      writeResults(link + "; Unknown host");
      console.log(link + " : Unknown host");
    }

  });
});

// Launch casper
casper.run();


// FUNCTIONS
// ------------------------------------

// GET META
// Return the meta generator content
// -------------
function getMeta(that) {
  var metaContent = that.getElementAttribute('meta[name="generator"]', 'content');
  return metaContent !== null ? metaContent.replace(";", " ") : metaContent;
}

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
