//para mostrar el desglose de cuotas de la solicitud actual
function mostrarCuotas(cuotas, nombre) {
    const resultado = document.getElementById("resultado");
    resultado.innerHTML = `<h2>Hola, ${nombre}!</h2>`;
    resultado.innerHTML += `<h3>Desglose de cuotas:</h3>`;
  
    cuotas.forEach((cuotaData) => {
      resultado.innerHTML += `<p>Mes ${cuotaData.mes}: Cuota: $${cuotaData.cuota}, Interés: $${cuotaData.interes}, Amortización: $${cuotaData.amortizacion}, Saldo Restante: $${cuotaData.saldoRestante}</p>`;
    });
  }
  
  //mostrar las solicitudes anteriores
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
  
  //para calcular las cuotas y mostrar el desglose
  function calcularCuotas() {
    const nombre = document.getElementById("nombre").value;
    const montoInicial = parseFloat(document.getElementById("monto").value);
    const anhos = parseInt(document.getElementById("anhos").value);
    const tipo = document.getElementById("tipo").value;
    const tasaAnual = tipo === "hipotecario" ? 0.05 : 0.15;
    const tasaMensual = tasaAnual / 12;
    const totalCuotas = anhos * 12;
    let cuotaMensual = (montoInicial * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -totalCuotas));
  
    const cuotasArray = [];
    let totalPagar = 0;
    let montoRestante = montoInicial;
  
    for (let i = 1; i <= totalCuotas; i++) {
      const interesMensual = montoRestante * tasaMensual;
      const amortizacionMensual = cuotaMensual - interesMensual;
      montoRestante -= amortizacionMensual;
      totalPagar += cuotaMensual;
  
      cuotasArray.push({
        mes: i,
        cuota: cuotaMensual.toFixed(2),
        interes: interesMensual.toFixed(2),
        amortizacion: amortizacionMensual.toFixed(2),
        saldoRestante: montoRestante.toFixed(2)
      });
    }
  
    //almacenar en el local Storage
    const solicitudesAnteriores = JSON.parse(localStorage.getItem("solicitudesData")) || [];
  
    //agregar solicitud actual al historial
    const solicitudActual = {
      nombre: nombre,
      montoInicial: montoInicial,
      anhos: anhos,
      tipo: tipo,
      cuotaMensual: cuotaMensual
    };
    solicitudesAnteriores.push(solicitudActual);
  
    //datos al local Storage
    localStorage.setItem("solicitudesData", JSON.stringify(solicitudesAnteriores));
  
    //mostrar resultados
    mostrarCuotas(cuotasArray, nombre);
    mostrarSolicitudesAnteriores(solicitudesAnteriores);
  
    //limpiar campos
    document.getElementById("nombre").value = "";
    document.getElementById("monto").value = "";
    document.getElementById("anhos").value = "";
    document.getElementById("tipo").value = "hipotecario";
  }
  
  //ve si hay datos guardados en el almacenamiento local y mostrar las solicitudes anteriores
  window.addEventListener("DOMContentLoaded", () => {
    const solicitudesData = localStorage.getItem("solicitudesData");
    if (solicitudesData) {
      const solicitudesAnteriores = JSON.parse(solicitudesData);
      mostrarSolicitudesAnteriores(solicitudesAnteriores);
    }
  });
  