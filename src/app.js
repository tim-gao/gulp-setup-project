
define(['jquery', 'mytime'], function ($, mytime) {
  return {
    init: function () {
      $(function () {
        // start code
        setInterval(mytime.newClock, 1000);
      });
    }
  };
});