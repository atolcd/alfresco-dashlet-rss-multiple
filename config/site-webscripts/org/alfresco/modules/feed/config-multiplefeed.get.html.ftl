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

<#assign el=args.htmlid?html>
<div id="${el}-configDialog" class="config-feed">
  <div class="hd">${msg("label.dashlet.multiplerssfeed.header")}</div>
  <div class="bd">
    <div id="${el}-contextMenuContainer"></div>
    <div id="${el}-deleteRowContextMenu"></div>

    <div class="yui-gd add-feed-button-container">
      <span id="${el}-addfeed" class="yui-button yui-push-button add-feed-button">
        <span class="first-child">
          <button type="button">${msg("label.dashlet.multiplerssfeed.addFeed")}</button>
        </span>
      </span>
    </div>

    <form id="${el}-form" action="" method="POST">
      <div class="yui-gd">
        <div class="rss-datatable-container">
          <input id="${el}-feeds" name="feeds" type="hidden">
          <div id="${el}-datatable"></div>
        </div>
      </div>

      <div class="rss-gd">
        <label for="${el}-title">${msg("label.dashlet.multiplerssfeed.title")}</label>
        <input id="${el}-title" type="text" name="title" value="" maxlength="2048" size="50" />&nbsp;*
      </div>
      <div class="rss-gd">
        <label for="${el}-new_window">${msg("label.dashlet.multiplerssfeed.newWindow")}</label>
        <input type="checkbox" id="${el}-new_window" name="new_window" />
      </div>

      <div class="bdft">
        <input type="submit" id="${el}-ok" value="${msg('button.ok')}" />
        <input type="button" id="${el}-cancel" value="${msg('button.cancel')}" />
      </div>
    </form>
  </div>
</div>