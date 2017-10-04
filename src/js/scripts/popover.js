'use strict';

var $ = require('jquery');
require('bootstrap');

module.exports = function () {

    $('[data-toggle="popover"]').popover();

    //$('.btn-popover').popover();
    //
    //$('.btn-popover').on('click', function (e) {
    //    $('.btn-popover').not(this).popover('hide');
    //});
};