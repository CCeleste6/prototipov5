# Quiz de PM e PC — Mecânica de Casas

Este repositório contém um quiz com perguntas de Matemática e Português, além da mecânica de pontuação individual (PM — Pontos de Mérito) e coletiva (PC — Pontos de Casa) baseada nas vantagens das casas.

Como usar
1. Clone este repositório.
2. As perguntas estão em `questions/` (JSON). Pode-se usar qualquer frontend para renderizar o quiz (ex.: React, Vue, ou páginas estáticas).
3. A lógica de pontuação de exemplo está em `src/score.js`. Integre-a ao frontend/backend para registrar PM (por usuário) e acumular PC (por casa).
4. As vantagens das casas estão consolidadas em `config/advantages.json`.

Formato
- Cada pergunta tem: id, tema, tipo, enunciado, alternativas (quando aplicável), resposta correta, pontos_PM (valor de PM ganho para resposta correta) e gatilhos de PC (lista de regras que, quando ativadas, somam PC à casa).
- `src/score.js` exporta funções para calcular PM e atualizar efeitos de PC.

Licença
- MIT
