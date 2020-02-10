import snippet from 'tui-code-snippet';
import Submenu from './submenuBase';
import templateHtml from './template/submenu/crop';

/**
 * Crop ui class
 * @class
 * @ignore
 */
class Crop extends Submenu {
    constructor(subMenuElement, {locale, iconStyle, menuBarPosition, usageStatistics}) {
        super(subMenuElement, {
            locale,
            name: 'crop',
            iconStyle,
            menuBarPosition,
            templateHtml,
            usageStatistics
        });

        this.status = 'active';

        this._els = {
            apply: this.selector('.tie-crop-button .apply'),
            cancel: this.selector('.tie-crop-button .cancel'),
            preset: this.selector('.tie-crop-preset-button')
        };

        this.defaultPresetButton = this._els.preset.querySelector('.preset-none');
    }

    /**
     * Destroys the instance.
     */
    destroy() {
        this._removeEvent();
        snippet.forEach(this, (value, key) => {
            this[key] = null;
        });
    }

    /**
     * Add event for crop
     * @param {Object} actions - actions for crop
     *   @param {Function} actions.crop - crop action
     *   @param {Function} actions.cancel - cancel action
     *   @param {Function} actions.preset - draw rectzone at a predefined ratio
     */
    addEvent(actions) {
        this.eventHandler = {
            apply: this._applyEventHandler.bind(this),
            cancel: this._cancelEventHandler.bind(this),
            cropzonePreset: this._cropzonePresetEventHandler.bind(this)
        };
        this.actions = actions;
        this._els.apply.addEventListener('click', this.eventHandler.apply);
        this._els.cancel.addEventListener('click', this.eventHandler.cancel);
        this._els.preset.addEventListener('click', this.eventHandler.cropzonePreset);
    }

    /**
     * Remove event
     * @private
     */
    _removeEvent() {
        this._els.apply.removeEventListener('click', this.eventHandler.apply);
        this._els.cancel.removeEventListener('click', this.eventHandler.cancel);
        this._els.preset.removeEventListener('click', this.eventHandler.cropzonePreset);
    }

    _applyEventHandler() {
        this.actions.crop();
        this._els.apply.classList.remove('active');
    }

    _cancelEventHandler() {
        this.actions.cancel();
        this._els.apply.classList.remove('active');
    }

    _cropzonePresetEventHandler(event) {
        const button = event.target.closest('.tui-image-editor-button.preset');
        if (button) {
            const [presetType] = button.className.match(/preset-[^\s]+/);

            this._setPresetButtonActive(button);
            this.actions.preset(presetType);
        }
    }

    /**
     * Executed when the menu starts.
     */
    changeStartMode() {
        this.actions.modeChange('crop');
    }

    /**
     * Returns the menu to its default state.
     */
    changeStandbyMode() {
        this.actions.stopDrawingMode();
        this._setPresetButtonActive();
    }

    /**
     * Change apply button status
     * @param {Boolean} enableStatus - apply button status
     */
    changeApplyButtonStatus(enableStatus) {
        if (enableStatus) {
            this._els.apply.classList.add('active');
        } else {
            this._els.apply.classList.remove('active');
        }
    }

    /**
     * Set preset button to active status
     * @param {HTMLElement} button - event target element
     * @private
     */
    _setPresetButtonActive(button = this.defaultPresetButton) {
        snippet.forEach([].slice.call(this._els.preset.querySelectorAll('.preset')), presetButton => {
            presetButton.classList.remove('active');
        });

        if (button) {
            button.classList.add('active');
        }
    }
}

export default Crop;
