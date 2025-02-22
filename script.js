let main = document.querySelector(".main");
let gastoForm = document.querySelector("#gastos-form")
let btnNuevo = document.querySelector('.nuevo-btn');
let btnDelete = document.querySelector('#eliminar');


let gastos = [];

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
    gastoForm.classList.add('hidden');
});

function addGasto(gasto){
    gastos.push(gasto);
    render(gasto);
};

//borra un gasto de la pantalla y del array



//hace que el gasto aparezca en pantalla 

function render(gasto){
    const nuevoGasto = document.createElement('div');
    nuevoGasto.classList.add('gastos');
    nuevoGasto.innerHTML = `<p> categoria: ${gasto.categoria}</p>
                            <p> cantidad: ${gasto.cantidad}</p>
                            <p> fecha: ${gasto.fecha}</p>
                            <button id= 'eliminar'>eliminar</button> 
                            `
    main.appendChild(nuevoGasto);
}
gastos.forEach(gasto => {
    render(gasto)
});


