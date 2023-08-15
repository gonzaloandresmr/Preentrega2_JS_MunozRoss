// Función para obtener el valor del Dólar EE.UU. desde la API de Open Exchange Rates
async function obtenerValorDolar() {
  const apiKey = '3ae36ef9fe4b48ce8feebd5dd582a314'; // Reemplaza con tu clave de API de Open Exchange Rates
  const url = `https://openexchangerates.org/api/latest.json?app_id=${apiKey}&base=USD&symbols=CLP`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.rates.CLP;
  } catch (error) {
    console.error('Error al obtener el valor del Dólar:', error);
    return 1; // Valor predeterminado si no se puede obtener desde la API
  }
}

// Función para mostrar el desglose de cuotas
function mostrarCuotas(cuotas, nombre) {
  const resultado = document.getElementById("resultado");
  resultado.innerHTML = `<h2>Hola, ${nombre}!</h2>`;
  resultado.innerHTML += `<h3>Desglose de cuotas:</h3>`;

  cuotas.forEach((cuotaData) => {
    const cuotaDolaresTexto = cuotaData.cuotaDolares > 0 ? ` (USD ${cuotaData.cuotaDolares})` : '';
    const interesDolaresTexto = cuotaData.interesDolares > 0 ? ` (USD ${cuotaData.interesDolares})` : '';
    const amortizacionDolaresTexto = cuotaData.amortizacionDolares > 0 ? ` (USD ${cuotaData.amortizacionDolares})` : '';
    const saldoRestanteDolaresTexto = cuotaData.saldoRestanteDolares > 0 ? ` (USD ${cuotaData.saldoRestanteDolares})` : '';
    
    resultado.innerHTML += `<p>Mes ${cuotaData.mes}: Cuota en Pesos: $${cuotaData.cuotaPesos}${cuotaDolaresTexto}, Interés: $${cuotaData.interes}${interesDolaresTexto}, Amortización: $${cuotaData.amortizacion}${amortizacionDolaresTexto}, Saldo Restante en Pesos: $${cuotaData.saldoRestantePesos}${saldoRestanteDolaresTexto}</p>`;
  });
}

// Función para mostrar las solicitudes anteriores
function mostrarSolicitudesAnteriores(solicitudes) {
  const solicitudesAnteriores = document.getElementById("solicitudesAnteriores");
  solicitudesAnteriores.innerHTML = `<h3>Solicitudes anteriores:</h3>`;

  solicitudes.forEach((solicitud, index) => {
    solicitudesAnteriores.innerHTML += `<div class="solicitud-anterior">
      <p><strong>Solicitud ${index + 1}:</strong></p>
      <p><strong>Nombre:</strong> ${solicitud.nombre}</p>
      <p><strong>Monto Inicial:</strong> $${solicitud.montoInicial}</p>
      <p><strong>Años:</strong> ${solicitud.anhos}</p>
      <p><strong>Tipo de Crédito:</strong> ${solicitud.tipo}</p>
      <p><strong>Cuota Mensual:</strong> $${solicitud.cuotaMensual.toFixed(2)}</p>
      <hr>
    </div>`;
  });
}

// Función para calcular las cuotas y mostrar el desglose
async function calcularCuotas() {
  const nombre = document.getElementById("nombre").value;
  const montoInicial = parseFloat(document.getElementById("monto").value);
  const anhos = parseInt(document.getElementById("anhos").value);
  const tipo = document.getElementById("tipo").value;
  const tasaAnual = tipo === "hipotecario" ? 0.05 : 0.15;
  const tasaMensual = tasaAnual / 12;
  const totalCuotas = anhos * 12;
  let cuotaMensual = (montoInicial * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -totalCuotas));

  const cuotasArray = [];
  let totalPagarPesos = 0;
  let totalPagarDolares = 0;
  let montoRestante = montoInicial;

  const valorDolar = await obtenerValorDolar();

  for (let i = 1; i <= totalCuotas; i++) {
    const interesMensual = montoRestante * tasaMensual;
    const amortizacionMensual = cuotaMensual - interesMensual;
    montoRestante -= amortizacionMensual;
    totalPagarPesos += cuotaMensual;
    totalPagarDolares += cuotaMensual / valorDolar;

    cuotasArray.push({
      mes: i,
      cuotaPesos: cuotaMensual.toFixed(2),
      cuotaDolares: (cuotaMensual / valorDolar).toFixed(2),
      interes: interesMensual.toFixed(2),
      interesDolares: (interesMensual / valorDolar).toFixed(2),
      amortizacion: amortizacionMensual.toFixed(2),
      amortizacionDolares: (amortizacionMensual / valorDolar).toFixed(2),
      saldoRestantePesos: montoRestante.toFixed(2),
      saldoRestanteDolares: (montoRestante / valorDolar).toFixed(2)
    });
  }

  // Almacenar en el local Storage
  const solicitudesAnteriores = JSON.parse(localStorage.getItem("solicitudesData")) || [];

  // Agregar solicitud actual al historial
  const solicitudActual = {
    nombre: nombre,
    montoInicial: montoInicial,
    anhos: anhos,
    tipo: tipo,
    cuotaMensual: cuotaMensual
  };
  solicitudesAnteriores.push(solicitudActual);

  // Datos al local Storage
  localStorage.setItem("solicitudesData", JSON.stringify(solicitudesAnteriores));

  // Mostrar resultados
  mostrarCuotas(cuotasArray, nombre);
  mostrarSolicitudesAnteriores(solicitudesAnteriores);

  // Limpiar campos
  document.getElementById("nombre").value = "";
  document.getElementById("monto").value = "";
  document.getElementById("anhos").value = "";
  document.getElementById("tipo").value = "hipotecario";
}

// Evento DOMContentLoaded para cargar solicitudes anteriores
window.addEventListener("DOMContentLoaded", () => {
  const solicitudesData = localStorage.getItem("solicitudesData");
  if (solicitudesData) {
    const solicitudesAnteriores = JSON.parse(solicitudesData);
    mostrarSolicitudesAnteriores(solicitudesAnteriores);
  }
})

const boton = document.getElementById("boton")
boton.addEventListener("click", ()=>{
    Toastify({
      text: "Préstamo solicitado",
      duration: 3000
    }).showToast();
  }) 
;
