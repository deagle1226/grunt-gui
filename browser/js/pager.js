var $ = require('jquery');
var _ = require('underscore');

module.exports = (function() {

    var pages, history;

    function init(entry) {
        pages = $('[main]');
        history = [];
        go(entry);
    }

    function go(page) {
        if (page instanceof $.Event) page = page.data.page;
        pages.hide();
        pages.eq(pages.index(page)).show();
        history.push(page);
    }

    function back() {
        if (history.length > 1) {
            history.pop();
            go(_.last(history))
            history = _.initial(history);
        }
    }

    return {
        init: init,
        go: go,
        back: back
    };
})();