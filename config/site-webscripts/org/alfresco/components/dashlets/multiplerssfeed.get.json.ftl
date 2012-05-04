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

<#assign rssItems>
  <#if items?? && items?size &gt; 0>
    <#list items?sort_by("date")?reverse as item>
      <@feedLib.renderItem item=item target=target first=(item_index == 0)/>
    </#list>
  <#elseif !error?exists>
    <div class="detail-list-item first-item last-item">
      <span>${msg("label.dashlet.multiplerssfeed.noItems")}</span>
    </div>
  </#if>
</#assign>

<@compress single_line=true>
  <#escape x as jsonUtils.encodeJSONString(x)>
  {
    "content": "${rssItems}"
  }
  </#escape>
</@compress>