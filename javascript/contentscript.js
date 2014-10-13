( function ($) {
    'use strict';
    $(document).ready(function () {
        var $downloadButton = $(".imageList > div > .slide > .details > .downloads");
        $downloadButton.each(function (index) {
            $(this).text("Download");
            $(this).click(function () {
                var $image = $(this).parent().parent().find("img.preview");
                var imgsrc = $image.attr("src");

                var match1 = imgsrc.match(/http:\/\/cdn(\d)\.freepik\.com\/(image|free-photo)\/th\/(\d+)-(\d+)\.(jpg|png)/);
                var downloadurl = "http://static.freepik.com/download/" + match1[3] + "/" + ( parseInt(match1[4].substr(0, 7)) + 1 ) + "/" + match1[4] + ".zip";

                var $imagelink = $(this).parent().parent().find("a.preview");
                var href = $imagelink.attr("href");
                var match2 = href.match(/http:\/\/www\.freepik\.com\/(free-vector)\/(.+)_(\d+)\.htm/);

                var bigImgSrc = "http://cdn" + match1[1] + ".freepik.com/" + match1[2] + "/" + match2[2] + "_" + match1[3] + "-" + match1[4] + "." + match1[5];

chrome.runtime.sendMessage(
    {
        from: "freepikdownloader-contentscript",
        imgurl: bigImgSrc,
        downloadurl: downloadurl
    }, function (response) {
        //...
    }
);
            });
        });
    })
}(jQuery) )