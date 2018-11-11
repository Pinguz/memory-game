/*
项目主要涉及内容：
1. 注册点击事件，然后需要确定使用事件委托，在所有卡牌的父元素上设置监听器
2. 然后，确保每次点击的事件仅对未打开的卡牌有效（排除已经匹配的和已经翻开的牌）
3. 每次点击卡牌翻开卡牌（函数 displayCardSymbol），同时，将这张牌放入一个
  表示当前打开的卡牌的数组 openCards（函数 addCardToOpenCards）
4. 当openCards 中包含两张卡牌时，进行对比 * 如果卡牌相同，则匹配相关操作
（函数 lockMatchedCard，在此函数中将匹配卡牌放入数组 matchedCards ，注
  意检查 matchedCards 是否达到数量16，如果达到就赢了，显示隐藏的胜利信息 modal 窗口）
   * 如果卡牌不同，则卡牌翻过去恢复隐藏状态（函数 hideCardSymbol）
*/

//设置变量
const timer = document.getElementById('timer');
const restartBtn = document.getElementsByClassName('restart');
const deck =document.getElementsByClassName('deck');
const card = document.getElementsByClassName('card');
const moves =
const movesText =
const starOne
const starTwo
const totalMoves
const totalStars
const playAgainBtn
const seconds
const minutes

// 创建一个包含所有卡片的数组
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
      if (openCard[0][0].classList[2] === openCard[1][0].classList[2]){
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
