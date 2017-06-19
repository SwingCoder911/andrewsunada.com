(function(){
  String.prototype.repeater = function(val){
    var output = "", duplicate = this;
    for(var i = 0, len = val; i < len; i++){
      output += duplicate;
    }
    return output;
  };
  console.log("Hello World!".repeater(3));
})();
