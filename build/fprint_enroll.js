#!/usr/bin/env node
// This script lists the available fingerprint readers on the system.
/// <reference path="../typings/tsd.d.ts"/>
var promise = require("bluebird");
var libfprint = promise.promisifyAll(require("../"));
var sprintf = require("sprintf-js").sprintf;

var verbose = false;
if (process.argv.length > 2) {
    if (process.argv[2] == "-v") {
        verbose = true;
    } else {
        console.log("usage: lsfprint [-v]");
        process.exit(0);
    }
}

var fp = new libfprint.fprint();
console.log(sprintf("%8s %-8s %-8s %-32s", "handle", "type", "driver", "description"));

fp.init();
fp.discover().forEach(function (entry) {
    console.log(sprintf("%8d %-8s %-8s %-32s", entry.handle, entry.driver_type, entry.driver, entry.driver_detail));

    if (verbose) {
        var reader = promise.promisifyAll(fp.get_reader(entry.handle));
        console.log(sprintf("\t Enroll stages: %d", reader.enroll_stages));
        console.log(sprintf("\t Supports imaging: %s", reader.supports_imaging));
        console.log(sprintf("\t Supports identification: %s", reader.supports_identification));
        console.log(sprintf("\t Image height: %d", reader.img_height));
        console.log(sprintf("\t Image width: %d", reader.img_width));
        reader.start_enrollAsync().then(function (result) {
            console.log(result);
        }).catch(function (err) {
            console.log("ERR");
            console.log(err);
        });

        console.log("DONE");
    }
});
console.log("BYE");

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZwcmludF9lbnJvbGwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEscUVBQXFFO0FBRXJFLDJDQUEyQztBQUUzQyxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDO0FBQ2pDLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3BELElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPOztBQUUzQyxJQUFJLE9BQU8sR0FBRyxLQUFLO0FBQ25CLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUMzQjtJQUNJLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQzNCO1FBQ0ksT0FBTyxHQUFHLElBQUk7S0FDakIsS0FFRDtRQUNJLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLENBQUM7UUFDbkMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7S0FDbEI7Q0FDSjs7QUFFRCxJQUFJLEVBQUUsR0FBRyxJQUFJLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMvQixPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxhQUFhLENBQUMsQ0FBQzs7QUFFdEYsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ1QsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsS0FBSztJQUV6QixPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxXQUFXLEVBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUM7O0lBRWhILElBQUksT0FBTyxDQUNYO1FBQ0ksSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM5RCxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxzQkFBc0IsRUFBRSxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDbEUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMseUJBQXlCLEVBQUUsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDeEUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsZ0NBQWdDLEVBQUUsTUFBTSxDQUFDLHVCQUF1QixDQUFDLENBQUM7UUFDdEYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMscUJBQXFCLEVBQUUsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzlELE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLG9CQUFvQixFQUFFLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUM1RCxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FDM0IsVUFBVSxNQUFNO1lBRVosT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUM7UUFDdkIsQ0FBQyxDQUNBLENBQ0EsS0FBSyxDQUNGLFVBQVUsR0FBRztZQUVULE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDO1lBQ2xCLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO1FBQ3BCLENBQUMsQ0FDSjs7UUFFRCxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQztLQUMxQjtBQUNMLENBQUMsQ0FBQztBQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDIiwiZmlsZSI6ImZwcmludF9lbnJvbGwuanMiLCJzb3VyY2VSb290IjoiL2hvbWUvYWVyby9ub2RlLWxpYmZwcmludC8iLCJzb3VyY2VzQ29udGVudCI6WyIvLyBUaGlzIHNjcmlwdCBsaXN0cyB0aGUgYXZhaWxhYmxlIGZpbmdlcnByaW50IHJlYWRlcnMgb24gdGhlIHN5c3RlbS5cblxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3R5cGluZ3MvdHNkLmQudHNcIi8+XG5cbnZhciBwcm9taXNlID0gcmVxdWlyZShcImJsdWViaXJkXCIpO1xudmFyIGxpYmZwcmludCA9IHByb21pc2UucHJvbWlzaWZ5QWxsKHJlcXVpcmUoXCIuLi9cIikpO1xudmFyIHNwcmludGYgPSByZXF1aXJlKFwic3ByaW50Zi1qc1wiKS5zcHJpbnRmO1xuXG52YXIgdmVyYm9zZSA9IGZhbHNlO1xuaWYgKHByb2Nlc3MuYXJndi5sZW5ndGggPiAyKVxue1xuICAgIGlmIChwcm9jZXNzLmFyZ3ZbMl0gPT0gXCItdlwiKVxuICAgIHtcbiAgICAgICAgdmVyYm9zZSA9IHRydWU7XG4gICAgfVxuICAgIGVsc2VcbiAgICB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwidXNhZ2U6IGxzZnByaW50IFstdl1cIik7XG4gICAgICAgIHByb2Nlc3MuZXhpdCgwKTtcbiAgICB9XG59XG5cbnZhciBmcCA9IG5ldyBsaWJmcHJpbnQuZnByaW50KCk7XG5jb25zb2xlLmxvZyhzcHJpbnRmKFwiJThzICUtOHMgJS04cyAlLTMyc1wiLCBcImhhbmRsZVwiLCBcInR5cGVcIiwgXCJkcml2ZXJcIiwgXCJkZXNjcmlwdGlvblwiKSk7XG5cbmZwLmluaXQoKTtcbmZwLmRpc2NvdmVyKCkuZm9yRWFjaChmdW5jdGlvbiAoZW50cnkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNwcmludGYoXCIlOGQgJS04cyAlLThzICUtMzJzXCIsIGVudHJ5LmhhbmRsZSwgZW50cnkuZHJpdmVyX3R5cGUsICBlbnRyeS5kcml2ZXIsIGVudHJ5LmRyaXZlcl9kZXRhaWwpKTtcblxuICAgICAgICAgICAgaWYgKHZlcmJvc2UpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdmFyIHJlYWRlciA9IHByb21pc2UucHJvbWlzaWZ5QWxsKGZwLmdldF9yZWFkZXIoZW50cnkuaGFuZGxlKSk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coc3ByaW50ZihcIlxcdCBFbnJvbGwgc3RhZ2VzOiAlZFwiLCByZWFkZXIuZW5yb2xsX3N0YWdlcykpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHNwcmludGYoXCJcXHQgU3VwcG9ydHMgaW1hZ2luZzogJXNcIiwgcmVhZGVyLnN1cHBvcnRzX2ltYWdpbmcpKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhzcHJpbnRmKFwiXFx0IFN1cHBvcnRzIGlkZW50aWZpY2F0aW9uOiAlc1wiLCByZWFkZXIuc3VwcG9ydHNfaWRlbnRpZmljYXRpb24pKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhzcHJpbnRmKFwiXFx0IEltYWdlIGhlaWdodDogJWRcIiwgcmVhZGVyLmltZ19oZWlnaHQpKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhzcHJpbnRmKFwiXFx0IEltYWdlIHdpZHRoOiAlZFwiLCByZWFkZXIuaW1nX3dpZHRoKSk7XG4gICAgICAgICAgICAgICAgcmVhZGVyLnN0YXJ0X2Vucm9sbEFzeW5jKCkudGhlbihcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHJlc3VsdClcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaChcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChlcnIpXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFUlJcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgKVxuXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRE9ORVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5jb25zb2xlLmxvZyhcIkJZRVwiKTtcbiJdfQ==