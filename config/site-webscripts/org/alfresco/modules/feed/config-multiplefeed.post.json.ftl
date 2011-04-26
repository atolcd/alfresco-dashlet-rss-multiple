<#--
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
-->

<#import "/org/alfresco/utils/multiplefeed.utils.ftl" as feedLib/>
<#assign rssItems>
   <#if items?exists>
      <#list items?sort_by("date")?reverse as item>
         <@feedLib.renderItem item=item target=target first=(item_index == 0)/>
      </#list>
   </#if>
</#assign>

<#escape x as jsonUtils.encodeJSONString(x)>
{
   "feeds": "${feeds!'[]'}",
   "target": "${target!''}",
   "title": "${title!''}",
   "content": "${rssItems?replace('"', '\"')}"
}
</#escape>