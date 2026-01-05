
let timer = null;
let startTime = null;
let elapsed = 0;
let isRunning = false;

// ===============================
// AO ABRIR A PÁGINA
// ===============================
window.onload = () => {
    loadHistory();
    document.getElementById('display').innerText = "00:00:00";
};

// ===============================
// ATUALIZA DISPLAY
// ===============================
function updateTimer() {
    elapsed = Date.now() - startTime;

    let totalSeconds = Math.floor(elapsed / 1000);
    let hrs = Math.floor(totalSeconds / 3600);
    let mins = Math.floor((totalSeconds % 3600) / 60);
    let secs = totalSeconds % 60;

    document.getElementById('display').innerText =
        `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// ===============================
// START
// ===============================
function start() {
    if (isRunning) return;

    isRunning = true;

    document.getElementById('startBtn').disabled = true;
    document.getElementById('pauseBtn').disabled = false;
    document.getElementById('saveBtn').disabled = true;

    startTime = Date.now() - elapsed;
    timer = setInterval(updateTimer, 1000);
}

// ===============================
// PAUSE
// ===============================
function pause() {
    if (!isRunning) return;

    isRunning = false;
    clearInterval(timer);

    document.getElementById('startBtn').disabled = false;
    document.getElementById('pauseBtn').disabled = true;
    document.getElementById('saveBtn').disabled = (elapsed === 0);
}

// ===============================
// RESET
// ===============================
function reset() {
    pause();
    elapsed = 0;
    startTime = null;
    document.getElementById('display').innerText = "00:00:00";
    document.getElementById('saveBtn').disabled = true;
}

// ===============================
// SALVAR ATIVIDADE
// ===============================
function saveActivity() {
    const pessoas = document.getElementById('Pessoa').value;
    const atividade = document.getElementById('atividade').value;
    const tempo = document.getElementById('display').innerText;
    const data = new Date().toLocaleDateString('pt-BR');

    if (!pessoas || !atividade || tempo === "00:00:00") {
        alert("Preencha todos os campos antes de salvar.");
        return;
    }

    const registro = { data, pessoas, atividade, tempo };

    let historico = JSON.parse(localStorage.getItem('atividades_2026')) || [];
    historico.push(registro);
    localStorage.setItem('atividades_2026', JSON.stringify(historico));

    addTableRow(registro);
    reset();
}

// ===============================
// ADICIONA LINHA NA TABELA
// ===============================
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

// ===============================
// CARREGA HISTÓRICO
// ===============================
function loadHistory() {
    let historico = JSON.parse(localStorage.getItem('atividades_2026')) || [];
    document.getElementById('historyBody').innerHTML = "";
    historico.reverse().forEach(addTableRow);
}

// ===============================
// LIMPAR HISTÓRICO
// ===============================
function clearHistory() {
    if (confirm("Deseja apagar todo o histórico?")) {
        localStorage.removeItem('atividades_2026');
        document.getElementById('historyBody').innerHTML = "";
    }
}

// ===============================
// DOWNLOAD CSV
// ===============================
function downloadHistory() {
    let historico = JSON.parse(localStorage.getItem('atividades_2026')) || [];

    if (historico.length === 0) {
        alert("Não há dados para download.");
        return;
    }

    let csv = "Data;Pessoas;Atividade;Tempo\n";

    historico.forEach(registro => {
        csv += `${registro.data};${registro.pessoas};${registro.atividade};${registro.tempo}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "historico_atividades_2026.csv";
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
