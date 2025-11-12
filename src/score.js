

const advantages = require('../config/advantages.json');
const fs = require('fs');

function calculatePM(question, answer) {

  const correct = (answer && answer.toString().trim().toLowerCase() === question.resposta.toString().trim().toLowerCase());
  const pm = correct ? (question.pontos_PM || 0) : 0;
  return { pmEarned: pm, correct };
}

function evaluateGatilhos(question, answer, participant, houseState) {

  const { correct } = calculatePM(question, answer);
  const changes = [];

  if (!correct) return changes;

  if (Array.isArray(question.gatilhos_PC)) {
    question.gatilhos_PC.forEach(g => {
      const house = g.casa || participant.house;
      const pc = g.pc || 0;
      if (pc > 0) {
   
        changes.push({ house, pc, motivo: g.tipo || 'Resposta correta com gatilho' });
      }
    });
  }


  return changes;
}

module.exports = {
  calculatePM,
  evaluateGatilhos
};
