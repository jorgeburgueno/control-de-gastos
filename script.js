let main = document.querySelector(".main");
let gastosContainer = document.querySelector(".gastos-container");
let totalContainer = document.querySelector(".total-container");
let gastoForm = document.querySelector("#gastos-form");
let budgetForm = document.querySelector('#budget-form');
let btnNuevo = document.querySelector('.nuevo-btn');
let btnBudget = document.querySelector('.budget-btn');
let btnDelete = document.querySelector('.eliminar');
let budgetContainer = document.querySelector('.budget-container');


let gastos = JSON.parse(localStorage.getItem("gastos")) || [];

//crear gasto nuevo
btnNuevo.addEventListener('click', () => {
    gastoForm.classList.remove('hidden');
});

gastoForm.addEventListener('submit', (event) => {
    event.preventDefault();

    let gasto = {
        categoria: document.querySelector('#categoria').value,
        cantidad: Number(document.querySelector('#cantidad').value),
        fecha: document.querySelector('#fecha').value
    };
    console.log(gastos);
    addGasto(gasto);
    gastoForm.reset();
    gastoForm.classList.add('hidden');
});

function addGasto(gasto){
    gastos.push(gasto);
    localStorage.setItem("gastos", JSON.stringify(gastos));
    addTotalGastos(gasto);
    renderChart();
    render(gasto, gastos.length - 1);
};

// cierra form al cancelar
document.querySelector('.cancel-btn').addEventListener('click', () => {
    gastoForm.reset();
    gastoForm.classList.add('hidden');
});

//borra un gasto de la pantalla y del array

gastosContainer.addEventListener('click', (event) =>{
    if (event.target.classList.contains('eliminar')) {
        const gastoDiv = event.target.closest('.gasto');
        const gastoId = Number(gastoDiv.getAttribute('data-id'));

        
        restaTotalGastos(gastos[gastoId]);
        gastoDiv.remove();
        gastos = gastos.filter((_, i) => i !== gastoId);        
        localStorage.setItem("gastos", JSON.stringify(gastos));              
        renderAllGastos();
        renderChart();
    }
})


//hace que el gasto aparezca en pantalla 

function render(gasto, index){
    const nuevoGasto = document.createElement('div');
    nuevoGasto.classList.add('gasto');
    nuevoGasto.setAttribute('data-id', index);
    nuevoGasto.innerHTML = `<p> categoria: ${gasto.categoria}</p>
                            <p> cantidad: ${gasto.cantidad}</p>
                            <p> fecha: ${gasto.fecha}</p>
                            <button class= 'eliminar'>eliminar</button> 
                            `
    gastosContainer.appendChild(nuevoGasto);
}

function renderAllGastos(){
    gastosContainer.innerHTML = '';
    gastos.forEach((gasto, index) => {
        render(gasto, index)
    });
    
}

// calcula y muestra total de gastos
let totalGastos = JSON.parse(localStorage.getItem("totalgastos")) || 0;

function addTotalGastos(gasto){
    totalGastos +=  Number(gasto.cantidad); 
    localStorage.setItem("totalgastos", JSON.stringify(totalGastos));
    renderTotal();
}

function restaTotalGastos(gasto){
    totalGastos -= Number(gasto.cantidad);
    localStorage.setItem("totalgastos", JSON.stringify(totalGastos));
    renderTotal();
}

function renderTotal() {
    totalGastos = JSON.parse(localStorage.getItem("totalgastos")) || 0;
       
    let totalGasto = document.querySelector('.total');
    
    if (!totalGasto) {
        totalGasto = document.createElement('div');
        totalGasto.classList.add('total');
        totalContainer.appendChild(totalGasto);
    }
    
    totalGasto.innerHTML = `<p>Total de gastos: ${totalGastos}</p>`;
}


// creacion de chart 

let chart; 

function renderChart() {
    const ctx = document.getElementById('myChart').getContext('2d');

    if (chart) {
        chart.destroy(); 
    }

    chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: gastos.map(x => x.categoria),
            datasets: [{
                label: 'Cantidad gastada',
                data: gastos.map(x => x.cantidad)
            }]
        }
    });
}

function updateChart() {
    if (!chart) return;

    chart.data.labels = gastos.map(x => x.categoria);
    chart.data.datasets[0].data = gastos.map(x => x.cantidad);
    chart.update();
}

//creacion y display de presupuesto
let budget = 0;

btnBudget.addEventListener('click', () => {
    budgetForm.classList.remove('hidden');
});

budgetForm.addEventListener('submit', (event) => {
    event.preventDefault();
    budget += Number(document.querySelector('#cantidadb').value);
    budgetForm.classList.add('hidden');
    renderBudget();
});

function renderBudget() {          

    let presupuesto = document.querySelector('.presupuesto');
    
    if (!presupuesto) {
        presupuesto = document.createElement('div');
        presupuesto.classList.add('presupuesto');
        budgetContainer.appendChild(presupuesto);
    }
    
    presupuesto.innerHTML = `<p>Presupuesto: ${budget}</p>`;
}




//render todo al iniciar la pagina

document.addEventListener("DOMContentLoaded", () => {
    gastos = JSON.parse(localStorage.getItem("gastos")) || [];
    renderTotal();
    renderChart();
    renderAllGastos();
    renderBudget()
});

