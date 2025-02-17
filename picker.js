// Picker Logic
var picker = (function() {
    function Picker(options) {
        this.items = options.items;
        this.localStorageKey = options.localStorageKey || null;
        this.defaultSettings = options.defaultSettings || {};
        this.historyLength = options.historyLength || 3;
        this.getBatchSize = options.getBatchSize || this.defaultGetBatchSize;
        this.shouldIncludeItem = options.shouldIncludeItem || function() { return true; };
        this.getFilteredItems = options.getFilteredItems || null;
        this.modifyState = options.modifyState || function(state) { return state; };
        this.onLoadState = options.onLoadState || function() {};
        this.saveState = options.saveState || this.defaultSaveState;
        this.loadState = options.loadState || this.defaultLoadState;
        this.favoritesQueryParam = options.favoritesQueryParam || 'favs';
        this.shortcodeLength = options.shortcodeLength || null;
        this.settingsFromFavorites = options.settingsFromFavorites || function() { return {}; };

        this.state = this.initializeState();
        this.history = [];
        this.historyPointer = -1;

        if (this.localStorageKey) {
            this.loadState();
        }
    }

    Picker.prototype.initializeState = function() {
        return {
            eliminated: [],
            survived: [],
            current: this.getFilteredItems ? this.getFilteredItems(this.defaultSettings) : this.items.map(function(item) { return item.id; }),
            evaluating: [],
            favorites: [],
            settings: Object.assign({}, this.defaultSettings)
        };
    };

    Picker.prototype.defaultGetBatchSize = function(currentSize, settings) {
        var batchSize = Math.floor(currentSize / 5);
        return Math.max(settings.minBatchSize || 2, Math.min(settings.maxBatchSize || 20, batchSize));
    };

    Picker.prototype.defaultSaveState = function(state) {
        if (this.localStorageKey) {
            localStorage.setItem(this.localStorageKey, JSON.stringify(state));
        }
    };

    Picker.prototype.defaultLoadState = function() {
        if (this.localStorageKey) {
            var state = localStorage.getItem(this.localStorageKey);
            if (state) {
                this.restoreState(JSON.parse(state));
            }
        }
    };

    Picker.prototype.restoreState = function(state) {
        state = this.modifyState(state);
        this.state = state;
        this.pushHistory();
    };

    Picker.prototype.pushHistory = function() {
        this.history = this.history.slice(0, this.historyPointer + 1);
        this.history.push(JSON.parse(JSON.stringify(this.state)));
        this.historyPointer++;
        if (this.history.length > this.historyLength) {
            this.history.shift();
            this.historyPointer--;
        }
        this.saveState(this.state);
    };

    Picker.prototype.pick = function(picked) {
        // Picker logic here
    };

    Picker.prototype.pass = function() {
        // Pass logic here
    };

    Picker.prototype.undo = function() {
        if (this.historyPointer > 0) {
            this.historyPointer--;
            this.state = JSON.parse(JSON.stringify(this.history[this.historyPointer]));
            this.saveState(this.state);
        }
    };

    Picker.prototype.redo = function() {
        if (this.historyPointer < this.history.length - 1) {
            this.historyPointer++;
            this.state = JSON.parse(JSON.stringify(this.history[this.historyPointer]));
            this.saveState(this.state);
        }
    };

    return {
        Picker: Picker
    };
})();
