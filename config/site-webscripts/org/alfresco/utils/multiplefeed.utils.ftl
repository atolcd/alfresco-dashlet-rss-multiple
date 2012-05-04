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

<#macro renderItem item target="_self" first=false>
<div class="headline" style="border-left: 2px solid ${item.color}; margin:<#if first>0<#else>15px</#if> 0 15px 5px; padding-left: 5px;">
  <#if item.image??>
     <img align="left" src="${item.image}" alt="" style="padding-right:10px"/>
  </#if>
     <h4 style="padding-top: 2px;">
        <#if (item.link?exists)>
        <a href="${item.link}" target="${target}" class="theme-color-1">${item.title}</a>
        <#else>
        ${item.title}
        </#if>
     </h4>
    <#if item.date?has_content>
      <p class="rss-date">
      <#if item.date?date?string("dd-MM-yyyy") == date?date?string("dd-MM-yyyy")>
        ${item.date?datetime?string(msg("label.dashlet.multiplerssfeed.pub-date.full"))?capitalize}
      <#else>
        ${item.date?date?string(msg("label.dashlet.multiplerssfeed.pub-date.short"))?capitalize}
      </#if>
      </p>
    </#if>
     <p>${item.description}</p>
  <#if item.attachment??>
     <div><img src="${url.context}/res/images/filetypes32/${item.attachment.type}.gif"/><a href="${item.attachment.url}">${item.attachment.name}</a></div>
  </#if>
</div>
</#macro>
