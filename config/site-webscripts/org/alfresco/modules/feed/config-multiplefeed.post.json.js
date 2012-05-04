<import resource="classpath:alfresco/site-webscripts/org/alfresco/utils/multiplefeed.utils.js">

/*
 * Copyright (C) 2012 Atol Conseils et Développements.
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

model.items = [];

var c = sitedata.getComponent(url.templateArgs.componentId);

// Target
var target = json.isNull("new_window") ? "_self" : "_blank";
model.target = target;
c.properties["target"] = target;

// Dashlet title
var title = String(json.get("title"));
model.title = title;
c.properties["title"] = title;


// Feeds
var feeds = String(json.get("feeds"));
c.properties["feeds"] = feeds;
model.feeds = feeds;

// Retrieve rss items
var urls = decodeURIComponent(feeds);
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

c.save();