<#--
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
-->

<#import "/org/alfresco/utils/multiplefeed.utils.ftl" as feedLib/>

<#assign el=args.htmlid?js_string>
<script type="text/javascript">//<![CDATA[
   new Alfresco.dashlet.MultipleRssFeed("${el}").setOptions(
   {
      "componentId": "${instance.object.id}",
      "target": "${target!''}",
      "title": "<#if title?has_content>${title}<#else>${msg("label.dashlet.multiplerssfeed.default.title")}</#if>",
      "feeds": "${feeds!"[]"}",
      "site": "${page.url.templateArgs.site!''}"
   });
   new Alfresco.widget.DashletResizer("${el}", "${instance.object.id}");
//]]>
</script>

<div class="dashlet rssfeed">
  <div class="refresh" id="${el}-refresh"><a href="#">&nbsp;</a></div>
  <div class="title" style="overflow-x: visible;" id="${el}-title"><#if title?has_content>${title}<#else>${msg("label.dashlet.multiplerssfeed.default.title")}</#if></div>
  <#if userIsSiteManager>
    <div class="toolbar">
      <a href="#" id="${el}-configFeed-link" class="theme-color-1">${msg("label.dashlet.multiplerssfeed.configure")}</a>
    </div>
  </#if>
  <div class="body scrollableList" <#if args.height??>style="height: ${args.height}px;"</#if> id="${el}-scrollableList">
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