# Quiz de Mecânica: Pontos de Mérito (PM) e Pontos de Casa (PC)

Descrição
Este repositório contém um quiz com mecânica de Pontos de Mérito (PM) individuais e Pontos de Casa (PC) coletivos. Participantes respondem questões de matemática e português; respostas são submetidas via Issue (JSON) e avaliadas automaticamente por um workflow.

Estrutura do repositório
- README.md — este arquivo.
- houses.md — descrição das casas e suas vantagens.
- questions/math.json — questões de matemática.
- questions/portuguese.json — questões de português.
- participants/users.yaml — cadastro inicial de participantes.
- results/leaderboard.md — placar consolidado de PM e PC.
- results/submissions/ — pasta para armazenar submissões manuais (opcional).
- .github/workflows/auto-grade.yml — workflow para avaliar submissões.
- tools/grade.py — script que faz a correção e atualiza resultados.
- templates/submission_template.json — template para submissão de respostas.

Regras rápidas
- Cada resposta correta: **+10 PM**.
- Resposta parcialmente correta: **+5 PM**.
- Resposta incorreta: **0 PM**.
- PC de cada casa = soma dos PM dos seus membros por rodada; PC é mostrado no leaderboard.
- Cada casa tem vantagens específicas descritas em houses.md.
- Limite: 1 submissão por participante por rodada.

Como participar
1. Forke o repositório e crie uma branch (opcional).
2. Crie uma Issue com o título: `Resposta — Rodada X — @seuusuario`.
3. Cole o JSON seguindo `templates/submission_template.json` dentro do corpo da Issue.
4. O workflow automático rodará ao criar a Issue e o grade.py fará a correção, respondendo com o resultado.

Automação
- O workflow responde quando uma Issue é aberta.
- Ele corre o grade.py, que valida o formato, confere respostas, calcula PM, aplica vantagens de casa
