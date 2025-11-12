Modelo de dados sugerido

Usuário
- id: string
- nome: string
- casa: string
- pm_total: number
- respostas: [{questionId, answer, correct, pmEarned, timestamp}]

Casa
- nome: string
- pc_total: number
- estado: {participacaoSemana: number, entregasSemanaisSeguidas: number, etc.}

Pergunta (como nos JSON)
- id, tema, tipo, enunciado, alternativas, resposta, pontos_PM, gatilhos_PC
