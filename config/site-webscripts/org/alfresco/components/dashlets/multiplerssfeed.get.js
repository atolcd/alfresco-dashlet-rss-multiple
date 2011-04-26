<import resource="classpath:alfresco/site-webscripts/org/alfresco/utils/multiplefeed.utils.js">

/*
 * Copyright (C) 2011 Atol Conseils et Développements.
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
 * Main entry point for the webscript
 */
function main() {
  model.items = [];
  model.title = args.title || "";
  model.feeds = args.feeds || "[]";
  model.target = args.target || "_blank";

  var urls = decodeURIComponent(args.feeds);
  var data = eval(urls);
  if (data && data.length > 0) {
    var i, ii;
    for (i=0, ii=data.length ; i<ii ; i++) {
      var feedProps = data[i];

      var feed = getRSSFeed(getValidRSSUri(feedProps.url), feedProps.limit, feedProps.color);
      if (!feed.error) {
        model.items = model.items.concat(feed.items || []);
      }
    }
  }

  var userIsSiteManager = true, site = "";
  try {
    site = args.site ? args.site : page.url.templateArgs.site;
  }
  catch(e) {}

  // Check whether we are within the context of a site
  if (site && site != "") {
    // If we are, call the repository to see if the user is site manager or not
    userIsSiteManager = false;
    var obj = context.properties["memberships"];
    if (!obj) {
      var json = remote.call("/api/sites/" + site + "/memberships/" + encodeURIComponent(user.name));
      if (json.status == 200) {
        obj = eval('(' + json + ')');
      }
    }
    if (obj) {
      userIsSiteManager = (obj.role == "SiteManager");
    }
  }
  model.userIsSiteManager = userIsSiteManager;
}

/**
 * Start webscript
 */
main();