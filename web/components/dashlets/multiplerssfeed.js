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
 * Alfresco.dashlet.MultipleRssFeed
 *
 * Aggregates events from all the sites the user belongs to.
 * For use on the user's dashboard.
 *
 */
(function () {
  /**
   * YUI Library aliases
   */
  var Dom = YAHOO.util.Dom,
      Event = YAHOO.util.Event;

  /**
   * MultipleRssFeed constructor.
   *
   * @param {String} htmlId The HTML id of the parent element
   * @return {Alfresco.dashlet.MultipleRssFeed} The new MultipleRssFeed instance
   * @constructor
   */
  Alfresco.dashlet.MultipleRssFeed = function MultipleRssFeed_constructor(htmlId) {
    Alfresco.dashlet.MultipleRssFeed.superclass.constructor.call(this, "Alfresco.dashlet.MultipleRssFeed", htmlId);

    this.configDialog = null;
    this.deleteRowContextMenu = null;

    return this;
  };

  YAHOO.extend(Alfresco.dashlet.MultipleRssFeed, Alfresco.component.Base, {
    /**
     * Object container for initialization options
     *
     * @property options
     * @type object
     */
    options: {
      /**
       * The component id
       *
       * @property componentId
       * @type string
       * @default ""
       */
      componentId: "",

      /**
       * The feeds to display
       *
       * @property feeds
       * @type string
       * @default ""
       */
      feeds: "[]",

      /**
       * The target feed link type
       *
       * @property target
       * @type string
       * @default ""
       */
      target: "_blank",

      /**
       * The dashlet title
       *
       * @property title
       * @type string
       * @default ""
       */
      title: Alfresco.util.message("label.dashlet.multiplerssfeed.default.title"),

      /**
       * The site Id
       *
       * @property site
       * @type string
       * @default ""
       */
      site: "",

      /**
       * The default feed data
       *
       * @property defaultData
       * @type string
       * @default ""
       */
      defaultData: {
        url: "http://",
        limit: 10,
        color: "#FFFFFF"
      }
    },

    /**
     * Fired by YUI when parent element is available for scripting.
     * Component initialisation, including instantiation of YUI widgets and event listener binding.
     *
     * @method onReady
     */
    onReady: function MRF_onReady() {
      // Add click handler to config feed link that will be visible if user is site manager.
      var configFeedLink = Dom.get(this.id + "-configFeed-link");
      if (configFeedLink) {
        Event.addListener(configFeedLink, "click", this.onConfigFeedClick, this, true);
      }

      // Add click handler to refresh icon
      Event.addListener(this.id + "-refresh", "click", this.onRefresh, this, true);

      // Custom event
      this.onDataTableChangeEvent = new YAHOO.util.CustomEvent("onDataTableChangeEvent", this);
      this.onDataTableChangeEvent.subscribe(this.onDataTableChange, this);
    },


    /**
     * @method onConfigFeedClick
     * @param e The click event
     */
    displayFeedsDataTable: function MRF_displayFeedsDataTable() {
      var me = this;

      /** URL validator **/
      var urlValidator = function (data) {
        var expression = /(ftp|http|https):\/\/[\w\-_]+(\.[\w\-_]+)*([\w\-\.,@?\^=%&:\/~\+#]*[\w\-\@?\^=%&\/~\+#])?/,
            valid = true;

        // Check an empty string replacement returns an empty string
        var pattern = new RegExp(expression);
        valid = data.replace(pattern, "") === "";

        return valid ? data : undefined;
      };


      // Color cell formatter
      var colorFormatter = function (elLiner, oRecord, oColumn, oData) {
        elLiner.innerHTML = '<div class="feed-color-icon-container"><span style="background-color:' + (oRecord.getData("color") || this.defaultData.color) + ';" class="feed-color-icon">&nbsp;</span></div>';
        elLiner.style.marginLeft = "14px";
      };

      var columnDefs = [
        { key: "url",   label: Alfresco.util.message("label.dashlet.multiplerssfeed.datatable.url"), width: 500, resizeable: true, editor: new YAHOO.widget.TextboxCellEditor({ disableBtns: true, validator: urlValidator }) },
        { key: "limit", label: Alfresco.util.message("label.dashlet.multiplerssfeed.datatable.limit"), className:"rss-cell-center", formatter: YAHOO.widget.DataTable.formatNumber, editor: new YAHOO.widget.TextboxCellEditor({ disableBtns: true, validator: YAHOO.widget.DataTable.validateNumber }) },
        { key: "color", label: Alfresco.util.message("label.dashlet.multiplerssfeed.datatable.color"), formatter: colorFormatter, editor: new YAHOO.widget.ColorCellEditor() }
      ];


      // Retrieve feeds
      var data = [];
      try {
        data = YAHOO.lang.JSON.parse(decodeURIComponent(this.options.feeds));
      }
      catch (e) {}


      var feedsDataSource = new YAHOO.util.DataSource(data);
      feedsDataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
      feedsDataSource.responseSchema = {
        fields: ["url", "limit", "color"]
      };

      this.feedsDataTable = new YAHOO.widget.DataTable(this.configDialog.id + "-datatable", columnDefs, feedsDataSource, {
        caption: Alfresco.util.message("label.dashlet.multiplerssfeed.datatable.caption"),
        MSG_EMPTY: Alfresco.util.message("label.dashlet.multiplerssfeed.datatable.no-reccords")
      });


      // Set up editing flow
      var editCell = function (oArgs) {
        if (me.configDialog) {
          Dom.get(me.configDialog.id + "-feeds").value = encodeURIComponent(me.dataTableToJsonString());
          me.onDataTableChangeEvent.fire();
        }
      };

      this.feedsDataTable.subscribe("cellClickEvent", this.feedsDataTable.onEventShowCellEditor);
      this.feedsDataTable.subscribe("cellUpdateEvent", editCell);
      this.feedsDataTable.subscribe("rowAddEvent", editCell);
      this.feedsDataTable.subscribe("rowDeleteEvent", editCell);



      // Add one row to the bottom
      var btnAddRow = new YAHOO.widget.Button(this.configDialog.id + "-addfeed");
      btnAddRow.on("click", function (args, scope) {
        var record = YAHOO.widget.DataTable._cloneObject(this.options.defaultData);
        this.feedsDataTable.addRow(record);
      }, this, true);



      // Delete Row
      var onContextMenuClick = function (p_sType, p_aArgs, p_dataTable) {
        var task = p_aArgs[1];
        if (task) {
          // Extract which TR element triggered the context menu
          var elRow = this.contextEventTarget;
          elRow = p_dataTable.getTrEl(elRow);

          if (elRow) {
            switch (task.index) {
            case 0:
              // Delete row upon confirmation
              var oRecord = p_dataTable.getRecord(elRow);
              if (confirm(Alfresco.util.message("label.dashlet.multiplerssfeed.datatable.delete.confirm", null, oRecord.getData("url")))) {
                p_dataTable.deleteRow(elRow);
              }
              break;
            }
          }
        }
      };

      if (this.deleteRowContextMenu) {
        this.deleteRowContextMenu.destroy();
      }

      this.deleteRowContextMenu = new YAHOO.widget.ContextMenu(this.configDialog.id + "-deleteRowContextMenu", {
        trigger: this.feedsDataTable.getTbodyEl()
      });
      this.deleteRowContextMenu.addItem(Alfresco.util.message("label.dashlet.multiplerssfeed.datatable.delete-item"));

      // Render the ContextMenu instance to the parent container of the DataTable
      this.deleteRowContextMenu.render(this.configDialog.id + "-contextMenuContainer");
      this.deleteRowContextMenu.clickEvent.subscribe(onContextMenuClick, this.feedsDataTable);


      /*******************************/
      /** DATATABLE EDITION BUG FIX **/
      /*******************************/
      YAHOO.widget.BaseCellEditor.prototype.move = function () {
        // Move Editor
        var elContainer = this.getContainerEl(),
            elTd = this.getTdEl();

        Dom.setStyle(elContainer, 'display', '');
        Dom.setXY(elContainer, Dom.getXY(elTd));
      };

      YAHOO.util.Dom.getElementsByClassName('yui-dt-editor', 'div', document.body, function (el) {
        me.feedsDataTable.getTableEl().parentNode.appendChild(el);
      });
      /*******************************/
    },


    /**
     * Called when the user clicks the config rss feed link.
     * Will open a rss config dialog
     *
     * @method onConfigFeedClick
     * @param e The click event
     */
    onConfigFeedClick: function MRF_onConfigFeedClick(e) {
      Event.stopEvent(e);

      var actionUrl = Alfresco.constants.URL_SERVICECONTEXT + "modules/multiplefeed/config/" + encodeURIComponent(this.options.componentId);

      this.configDialog = new Alfresco.module.SimpleDialog(this.id + "-configDialog").setOptions({
        width: "700px",
        templateUrl: Alfresco.constants.URL_SERVICECONTEXT + "modules/multiplefeed/config",
        onSuccess: {
          fn: function MultipleRssFeed_onConfigFeed_callback(response) {
            var rss = response.json;

            // Save feeds for new config dialog openings
            this.options.feeds = (rss && rss.feeds) ? rss.feeds : this.options.feeds;

            // Update title and items are with new rss
            this.options.title = (rss && rss.title && rss.title !== "") ? rss.title : this.options.title;
            this.options.target = (rss && rss.target) ? rss.target : this.options.target;


            // Only refresh textContent
            Dom.get(this.id + "-title").innerHTML = rss ? rss.title : "";

            Dom.get(this.id + "-scrollableList").innerHTML = rss ? rss.content : "";
          },
          scope: this
        },
        doSetupFormsValidation: {
          fn: function MultipleRssFeed_doSetupForm_callback(form) {
            this.displayFeedsDataTable();
            if (this.configDialog) {
              Dom.get(this.configDialog.id + "-feeds").value = encodeURIComponent(this.dataTableToJsonString());
            }

            form.addValidation(this.configDialog.id + "-title", Alfresco.forms.validation.mandatory, null, "keyup");


            // Datatable cannot be empty
            var fnValidateDataTable = function (field, args, event, form, silent, message) {
              return (args.getRecordSet().getRecords().length !== 0);
            };
            form.addValidation(this.configDialog.id + "-feeds", fnValidateDataTable, this.feedsDataTable, null);


            Dom.get(this.configDialog.id + "-title").value = this.options.title;
            Dom.get(this.configDialog.id + "-new_window").checked = this.options.target === "_blank";
          },
          scope: this
        },
        actionUrl: actionUrl,
        destroyOnHide: true
      }).show();
    },


    /**
     * Event handler for refresh click
     * @method onRefresh
     * @param e {object} Event
     */
    onRefresh: function MRF_onRefresh(e)
    {
      if (e) {
        // Stop browser's default click behaviour for the link
        Event.preventDefault(e);
      }

      Dom.replaceClass(this.id + "-refresh", "refresh", "refresh-loading");
      Alfresco.util.Ajax.jsonRequest(
      {
        url: Alfresco.constants.URL_SERVICECONTEXT + "components/dashlets/multiplerssfeed",
        method: "GET",
        dataObj:
        {
          title: this.options.title,
          feeds: this.options.feeds,
          target: this.options.target,
          site: this.options.site,
          format: "json"
        },
        successCallback:
        {
          fn: function onSuccess(res, scope) {
            var data = eval('(' + res.serverResponse.responseText + ')');
            if (data && data.content) {
              Dom.get(this.id + "-scrollableList").innerHTML = data.content;
            }
            Dom.replaceClass(this.id + "-refresh", "refresh-loading", "refresh");
          },
          scope: this
        },
        failureCallback:
        {
          fn: function onFailure(res, scope) {
            Dom.replaceClass(this.id + "-refresh", "refresh-loading", "refresh");
          },
          scope: this
        }
      });
    },


    onDataTableChange: function MRF_onDataTableChange(e, args, t) {
      if (this.configDialog && this.feedsDataTable) {
        if (Dom.get(this.configDialog.id + "-title").value !== "") {
          this.configDialog.form.submitElements[0].set("disabled", (this.feedsDataTable.getRecordSet().getRecords().length === 0));
        }
      }
    },


    dataTableToJsonString: function MRF_dataTableToJsonString() {
      var str = [];

      if (this.feedsDataTable) {
        var i, records = this.feedsDataTable.getRecordSet().getRecords();
        for (i = 0; i < records.length; i++) {
          var j, o = {}, keys = this.feedsDataTable.getColumnSet().keys;
          for (j = 0; j < keys.length; j++) {
            key = keys[j].getKey();
            o[key] = records[i].getData(key);
          }
          str.push(o);
        }
      }

      return YAHOO.lang.JSON.stringify(str);
    }
  });
})();