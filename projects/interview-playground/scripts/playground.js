(function(){
    'use strict';
    let loader = $("#loader"), max = 5;
    let loadingContainer = $("#list-template").html(),
        loadingItem = $("#list-item-template").html(),
        i = 0;
    let getLoadingItem = () => {
      let $loadingItem = $(loadingItem);
      $loadingItem.css('width', (100 / max) + "%");
      return $loadingItem;
    };
    let getCounter = (function(){
      return new Promise((resolve, reject) => {
          resolve(i++);
      });
    });
    var interv = setInterval(() => {
      let promise = getCounter();
      promise.then((value) => {
        if(value >= max){
          clearInterval(interv);
          return;
        }
        loader.find('.loading-container').append(getLoadingItem());
      });
    }, 1000);
    loader.append(loadingContainer);

})();
