'use strict';

var $ = require('jquery');
require('bootstrap');

module.exports = function () {

    // enable link to tab
    var url = document.location.toString();
    if (url.match('#')) {
        $('.nav-tabs a[href=#' + url.split('#')[1] + ']').tab('show');
    }

    // Change hash for page-reload
    $('.nav-tabs a').on('shown', function (e) {
        window.location.hash = e.target.hash;
    });

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        var type = $(e.target).data('component-type');
        var input = $("input[name=type]");

        input.val(type);

        e.target // activated tab
        e.relatedTarget // previous tab
    });

};