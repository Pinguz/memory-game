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
// const timer = document.getElementById('timer');
const restartBtn = document.getElementsByClassName('restart');
const deck =document.getElementsByClassName('deck');
const card = document.getElementsByClassName('card');
const moves = document.getElementsByClassName('moves');
const movesText = document.getElementById('movesText');
const stars = document.querySelector('.fa-star');
const starsList = document.querySelector('.stars li')
const starOne = document.getElementById('starOne');
const starTwo = document.getElementById('starTwo');
const starThree = document.getElementById('starThree');
const totalMoves = document.getElementById('total-moves');
const totalStars = document.getElementById('total-stars');
const playAgainBtn = document.getElementById('paly-again-btn');
// const second = document.getElementsByClassName('seconds');
const minute = document.getElementsByClassName('minutes');
let matchedCard = document.getElementsByClassName('match');

// 创建一个包含所有卡片的数组
let cards = ["fa-diamond", "fa-diamond", "fa-paper-plane-o", "fa-paper-plane-o", "fa-anchor", "fa-anchor", "fa-bolt", "fa-bolt", "fa-cube", "fa-cube", "fa-leaf", "fa-leaf", "fa-bicycle", "fa-bicycle", "fa-bomb", "fa-bomb"];

let openedCards = [];
// let moves = 0;
let starts = 3;
let matchFound = 0;
// let startGame = false;

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
// 当页面刷新时洗牌
document.body.onload = startGame();

function startGame(){
  cards = shuffle(cards);
  for (var i = 0; i < cards.length; i++){
    deck.innerHTML = "";
    [].forEach.call(cards, function(item) {
      deck.appendChild(item);
    });
    cards[i].classList.remove("show","open","match","disable");
  }
  // 重置步数
  moves = 0;
  counter.innerHTML = moves;
  for (var i = 0; i < stars.length; i++){
    stars[i].style.color = "#{FFD700}";
    stars[i].style.visibility = "visible";
  }
  // 重置事件
  second = 0;
  minute = 0;
  hour = 0;
  var timer = document.querySelector(".timer");
  timer.innerHTML = "0 mins o secs";
  clearInterval(interval);
}

// 切换打开跟显示卡片的类型
var displayCard = function (){
  this.classList.toggle("open");
  this.classList.toggle("show");
  this.classList.toggle("disabled");
};

// 将卡片与已翻开卡片进行对比判断是否同类型
function cardOpen() {
  openedCards.push(this);
  var len = openedCards.length;
  if( len === 2){
    moveCounter();
    if(openedCards[0].type === openedCards[1].type){
      matched();
    } else {
      unmatched();
    }
  }
};

// 卡片匹配时
function matched(){
  openedCards[0].classList.add("match","disabled");
  openedCards[1].classList.add("match","disabled");
  openedCards[0].classList.remove("show","open","no-event");
  openedCards[1].classList.remove("show","open","no-event");
  openedCards = [];
}
// 卡片不匹配时
function unmatched(){
  openedCards[0].classList.add("unmatched");
  openedCards[1].classList.add("unmatched");
  disable();
  setTimeout(function(){
    openedCards[0].classList.remove("show","open","no-event","unmatched");
    openedCards[1].classList.remove("show","open","no-event","unmatched");
    enable();
    openedCards = [];
  },1100);
}
// 暂时禁用卡片
function disable(){
  Array.prototype.filter.call(cards, function(card){
    card.classList.add("disabled");
  });
}
// 启用卡和禁用匹配卡
function enable(){
  Array.prototype.filter.call(cards, function(card){
    card.classList.remove("disabled");
    for(var i = 0; i < matchedCard.length; i++){
      matchedCard[i].classList.add("disabled");
    }
  });
}
// 计算用户步数
function moveCounter(){
  moves++;
  counter.innerHTML = moves;
  // 第一次点击后开始
  if(moves == 1){
    second = 0;
    minute = 0;
    hour = 0;
    startTimer();
  }
  // 根据步数设定星级
  if(moves > 8 && moves < 12){
    for( i = 0; i < 3; i++){
      if(i > 1){
        stars[i].stytle.visibility = "collapse";
      }
    }
  }
  else if (move > 13){
    for( i = 0; i < 3; i++){
      if(i > 0){
        stars[1].style.visibility = "collapse";
      }
    }
  }
}
// 游戏计时器
var second = 0;minute =0;hour = 0;
var timer = document.querySelector(",timer");
var interval;
function startTimer(){
  interval = setInterval(function(){
    timer.innerHTML = minute+"mins "+second+"secs";
    second++;
    if(second == 60){
      minute++;
      second=0;
    }
    if(minute == 60){
      hour++;
      minute = 0;
    }
  },1000);
}

//当游戏完成时显示弹层
function congratulations() {
  if (matchedCard.length == 16){
    clearInterval(interval);
    finalTime = timer.innerHTML;
    // 显示卡片
    modal.classList.add("show");
    // 显示星级
    var starRating = document.querySelector(".stars").innerHTML;
    // 显示成绩
    document.getElementById("finalMove").innerHTML = moves;
    document.getElementById("starRating").innerHTML = starRating;
    document.getElementById("totalTime").innerHTML = finalTime;

    closeModal();
  };
}
// 关闭按钮
function closeModal() {
  closeicon.addEventListener("click",function(e){
    modal.classList.remove("show");
    startGame();
  });
}
// 重新开始
function playAgain(){
  modal.classList.remove("show");
  startGame();
}
// 给卡片添加监听事件
for (var i = 0; i < cards.length; i++){
  card = cards[i];
  card.addEventListener("click",displayCard);
  card.addEventListener("click",cardOpen);
  card.addEventListener("click",congratulations);
};
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
