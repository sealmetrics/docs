/* SealMetrics Tracker Code */
(function() {
  var options = {
    account: '6877c5da3738f4296a4916fb',
    event: 'pageview',
    use_session: 1,
  };
  
  var url = "//app.sealmetrics.com/tag/v2/tracker";
  
  function loadScript(callback) {
    var script = document.createElement("script");
    script.src = url;
    script.async = true;
    script.onload = function() {
      if (typeof callback === "function") {
        callback();
      }
    };
    script.onerror = function() {
      console.error("Error loading script: " + url);
    };
    document.getElementsByTagName("head")[0].appendChild(script);
  }
  
  loadScript(function() {
    options.id = Math.floor((Math.random() * 999) + 1);
    if (window.sm) {
      var instance = new window.sm(options);
      instance.track(options.event);
    } else {
      console.error("sm2 plugin is not available");
    }
  });
})();
/* End SealMetrics Tracker Code */