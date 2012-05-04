<#--
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
-->

<#import "/org/alfresco/utils/multiplefeed.utils.ftl" as feedLib/>

<#assign id = args.htmlid>
<#assign jsid = args.htmlid?js_string>
<script type="text/javascript">//<![CDATA[
(function()
{
   var rssFeed = new Alfresco.dashlet.MultipleRssFeed("${jsid}").setOptions(
   {
      "componentId": "${instance.object.id}",
      "target": "${target!''}",
      "title": "<#if title?has_content>${title}<#else>${msg("label.dashlet.multiplerssfeed.default.title")}</#if>",
      "feeds": "${feeds!"[]"}",
      "site": "${page.url.templateArgs.site!''}"
   });

   new Alfresco.widget.DashletResizer("${jsid}", "${instance.object.id}");

   var refreshDashletEvent = new YAHOO.util.CustomEvent("refreshDashletClick");
   refreshDashletEvent.subscribe(rssFeed.onRefresh, rssFeed, true);

   var rssFeedDashletEvent = new YAHOO.util.CustomEvent("onConfigFeedClick");
   rssFeedDashletEvent.subscribe(rssFeed.onConfigFeedClick, rssFeed, true);

   new Alfresco.widget.DashletTitleBarActions("${jsid}").setOptions(
   {
      actions:
      [
        <#if userIsSiteManager>
         {
            cssClass: "edit",
            eventOnClick: rssFeedDashletEvent,
            tooltip: "${msg("dashlet.edit.tooltip")?js_string}"
         },
        </#if>
         {
            cssClass: "refresh",
            id: "-refresh",
            eventOnClick: refreshDashletEvent,
            tooltip: "${msg("label.dashlet.refresh.tooltip")?js_string}"
         }
      ]
   });
})();
//]]>
</script>

<div class="dashlet rssfeed">
  <div class="title" id="${jsid}-title"><#if title?has_content>${title}<#else>${msg("label.dashlet.multiplerssfeed.default.title")}</#if></div>
  <div class="body scrollableList" <#if args.height??>style="height: ${args.height}px;"</#if> id="${jsid}-scrollableList">
    <#if items?? && items?size &gt; 0>
      <#list items?sort_by("date")?reverse as item>
        <@feedLib.renderItem item=item target=target first=(item_index == 0)/>
      </#list>
    <#elseif !error?exists>
      <div class="detail-list-item first-item last-item">
        <span>${msg("label.dashlet.multiplerssfeed.noItems")}</span>
      </div>
    </#if>
  </div>
</div>