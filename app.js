
const STORAGE_KEY = 'quiz-pm-pc:v1';

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

const allQuestions = [...QUESTIONS.math, ...QUESTIONS.portugues];


const houseState = {
  "Precursores": { pc: 0 },
  "Visionários": { pc: 0 },
  "Guardiões": { pc: 0 },
  "Solidários": { pc: 0 }
};

let participant = null;
let idx = 0;
let pmTotal = 0;
let answers = {};
let lastSavedAt = null;


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
  houseScores: document.getElementById('house-scores'),
  saveStatus: document.getElementById('save-status'),
  nameField: document.getElementById('participant-name')
};

function formatTimestamp(ts){
  if (!ts) return 'Nenhum progresso salvo';
  const d = new Date(ts);
  return `Progresso salvo em ${d.toLocaleString('pt-BR')}`;
}

function updateSaveIndicator(saved){
  lastSavedAt = saved || Date.now();
  el.saveStatus.textContent = formatTimestamp(lastSavedAt);
  el.saveStatus.className = saved ? 'saved' : '';
}

function saveState(){
  const payload = {
    participant,
    idx,
    pmTotal,
    answers,
    houseState,
    savedAt: Date.now()
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    updateSaveIndicator(payload.savedAt);
  } catch(e){
    el.saveStatus.textContent = 'Não foi possível salvar localmente';
    el.saveStatus.className = 'unsaved';
  }
}

function loadState(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return false;
  try {
    const data = JSON.parse(raw);
    if (data && data.participant) {
      participant = data.participant;
      idx = data.idx || 0;
      pmTotal = data.pmTotal || 0;
      answers = data.answers || {};
      Object.keys(houseState).forEach(h=>{
        houseState[h].pc = (data.houseState && data.houseState[h] && Number(data.houseState[h].pc)) || houseState[h].pc;
      });
      lastSavedAt = data.savedAt || null;
      return true;
    }
  } catch(e){
    console.warn('Erro ao carregar estado:', e);
  }
  return false;
}

function clearState(){
  localStorage.removeItem(STORAGE_KEY);
  lastSavedAt = null;
  updateSaveIndicator(null);
}

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
  saveState();
  el.quizArea.classList.remove('hidden');
  el.results.classList.add('hidden');
  renderQuestion();
  updateStatus();
  renderHouseScores();
}

function restoreToUI(){
  if (!participant) return;
  el.nameField.value = participant.name || '';
  for (let i=0;i<el.houseSelect.options.length;i++){
    if (el.houseSelect.options[i].value === participant.house){
      el.houseSelect.selectedIndex = i; break;
    }
  }
  el.quizArea.classList.remove('hidden');
  el.results.classList.add('hidden');
  renderQuestion();
  updateStatus();
  renderHouseScores();
  el.saveStatus.textContent = formatTimestamp(lastSavedAt);
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
    q.alternativas.forEach((alt) => {
      const b = document.createElement('div');
      b.className = 'alt';
      b.textContent = alt;
      b.dataset.value = alt;
      b.addEventListener('click', () => {
        document.querySelectorAll('.alt').forEach(x=>x.classList.remove('selected'));
        b.classList.add('selected');
      });
      const prev = answers[q.id] && answers[q.id].answer;
      if (prev && String(prev).trim().toLowerCase() === String(alt).trim().toLowerCase()){
        b.classList.add('selected');
      }
      list.appendChild(b);
    });
    card.appendChild(list);
  } else {
    const ta = document.createElement('textarea');
    ta.style.width = '100%';
    ta.rows = 3;
    ta.id = 'open-answer';
    if (answers[q.id] && answers[q.id].answer) ta.value = answers[q.id].answer;
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


function collectGatilhos(question, answer){
  const { correct } = calculatePM(question, answer);
  const collected = [];
  if (!correct) return collected;
  if (Array.isArray(question.gatilhos_PC)){
    question.gatilhos_PC.forEach(g => {

      collected.push({ tipo: g.tipo || '', casa: g.casa || null, pc: g.pc || 0 });
    });
  }
  return collected;
}


function applyGatilhosFinal(){
  if (!participant || !participant.house) return [];
  const applied = [];
  Object.keys(answers).forEach(qid => {
    const a = answers[qid];
    if (!a.gatilhos || !Array.isArray(a.gatilhos)) return;
    a.gatilhos.forEach(g => {

      const targetHouse = g.casa || participant.house;
      if (String(targetHouse) === String(participant.house)) {
        if (g.pc && g.pc > 0) {
          houseState[targetHouse].pc += g.pc;
          applied.push({ house: targetHouse, pc: g.pc, motivo: g.tipo || 'Gatilho final' });
        }
      }
    });
  });
  return applied;
}

el.startBtn.addEventListener('click', () => {
  startQuiz();
});

el.prevBtn.addEventListener('click', () => {
  if (idx > 0) { idx--; renderQuestion(); updateStatus(); saveState(); }
});
el.nextBtn.addEventListener('click', () => {
  if (idx < allQuestions.length - 1) { idx++; renderQuestion(); updateStatus(); saveState(); }
});

el.submitBtn.addEventListener('click', () => {
  const q = allQuestions[idx];
  const answer = getCurrentAnswer();
  if (!answer) { alert('Responda a questão antes de enviar.'); return; }
  const prev = answers[q.id];
  const res = calculatePM(q, answer);


  pmTotal += res.pmEarned - ((prev && prev.pmEarned) || 0);


  const collected = collectGatilhos(q, answer);


  answers[q.id] = { answer, correct: res.correct, pmEarned: res.pmEarned, gatilhos: collected };

  saveState();
  renderHouseScores();
  updateStatus();


  if (idx < allQuestions.length - 1){ idx++; renderQuestion(); updateStatus(); saveState(); }
  else { showResults(); }
});

function showResults(){

  const appliedGatilhos = applyGatilhosFinal();


  const bonusPC = Math.floor((pmTotal * 10) / 100);
  if (participant && participant.house && bonusPC > 0) {
    houseState[participant.house].pc += bonusPC;
  }

  el.quizArea.classList.add('hidden');
  el.results.classList.remove('hidden');
  el.resultDetail.innerHTML = '';

  const summary = document.createElement('div');
  summary.className = 'result-row';
  summary.innerHTML = `<strong>${participant.name}</strong> — Casa: ${participant.house} — <span>PM total: ${pmTotal}</span>`;
  el.resultDetail.appendChild(summary);


  if (appliedGatilhos.length > 0) {
    const gRow = document.createElement('div');
    gRow.className = 'result-row';
    gRow.innerHTML = `<strong>Vantagens aplicadas da casa ${participant.house}:</strong>`;
    appliedGatilhos.forEach(g => {
      const d = document.createElement('div');
      d.textContent = `+${g.pc} PC — ${g.motivo}`;
      gRow.appendChild(d);
    });
    el.resultDetail.appendChild(gRow);
  } else {
    const gRow = document.createElement('div');
    gRow.className = 'result-row';
    gRow.textContent = `Nenhuma vantagem da casa ${participant.house} foi ativada.`;
    el.resultDetail.appendChild(gRow);
  }


  const bonusRow = document.createElement('div');
  bonusRow.className = 'result-row';
  bonusRow.innerHTML = `Bônus: 10% do PM convertido em PC = <strong>+${bonusPC} PC</strong> para a casa <strong>${participant.house}</strong>`;
  el.resultDetail.appendChild(bonusRow);


  Object.keys(answers).forEach((qid, i) => {
    const a = answers[qid];
    const row = document.createElement('div');
    row.className = 'result-row';
    row.innerHTML = `<div><strong>Questão ${i+1}</strong> — correta: ${a.correct} — PM ganho: ${a.pmEarned}</div>`;
    if (a.gatilhos && a.gatilhos.length){
      a.gatilhos.forEach(g => {
        const gdiv = document.createElement('div');
        const target = g.casa || participant.house;
        gdiv.textContent = `Gatilho registrado: ${g.tipo} => +${g.pc} PC para ${target}`;
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


  saveState();
}

el.restartBtn.addEventListener('click', () => {
  if (!confirm('Reiniciar quiz local? Isso apagará progresso salvo neste navegador.')) return;
  participant = null;
  idx = 0;
  pmTotal = 0;
  answers = {};
  Object.keys(houseState).forEach(h => houseState[h].pc = 0);
  clearState();
  renderHouseScores();
  el.results.classList.add('hidden');
  el.quizArea.classList.add('hidden');
  el.nameField.value = '';
});


window.addEventListener('load', () => {
  const ok = loadState();
  if (ok) {
    restoreToUI();
  } else {
    updateSaveIndicator(null);
  }
  renderHouseScores();
});
