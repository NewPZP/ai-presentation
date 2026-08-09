/* =========================================================================
   共享测验组件 — 所有 lesson 引用本文件
   用法：<div class="quiz" data-correct="b" data-explanation="正确。因为...">
           <p class="quiz-title">...</p>
           <p class="quiz-question">...</p>
           <ul class="quiz-options">
             <li>选项 A</li>
             <li>选项 B</li>
             ...
           </ul>
           <div class="quiz-feedback"></div>
         </div>
   ========================================================================= */

document.querySelectorAll('.quiz').forEach(quiz => {
  const correct = quiz.dataset.correct;
  const explanation = quiz.dataset.explanation || '正确。';
  const options = quiz.querySelectorAll('.quiz-options li');
  const feedback = quiz.querySelector('.quiz-feedback');

  options.forEach((opt, i) => {
    const letter = String.fromCharCode(97 + i); // a, b, c, d...
    opt.addEventListener('click', () => {
      // 如果已经答过，不允许重复点击
      if (quiz.dataset.answered === 'true') return;

      options.forEach(o => o.classList.remove('correct', 'wrong'));
      if (letter === correct) {
        opt.classList.add('correct');
        feedback.innerHTML = '✓ ' + explanation;
      } else {
        opt.classList.add('wrong');
        // 标出正确答案
        if (options[correct.charCodeAt(0) - 97]) {
          options[correct.charCodeAt(0) - 97].classList.add('correct');
        }
        feedback.innerHTML = '✗ 正确答案是 ' + correct.toUpperCase() + '。' + explanation;
      }
      feedback.classList.add('shown');
      quiz.dataset.answered = 'true';
    });
  });
});
