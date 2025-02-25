let main = document.querySelector(".main");
let gastosContainer = document.querySelector(".gastos");
let totalContainer = document.querySelector(".total-container");
let gastoForm = document.querySelector("#gastos-form");
let budgetForm = document.querySelector('#budget-form');
let btnNuevo = document.querySelector('.nuevo-btn');
let btnBudget = document.querySelector('.budget-btn');
let btnDelete = document.querySelector('.eliminar');
let budgetContainer = document.querySelector('.budget-container');
let presupuestoTotalDisplay = document.querySelector('#presupuestoTotalDisplay');
let presupuestoResDisplay = document.querySelector('#presupuestoResDisplay');
const progressBar = document.querySelector('.progress-bar');
let filtroCategoria = document.querySelector('#filtro-categoria');
const filtroFechaInicial = document.querySelector('#filtro-fecha-inicial');
const filtroFechaFinal = document.querySelector('#filtro-fecha-final');
const filtrarFechaBtn = document.querySelector('#filtrar-fecha-btn');


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
    renderAllGastos();
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
    const sortedGastos = gastos.sort((a, b) => {
        const dateA = new Date(a.fecha);
        const dateB = new Date(b.fecha);

        if (dateB - dateA !== 0) {            
            return dateB - dateA;
        } else {           
            return gastos.indexOf(b) - gastos.indexOf(a);
        }
    });

    sortedGastos.forEach((gasto, index) => {
        render(gasto, index)
    });       
}

//Filtro de gastos

function filtroPorCategoria(gastos){
    return gastos.reduce((acc, gasto) => {
        const categoria = gasto.categoria;
        if(!acc[categoria]){
            acc[categoria] = [];
        }
        acc[categoria].push(gasto);   
        return acc;              
    }, {});   
}


filtroCategoria.addEventListener('change', (event) => {
    const selected = event.target.value;  
    displaySeleccion(selected);
});

function displaySeleccion(select){
    let organizado = filtroPorCategoria(gastos);
    if (select === 'all') {
        renderAllGastos();        
    } else {
        let filteredGastos = organizado[select] || [];
        rendeGastosFiltrados(filteredGastos); 
    }
}

function rendeGastosFiltrados(filteredGastos){
    gastosContainer.innerHTML = "";
    filteredGastos.forEach((gasto, index) => {
        render(gasto, index);
    })
}

//filtrar por fecha

filtrarFechaBtn.addEventListener('click', () => {
    let fechaInicial = filtroFechaInicial.value;
    let fechaFinal = filtroFechaFinal.value;

    if (!fechaInicial || !fechaFinal) {
        alert("Por favor, selecciona ambas fechas.");
        return;
      }
    const filteredGastos = filterByDateRange(gastos, fechaInicial, fechaFinal);
    renderFilteredGastos(filteredGastos);
    updateChart(filteredGastos); 
})

function filterByDateRange(gastos, fechaInicial, fechaFinal) {
    return gastos.filter((gasto) => {
      const gastoFecha = new Date(gasto.fecha);
      const startDate = new Date(fechaInicial);
      const endDate = new Date(fechaFinal);  
      
      return gastoFecha >= startDate && gastoFecha <= endDate;
    });
  }

function renderFilteredGastos(filteredGastos) {
    gastosContainer.innerHTML = ''; 

    const sortedGastos = filteredGastos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    sortedGastos.forEach((gasto, index) => {
      render(gasto, index); 
    });
}

// limpia los filtros

function clearFilters(){
    filtroCategoria.value = 'all';
    filtroFechaInicial.value = "";
    filtroFechaFinal.value = '';
    renderAllGastos();
}



// calcula y muestra total de gastos
let totalGastos = JSON.parse(localStorage.getItem("totalgastos")) || 0;

function addTotalGastos(gasto){
    totalGastos +=  Number(gasto.cantidad); 
    localStorage.setItem("totalgastos", JSON.stringify(totalGastos));
    budget -= Number(gasto.cantidad);
    renderTotal();
    localStorage.setItem("budget", JSON.stringify(budget));
    renderBudget();
    updateProgressBar();
}

function restaTotalGastos(gasto){
    totalGastos -= Number(gasto.cantidad);
    localStorage.setItem("totalgastos", JSON.stringify(totalGastos));
    budget += Number(gasto.cantidad);
    renderTotal();
    localStorage.setItem("budget", JSON.stringify(budget));
    renderBudget();
    updateProgressBar();
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
let budget = JSON.parse(localStorage.getItem("budget")) || 0;
let presupuestoTotal = JSON.parse(localStorage.getItem("presupuestoTotal")) || 0;


    btnBudget.addEventListener('click', () => {
    budgetForm.classList.remove('hidden');
});

    budgetForm.addEventListener('submit', (event) => {
        event.preventDefault();
        budget = Number(document.querySelector('#cantidadb').value);
        presupuestoTotal = Number(document.querySelector('#cantidadb').value);
        localStorage.setItem("budget", JSON.stringify(budget));
        localStorage.setItem("presupuestoTotal", JSON.stringify(presupuestoTotal));
        budgetForm.classList.add('hidden');
        document.querySelector('#cantidadb').value = '';
        renderBudget();
        updateProgressBar();        
    });

function renderBudget() {       
    presupuestoTotalDisplay.textContent = presupuestoTotal;
    presupuestoResDisplay.textContent = budget;
}

function updateProgressBar() {
    const percentage = (budget / presupuestoTotal) * 100;
    progressBar.style.height = (100 - percentage) + '%';

}
  
//render todo al iniciar la pagina

document.addEventListener("DOMContentLoaded", () => {
    gastos = JSON.parse(localStorage.getItem("gastos")) || [];
    renderTotal();
    renderChart();
    renderAllGastos();
    renderBudget(); 
    updateProgressBar();   
});

