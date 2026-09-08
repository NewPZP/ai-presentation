/**
 * LinguaAI 建造课程 — 共享测验组件
 * 用法（在课程页底部）：
 *   <div class="quiz" id="quiz"></div>
 *   <script src="../assets/quiz.js"></script>
 *   <script>
 *     LinguaQuiz('#quiz', [
 *       { q: '题干', options: ['A', 'B', 'C', 'D'], answer: 0, explain: '解析' },
 *     ])
 *   </script>
 * 即时反馈：选错标红并高亮正确项；全部作答后显示总分。
 */
(function () {
  'use strict'

  function render(rootEl, questions) {
    var score = 0
    var answered = 0
    var els = []

    var resultEl = document.createElement('p')
    resultEl.className = 'quiz-result'
    rootEl.appendChild(resultEl)

    questions.forEach(function (item, qi) {
      var qEl = document.createElement('div')
      qEl.className = 'quiz-q'

      var title = document.createElement('div')
      title.className = 'quiz-q-title'
      title.textContent = 'Q' + (qi + 1) + '. ' + item.q
      qEl.appendChild(title)

      var opts = []
      item.options.forEach(function (text, oi) {
        var btn = document.createElement('button')
        btn.type = 'button'
        btn.className = 'quiz-opt'
        btn.textContent = text
        btn.addEventListener('click', function () {
          if (qEl.classList.contains('answered')) return
          qEl.classList.add('answered')
          var correct = oi === item.answer
          if (correct) score++
          answered++
          opts.forEach(function (b, i) {
            b.disabled = true
            if (i === item.answer) b.classList.add('is-correct')
            else if (i === oi) b.classList.add('is-wrong')
          })
          if (answered === questions.length) {
            resultEl.textContent = '得分 ' + score + ' / ' + questions.length +
              (score === questions.length ? ' — 满分，可以进入下一课了。' : ' — 建议回顾上文标注的要点后再继续。')
            resultEl.classList.add('show')
          }
        })
        opts.push(btn)
        qEl.appendChild(btn)
      })

      var explain = document.createElement('div')
      explain.className = 'quiz-explain'
      explain.textContent = item.explain
      qEl.appendChild(explain)

      els.push(qEl)
      rootEl.appendChild(qEl)
    })
  }

  window.LinguaQuiz = function (selector, questions) {
    var rootEl = document.querySelector(selector)
    if (!rootEl || !Array.isArray(questions) || questions.length === 0) return
    render(rootEl, questions)
  }
})()
