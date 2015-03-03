#!/usr/bin/env node
/// <reference path="../typings/tsd.d.ts"/>
var binary = require('node-pre-gyp');
var path = require('path');
var PACKAGE_JSON = path.join(__dirname, '../package.json');
var binding_path = binary.find(path.resolve(PACKAGE_JSON));
var fprintbinding = require(binding_path);

var stream = require('stream');
var util = require('util');
var bunyan = require('bunyan');
var events = require('events');

var log;

(function (fp_enroll_result) {
    fp_enroll_result[fp_enroll_result["ENROLL_COMPLETE"] = 1] = "ENROLL_COMPLETE";
    fp_enroll_result[fp_enroll_result["ENROLL_FAIL"] = 2] = "ENROLL_FAIL";
    fp_enroll_result[fp_enroll_result["ENROLL_PASS"] = 3] = "ENROLL_PASS";
    fp_enroll_result[fp_enroll_result["ENROLL_RETRY"] = 100] = "ENROLL_RETRY";
    fp_enroll_result[fp_enroll_result["ENROLL_RETRY_TOO_SHORT"] = 101] = "ENROLL_RETRY_TOO_SHORT";
    fp_enroll_result[fp_enroll_result["ENROLL_RETRY_CENTER_FINGER"] = 102] = "ENROLL_RETRY_CENTER_FINGER";
    fp_enroll_result[fp_enroll_result["ENROLL_RETRY_REMOVE_FINGER"] = 103] = "ENROLL_RETRY_REMOVE_FINGER";
})(exports.fp_enroll_result || (exports.fp_enroll_result = {}));
var fp_enroll_result = exports.fp_enroll_result;

var fpreader = (function () {
    function fpreader(fpinstance) {
        var _this = this;
        this.close = function () {
            _this.wrapped.close();
        };
        // Start enrolling a fingerprint
        this.start_enroll = function (callback) {
            // tell the fpreader to begin the enroll finger process
            if (!_this.wrapped.enroll_finger(function (result, fpdata, fpimage, height, width) {
                var err = null;

                // If the result was not a successful enrollment
                if (result != 1 /* ENROLL_COMPLETE */) {
                    // store error code in err
                    err = fp_enroll_result[result];
                    callback(err, null, null, null, null, null);
                } else {
                    // check the fpdata for completeness
                    if (fpdata !== null && fpdata !== undefined) {
                        var data = new Buffer(fpdata.length);
                        fpdata.copy(data);
                    }

                    // shouldn't we check these as well? TODO
                    var image = new Buffer(fpimage.length);
                    fpimage.copy(image);

                    // callback to fp_server
                    callback(err, result, data, image, height, width);
                }
            })) {
                // Not finished yet!
                callback("Enroll in progress!", null, null, null, null, null);
            }
        };
        // Stop enrolling a fingerprint
        this.stop_enroll = function (callback) {
            // tell the fp.reader to stop enrollment (if it is enrolling)
            _this.wrapped.stop_enroll_finger();
            callback();
        };
        // Start identifying a fingerprint
        this.start_identify = function (callback) {
            // TODO
            callback(null, null);
        };
        // Stop identifying a fingerprint
        this.stop_identify = function (callback) {
            // tell the fp.reader to stop identifying (if it is identifying)
            _this.wrapped.stop_identify_finger();
            callback();
        };
        // Driver for async fingerprint activity
        this.handle_events = function () {
            // tell the fp.reader to handle events, i.e. advance the reader a step
            _this.wrapped.handle_events();
        };
        this.wrapped = fpinstance;

        //these values are static so we can grab them now
        this.enroll_stages = fpinstance.enroll_stages;
        this.supports_imaging = fpinstance.supports_imaging;
        this.supports_identification = fpinstance.supports_identification;
        this.img_width = fpinstance.img_width;
        this.img_height = fpinstance.img_height;
    }
    return fpreader;
})();
exports.fpreader = fpreader;

var fprint = (function () {
    function fprint() {
    }
    // Initializes libfprint and returns 0 if successful.
    fprint.prototype.init = function () {
        return fprintbinding.init();
    };

    fprint.prototype.discover = function () {
        var devices = [];
        fprintbinding.discover(function (handle, devid, drvtype, drvname, drvfullname) {
            var thisdev = {
                handle: handle,
                deviceid: devid,
                driver_type: drvtype,
                driver: drvname,
                driver_detail: drvfullname
            };

            devices.push(thisdev);
        });

        return devices;
    };

    fprint.prototype.get_reader = function (handle) {
        var reader = new fprintbinding.fpreader(handle);
        if (typeof reader != 'undefined') {
            return new fpreader(reader);
        }
        return null;
    };

    fprint.prototype.exit = function () {
        return fprintbinding.exit();
    };
    return fprint;
})();
exports.fprint = fprint;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYmZwcmludC50cyJdLCJuYW1lcyI6WyJmcF9lbnJvbGxfcmVzdWx0IiwiZnByZWFkZXIiLCJmcHJlYWRlci5jb25zdHJ1Y3RvciIsImZwcmludCIsImZwcmludC5jb25zdHJ1Y3RvciIsImZwcmludC5pbml0IiwiZnByaW50LmRpc2NvdmVyIiwiZnByaW50LmdldF9yZWFkZXIiLCJmcHJpbnQuZXhpdCJdLCJtYXBwaW5ncyI6IkFBQUEsMkNBQTJDO0FBQTNDLElBRUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUM7QUFDcEMsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztBQUMxQixJQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxpQkFBaUIsQ0FBQztBQUMxRCxJQUFJLFlBQVksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDMUQsSUFBSSxhQUFhLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQzs7QUFFekMsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQztBQUM5QixJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO0FBQzFCLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUM7QUFDOUIsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQzs7QUFFOUIsSUFBSSxHQUFHOztDQUVQLFVBQVksZ0JBQWdCO0lBRXhCQSx1REFBa0JBLENBQUNBLHFCQUFBQTtJQUNuQkEsbURBQWNBLENBQUNBLGlCQUFBQTtJQUNmQSxtREFBY0EsQ0FBQ0EsaUJBQUFBO0lBQ2ZBLG9EQUFlQSxHQUFHQSxrQkFBQUE7SUFDbEJBLDhEQUF5QkEsR0FBR0EsNEJBQUFBO0lBQzVCQSxrRUFBNkJBLEdBQUdBLGdDQUFBQTtJQUNoQ0Esa0VBQTZCQSxHQUFHQSxnQ0FBQUE7Z0VBQ25DO2dEQUFBOztBQUVEO0lBK0VJ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LElBQUlBLFdBQVdBLENBQ2hDQTtZQUNJQSxPQUFPQSxJQUFJQSxRQUFRQSxDQUFDQSxNQUFNQSxDQUFDQTtTQUM5QkE7UUFDREEsT0FBT0EsSUFBSUE7SUFDZkEsQ0FBQ0E7O0lBRURKLHdCQUFBQTtRQUNJSyxPQUFPQSxhQUFhQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtJQUMvQkEsQ0FBQ0E7SUFHTEwsY0FBQ0E7QUFBREEsQ0FBQ0EsSUFBQTtBQXZDRCx3QkF1Q0M7QUFDRCIsImZpbGUiOiJsaWJmcHJpbnQuanMiLCJzb3VyY2VSb290IjoiL2hvbWUvYWVyby9ub2RlLWxpYmZwcmludC8iLCJzb3VyY2VzQ29udGVudCI6WyIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vdHlwaW5ncy90c2QuZC50c1wiLz5cblxudmFyIGJpbmFyeSA9IHJlcXVpcmUoJ25vZGUtcHJlLWd5cCcpO1xudmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG52YXIgUEFDS0FHRV9KU09OID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJy4uL3BhY2thZ2UuanNvbicpO1xudmFyIGJpbmRpbmdfcGF0aCA9IGJpbmFyeS5maW5kKHBhdGgucmVzb2x2ZShQQUNLQUdFX0pTT04pKTtcbnZhciBmcHJpbnRiaW5kaW5nID0gcmVxdWlyZShiaW5kaW5nX3BhdGgpO1xuXG52YXIgc3RyZWFtID0gcmVxdWlyZSgnc3RyZWFtJyk7XG52YXIgdXRpbCA9IHJlcXVpcmUoJ3V0aWwnKTtcbnZhciBidW55YW4gPSByZXF1aXJlKCdidW55YW4nKTtcbnZhciBldmVudHMgPSByZXF1aXJlKCdldmVudHMnKTtcblxudmFyIGxvZztcblxuZXhwb3J0IGVudW0gZnBfZW5yb2xsX3Jlc3VsdFxue1xuICAgIEVOUk9MTF9DT01QTEVURSA9IDEsXG4gICAgRU5ST0xMX0ZBSUwgPSAyLFxuICAgIEVOUk9MTF9QQVNTID0gMyxcbiAgICBFTlJPTExfUkVUUlkgPSAxMDAsXG4gICAgRU5ST0xMX1JFVFJZX1RPT19TSE9SVCA9IDEwMSxcbiAgICBFTlJPTExfUkVUUllfQ0VOVEVSX0ZJTkdFUiA9IDEwMixcbiAgICBFTlJPTExfUkVUUllfUkVNT1ZFX0ZJTkdFUiA9IDEwM1xufVxuXG5leHBvcnQgY2xhc3MgZnByZWFkZXIge1xuICAgIHByaXZhdGUgd3JhcHBlZDtcblxuICAgIGVucm9sbF9zdGFnZXMgOiBudW1iZXI7XG4gICAgc3VwcG9ydHNfaW1hZ2luZyA6IGJvb2xlYW47XG4gICAgc3VwcG9ydHNfaWRlbnRpZmljYXRpb246IGJvb2xlYW47XG4gICAgaW1nX3dpZHRoOiBudW1iZXI7XG4gICAgaW1nX2hlaWdodDogbnVtYmVyO1xuXG4gICAgY2xvc2UgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMud3JhcHBlZC5jbG9zZSgpO1xuICAgIH1cblxuICAgIC8vIFN0YXJ0IGVucm9sbGluZyBhIGZpbmdlcnByaW50XG4gICAgc3RhcnRfZW5yb2xsID0gKGNhbGxiYWNrIDogKGVyciwgcmVzdWx0IDogZnBfZW5yb2xsX3Jlc3VsdCwgZnBkYXRhIDogQnVmZmVyLCBmcGltYWdlOiBCdWZmZXIsIGhlaWdodCA6IE51bWJlciwgd2lkdGggOiBOdW1iZXIpID0+IHZvaWQpIDogdm9pZCA9PiB7XG4gICAgXG4gICAgICAgIC8vIHRlbGwgdGhlIGZwcmVhZGVyIHRvIGJlZ2luIHRoZSBlbnJvbGwgZmluZ2VyIHByb2Nlc3NcbiAgICAgICAgaWYgKCF0aGlzLndyYXBwZWQuZW5yb2xsX2ZpbmdlcihcbiAgICAgICAgICAgICAgICAvLyBFbnJvbGwgZmluZ2VyIGhhcyBjb21wbGV0ZWRcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAocmVzdWx0OiBmcF9lbnJvbGxfcmVzdWx0LCBmcGRhdGEsIGZwaW1hZ2UsIGhlaWdodCA6IG51bWJlciwgd2lkdGg6IG51bWJlcilcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBlcnIgPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHRoZSByZXN1bHQgd2FzIG5vdCBhIHN1Y2Nlc3NmdWwgZW5yb2xsbWVudFxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0ICE9IGZwX2Vucm9sbF9yZXN1bHQuRU5ST0xMX0NPTVBMRVRFKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzdG9yZSBlcnJvciBjb2RlIGluIGVyclxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyID0gZnBfZW5yb2xsX3Jlc3VsdFtyZXN1bHRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyLG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNoZWNrIHRoZSBmcGRhdGEgZm9yIGNvbXBsZXRlbmVzc1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZwZGF0YSAhPT0gbnVsbCAmJiBmcGRhdGEgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGF0YSA9IG5ldyBCdWZmZXIoZnBkYXRhLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnBkYXRhLmNvcHkoZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNob3VsZG4ndCB3ZSBjaGVjayB0aGVzZSBhcyB3ZWxsPyBUT0RPXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW1hZ2UgPSBuZXcgQnVmZmVyKGZwaW1hZ2UubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZwaW1hZ2UuY29weShpbWFnZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNhbGxiYWNrIHRvIGZwX3NlcnZlclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyLCByZXN1bHQsIGRhdGEsIGltYWdlLCBoZWlnaHQsIHdpZHRoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgKSkge1xuICAgICAgICAgICAgLy8gTm90IGZpbmlzaGVkIHlldCFcbiAgICAgICAgICAgIGNhbGxiYWNrKFwiRW5yb2xsIGluIHByb2dyZXNzIVwiLCBudWxsLCBudWxsLCBudWxsLCBudWxsLCBudWxsKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFN0b3AgZW5yb2xsaW5nIGEgZmluZ2VycHJpbnRcbiAgICBzdG9wX2Vucm9sbCA9IChjYWxsYmFjayA6ICgpID0+IHZvaWQpIDogdm9pZCA9PiB7XG4gICAgICAgIC8vIHRlbGwgdGhlIGZwLnJlYWRlciB0byBzdG9wIGVucm9sbG1lbnQgKGlmIGl0IGlzIGVucm9sbGluZylcbiAgICAgICAgdGhpcy53cmFwcGVkLnN0b3BfZW5yb2xsX2ZpbmdlcigpO1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgIH1cblxuICAgIC8vIFN0YXJ0IGlkZW50aWZ5aW5nIGEgZmluZ2VycHJpbnRcbiAgICBzdGFydF9pZGVudGlmeSA9IChjYWxsYmFjayA6IChlcnIsIHN1Y2Nlc3MpID0+IHZvaWQpIDogdm9pZCA9PiB7XG4gICAgICAgIC8vIFRPRE9cbiAgICAgICAgY2FsbGJhY2sobnVsbCxudWxsKTtcbiAgICB9XG5cbiAgICAvLyBTdG9wIGlkZW50aWZ5aW5nIGEgZmluZ2VycHJpbnRcbiAgICBzdG9wX2lkZW50aWZ5ID0gKGNhbGxiYWNrIDogKCkgPT4gdm9pZCkgOiB2b2lkID0+IHtcbiAgICAgICAgLy8gdGVsbCB0aGUgZnAucmVhZGVyIHRvIHN0b3AgaWRlbnRpZnlpbmcgKGlmIGl0IGlzIGlkZW50aWZ5aW5nKVxuICAgICAgICB0aGlzLndyYXBwZWQuc3RvcF9pZGVudGlmeV9maW5nZXIoKTtcbiAgICAgICAgY2FsbGJhY2soKTtcbiAgICB9XG5cbiAgICAvLyBEcml2ZXIgZm9yIGFzeW5jIGZpbmdlcnByaW50IGFjdGl2aXR5XG4gICAgaGFuZGxlX2V2ZW50cyA9ICgpIDogdm9pZCA9PiB7XG4gICAgICAgIC8vIHRlbGwgdGhlIGZwLnJlYWRlciB0byBoYW5kbGUgZXZlbnRzLCBpLmUuIGFkdmFuY2UgdGhlIHJlYWRlciBhIHN0ZXBcbiAgICAgICAgdGhpcy53cmFwcGVkLmhhbmRsZV9ldmVudHMoKTtcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihmcGluc3RhbmNlKSB7XG4gICAgICAgIHRoaXMud3JhcHBlZCA9IGZwaW5zdGFuY2U7XG5cbiAgICAgICAgLy90aGVzZSB2YWx1ZXMgYXJlIHN0YXRpYyBzbyB3ZSBjYW4gZ3JhYiB0aGVtIG5vd1xuICAgICAgICB0aGlzLmVucm9sbF9zdGFnZXMgPSBmcGluc3RhbmNlLmVucm9sbF9zdGFnZXM7XG4gICAgICAgIHRoaXMuc3VwcG9ydHNfaW1hZ2luZyA9IGZwaW5zdGFuY2Uuc3VwcG9ydHNfaW1hZ2luZztcbiAgICAgICAgdGhpcy5zdXBwb3J0c19pZGVudGlmaWNhdGlvbiA9IGZwaW5zdGFuY2Uuc3VwcG9ydHNfaWRlbnRpZmljYXRpb247XG4gICAgICAgIHRoaXMuaW1nX3dpZHRoID0gZnBpbnN0YW5jZS5pbWdfd2lkdGg7XG4gICAgICAgIHRoaXMuaW1nX2hlaWdodCA9IGZwaW5zdGFuY2UuaW1nX2hlaWdodDtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBmcHJpbnQge1xuXG4gICAgLy8gSW5pdGlhbGl6ZXMgbGliZnByaW50IGFuZCByZXR1cm5zIDAgaWYgc3VjY2Vzc2Z1bC5cbiAgICBpbml0KCkgOiBudW1iZXIgIHtcbiAgICAgICAgcmV0dXJuIGZwcmludGJpbmRpbmcuaW5pdCgpO1xuICAgIH1cblxuICAgIGRpc2NvdmVyKCkge1xuICAgICAgICB2YXIgZGV2aWNlcyA9IFtdO1xuICAgICAgICBmcHJpbnRiaW5kaW5nLmRpc2NvdmVyKCBmdW5jdGlvbihoYW5kbGUsIGRldmlkLCBkcnZ0eXBlLCBkcnZuYW1lLCBkcnZmdWxsbmFtZSlcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0aGlzZGV2ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlOiBoYW5kbGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXZpY2VpZDogZGV2aWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBkcml2ZXJfdHlwZTogZHJ2dHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRyaXZlcjogZHJ2bmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRyaXZlcl9kZXRhaWw6IGRydmZ1bGxuYW1lXG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgZGV2aWNlcy5wdXNoKHRoaXNkZXYpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBkZXZpY2VzO1xuICAgIH1cblxuICAgIGdldF9yZWFkZXIoaGFuZGxlOiBudW1iZXIpIHtcbiAgICAgICAgdmFyIHJlYWRlciA9IG5ldyBmcHJpbnRiaW5kaW5nLmZwcmVhZGVyKGhhbmRsZSk7XG4gICAgICAgIGlmICh0eXBlb2YgcmVhZGVyICE9ICd1bmRlZmluZWQnKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IGZwcmVhZGVyKHJlYWRlcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgZXhpdCgpIDogdm9pZCB7XG4gICAgICAgIHJldHVybiBmcHJpbnRiaW5kaW5nLmV4aXQoKTtcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvciAoKSB7IH1cbn1cbiJdfQ==