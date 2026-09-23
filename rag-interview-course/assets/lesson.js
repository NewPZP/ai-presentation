/* =========================================================================
   RAG 面试冲刺课程 · 共享交互组件
   所有 lesson 链接本文件即可获得：
     1. 测验引擎  —— 选项自带反馈，不需要每课写 JS
     2. 自测计分  —— 页面里放一个 [data-quiz-score] 元素就自动汇总
     3. 打印展开  —— 打印时把 <details class="drill"> 的答案一起印出来
   用法（无需任何额外脚本）：

     <div class="quiz">
       <p class="quiz-title">检索练习</p>
       <p class="quiz-question">问题？</p>
       <ul class="quiz-options">
         <li data-correct="true" data-why="对，因为……">正确选项</li>
         <li data-why="不对，因为……">错误选项</li>
       </ul>
       <p class="quiz-feedback"></p>
     </div>

   约定：
     · 每个选项都要有 data-why（错也要说清错在哪，这才是反馈回路的全部价值）
     · 正确选项加 data-correct="true"，有且只有一个
     · 选项文字长度尽量一致，不要用格式泄露答案
   ========================================================================= */

(function () {
  'use strict';

  // ── 1. 测验引擎 ────────────────────────────────────────────────
  var quizzes = document.querySelectorAll('.quiz');
  var stats = { answered: 0, firstTry: 0 };

  function updateScoreboard() {
    var board = document.querySelector('[data-quiz-score]');
    if (!board) return;
    board.textContent =
      '自测进度：' + stats.answered + '/' + quizzes.length +
      ' 题已作答，其中 ' + stats.firstTry + ' 题一次答对。';
  }

  quizzes.forEach(function (quiz) {
    var options = Array.prototype.slice.call(quiz.querySelectorAll('.quiz-options li'));
    var feedback = quiz.querySelector('.quiz-feedback');
    var settled = false;   // 是否已锁定（答对后锁定；答错可重试）
    var firstAttempt = true;

    options.forEach(function (opt) {
      opt.addEventListener('click', function () {
        if (settled) return;

        var isCorrect = opt.dataset.correct === 'true';
        options.forEach(function (o) { o.classList.remove('correct', 'wrong'); });

        if (firstAttempt) {
          firstAttempt = false;
          if (isCorrect) stats.firstTry += 1;
        }

        if (isCorrect) {
          settled = true;
          opt.classList.add('correct');
          feedback.innerHTML = '✓ ' + (opt.dataset.why || '正确。');
          feedback.classList.add('shown');
          if (stats.answered < quizzes.length) stats.answered += 1;
          updateScoreboard();
        } else {
          opt.classList.add('wrong');
          var right = quiz.querySelector('[data-correct="true"]');
          if (right) right.classList.add('correct');
          feedback.innerHTML =
            '✗ ' + (opt.dataset.why || '再想想。') +
            '<br><span class="quiz-retry">点另一个选项再试一次；想清楚再点，别靠排除法。</span>';
          feedback.classList.add('shown');
        }
      });
    });
  });

  updateScoreboard();

  // ── 2. 打印时展开所有自测题答案 ─────────────────────────────────
  // 纸质版才是真正会反复看的那一版，答案必须跟着一起印出来。
  var opened = [];

  function openAllDrills() {
    opened = [];
    document.querySelectorAll('details').forEach(function (d) {
      if (!d.open) { d.open = true; opened.push(d); }
    });
  }

  function restoreDrills() {
    opened.forEach(function (d) { d.open = false; });
    opened = [];
  }

  if (window.matchMedia) {
    var mq = window.matchMedia('print');
    var handler = function (e) { if (e.matches) { openAllDrills(); } else { restoreDrills(); } };
    if (mq.addEventListener) mq.addEventListener('change', handler);
    else if (mq.addListener) mq.addListener(handler);
  }
  window.addEventListener('beforeprint', openAllDrills);
  window.addEventListener('afterprint', restoreDrills);
})();
