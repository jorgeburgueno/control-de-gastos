let main = document.querySelector(".main");

let gastos = [
    {categoria: "renta", cantidad: 500, fecha: "01/01/2025"},
    {categoria: "gas", cantidad: 100, fecha: "02/01/2025"}
];

function render(gasto){
    const nuevoGasto = document.createElement('div');
    nuevoGasto.classList.add('gastos');
    nuevoGasto.innerHTML = `<p> categoria: ${gasto.categoria}</p>
                            <p> cantidad: ${gasto.cantidad}</p>
                            <p> fecha: ${gasto.fecha}</p>
                            `
    main.appendChild(nuevoGasto);
}
gastos.forEach(gasto => {
    render(gasto)
});