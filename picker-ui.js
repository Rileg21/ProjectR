// Picker UI
var PickerUI = function(picker, options) {
    this.picker = picker;
    this.elements = options.elements;
    this.messages = options.messages || {
        reset: "Reset",
        mustSelect: "You must select something first! If you're indifferent, press Pass.",
        orderedAll: "You have ordered every available item!",
        noItems: "There are no items that fit your criteria! Set some different options and try again.",
        resetWarning: "Are you sure you wish to reset your state? All your found favorites and current progress will be lost."
    };
    this.onUpdate = options.onUpdate || function() {};
    this.getItemImageUrl = options.getItemImageUrl || function(item) { return item.image; };
    this.wrapItem = options.wrapItem || function(itemContent) { return $('<li>').append(itemContent); };
    this.getItemElem = options.getItemElem || function(item, settings) {
        var itemContent = $('<div>').addClass('item');
        if (this.getItemImageUrl(item, settings)) {
            itemContent.append($('<img>').attr('src', this.getItemImageUrl(item, settings)));
        }
        itemContent.append($('<span>').text(item.name));
        return this.wrapItem(itemContent);
    };

    this.initialize();
};

PickerUI.prototype.initialize = function() {
    var self = this;
    $(this.elements.pick).click(function() { self.pick(); });
    $(this.elements.pass).click(function() { self.pass(); });
    $(this.elements.undo).click(function() { self.undo(); });
    $(this.elements.redo).click(function() { self.redo(); });
    this.update();
};

PickerUI.prototype.update = function() {
    // Update UI logic here
    this.onUpdate();
};

PickerUI.prototype.pick = function() {
    // Pick logic here
};

PickerUI.prototype.pass = function() {
    // Pass logic here
};

PickerUI.prototype.undo = function() {
    this.picker.undo();
    this.update();
};

PickerUI.prototype.redo = function() {
    this.picker.redo();
    this.update();
};
