/* ---------------------------------------------------------------------------
* Base: Sitemap extractor (Google sheets)
*
* @desc    Extracts urls from XML sitemap index or sitemap files
* @author  Dave Sottimano @dsottimano Twitter
* @license MIT (http://www.opensource.org/licenses/mit-license.php)
* @version 1.0
* -------------------------------------------------------------------------*/

/* ---------------------------------------------------------------------------
* Fork: Sitemap extractor (Google Apps Script)
*
* @desc    Recursively returns all locs of url elements starting from sitemap
* file or from sitemap index file and writes the results to a Google Sheet.
* @author  RicSti @ric_sti Twitter
* @version 1.0
* -------------------------------------------------------------------------*/

function main(){
  
  /*
  * Sets start and export file urls, prepares cache arrays and calls sub-functions.
  *
  * @param {"https://docs.google.com/spreadsheets/d/..."} exportSheetUrl REQUIRED  The URL of the Google Sheet to export to
  * @param {"https://www.yourdomain.com/sitemap.xml" | "https://www.yourdomain.com/sitemap-index.xml"} startUrl REQUIRED The url of the sitemap or the sitemap index file
  */
 
  let exportSheetUrl = ''; // https://docs.google.com/spreadsheets/d/...'
  let startUrl = ''; // 'https://www.yourwebsite.com/sitemap.xml'  | "https://www.yourdomain.com/sitemap-index.xml"

  var exportSheet = SpreadsheetApp.openByUrl(exportSheetUrl);
  var sitemapsTemp = [];
  var sitemapsBatch = [];
  var contentsBatch = [];
  var urlsBatch = [];

  // Clear existing content in exportSheet
  if ( exportSheet.getLastRow() ) { exportSheet.getRange("A1:A" + exportSheet.getLastRow()).clear(); }

  // Write header to exportSheet
  exportSheet.getRange('A1:B1').setValues([["Page URL","Custom Label"]]);

  // Start with url of sitemap or sitemap index file
  sitemapsTemp.push(startUrl);
  sitemapsBatch.push(startUrl);

  // Recursively return all sitemap urls and write them to temp sitemaps array
  Logger.log("adding sitemap urls to batch...");
  while (sitemapsTemp.length > 0){
    var results = fetchSitemaps(sitemapsTemp[0]);
    for (i=0;i<results.length;i++){ sitemapsTemp.push(results[i]); sitemapsBatch.push(results[i]); }
    sitemapsTemp.shift();
  }
  Logger.log(sitemapsBatch.length + " sitemaps added to sitemaps batch.");

  // Retrieve the XML content of all sitemaps previously saved in temp sitemaps array
  Logger.log("reading/saving sitemaps as XML to contents batch...");
  for (i=0;i<sitemapsBatch.length;i++) {
    contentsBatch.push([fetchXml(sitemapsBatch[i])]);    
  }
  Logger.log(contentsBatch.length + " XML contents added to content batch.");

  // Extract all urls (locs) from all cached sitemap contents
  Logger.log("extracting urls (locs) from sitemap contents...");
  for (i=0;i<contentsBatch.length;i++) {
    var results = extractLocsFromXml(contentsBatch[i]);
    for (j=0;j<results.length;j++){ urlsBatch.push(results[j]); }   
  }
  Logger.log(urlsBatch.length + " urls (locs) extracted from sitemap contents.");

  // Finally write all extracted urls (locs) to exportSheet
  Logger.log("writing urls to sheet...");
  var range = exportSheet.getRange('A2:A'+(urlsBatch.length+1));
  range.setValues(urlsBatch);

  Logger.log("Extraction complete. Go to file: " + exportSheetUrl);
}

function fetchSitemaps(url) {

  /*
  * Processes sitemap elements only
  * @return Returns sitemap URLs from sitemap index files
  */

  var urlFetchOptions = {
      "muteHttpExceptions": true,      
      "followRedirects": true
  };
  try {
    var xml = UrlFetchApp.fetch(url,urlFetchOptions);
    var document = XmlService.parse(xml.getContentText());
    var root = document.getRootElement()
    var namespace = root.getNamespace().getURI()
    var sitemapNameSpace = XmlService.getNamespace(namespace);
    var items = [];
    var sitemaps = [];
    if ( !root.getChildren('url',sitemapNameSpace)[0] ) {
      // process only sitemaps
      items = root.getChildren('sitemap', sitemapNameSpace)
      for (var i = 0; i < items.length; i++) {
        sitemaps.push([items[i].getChild('loc', sitemapNameSpace).getText()]) 
      }
    }
    return(sitemaps);
  } catch (e) {
    console.log(e)
    if (e.toString().includes("The markup in the document preceding the root element must be well-formed")) return "Parsing error: is this a valid XML sitemap?";
    return e.toString() 
  }
}

function fetchXml(url) {

  /*
  * Pre-fetches the XML data from all cached sitemap urls to speed up the following extracting process
  */

  var urlFetchOptions = {
      "muteHttpExceptions": true,      
      "followRedirects": true
  };
  try {
    var xml = UrlFetchApp.fetch(url,urlFetchOptions);
    return xml;
  } catch (e) {
    console.log(e)
    return e.toString() 
  }
}

function extractLocsFromXml(xml){

  /*
  * Processes url elements only
  * @return Returns url locs from cached sitemap XML contents
  */

  try {
    var document = XmlService.parse(xml);
    var root = document.getRootElement()
    var namespace = root.getNamespace().getURI()
    var sitemapNameSpace = XmlService.getNamespace(namespace);
    var items = [];
    var locs = []
    if ( root.getChildren('url',sitemapNameSpace)[0] ) {
      // process only page urls
      items = root.getChildren('url', sitemapNameSpace);
      for (var i = 0; i < items.length; i++) {
        locs.push([items[i].getChild('loc', sitemapNameSpace).getText()]) 
      }
    }
    return locs;
  } catch (e) {
    console.log(e)
    if (e.toString().includes("The markup in the document preceding the root element must be well-formed")) return "Parsing error: is this a valid XML sitemap?";
    return e.toString() 
  }
}