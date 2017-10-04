'use strict';

var $ = require('jquery');
require('bootstrap');
require('bootstrap-datetimejs');

module.exports = function () {

    var now = new Date();

    $('.datetimepicker').datetimepicker({
        format: 'YYYY-MM-DD',
        minDate: now,
        defaultDate: now
    });

    /*

    $('.input-daterange').datetimepicker({
        format: 'YYYY-MM-DD',
        pickDate: true,
        pickTime: false,
        minDate: now,
        defaultDate: now
    });

    $('#input-daterange-bookable-from').on("dp.change", function (e) {
        var bookableFrom = e.date;
        var bookableUntil = $('#input-daterange-bookable-until').data("DateTimePicker").getDate();
        var runtimeFrom = $('#input-daterange-runtime-from').data("DateTimePicker").getDate();

        $('#input-daterange-bookable-until').data("DateTimePicker").setMinDate(bookableFrom);
        $('#input-daterange-runtime-from').data("DateTimePicker").setMinDate(bookableFrom);
        $('#input-daterange-runtime-until').data("DateTimePicker").setMinDate(bookableFrom);

        if (bookableUntil < bookableFrom) {
            $('#input-daterange-bookable-until').data("DateTimePicker").setDate(bookableFrom);
        }

        if (runtimeFrom < bookableFrom) {
            $('#input-daterange-runtime-from').data("DateTimePicker").setDate(bookableFrom);
            $('#input-daterange-runtime-until').data("DateTimePicker").setDate(bookableFrom);
        }
    });

    $('#input-daterange-bookable-until').on("dp.change", function (e) {
        $('#input-daterange-bookable-from').data("DateTimePicker").setMaxDate(e.date);
    });

    $('#input-daterange-runtime-from').on("dp.change", function (e) {
        var runtimeFrom = e.date;
        var runtimeUntil = $('#input-daterange-runtime-until').data("DateTimePicker").getDate();

        $('#input-daterange-runtime-until').data("DateTimePicker").setMinDate(runtimeFrom);

        if (runtimeUntil < runtimeFrom) {
            $('#input-daterange-runtime-until').data("DateTimePicker").setDate(runtimeFrom);
        }
    });

    $('#input-daterange-runtime-until').on("dp.change", function (e) {
        $('#input-daterange-runtime-from').data("DateTimePicker").setMaxDate(e.date);
    });*/

};