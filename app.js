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
  nameField: document.getElementById('participant-name')
};

function saveState(){
  const payload = {
    participant,
    idx,
    pmTotal,
    answers,
    houseState
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
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
      return true;
    }
  } catch(e){
    console.warn('Erro ao carregar estado:', e);
  }
  return false;
}

function clearState(){
  localStorage.removeItem(STORAGE_KEY);
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
  // selecionar casa no select
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

  if (Object.keys(answers).length === allQuestions.length && allQuestions.length>0){
    showResults();
  }
}

function renderQuestion(){
  const q = all
