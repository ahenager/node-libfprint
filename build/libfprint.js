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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYmZwcmludC50cyJdLCJuYW1lcyI6WyJmcF9lbnJvbGxfcmVzdWx0IiwiZnByZWFkZXIiLCJmcHJlYWRlci5jb25zdHJ1Y3RvciIsImZwcmludCIsImZwcmludC5jb25zdHJ1Y3RvciIsImZwcmludC5pbml0IiwiZnByaW50LmRpc2NvdmVyIiwiZnByaW50LmdldF9yZWFkZXIiLCJmcHJpbnQuZXhpdCJdLCJtYXBwaW5ncyI6IkFBQUEsMkNBQTJDO0FBQTNDLElBRUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUM7QUFDcEMsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztBQUMxQixJQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxpQkFBaUIsQ0FBQztBQUMxRCxJQUFJLFlBQVksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDMUQsSUFBSSxhQUFhLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQzs7QUFFekMsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQztBQUM5QixJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO0FBQzFCLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUM7QUFDOUIsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQzs7QUFFOUIsSUFBSSxHQUFHOztDQUVQLFVBQVksZ0JBQWdCO0lBRXhCQSx1REFBa0JBLENBQUNBLHFCQUFBQTtJQUNuQkEsbURBQWNBLENBQUNBLGlCQUFBQTtJQUNmQSxtREFBY0EsQ0FBQ0EsaUJBQUFBO0lBQ2ZBLG9EQUFlQSxHQUFHQSxrQkFBQUE7SUFDbEJBLDhEQUF5QkEsR0FBR0EsNEJBQUFBO0lBQzVCQSxrRUFBNkJBLEdBQUdBLGdDQUFBQTtJQUNoQ0Esa0VBQTZCQSxHQUFHQSxnQ0FBQUE7Z0VBQ25DO2dEQUFBOztBQUVEO0lBeUVJ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QU9BLGFBQWFBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO0lBQy9CQSxDQUFDQTtJQUdMTCxjQUFDQTtBQUFEQSxDQUFDQSxJQUFBO0FBdkNELHdCQXVDQztBQUNEIiwiZmlsZSI6ImxpYmZwcmludC5qcyIsInNvdXJjZVJvb3QiOiIvaG9tZS9hZXJvL25vZGUtbGliZnByaW50LyIsInNvdXJjZXNDb250ZW50IjpbIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi90eXBpbmdzL3RzZC5kLnRzXCIvPlxuXG52YXIgYmluYXJ5ID0gcmVxdWlyZSgnbm9kZS1wcmUtZ3lwJyk7XG52YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbnZhciBQQUNLQUdFX0pTT04gPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4vcGFja2FnZS5qc29uJyk7XG52YXIgYmluZGluZ19wYXRoID0gYmluYXJ5LmZpbmQocGF0aC5yZXNvbHZlKFBBQ0tBR0VfSlNPTikpO1xudmFyIGZwcmludGJpbmRpbmcgPSByZXF1aXJlKGJpbmRpbmdfcGF0aCk7XG5cbnZhciBzdHJlYW0gPSByZXF1aXJlKCdzdHJlYW0nKTtcbnZhciB1dGlsID0gcmVxdWlyZSgndXRpbCcpO1xudmFyIGJ1bnlhbiA9IHJlcXVpcmUoJ2J1bnlhbicpO1xudmFyIGV2ZW50cyA9IHJlcXVpcmUoJ2V2ZW50cycpO1xuXG52YXIgbG9nO1xuXG5leHBvcnQgZW51bSBmcF9lbnJvbGxfcmVzdWx0XG57XG4gICAgRU5ST0xMX0NPTVBMRVRFID0gMSxcbiAgICBFTlJPTExfRkFJTCA9IDIsXG4gICAgRU5ST0xMX1BBU1MgPSAzLFxuICAgIEVOUk9MTF9SRVRSWSA9IDEwMCxcbiAgICBFTlJPTExfUkVUUllfVE9PX1NIT1JUID0gMTAxLFxuICAgIEVOUk9MTF9SRVRSWV9DRU5URVJfRklOR0VSID0gMTAyLFxuICAgIEVOUk9MTF9SRVRSWV9SRU1PVkVfRklOR0VSID0gMTAzXG59XG5cbmV4cG9ydCBjbGFzcyBmcHJlYWRlciB7XG4gICAgcHJpdmF0ZSB3cmFwcGVkO1xuXG4gICAgZW5yb2xsX3N0YWdlcyA6IG51bWJlcjtcbiAgICBzdXBwb3J0c19pbWFnaW5nIDogYm9vbGVhbjtcbiAgICBzdXBwb3J0c19pZGVudGlmaWNhdGlvbjogYm9vbGVhbjtcbiAgICBpbWdfd2lkdGg6IG51bWJlcjtcbiAgICBpbWdfaGVpZ2h0OiBudW1iZXI7XG5cbiAgICBjbG9zZSA9ICgpID0+IHtcbiAgICAgICAgdGhpcy53cmFwcGVkLmNsb3NlKCk7XG4gICAgfVxuXG4gICAgLy8gU3RhcnQgZW5yb2xsaW5nIGEgZmluZ2VycHJpbnRcbiAgICBzdGFydF9lbnJvbGwgPSAoY2FsbGJhY2sgOiAoZXJyLCByZXN1bHQgOiBmcF9lbnJvbGxfcmVzdWx0LCBmcGRhdGEgOiBCdWZmZXIsIGZwaW1hZ2U6IEJ1ZmZlciwgaGVpZ2h0IDogTnVtYmVyLCB3aWR0aCA6IE51bWJlcikgPT4gdm9pZCkgOiB2b2lkID0+IHtcbiAgICBcbiAgICAgICAgLy8gdGVsbCB0aGUgZnByZWFkZXIgdG8gYmVnaW4gdGhlIGVucm9sbCBmaW5nZXIgcHJvY2Vzc1xuICAgICAgICBpZiAoIXRoaXMud3JhcHBlZC5lbnJvbGxfZmluZ2VyKFxuICAgICAgICAgICAgICAgIC8vIEVucm9sbCBmaW5nZXIgaGFzIGNvbXBsZXRlZFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChyZXN1bHQ6IGZwX2Vucm9sbF9yZXN1bHQsIGZwZGF0YSwgZnBpbWFnZSwgaGVpZ2h0IDogbnVtYmVyLCB3aWR0aDogbnVtYmVyKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVyciA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgdGhlIHJlc3VsdCB3YXMgbm90IGEgc3VjY2Vzc2Z1bCBlbnJvbGxtZW50XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQgIT0gZnBfZW5yb2xsX3Jlc3VsdC5FTlJPTExfQ09NUExFVEUpXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHN0b3JlIGVycm9yIGNvZGUgaW4gZXJyXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnIgPSBmcF9lbnJvbGxfcmVzdWx0W3Jlc3VsdF07XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIsbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2hlY2sgdGhlIGZwZGF0YSBmb3IgY29tcGxldGVuZXNzXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZnBkYXRhICE9PSBudWxsICYmIGZwZGF0YSAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkYXRhID0gbmV3IEJ1ZmZlcihmcGRhdGEubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcGRhdGEuY29weShkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2hvdWxkbid0IHdlIGNoZWNrIHRoZXNlIGFzIHdlbGw/IFRPRE9cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbWFnZSA9IG5ldyBCdWZmZXIoZnBpbWFnZS5sZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZnBpbWFnZS5jb3B5KGltYWdlKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2FsbGJhY2sgdG8gZnBfc2VydmVyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIsIHJlc3VsdCwgZGF0YSwgaW1hZ2UsIGhlaWdodCwgd2lkdGgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICApKSB7XG4gICAgICAgICAgICAvLyBOb3QgZmluaXNoZWQgeWV0IVxuICAgICAgICAgICAgY2FsbGJhY2soXCJFbnJvbGwgaW4gcHJvZ3Jlc3MhXCIsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gU3RvcCBlbnJvbGxpbmcgYSBmaW5nZXJwcmludFxuICAgIHN0b3BfZW5yb2xsID0gKGNhbGxiYWNrIDogKCkgPT4gdm9pZCkgOiB2b2lkID0+IHtcbiAgICAgICAgLy8gdGVsbCB0aGUgZnAucmVhZGVyIHRvIHN0b3AgZW5yb2xsbWVudCAoaWYgaXQgaXMgZW5yb2xsaW5nKVxuICAgICAgICB0aGlzLndyYXBwZWQuc3RvcF9lbnJvbGxfZmluZ2VyKCk7XG4gICAgICAgIGNhbGxiYWNrKCk7XG4gICAgfVxuXG4gICAgLy8gU3RhcnQgaWRlbnRpZnlpbmcgYSBmaW5nZXJwcmludFxuICAgIHN0YXJ0X2lkZW50aWZ5ID0gKGNhbGxiYWNrIDogKGVyciwgc3VjY2VzcykgPT4gdm9pZCkgOiB2b2lkID0+IHtcbiAgICAgICAgLy8gVE9ET1xuICAgICAgICBjYWxsYmFjayhudWxsLG51bGwpO1xuICAgIH1cblxuICAgIC8vIFN0b3AgaWRlbnRpZnlpbmcgYSBmaW5nZXJwcmludFxuICAgIHN0b3BfaWRlbnRpZnkgPSAoY2FsbGJhY2sgOiAoKSA9PiB2b2lkKSA6IHZvaWQgPT4ge1xuICAgICAgICAvLyB0ZWxsIHRoZSBmcC5yZWFkZXIgdG8gc3RvcCBpZGVudGlmeWluZyAoaWYgaXQgaXMgaWRlbnRpZnlpbmcpXG4gICAgICAgIHRoaXMud3JhcHBlZC5zdG9wX2lkZW50aWZ5X2ZpbmdlcigpO1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKGZwaW5zdGFuY2UpIHtcbiAgICAgICAgdGhpcy53cmFwcGVkID0gZnBpbnN0YW5jZTtcblxuICAgICAgICAvL3RoZXNlIHZhbHVlcyBhcmUgc3RhdGljIHNvIHdlIGNhbiBncmFiIHRoZW0gbm93XG4gICAgICAgIHRoaXMuZW5yb2xsX3N0YWdlcyA9IGZwaW5zdGFuY2UuZW5yb2xsX3N0YWdlcztcbiAgICAgICAgdGhpcy5zdXBwb3J0c19pbWFnaW5nID0gZnBpbnN0YW5jZS5zdXBwb3J0c19pbWFnaW5nO1xuICAgICAgICB0aGlzLnN1cHBvcnRzX2lkZW50aWZpY2F0aW9uID0gZnBpbnN0YW5jZS5zdXBwb3J0c19pZGVudGlmaWNhdGlvbjtcbiAgICAgICAgdGhpcy5pbWdfd2lkdGggPSBmcGluc3RhbmNlLmltZ193aWR0aDtcbiAgICAgICAgdGhpcy5pbWdfaGVpZ2h0ID0gZnBpbnN0YW5jZS5pbWdfaGVpZ2h0O1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIGZwcmludCB7XG5cbiAgICAvLyBJbml0aWFsaXplcyBsaWJmcHJpbnQgYW5kIHJldHVybnMgMCBpZiBzdWNjZXNzZnVsLlxuICAgIGluaXQoKSA6IG51bWJlciAge1xuICAgICAgICByZXR1cm4gZnByaW50YmluZGluZy5pbml0KCk7XG4gICAgfVxuXG4gICAgZGlzY292ZXIoKSB7XG4gICAgICAgIHZhciBkZXZpY2VzID0gW107XG4gICAgICAgIGZwcmludGJpbmRpbmcuZGlzY292ZXIoIGZ1bmN0aW9uKGhhbmRsZSwgZGV2aWQsIGRydnR5cGUsIGRydm5hbWUsIGRydmZ1bGxuYW1lKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRoaXNkZXYgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGU6IGhhbmRsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRldmljZWlkOiBkZXZpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRyaXZlcl90eXBlOiBkcnZ0eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZHJpdmVyOiBkcnZuYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgZHJpdmVyX2RldGFpbDogZHJ2ZnVsbG5hbWVcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICBkZXZpY2VzLnB1c2godGhpc2Rldik7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGRldmljZXM7XG4gICAgfVxuXG4gICAgZ2V0X3JlYWRlcihoYW5kbGU6IG51bWJlcikge1xuICAgICAgICB2YXIgcmVhZGVyID0gbmV3IGZwcmludGJpbmRpbmcuZnByZWFkZXIoaGFuZGxlKTtcbiAgICAgICAgaWYgKHR5cGVvZiByZWFkZXIgIT0gJ3VuZGVmaW5lZCcpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgZnByZWFkZXIocmVhZGVyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBleGl0KCkgOiB2b2lkIHtcbiAgICAgICAgcmV0dXJuIGZwcmludGJpbmRpbmcuZXhpdCgpO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yICgpIHsgfVxufVxuIl19