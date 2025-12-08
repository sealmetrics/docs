/* SealMetrics Tracker Code */
(function() {
  // Determine content_grouping based on URL path
  var path = window.location.pathname;
  var contentGrouping = path.startsWith('/blog') ? 'Blog' : 'Docs';

  var options = {
    account: '60a52f6ac660b269d13c3f53',
    event: 'pageview',
    content_grouping: contentGrouping,
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