let main = document.querySelector(".main");
let gastosContainer = document.querySelector(".gastos-container");
let gastoForm = document.querySelector("#gastos-form")
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
        cantidad: document.querySelector('#cantidad').value,
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
    render(gasto, gastos.length - 1);
};

//borra un gasto de la pantalla y del array

gastosContainer.addEventListener('click', (event) =>{
    if (event.target.classList.contains('eliminar')) {
        const gastoDiv = event.target.closest('.gasto');
        const gastoId = gastoDiv.getAttribute('data-id');

        gastoDiv.remove();
        gastos.splice(gastoId, 1);
        localStorage.setItem("gastos", JSON.stringify(gastos));
        console.log('Expense deleted:', gastos);

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

renderAllGastos();
