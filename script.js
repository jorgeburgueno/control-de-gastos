let main = document.querySelector(".main");
let gastosContainer = document.querySelector(".gastos-container");
let totalContainer = document.querySelector(".total-container");
let gastoForm = document.querySelector("#gastos-form");
let btnNuevo = document.querySelector('.nuevo-btn');
let btnDelete = document.querySelector('.eliminar');


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
    addTotalGastos(gasto)
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

function renderTotal(){
    totalGastos = JSON.parse(localStorage.getItem("totalgastos")) || 0;
    totalContainer.innerHTML = '';
    const totalGasto = document.createElement('div');
    totalGasto.classList.add('total');
    totalGasto.innerHTML = `<p> Total de gastos : ${totalGastos}`

    totalContainer.appendChild(totalGasto);    
}


renderTotal();
renderAllGastos();
