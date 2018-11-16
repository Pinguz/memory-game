/*
参考思路：
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

const cardIcons = [
  "fa-diamond",
  "fa-paper-plane-o",
  "fa-anchor",
  "fa-bolt",
  "fa-cube",
  "fa-anchor",
  "fa-leaf",
  "fa-bicycle",
  "fa-diamond",
  "fa-bomb",
  "fa-leaf",
  "fa-bomb",
  "fa-bolt",
  "fa-bicycle",
  "fa-paper-plane-o",
  "fa-cube"
];

// 设置元素
const deck = document.getElementsByClassName("deck")[0];
const stars = document.getElementsByClassName("stars")[0];
const moves = document.getElementsByClassName("moves")[0];
const gameTime = document.getElementsByClassName("game-time")[0];
const restartBtn = document.getElementsByClassName("restart")[0];
const modal = document.getElementsByClassName("modal")[0];
const successMessage = document.getElementsByClassName("success-sub-msg")[0];
const playAgain = document.getElementsByClassName("play-again")[0];


// 初始化变量

let openCards = [];
let moveCounter = 0;
let message = "";
let starNum = 3;
let starResultHtml = "";
let startDate = null;
let finalTime = 0;
let timerID = null;
let firstClick = true;
let matchedCards = 0;
let closeicon = document.getElementsByClassName('close')[0];

// 初始化页面

function initialize(){
  document.addEventListener("DOMContentLoaded",function(){
    resetGame();
    events();
  });
}
// 设置页面点击事件

function events(){
  // 事件委托
  deck.addEventListener("click", function(e) {
    // 浏览器兼容
    let event = e || window.event;
    let target = event.target || event.srcElement;
    if (
      target.nodeName.toLocaleLowerCase() === "li" &&
      !hasClass(target,"open")
    ) {
      if (firstClick) {
        // 计时器
        startDate = new Date();
        timerID = setInterval(function() {
          finalTime = Math.round((new Date() - startDate) / 1000);
          gameTime.innerHTML = finalTime;
        }, 1000);

        firstClick = false;
      }
      // DOM操作
      displayCardSymbol(target);
      addCardToOpenCards(target);
      if (openCards.length === 2) {
        showMoveCounter();
        openCards[0].innerHTML === openCards[1].innerHTML
          ? lockMatchedCard()
          : hideCardSymbol();
      }
    }
  });
  // 重置事件
  restartBtn.addEventListener("click", function() {
    resetGame();
  });

  playAgain.addEventListener("click", function() {
    modal.classList = "modal";
    resetGame();
  });
  // 关闭按钮
  closeicon.onclick = function() {
    modal.style.display = "none";
    resetGame();
  };
}

// 重置游戏数据

function resetGame() {
  clearInterval(timerID);
  openCards = [];
  matchedCards = 0;
  moveCounter = 0;
  message = "";
  starNum = 3;
  startDate = null;
  finalTime = 0;
  timerID = null;
  firstClick = true;
  starResultHtml = "";
  moves.innerHTML = "0";
  deck.innerHTML = "";
  stars.innerHTML =
    '<li><i class="fa fa-star"></i></li> <li><i class="fa fa-star"></i></li> <li><i class="fa fa-star"></i></li>';
  successMessage.innerHTML = "With #{move} moves in #{time} seconds #{stars}.";
  gameTime.innerHTML = "0";
  shuffleCards(cardIcons);
}

// 洗牌函数

function shuffleCards(arr) {
  //打乱数组
  shuffle(arr);
  let str = "";
  for (let i = 0; i < arr.length; i++) {
    str = str + `<li class="card"><i class="fa ${arr[i]}"></i></li>\n`;
  }
  deck.insertAdjacentHTML("afterbegin",str);
}
// 显示移动步数
function showMoveCounter() {
  moves.innerHTML = "";
  moveCounter++;

  if (moveCounter > 10 && moveCounter < 18) {
    starNum = 2;
    stars.innerHTML = `<li><i class="fa fa-star"></i></li>
                      <li><i class="fa fa-star"></i></li>` ;
  } else if (moveCounter >= 18) {
    starNum = 1;
    stars.innerHTML = `<li><i class="fa fa-star"></i></li>`;
  } else {
    starNum = 3;
  }
  moves.insertAdjacentHTML("afterbegin",moveCounter);
}

function displayCardSymbol(el) {
  el.classList += " open show animated flipInY";
}

function addCardToOpenCards(el) {
  openCards.push(el);
}

function hideCardSymbol() {
  openCards.forEach(function(card) {
    card.classList = "card open show error animated shake";
    setTimeout(function() {
      card.className = "card";
    },1000);
  });
  openCards = [];
}

// 如果卡牌匹配成功

function lockMatchedCard() {
  openCards.forEach(function(card) {
    card.classList = "card open match animated bounceIn";
  });
  matchedCards = matchedCards + 2;
  isWin();
  openCards = [];
}
function isWin() {
  if (matchedCards === 16) {
    setTimeout(function() {
      alertMessage();
    },500);
  }
}

// 成功弹窗

function alertMessage() {
  if (starNum === 3) {
    starResultHtml = `<i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i>`;
  } else if (starNum === 2) {
    starResultHtml = `<i class="fa fa-star"></i><i class="fa fa-star"></i>`;
  } else if (starNum === 1) {
    starResultHtml = `<i class="fa fa-star"></i>`;
  }
  modal.className += " active";
  message = successMessage.textContent.replace("#{move}",moveCounter);
  message = message.replace("#{stars}", starResultHtml);
  message = message.replace("#{time}", finalTime);
  successMessage.innerHTML = "";
  successMessage.insertAdjacentHTML("afterbegin", message);
}

// 是否包含某个类别

function hasClass(el, classList) {
  if (el.classList) {
    return el.classList.contains(classList);
  } else {
    return new RegExp("(^| )" + classList + "( |$)", "gi").test(el.classList);
  }
}

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

initialize();

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
