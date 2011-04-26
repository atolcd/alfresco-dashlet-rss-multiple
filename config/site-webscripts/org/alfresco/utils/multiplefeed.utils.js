/*
 * Copyright (C) 2011 Atol Conseils et D�veloppements.
 * http://www.atolcd.com/
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */


/**
 * Controls how many items are displayed at any one time in the RSS dashlet.
 * Defaults to a large number, the theory being is that you aren't going to get 9999 items
 * in any RSS feed.
 */
const DISPLAY_ITEMS = 999;

/**
 * Function to return a URI with a valid http protocol prefix if it does not already have one
 */
function getValidRSSUri(uri)
{
   var re = /^(http|https):\/\//;
   if (!re.test(uri))
   {
      uri = "http://" + uri;
   }
   return uri;
}

/**
 * Takes a URL of an RSS feed and returns an rss object
 * with title and an array of items in the feed.
 *
 * @param uri {String} the uri of the RSS feed (previously passed through getValidRSSUri())
 */
function getRSSFeed(uri, limit, color)
{
   limit = limit || DISPLAY_ITEMS;

   // We only handle "http" connections for the time being
   var connector = remote.connect("http");
   var result = connector.call(uri);

   if (result !== null && result.status == 200)
   {
      var rssXml = new String(result),
         rss;

      // Prepare string for E4X
      rssXml = prepareForE4X(rssXml);

      // Find out what type of feed
      try
      {
         rss = new XML(rssXml);
         if (rss.name().localName.toLowerCase() == "rss")
         {
             return parseRssFeed(rss, rssXml, limit, color);
         }
         else if(rss.name().localName.toLowerCase() == "feed")
         {
             return parseAtomFeed(rss, rssXml, limit, color);
         }
      }
      catch (e)
      {
         return {
            error: "bad_data"
         };
      }
   }
   else
   {
      return {
         error: "unavailable"
      };
   }
}

/**
 * Takes am xml string and prepares it for E4X.
 *
 * Removes all comments and instructions and trims the string
 *
 * @param xmlStr {string} An string representing an xml document
 * @return {string} An E4X compatible string
 */
function prepareForE4X(xmlStr)
{
   // NOTE: we use the Java regex features here - as the Rhino impl of regex is x100's slower!!
   var str = new java.lang.String(xmlStr);
   return new String(str.replaceAll("(<\\?.*?\\?>)|(<!--.*?-->)", "").replaceAll("^[^<]*", "").replaceAll("[^>]*$", ""));
}

/**
 * Takes a rss feed string and returns feed object
 *
 * @param rss {XML} represents an Rss feed
 * @param rssStr {String} represents an Rss feed
 * @param limit {int} The maximum number of items to display
 * @return {object} A feed object with title and items with malicious html code removed
 */
function parseRssFeed(rss, rssStr, limit, color)
{
   /**
    * We do this (dynamically) as some feeds, e.g. the BBC, leave the trailing slash
    * off the end of the Yahoo Media namespace! Technically this is wrong but what to do.
    */
   var mediaRe = /xmlns\:media="([^"]+)"/;
   var hasMediaExtension = mediaRe.test(rssStr);

   if (hasMediaExtension)
   {
      var result = mediaRe.exec(rssStr);
      // The default (correct) namespace should be 'http://search.yahoo.com/mrss/'
      var media = new Namespace( result[1] );
      var fileext = /([^\/]+)$/;
   }

   var items = [],
      item,
      obj,
      count = 0;
   for each (item in rss.channel..item)
   {
      if (count >= limit)
      {
         break;
      }

      obj =
      {
         "title": stringUtils.stripUnsafeHTML(item.title.toString()),
         "description": stringUtils.stripUnsafeHTML(item.description.toString() || ""),
         "link": stringUtils.stripUnsafeHTML(item.link.toString()),
         "color": color
      };

      // Retrieve RSS date
      if (item.pubDate) {
        var dateStr = stringUtils.stripUnsafeHTML(item.pubDate.toString());
        try {
          var date = new Date(formatRssFeedDate(dateStr));
          obj.date = date;
        }
        catch(e){}
      }


      if (hasMediaExtension)
      {
         // We only look for the thumbnail as a direct child in RSS
         var thumbnail = item.media::thumbnail;
         if (thumbnail && thumbnail.@url.toString())
         {
            obj["image"] = stringUtils.stripUnsafeHTML(thumbnail.@url.toString());
         }

         var attachment = item.media::content;
         if (attachment)
         {
            var contenturl = attachment.@url.toString();
            if (contenturl.length > 0)
            {
               var filename = fileext.exec(contenturl)[0];
               // Use the file extension to figure out what type it is for now
               var ext = filename.split(".");

               obj["attachment"] =
               {
                  "url": stringUtils.stripUnsafeHTML(contenturl),
                  "name": stringUtils.stripUnsafeHTML(filename),
                  "type": stringUtils.stripUnsafeHTML((ext[1] ? ext[1] : "_default"))
               };
            }
         }
      }

      items.push(obj);
      ++count;
   }

   return {
      title: stringUtils.stripUnsafeHTML(rss.channel.title.toString()),
      items: items
   };
}

/**
 * Takes an atom feed and returns an array of entries.
 *
 * @param atom {XML} represents an Atom feed
 * @param atomStr {String} represents an Atom feed
 * @param limit {int} The maximum number of items to display
 * @return {object} A feed object with title and items with malicious html code removed
 */
function parseAtomFeed(atom, atomStr, limit, color)
{
   // Recreate the xml with default namespace
   default xml namespace = new Namespace("http://www.w3.org/2005/Atom");
   atom = new XML(atomStr);

   // Do we have the media extensions such as thumbnails?
   var mediaRe = /xmlns\:media="([^"]+)"/;
   var hasMediaExtension = mediaRe.test(atomStr);
   if(hasMediaExtension)
   {
      var media = new Namespace("http://search.yahoo.com/mrss/");
   }

   var items = [],
      entry,
      link,
      obj,
      count = 0;
   for each (entry in atom.entry)
   {
      if (count >= limit)
      {
         break;
      }

      obj = {
         "title": stringUtils.stripUnsafeHTML(entry.title.toString()),
         "description": stringUtils.stripUnsafeHTML(entry.summary.toString().replace(/(target=)/g, "rel=")),
         "link": entry.link[0] ? stringUtils.stripUnsafeHTML(entry.link[0].@href.toString()) : null,
         "color": color
      };


      // Retrieve Atom date
      var dateStr = "";
      if (stringUtils.stripUnsafeHTML(entry.published.toString()) != "") {
        dateStr =  stringUtils.stripUnsafeHTML(entry.published.toString());
      }
      else if (stringUtils.stripUnsafeHTML(entry.updated.toString()) != "") {
        dateStr =  stringUtils.stripUnsafeHTML(entry.updated.toString());
      }

      try {
        obj.date = getDatefromISO8601(dateStr);
      }
      catch(e){}

      if (hasMediaExtension)
      {
         // In Atom, it could be a direct child
         var thumbnail = entry.media::thumbnail;
         if (thumbnail && thumbnail.@url.toString())
         {
            obj["image"] = stringUtils.stripUnsafeHTML(thumbnail.@url.toString());
         }
         else
         {
            // If not, it could be attached to one of the link tags,
            //  typically a <link rel="alternate">
            var found = false;
            for each (link in entry.link)
            {
               var rel = link.@rel.toString();
               if(! found && (!rel || rel == "alternate"))
               {
                  // Thumbnail can be on the link, or inside a media:content
                  thumbnail = link.media::thumbnail;
                  if (!thumbnail || !thumbnail.@url.toString())
                  {
                     thumbnail = link.media::content.media::thumbnail[0];
                  }

                  if (thumbnail && thumbnail.@url.toString())
                  {
                     found = true;
                     obj["image"] = stringUtils.stripUnsafeHTML(thumbnail.@url.toString());
                  }
               }
            }
         }
      }

      items.push(obj);

      ++count;
   }

   return {
      title: stringUtils.stripUnsafeHTML(atom.title.toString()),
      items: items
   };
}


function formatRssFeedDate(dateStr) {
  return dateStr.replace("CET",  "+0100")
                .replace("BST",  "+0100")
                .replace("IST",  "+0100")
                .replace("CEST", "+0200")
                .replace("EET",  "+0200")
                .replace("EEST", "+0300")
                .replace("MSK",  "+0300")
                .replace("KUYT", "+0400")
                .replace("MSD",  "+0400")
                .replace("SAMT", "+0400")
                .replace("WEST", "+0400")
                .replace("EST",  "-0500");
}


function getDatefromISO8601(formattedString)
{
   var isoRegExp = /^(?:(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?)?(?:T(\d{2}):(\d{2})(?::(\d{2})(.\d+)?)?((?:[+-](\d{2}):(\d{2}))|Z)?)?$/;

   var match = isoRegExp.exec(formattedString);
   var result = null;

   if (match)
   {
      match.shift();
      if (match[1]){match[1]--;} // Javascript Date months are 0-based
      if (match[6]){match[6] *= 1000;} // Javascript Date expects fractional seconds as milliseconds

      result = new Date(match[0]||1970, match[1]||0, match[2]||1, match[3]||0, match[4]||0, match[5]||0, match[6]||0);

      var offset = 0;
      var zoneSign = match[7] && match[7].charAt(0);
      if (zoneSign != 'Z')
      {
         offset = ((match[8] || 0) * 60) + (Number(match[9]) || 0);
         if (zoneSign != '-')
         {
            offset *= -1;
         }
      }
      if (zoneSign)
      {
         offset -= result.getTimezoneOffset();
      }
      if (offset)
      {
         result.setTime(result.getTime() + offset * 60000);
      }
   }

   return result; // Date or null
}