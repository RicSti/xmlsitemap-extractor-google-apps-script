## Description

This Google Apps Script recursively returns all locs of url elements starting from a sitemap file or from a sitemap index file and writes the results to a pre-formatted Google Sheet that can be used as page feed in Google Ads.

This is my very first fork. Feel free to correct or add the information in this README and in the inline comments.

Also I'd be happy for any improvement of my very basic functions. Especially if you find a way to save more execution time. Just as reference: With this script I extracted 620K+ urls from 72 sitemap files in about 23 minutes. 30 minutes is the execution time limit in Google Apps. So this script will probably run into a timeout for bigger website projects with 800K+ indexed urls.

## Functions

<dl>
<dt><a href="#main">main()</a> ⇒</dt>
<dd><p>Sets start and export file urls, prepares cache arrays and calls sub-functions.</p>
</dd>
</dl>
<dl>
<dt><a href="#fetchSitemaps">fetchSitemaps(url)</a> ⇒</dt>
<dd><p>Returns sitemap URLs from sitemap index files. Processes sitemap elements only.</p>
</dd>
</dl>
<dl>
<dt><a href="#fetchXml">fetchXml(url)</a> ⇒</dt>
<dd><p>Pre-fetches the XML data from all cached sitemap urls to speed up the following extracting process.</p>
</dd>
</dl>
<dl>
<dt><a href="#extractLocsFromXml">extractLocsFromXml(xml)</a> ⇒</dt>
<dd><p>Returns url locs from cached sitemap XML contents. Processes url elements only.
</p>
</dd>
</dl>

<a name="main"></a>

## main() ⇒
Sets start and export file urls, prepares cache arrays and calls sub-functions.

### Process steps:

* Clear existing content in exportSheet
* Write header to exportSheet
* Start with url of sitemap or sitemap index file
* Recursively return all sitemap urls and write them to temp sitemaps array
* Retrieve the XML content of all sitemaps previously saved in temp sitemaps array
* Extract all urls (locs) from all cached sitemap contents
* Finally write all extracted urls (locs) to exportSheet

**Kind**: global function
**Customfunction**:

| Param | Type | Description |
| --- | --- | --- |
| exportSheetUrl | <code>"https://docs.google.com/spreadsheets/d/..."</code> | REQUIRED  The URL of the Google Sheet to export to
| startUrl | <code>"https://www.yourdomain.com/sitemap.xml" OR "https://www.yourdomain.com/sitemap-index.xml"</code> |  REQUIRED The url of the sitemap or the sitemap index file

<a name="fetchSitemaps"></a>

## fetchSitemaps(url) ⇒
Returns sitemap URLs from sitemap index files. Processes sitemap elements only.

**Kind**: local variable
**Customfunction**:

| Param | Type | Description |
| --- | --- | --- |
| url | <code>"../sitemap.xml" OR "../sitemap-index.xml </code> | Actually processed sitemap URL provided by main()
| return | <code>Array</code> |  Extracted sitemap URLs

<a name="fetchXml"></a>

## fetchXml(url) ⇒
Pre-fetches the XML data from all cached sitemap urls to speed up the following extracting process.

**Kind**: local variable
**Customfunction**:

| Param | Type | Description |
| --- | --- | --- |
| url | <code>"../sitemap.xml" OR "../sitemap-index.xml </code> | Actually processed sitemap URL provided by main()
| return | <code>Array</code> |  Fetched XML

<a name="extractLocsFromXml"></a>

## extractLocsFromXml(xml) ⇒
Returns url locs from cached sitemap XML contents. Processes url elements only.

**Kind**: local variable
**Customfunction**:

| Param | Type | Description |
| --- | --- | --- |
| xml | <code>"<?xml version...>"</code> | Actually processed sitemap XML content provided by main()
| return | <code>Array</code> |  Extracted urls (locs)
