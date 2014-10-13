var queue = {};

chrome.runtime.onMessage.addListener(
function (request, sender, sendResponse) {
    if (request.from == "freepikdownloader-contentscript") {
        var filename = request.downloadurl.substring(request.downloadurl.lastIndexOf('/') + 1);
        chrome.downloads.download({url: request.downloadurl}, function (downloadId) {
            queue[downloadId] = {url: request.imgurl};
        });
    }
});

chrome.downloads.onChanged.addListener(function (downloadDelta){
    console.log(downloadDelta);
    if(queue[downloadDelta.id]) {
        if (downloadDelta.hasOwnProperty("state")) {
            if (downloadDelta.state.current == "complete") {
                //Download success
                log("File name",queue[downloadDelta.id].filename);
                chrome.downloads.download({
                    url: queue[downloadDelta.id].url,
                    filename : queue[downloadDelta.id].filename
                }, function () {
                    delete queue[downloadDelta.id];
                    log("Queue", queue);
                });
            }else if(downloadDelta.state.current == "interrupted"){
                //Cancel
                delete queue[downloadDelta.id];
            }
        }
        if (!downloadDelta.hasOwnProperty("state")) {
            //Download started
            var filepathargs = downloadDelta.filename.current.replace("zip", "jpg").split("\\");
            var filepath = "freepik/" + filepathargs[filepathargs.length - 2] + "/" + filepathargs[filepathargs.length - 1];
            log("filepath", filepath);
            queue[downloadDelta.id].filename = filepath;
        }
    }
});

function log(name, data){
    console.log(name + " : ");
    console.log(data);
}