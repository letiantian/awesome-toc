(function() {


    Loader = (function() {

      var load_cursor = 0;
      var load_queue;

      var loadFinished = function() {
        load_cursor ++;
        if (load_cursor < load_queue.length) {
          loadScript();
        }
      }

      function loadError (oError) {
        console.error("The script " + oError.target.src + " is not accessible.");
      }


      var loadScript = function() {
        var url = load_queue[load_cursor];
        var script = document.createElement('script');
        script.type = "text/javascript";

        if (script.readyState){  //IE
            script.onreadystatechange = function(){
                if (script.readyState == "loaded" ||
                        script.readyState == "complete"){
                    script.onreadystatechange = null;
                    loadFinished();
                }
            };
        } else {  //Others
            script.onload = function(){
                loadFinished();
            };
        }

        script.onerror = loadError;

        // script.src = url+'?'+'time='+Date.parse(new Date());
        script.src = url;
        document.body.appendChild(script);
      };

      var loadMultiScript = function(url_array) {
        load_cursor = 0;
        load_queue = url_array;
        loadScript();
      }

      return {
        load: loadMultiScript,
      };

    })();

    jqueryUrl = 'http://127.0.0.1:8000/build/jquery-1.11.3.min.js';
    tocUrl    = 'http://127.0.0.1:8000/build/awesome-toc.min.js';
    gentocUrl = 'http://127.0.0.1:8000/build/gentoc.min.js';

    if (typeof(jQuery) == 'undefined' || typeof($) == 'undefined') {
        Loader.load([jqueryUrl, tocUrl, gentocUrl]);
    } else {
        Loader.load([tocUrl, gentocUrl]);
    }

})();
