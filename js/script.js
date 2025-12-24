let timer;
let seconds = 0;
let isRunning = false;

// Carregar dados ao abrir a página
window.onload = loadHistory;

function updateDisplay() {
    let hrs = Math.floor(seconds / 3600);
    let mins = Math.floor((seconds % 3600) / 60);
    let secs = seconds % 60;
    document.getElementById('display').innerText =
        `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}



function start() {
    if (!isRunning) {
        isRunning = true;
        document.getElementById('startBtn').disabled = true;
        document.getElementById('pauseBtn').disabled = false;
        document.getElementById('saveBtn').disabled = true;
        timer = setInterval(() => { 
            seconds++; 
            updateDisplay(); 
        }, 1000);
    }
}

function pause() {
    isRunning = false;
    document.getElementById('startBtn').disabled = false;
    document.getElementById('pauseBtn').disabled = true;
    document.getElementById('saveBtn').disabled = (seconds === 0);
    clearInterval(timer);
}

function reset() {
    pause();
    seconds = 0;
    updateDisplay();
    document.getElementById('saveBtn').disabled = true;
}

function saveActivity() {
    const pessoas = document.getElementById('Pessoa').value;
    const atividade = document.getElementById('atividade').value;
    const tempo = document.getElementById('display').innerText;
    const data = new Date().toLocaleDateString('pt-BR');

    const registro = { data, militar, atividade, tempo };

    let historico = JSON.parse(localStorage.getItem('atividades_2026')) || [];
    historico.push(registro);
    localStorage.setItem('atividades_2026', JSON.stringify(historico));

    addTableRow(registro);
    reset();
}

function addTableRow(registro) {
    const tbody = document.getElementById('historyBody');
    const row = tbody.insertRow(0);
    row.innerHTML = `
        <td>${registro.data}</td>
        <td>${registro.pessoas}</td>
        <td>${registro.atividade}</td>
        <td>${registro.tempo}</td>
    `;
}

function loadHistory() {
    let historico = JSON.parse(localStorage.getItem('atividades_2026')) || [];
    // Limpa a tabela antes de carregar (evita duplicatas)
    document.getElementById('historyBody').innerHTML = "";
    historico.reverse().forEach(addTableRow);
}

function clearHistory() {
    if(confirm("Deseja apagar todo o histórico?")) {
        localStorage.removeItem('atividades_2026');
        document.getElementById('historyBody').innerHTML = "";
    }
}

function downloadHistory() {
    let historico = JSON.parse(localStorage.getItem('atividades_2026')) || [];

    if (historico.length === 0) {
        alert("Não há dados para download.");
        return;
    }

    // Cabeçalho do CSV
    let csv = "Data;Pessoas;Atividade;Tempo\n";

    // Conteúdo
    historico.forEach(registro => {
        csv += `${registro.data};${registro.pessoas};${registro.atividade};${registro.tempo}\n`;
    });

    // Cria o arquivo
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    // Cria link de download
    const a = document.createElement("a");
    a.href = url;
    a.download = "historico_atividades_2026.csv";
    document.body.appendChild(a);
    a.click();

    // Limpeza
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}