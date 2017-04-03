$(function(){
  var componentActiveGlobal  = [];
  var attemptsGlobal  = 0;
  var imagesRemaining = 16;
  var secondsCounter = 0;
  var timerHandle = {};
  var avgTurnAroundTime = 0;
  $(".front").html("<img src='./images/cover.jpg' class='cover' />")
  boot();

  function startTimer(){
    timerHandle = setInterval(function(){
        if(imagesRemaining < 1){
             clearInterval(timerHandle);
             showScores();
        }
        secondsCounter++;
        updateTimer();
    },1000);
  }

  function showScores(){
    $('.scores').show();
    $('.board').hide();
  }

  function showBoard(){
    $('.scores').hide();
    $('.board').show();
  }

  function updateScores(){
      var avgTAT = secondsCounter/(8 + attemptsGlobal);
      $('.avg-turn-around').html(avgTAT);
      $('.images-remaining').html(imagesRemaining/2);
      $('.total-attempts').html(attemptsGlobal);
  }

  function updateTimer(){
      var mins = parseInt(secondsCounter / 60);
      var secs = parseInt(secondsCounter % 60);
      var timeString  = mins +" mins and " + secs +" seconds";
      $('.timer').html(timeString);
  }

  function boot(){
    var arr = random(16);
    loadImages(arr);
    showAllFor(3);
    updateScores();
    updateTimer();
    showBoard();
  }

  function showAllFor(seconds){
    $('.flip-container').toggleClass('flip');
    setTimeout(function(){
      $('.flip-container').toggleClass('flip');
      startTimer();
    }, seconds * 1000);
  }


  function loadImages(arr){
    var counter = 1;
    var componentArr = arr.map( function(a,i){
      var card = $('#c-'+a);
      card.data("img-code",counter)
      $('#c-'+a+' .back').html("<img class='cover' src='./images/img"+(counter++)+".jpg'>")
      if(counter > 8){
        counter = 1;
      }
    })
  }

  function checkIfUncoverPair(component){
      if(componentActiveGlobal.length == 2
              && componentActiveGlobal[0] != componentActiveGlobal[1]
              && isImageMatch()
        ){
          componentActiveGlobal.forEach(function(c){
              var id = $(c).attr('id');
              $(c).unbind("click",clickHandler);
              imagesRemaining--;
              updateScores();
          });

          componentActiveGlobal = [];
      }

  }


  function isImageMatch(){
      return($(componentActiveGlobal[0]).data('img-code') === $(componentActiveGlobal[1]).data('img-code'));
  }

  function coverPair(component){
    componentActiveGlobal.map(function(c){
      $(c).toggleClass("flip");
    });
    componentActiveGlobal = [];
    attemptsGlobal++;
    updateScores();
    return handleClick(component);
  }

  function handleClick(component){
    if(componentActiveGlobal.length < 2){
      componentActiveGlobal.push(component)
      $(component).toggleClass("flip");
      checkIfUncoverPair(component);
      return;
    }
    return coverPair(component);
  }

  $(".bgb").click(clickHandler)
  function clickHandler(e){
      e.stopPropagation();
      handleClick(this);
  }

  var perm = new permutation();
  var rng = perm.range


  //-----------PERMUTATION-------
  function permutation(input) {
    if (Array.isArray(input)) {
      return permutationA(input);
    }
    return permutationN.apply(null, arguments);
  }

  function * permutationN() {
    var input = range.apply(null, arguments);
    yield * permutationA(input);
  }

  function _permutation() {
    var iter = permutation.apply(null, arguments);
    var output = [];
    for (var perm of iter) {
      output.push(perm);
    }
    return output;
  }

  function * permutationA(input) {
    var n = input.length;
    if (n < 2) {
      return input;
    }
    for (var i of inversions(n)) {
      yield fromInversions(i).map(function (i) {
        return input[i];
      });
    }
  }

  function range(low, high, step) {
    if (arguments.length === 1) {
      high = low;
      low = 0;
    }
    low = +low || 0;
    high = +high || 0;
    step = +step || 1;
    var ret = [];
    var inc = step > 0;
    while (true) {
      if (inc && low >= high) {
        break;
      }
      if (!inc && low <= high) {
        break;
      }
      ret.push(low);
      low = low + step;
    }
    return ret;
  }

  function fromInversions(inversions) {
    var ret = [];
    var n = inversions.length;
    inversions.forEach(function (i, k) {
      var t = 0;
      for (var j = 0; j < n; j++) {
        if (ret[j] == null && ++t === i + 1) {
          ret[j] = k;
          return;
        }
      }
    });
    return ret;
  }


  function * inversions(n) {
    var inversions = [];
    for (var i = 0; i < n; i++) {
      inversions.push(0);
    }
    do {
      yield inversions;
    } while(addOne(inversions, n));
  }

  function addOne(inversions, n) {
    var i = 0;
    while (i < n - 1) {
      // the current level is cool
      if (inversions[i] < n - i - 1) {
        inversions[i]++;
        return true;
      }
      // now we have to go to the next level
      // until we reach the last level,
      // which means failing to add 1
      // i.e. number `n-1` can not have any inversions
      inversions[i] = 0;
      i++;
    }
    return false;
  }

  function random(low, high) {
    if (Array.isArray(low)) {
      return randomA(low);
    }
    return randomN.apply(null, arguments);
  }

  // produce an array of numbers which falls in [low, high)
  function randomN() {
    var input = range.apply(null, arguments);
    return randomA(input);
  }

  function randomA(input) {
    var n = input.length;
    if (!n) {
      return [];
    }
    var inversions = randomInversions(input.length);
    return fromInversions(inversions).map(function (i) {
      return input[i];
    });
  }

  function randomInversions(n) {
    var inversions = [];
    while (n > 1) {
      inversions.push(Math.floor(n * Math.random()));
      n--;
    }
    inversions.push(0);
    return inversions;
  }


});
