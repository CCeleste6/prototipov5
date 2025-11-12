
const QUESTIONS = {
  math: [
    {"id":"m1","tema":"Matemática","tipo":"Múltipla escolha","enunciado":"Calcule o valor de 3/4 de 48.","alternativas":["32","36","24","16"],"resposta":"36","pontos_PM":5,"gatilhos_PC":[{"tipo":"Marca Individual I","casa":"Precursores","pc":20}]},
    {"id":"m2","tema":"Matemática","tipo":"Aberta","enunciado":"Resolva a equação 2x + 5 = 17. Qual o valor de x?","resposta":"6","pontos_PM":6,"gatilhos_PC":[]},
    {"id":"m3","tema":"Matemática","tipo":"Múltipla escolha","enunciado":"Qual é o MMC entre 12 e 18?","alternativas":["36","72","54","6"],"resposta":"36","pontos_PM":5,"gatilhos_PC":[{"tipo":"Faísca Criativa I","casa":"Visionários","pc":3}]},
    {"id":"m4","tema":"Matemática","tipo":"Problema","enunciado":"Uma classe tem 24 alunos. Se 3/8 deles faltarem, quantos alunos permanecem presentes?","resposta":"18","pontos_PM":7,"gatilhos_PC":[{"tipo":"Escudo da disciplina I","casa":"Guardiões","pc":3}]},
    {"id":"m5","tema":"Matemática","tipo":"Múltipla escolha","enunciado":"Se um item custa R$ 45 e está com desconto de 20%, qual o preço final?","alternativas":["R$36","R$35","R$37","R$30"],"resposta":"R$36","pontos_PM":6,"gatilhos_PC":[]}
  ],
  portugues: [
    {"id":"p1","tema":"Português","tipo":"Múltipla escolha","enunciado":"Qual alternativa contém um verbo no pretérito perfeito?","alternativas":["eu comia","tu comeste","eles comerão","nós comeríamos"],"resposta":"tu comeste","pontos_PM":5,"gatilhos_PC":[{"tipo":"Inspiração Compartilhada I","casa":"Visionários","pc":7}]},
    {"id":"p2","tema":"Português","tipo":"Aberta","enunciado":"Reescreva a frase no plural: 'O aluno entregou a tarefa no prazo.'","resposta":"Os alunos entregaram as tarefas no prazo.","pontos_PM":6,"gatilhos_PC":[]},
    {"id":"p3","tema":"Português","tipo":"Múltipla escolha","enunciado":"Assinale a alternativa em que 'por que' está corretamente usado para introduzir pergunta direta.","alternativas":["Por que você saiu cedo?","Por que do fato","porque sim","porquê da resposta"],"resposta":"Por que você saiu cedo?","pontos_PM":5,"gatilhos_PC":[{"tipo":"Apoio Moral I","casa":"Solidários","pc":2}]},
    {"id":"p4","tema":"Português","tipo":"Múltipla escolha","enunciado":"Marque a alternativa com vírgula correta: 'Se você estudar __ passarás no exame.'","alternativas":[";"," ,"," —"," ."],"resposta":" ,","pontos_PM":5,"gatilhos_PC":[]},
    {"id":"p5","tema":"Português","tipo":"Problema","enunciado":"Identifique a oração subordinada na frase: 'Quando chove, eu prefiro ficar em casa.'","resposta":"Quando chove","pontos_PM":7,"gatilhos_PC":[{"tipo":"Voz Unida I","casa":"Solidários","pc":6}]}
  ]
};

// estado simples em memória
const houseState = {
  "Precursores": { pc: 0 },
  "Visionários": { pc: 0 },
  "Guardiões": { pc: 0 },
  "Solidários": { pc: 0 }
};

let participant = null;
let allQuestions = [...QUESTIONS.math, ...QUESTIONS.portugues];
let idx = 0;
let pmTotal = 0;
const answers = {}; 

const el = {
  startBtn: document.getElementById('start-btn'),
  nameInput: document.getElementById('participant-name'),
  houseSelect: document.getElementById('participant-house'),
  quizArea: document.getElementById('quiz-area'),
  questionContainer: document.getElementById('question-container'),
  prevBtn: document.getElementById('prev-btn'),
  nextBtn: document.getElementById('next-btn'),
  submitBtn: document.getElementById('submit-btn'),
  pmScore: document.getElementById('pm-score'),
  qIndex: document.getElementById('question-index'),
  results: document.getElementById('results'),
  resultDetail: document.getElementById('result-detail'),
  restartBtn: document.getElementById('restart-btn'),
  houseScores: document.getElementById('house-scores')
};

function renderHouseScores(){
  document.querySelectorAll('.house').forEach(div=>{
    const name = div.dataset.house;
    div.querySelector('.pc').textContent = `PC: ${houseState[name].pc}`;
  });
}

function startQuiz(){
  const name = el.nameInput.value.trim() || 'Aluno';
  const house = el.houseSelect.value;
  participant = { id: Date.now().toString(), name, house };
  pmTotal = 0;
  idx = 0;
  answers = {};
  el.quizArea.classList.remove('hidden');
  el.results.classList.add('hidden');
  renderQuestion();
  updateStatus();
}

function renderQuestion(){
  const q = allQuestions[idx];
  el.questionContainer.innerHTML = '';
  const card = document.createElement('div');
  const title = document.createElement('h3');
  title.textContent = `${q.tema} — ${q.tipo}`;
  const p = document.createElement('p');
  p.textContent = q.enunciado;
  card.appendChild(title);
  card.appendChild(p);

  if (q.alternativas){
    const list = document.createElement('div');
    list.className = 'alternatives';
    q.alternativas.forEach((alt, i) => {
      const b = document.createElement('div');
      b.className = 'alt';
      b.textContent = alt;
      b.dataset.value = alt;
      b.addEventListener('click', () => {
        document.querySelectorAll('.alt').forEach(x=>x.classList.remove('selected'));
        b.classList.add('selected');
      });
      list.appendChild(b);
    });
    card.appendChild(list);
  } else {
    const ta = document.createElement('textarea');
    ta.style.width = '100%';
    ta.rows = 3;
    ta.id = 'open-answer';
    card.appendChild(ta);
  }

  el.questionContainer.appendChild(card);
}

function updateStatus(){
  el.pmScore.textContent = `PM: ${pmTotal}`;
  el.qIndex.textContent = `Questão ${idx+1} / ${allQuestions.length}`;
  el.prevBtn.disabled = idx === 0;
  el.nextBtn.disabled = idx === allQuestions.length - 1;
}

function getCurrentAnswer(){
  const q = allQuestions[idx];
  if (q.alternativas){
    const sel = document.querySelector('.alt.selected');
    return sel ? sel.dataset.value : '';
  } else {
    const ta = document.getElementById('open-answer');
    return ta ? ta.value.trim() : '';
  }
}

function calculatePM(question, answer){
  const correct = (String(answer).trim().toLowerCase() === String(question.resposta).trim().toLowerCase());
  const pm = correct ? (question.pontos_PM || 0) : 0;
  return { pmEarned: pm, correct };
}

function evaluateGatilhos(question, answer){
  const { correct, pmEarned } = calculatePM(question, answer);
  const changes = [];
  if (!correct) return changes;
  if (Array.isArray(question.gatilhos_PC)){
    question.gatilhos_PC.forEach(g=>{
      const house = g.casa || participant.house;
      const pc = g.pc || 0;
      if (pc > 0) {
        houseState[house].pc += pc;
        changes.push({ house, pc, motivo: g.tipo });
      }
    });
  }
  return changes;
}

el.startBtn.addEventListener('click', () => {
  startQuiz();
  renderHouseScores();
});

el.prevBtn.addEventListener('click', () => {
  if (idx > 0) { idx--; renderQuestion(); updateStatus(); }
});
el.nextBtn.addEventListener('click', () => {
  if (idx < allQuestions.length - 1) { idx++; renderQuestion(); updateStatus(); }
});

el.submitBtn.addEventListener('click', () => {
  const q = allQuestions[idx];
  const answer = getCurrentAnswer();
  if (!answer) { alert('Responda a questão antes de enviar.'); return; }
  const res = calculatePM(q, answer);
  pmTotal += res.pmEarned;
  const gat = evaluateGatilhos(q, answer);
  answers[q.id] = { answer, correct: res.correct, pmEarned: res.pmEarned, gatilhos: gat };
  renderHouseScores();
  updateStatus();

  if (idx < allQuestions.length - 1){ idx++; renderQuestion(); updateStatus(); }
  else { showResults(); }
});

function showResults(){
  el.quizArea.classList.add('hidden');
  el.results.classList.remove('hidden');
  el.resultDetail.innerHTML = '';
  const summary = document.createElement('div');
  summary.className = 'result-row';
  summary.innerHTML = `<strong>${participant.name}</strong> — Casa: ${participant.house} — <span>PM total: ${pmTotal}</span>`;
  el.resultDetail.appendChild(summary);


  Object.values(answers).forEach((a, i) => {
    const row = document.createElement('div');
    row.className = 'result-row';
    row.innerHTML = `<div><strong>Resposta ${i+1}</strong> — correta: ${a.correct} — PM ganho: ${a.pmEarned}</div>`;
    if (a.gatilhos && a.gatilhos.length){
      a.gatilhos.forEach(g => {
        const gdiv = document.createElement('div');
        gdiv.textContent = `Gatilho aplicado: ${g.motivo} => +${g.pc} PC para ${g.house}`;
        row.appendChild(gdiv);
      });
    }
    el.resultDetail.appendChild(row);
  });

  
  const housesRow = document.createElement('div');
  housesRow.className = 'result-row';
  housesRow.innerHTML = `<h3>Placar de Casas</h3>`;
  Object.keys(houseState).forEach(h=>{
    const d = document.createElement('div');
    d.textContent = `${h}: PC = ${houseState[h].pc}`;
    housesRow.appendChild(d);
  });
  el.resultDetail.appendChild(housesRow);
}

el.restartBtn.addEventListener('click', () => {

  pmTotal = 0;
  Object.keys(houseState).forEach(h => houseState[h].pc = 0);
  renderHouseScores();
  el.results.classList.add('hidden');
  el.quizArea.classList.add('hidden');
  el.nameInput.value = '';
});
