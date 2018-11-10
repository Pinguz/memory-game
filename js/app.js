/*
 * 创建一个包含所有卡片的数组
 */
let cards = ["fa-diamond", "fa-diamond", "fa-paper-plane-o", "fa-paper-plane-o", "fa-anchor", "fa-anchor", "fa-bolt", "fa-bolt", "fa-cube", "fa-cube", "fa-leaf", "fa-leaf", "fa-bicycle", "fa-bicycle", "fa-bomb", "fa-bomb"];

let openCard = [];
let moves = 0;
let starts = 3;
let matchFound = 0;
let startGame = false;

/*
 * 显示页面上的卡片
 *   - 使用下面提供的 "shuffle" 方法对数组中的卡片进行洗牌
 *   - 循环遍历每张卡片，创建其 HTML
 *   - 将每张卡的 HTML 添加到页面
 */

// 洗牌函数来自于 http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

//循环遍历每张卡片，创建其 HTML
function createCard(){
  let cardList = shuffle(cards);
  cardList.forEach(function(card){
    $(".deck").append('<li><i class="card fa '+ card + '"></i></li>');
  })
}

function findMatch(){
  //显示点击的卡片
  $(".card").on("click",function(){
    if ($(this).hasClass("open show")){ return;}
    $(this).toggleClass("flipInY open show");
    openCard.push($(this));
    startGame = true;
  //判断卡列表
    if (openCard.length === 2) {
      if (openCard[0][0].classList[2]) === openCard[1][0].classList[2]{
        openCard[0][0].classList.add("bounceIn","match");
        openCard[1][0].classList.add("bounceIn","match");
        $(openCard[0]).off('click');
        $(openCard[1]).off('click');
        matchFound += 1;
        moves++;
        removeOpenCards();
        findWinner();
      } else {
        //如果类不匹配，显示错误提示
        openCard[0][0].classList.add("shake","wrong");
        openCard[1][0].classList.add("shake","wrong");
        moves++;
      }
    }
  updateMoves();
  })
}

//刷新步数
function updateMoves() {
  if (moves ===1) {
    $("#movesText").text(" Moves");
  } else {
    $("#movesText").text(" Moves");
  }
  $("#moves").text(moves.toString());

  if (moves > 0 && move < 16) {
    startRating = startRating;
  } else if (moves > 16 && move < 21) {
    $("#starOne").removeClass("fa-star");
    startRating = "2";
  } else if (moves > 21) {
    $("#starTwo").removeClass("fa-star");
    startRating = "1";
  }
}

//当游戏完成时显示弹层

/*
 * 设置一张卡片的事件监听器。 如果该卡片被点击：
 *  - 显示卡片的符号（将这个功能放在你从这个函数中调用的另一个函数中）
 *  - 将卡片添加到状态为 “open” 的 *数组* 中（将这个功能放在你从这个函数中调用的另一个函数中）
 *  - 如果数组中已有另一张卡，请检查两张卡片是否匹配
 *    + 如果卡片匹配，将卡片锁定为 "open" 状态（将这个功能放在你从这个函数中调用的另一个函数中）
 *    + 如果卡片不匹配，请将卡片从数组中移除并隐藏卡片的符号（将这个功能放在你从这个函数中调用的另一个函数中）
 *    + 增加移动计数器并将其显示在页面上（将这个功能放在你从这个函数中调用的另一个函数中）
 *    + 如果所有卡都匹配，则显示带有最终分数的消息（将这个功能放在你从这个函数中调用的另一个函数中）
 */
