/*
 * PEACH
 * The Peach user interface. jQuery soup.
 * Author: Pete Saia
 */
window.PEACH = window.PEACH || {};

(function (PEACH) {
'use strict';

/**
 * Output Messages
 */
PEACH.verbose = false;
PEACH.output = [];

/**
 * Consts
 */
var SLIDESPEED = 250;
var MAXSIZE    = 1073741824; // gb

/**
 * Vars
 */
var $dropbox_section = $('#upload');
var $form_section    = $('#domain-form');
var $old_domain      = $('input[name="old"]');
var $new_domain      = $('input[name="new"]');
var $cancel          = $('.cancel');
var $download        = $('.download');
var $migrate_btn     = $('button');
var $output_box      = $('.output');

var haystack = null;
var filename = null;

/**
 * Constants
 */
var scenes = {
    // After the file has been loaded, display form.
    show_form: function (freshhaystack) {
        if (!freshhaystack)
            return;
        
        // Set global var.
        haystack = freshhaystack;
        
        // Attempt to get old domain to prepopulate.
        var matches = haystack.match(/('siteurl',')([^']+)/);
        var old_domain = (matches && matches[2]) ? matches[2] : '';
        
        // Populate old domain field... or not.
        if (old_domain.length > 0) {
            $new_domain.focus();
            $old_domain.val(old_domain);
        } else {
            $old_domain.focus();
        }
        
        // Animate.
        $dropbox_section.animate({
            left:'-50%'
        }, SLIDESPEED);
        $form_section.animate({
            left:'50%'
        }, SLIDESPEED);
    },
    show_dropbox: function () {
        haystack = null;
        deactivate_btn($download);
        deactivate_btn($migrate_btn);
        clear_output();
        $dropbox_section.animate({
            left:'50%'
        }, SLIDESPEED);
        $form_section.animate({
            left:'150%'
        }, SLIDESPEED);
        $dropbox_section.activity(false);
    }
};


var deactivate_btn = function ($btn) {
    $btn.stop(true,true).animate({
        'opacity': 0.4
    }, 200)
    .off('click')
    .css('cursor', 'default')
    .removeClass('active');
};
var activate_btn = function ($btn) {
    $btn.stop(true,true).animate({
        'opacity': 1
    }, 200)
    .off('click')
    .css('cursor', 'pointer')
    .addClass('active');
    if ($btn === $migrate_btn)
        $btn.on('click', migrate_btn_click_handler);
};

var show_output = function () {
    var len = PEACH.output.length;
    $output_box.html('');
    for (var i = 0; len > i; i++)
        $output_box.append('<span>'+PEACH.output[i]+'</span>');
};

var clear_output = function () {
    $output_box.html('');
    PEACH.output = [];
};

var migrate_btn_click_handler = function () {
    if ( $.trim($new_domain.val()).length < 1 || $.trim($old_domain.val()).length < 1 )
        return alert('You must provide both fields.');
    
    if (!haystack)
        return alert('Something is wrong, please refresh and start over.');
    
    clear_output();
    
    var on_complete = function (stack) {
        var blob;
        window.URL = window.webkitURL || window.URL;
        if ( window.Blob ) {

            // The new way.
            blob = new Blob([stack], { 'type' : 'text\/plain' });

        } else {

            // Try the deprecated way.
            window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
            if ( !window.BlobBuilder )
                return alert('Please upgrade to a better browser. Perhaps one that supports Blob().');

            var bb = new window.BlobBuilder();
            bb.append(stack);
            blob = bb.getBlob('text/plain');
        }

        $download.attr('download', filename);
        $download.attr('href', window.URL.createObjectURL(blob));
        activate_btn($download);
        show_output();
    };
    
    // Convert db.
    var m = PEACH.migrate(
        haystack,
        $old_domain.val(),
        $new_domain.val(),
        on_complete
    );
    
    if (m)
        m.init();
    
    show_output();
    return false;
};

var cancel_btn_click_handler = function () {
    scenes.show_dropbox();
    return false;
};

var dropbox_handler = function (e) {
    e.stopPropagation();
    e.preventDefault();
    
    if (e.type ===  'drop') {
        var file = e.originalEvent.dataTransfer.files;
        var reader = new FileReader();
        var fileName;
        if ( file[0] ) {
            if ( file[0].fileName ) {
                fileName = file[0].fileName;
            } else if ( file[0].name ) {
                fileName = file[0].name;
            } else {
                return alert('Could not detect file name. This could be a browser issue.');
            }
        } else {
            return alert('Sorry, no file was detected. Perhaps try a better browser.');
        }

        if ( !fileName.match(/\.sql/) )
            return alert('Must be a .sql file.');
        
        if (file.length > 1)
            return alert('Only one file at a time, please.');
        
        if (file[0].fileSize > MAXSIZE)
            return alert('File is too large. Perhaps try deleting the cache?');
        
        filename = 'migrated-' + fileName;
        PEACH.file_manager.read(file[0], scenes.show_form);
        $dropbox_section.activity({
            valign: 'bottom',
            padding: 60,
            opacity: 0.5
        });
    }
};

var input_keyup_handler = function () {
    if ($old_domain.val().length > 0 && $new_domain.val().length > 1) {
        activate_btn($migrate_btn);
    } else {
        deactivate_btn($migrate_btn);
    }
};

/*
 * Event listeners.
*/
$dropbox_section.on('dragenter dragexit dragover drop', dropbox_handler);
$cancel.on('click', cancel_btn_click_handler).trigger('click');
$old_domain.add($new_domain).on('keyup press', input_keyup_handler);


PEACH.log = function (str) {
    if (window.console && PEACH.verbose)
        console.log(str);
    
    PEACH.output.push(str);
};

})(window.PEACH);


