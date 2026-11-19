/* =========================================================
   Barbería Faro Norte — demo
   CONFIGURACIÓN: para adaptar a otro cliente, tocá solo esto.
   ========================================================= */

// Número con código de país, sin "+" ni espacios (54 9 11 ...).
// Este es de ejemplo: no existe.
const WHATSAPP = "5491100000000";

// 0 = domingo ... 6 = sábado. null = cerrado. Formato 24 hs.
const HORARIOS = {
  1: null,                              // lunes
  2: { abre: "10:00", cierra: "20:00" },
  3: { abre: "10:00", cierra: "20:00" },
  4: { abre: "10:00", cierra: "20:00" },
  5: { abre: "10:00", cierra: "21:00" },
  6: { abre: "09:00", cierra: "18:00" },
  0: null,                              // domingo
};

const ZONA_HORARIA = "America/Argentina/Buenos_Aires";
const NOMBRES_DIA = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const ORDEN_SEMANA = [1, 2, 3, 4, 5, 6, 0]; // la tabla arranca en lunes

/* ---------------------------------------------------------
   1. Links de WhatsApp con mensaje precargado
   - data-servicio="Corte"  -> "Hola! Quiero reservar un turno para: Corte"
   - data-mensaje="..."     -> usa ese texto tal cual
   --------------------------------------------------------- */
document.querySelectorAll(".js-whatsapp").forEach((link) => {
  const servicio = link.dataset.servicio;
  const mensaje = servicio
    ? `Hola! Quiero reservar un turno para: ${servicio}. ¿Qué días tienen libre?`
    : link.dataset.mensaje || "Hola!";

  link.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
  link.target = "_blank";
  link.rel = "noopener";
});

/* ---------------------------------------------------------
   2. Hora actual EN ARGENTINA (aunque el visitante esté en otro país)
   --------------------------------------------------------- */
function ahoraEnArgentina() {
  const partes = new Intl.DateTimeFormat("en-US", {
    timeZone: ZONA_HORARIA,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());

  const get = (tipo) => partes.find((p) => p.type === tipo).value;
  const dias = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

  return {
    dia: dias[get("weekday")],
    minutos: (Number(get("hour")) % 24) * 60 + Number(get("minute")),
  };
}

const aMinutos = (hhmm) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/* ---------------------------------------------------------
   3. Cartel "Abierto ahora / Cerrado"
   --------------------------------------------------------- */
function actualizarEstado() {
  const cartel = document.getElementById("estado");
  const { dia, minutos } = ahoraEnArgentina();
  const hoy = HORARIOS[dia];

  if (hoy && minutos >= aMinutos(hoy.abre) && minutos < aMinutos(hoy.cierra)) {
    cartel.textContent = `Abierto ahora · hasta las ${hoy.cierra}`;
    cartel.className = "estado abierto";
    return;
  }

  // Si hoy todavía no abrió, avisamos a qué hora abre hoy
  if (hoy && minutos < aMinutos(hoy.abre)) {
    cartel.textContent = `Cerrado · hoy abre a las ${hoy.abre}`;
  } else {
    // Buscamos el próximo día con horario
    for (let i = 1; i <= 7; i++) {
      const d = (dia + i) % 7;
      if (HORARIOS[d]) {
        const cuando = i === 1 ? "mañana" : `el ${NOMBRES_DIA[d].toLowerCase()}`;
        cartel.textContent = `Cerrado · abre ${cuando} a las ${HORARIOS[d].abre}`;
        break;
      }
    }
  }
  cartel.className = "estado cerrado";
}

/* ---------------------------------------------------------
   4. Tabla de horarios (resalta el día de hoy)
   --------------------------------------------------------- */
function armarTablaHorarios() {
  const tabla = document.getElementById("tablaHorarios");
  const { dia } = ahoraEnArgentina();

  tabla.innerHTML = ORDEN_SEMANA.map((d) => {
    const h = HORARIOS[d];
    const texto = h ? `${h.abre} – ${h.cierra}` : "Cerrado";
    return `<tr class="${d === dia ? "hoy" : ""}"><td>${NOMBRES_DIA[d]}</td><td>${texto}</td></tr>`;
  }).join("");
}

armarTablaHorarios();
actualizarEstado();
setInterval(actualizarEstado, 60 * 1000); // se actualiza solo cada minuto

/* ---------------------------------------------------------
   5. Menú en celular
   --------------------------------------------------------- */
const boton = document.getElementById("navToggle");
const nav = document.getElementById("nav");

boton.addEventListener("click", () => {
  const abierto = nav.classList.toggle("abierto");
  boton.setAttribute("aria-expanded", abierto);
  boton.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
});

// Al tocar un link del menú, se cierra
nav.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    nav.classList.remove("abierto");
    boton.setAttribute("aria-expanded", "false");
  })
);

/* ---------------------------------------------------------
   6. Detalles visuales
   --------------------------------------------------------- */
// Línea bajo el header cuando scrolleás
const header = document.getElementById("header");
window.addEventListener("scroll", () => {
  header.classList.toggle("con-sombra", window.scrollY > 10);
}, { passive: true });

// Aparición suave de las secciones
const observer = new IntersectionObserver((entradas) => {
  entradas.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add("visible");
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".section .container, .cta-final .container").forEach((el) => {
  el.classList.add("revelar");
  observer.observe(el);
});
