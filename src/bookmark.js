(function() {
    var addScript = function(src) {
      var s = document.createElement( 'script' );
      s.setAttribute( 'src', src+'?'+'time='+Date.parse(new Date()));
      document.body.appendChild( s );
    };
    addScript('http://127.0.0.1:8000/build/loader.min.js');
})();

// javascript:(function(){var a=function(a){var b=document.createElement("script");b.setAttribute("src",a+"?time="+Date.parse(new Date)),document.body.appendChild(b)};a("http://127.0.0.1:8000/build/loader.min.js")})();
