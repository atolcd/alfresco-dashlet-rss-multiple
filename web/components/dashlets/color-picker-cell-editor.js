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


(function () {
  var lang = YAHOO.lang,
      util = YAHOO.util,
      widget = YAHOO.widget,
      ua = YAHOO.env.ua,
      Dom = util.Dom,
      Ev = util.Event,
      DT = widget.DataTable;

  var BCE = widget.BaseCellEditor;

  widget.ColorCellEditor = function (oConfigs) {
    this._sId = "yui-colorceditor" + YAHOO.widget.BaseCellEditor._nCount++;
    widget.ColorCellEditor.superclass.constructor.call(this, "color", oConfigs);
  };

  lang.extend(widget.ColorCellEditor, BCE, {
    colorPicker: null,
    disableBtns: true,
    defaultValue: "FFFFFF",

    /**
     * Render a colorPicker.
     *
     * @method renderForm
     */
    renderForm: function () {

    },

    /**
     * After rendering form, if disabledBtns is set to true, then sets up a mechanism
     * to save input without them.
     *
     * @method handleDisabledBtns
     */
    handleDisabledBtns: function () {

    },

    /**
     * Resets ColorCellEditor UI to initial state.
     *
     * @method resetForm
     */
    resetForm: function () {
      // Create new one for each color edition
      if (this.colorPicker) {
        this.colorPicker.destroy();
      }

      var colorContainer = this.getContainerEl().appendChild(document.createElement("div"));
      colorContainer.id = "rss-color-picker-container";
      colorContainer.className = "color-picker-container";

      var colorPicker = new YAHOO.widget.ColorPicker(colorContainer, {
        showcontrols: false,
        images: {
          PICKER_THUMB: Alfresco.constants.URL_CONTEXT + "yui/colorpicker/assets/picker_thumb.png",
          HUE_THUMB: Alfresco.constants.URL_CONTEXT + "yui/colorpicker/assets/hue_thumb.png"
        }
      });

      this.colorPicker = colorPicker;

      if (this.disableBtns) {
        this.handleDisabledBtns();
      }

      var value = lang.isValue(this.value) ? this.value.replace('#', '') : this.defaultValue;
      this.colorPicker.setValue(YAHOO.util.Color.hex2rgb(value), true);
    },

    /**
     * Sets focus in ColorCellEditor.
     *
     * @method focus
     */
    focus: function () {

    },

    /**
     * Retrieves input value from ColorCellEditor.
     *
     * @method getInputValue
     */
    getInputValue: function () {
      return '#' + this.colorPicker.get('hex');
    }

  });

  // Copy static members to ColorCellEditor class
  lang.augmentObject(widget.ColorCellEditor, BCE);
})();