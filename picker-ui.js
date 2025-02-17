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
PickerUI.prototype.update = function() {
    var self = this;
    
    // Clear current UI
    $(this.elements.evaluating).empty();
    $(this.elements.favorites).empty();

    // Render evaluating items
    this.picker.state.evaluating.forEach(function(itemId) {
        var item = self.picker.items.find(function(i) { return i.id === itemId; });
        if (item) {
            var itemElem = self.getItemElem(item, self.picker.state.settings);
            $(self.elements.evaluating).append(itemElem);
        }
    });

    // Render favorites
    this.picker.state.favorites.forEach(function(itemId) {
        var item = self.picker.items.find(function(i) { return i.id === itemId; });
        if (item) {
            var favoriteElem = self.getItemElem(item, self.picker.state.settings);
            $(self.elements.favorites).append(favoriteElem);
        }
    });

    // Enable/disable buttons
    $(this.elements.undo).prop('disabled', !this.picker.canUndo());
    $(this.elements.redo).prop('disabled', !this.picker.canRedo());

    this.onUpdate();
};

PickerUI.prototype.pick = function() {
    var selected = $(this.elements.evaluating + ' .selected').map(function() {
        return $(this).data('id');
    }).get();

    if (selected.length === 0) {
        alert(this.messages.mustSelect);
        return;
    }

    this.picker.pick(selected);
    this.update();
};

// Add click handler for items
PickerUI.prototype.initialize = function() {
    var self = this;
    
    // Existing button handlers
    $(this.elements.pick).click(function() { self.pick(); });
    $(this.elements.pass).click(function() { self.pass(); });
    $(this.elements.undo).click(function() { self.undo(); });
    $(this.elements.redo).click(function() { self.redo(); });

    // Item selection handler
    $(document).on('click', self.elements.evaluating + ' .item', function() {
        $(this).toggleClass('selected');
    });

    this.update();
};
