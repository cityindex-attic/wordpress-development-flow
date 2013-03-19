/*
 * PEACH
 * File Manager
 * Responsible for the client side downloading. Basically
 * a wrapper for the File API.
 * Author: Pete Saia
 */
window.PEACH = window.PEACH || {};

(function (PEACH) {
'use strict';

PEACH.file_manager = {
    
    in_progress: false,
    
    read: function (file, callback) {
        if (PEACH.file_manager.in_progress)
            return;
        
        var reader = new FileReader();
        PEACH.file_manager.cb = callback;
        PEACH.file_manager.in_progress = true;
        reader.onloadstart = this.on_start;
        reader.onerror     = this.on_error;
        reader.onprogress  = this.on_progress;
        reader.onload      = this.on_load;
        reader.onabort = function(e) {
            alert('Aborted. Something went horribly wrong.');
        };
        
        reader.readAsText(file);
    },
    
    on_error: function (evt) {
        switch(evt.target.error.code) {
            case evt.target.error.NOT_FOUND_ERR:
                alert('File Not Found!');
                break;
            case evt.target.error.NOT_READABLE_ERR:
                alert('File is not readable');
                break;
            case evt.target.error.ABORT_ERR:
                break;
            default:
                alert('An error occurred reading this file.');
        }
    },
    
    on_load: function (f) {
        PEACH.file_manager.in_progress = false;
        if (typeof PEACH.file_manager.cb === 'function') {
            PEACH.file_manager.cb(f.target.result);
        } else {
            return f.target.result;
        }
    },
    
    // Will add if it takes long for some folks.
    on_start: function () {},
    on_progress: function (evt) {}
};
})(window.PEACH);


