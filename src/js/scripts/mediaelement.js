'use strict';

var $ = require('jquery');
var MediaElementPlayer = require('mediaelement');

module.exports = function () {

    $('audio,video').mediaelementplayer({
        pluginPath: 'libs/mediaelement/build/',
        audioWidth: '100%',
        videoHeight: 220,
        videoWidth: '100%',
        success: function (mediaElement, originalNode) {
            // do things
        }
    });

};