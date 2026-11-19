/* =========================================================
   Veterinaria Ombú — demo
   CONFIGURACIÓN: para adaptar a otro cliente, tocá solo esto.
   ========================================================= */

// Números de ejemplo: no existen.
const WHATSAPP = "5491100000000";        // con código de país, sin "+"
const TELEFONO_GUARDIA = "+541100000000"; // para el link tel:

// 0 = domingo ... 6 = sábado. null = cerrado. Formato 24 hs.
const HORARIOS = {
  1: { abre: "09:00", cierra: "20:00" },
  2: { abre: "09:00", cierra: "20:00" },
  3: { abre: "09:00", cierra: "20:00" },
  4: { abre: "09:00", cierra: "20:00" },
  5: { abre: "09:00", cierra: "20:00" },
  6: { abre: "09:00", cierra: "14:00" },
  0: null,
};

const ZONA_HORARIA = "America/Argentina/Buenos_Aires";
const NOMBRES_DIA = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const ORDEN_SEMANA = [1, 2, 3, 4, 5, 6, 0];

/* ---------------------------------------------------------
   1. Links de WhatsApp y teléfono
   --------------------------------------------------------- */
const linkWhatsApp = (texto) =>
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`;

document.querySelectorAll(".js-whatsapp").forEach((link) => {
  link.href = linkWhatsApp(link.dataset.mensaje || "Hola!");
  link.target = "_blank";
  link.rel = "noopener";
});

// En celular abre el marcador directamente
document.querySelectorAll(".js-telefono").forEach((link) => {
  link.href = `tel:${TELEFONO_GUARDIA}`;
});

/* ---------------------------------------------------------
   2. Formulario de turno -> mensaje de WhatsApp armado
   --------------------------------------------------------- */
const form = document.getElementById("formTurno");
const errorBox = document.getElementById("formError");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const datos = new FormData(form);
  const tuNombre = datos.get("tuNombre").trim();
  const mascota = datos.get("mascota").trim();
  const especie = datos.get("especie");
  const motivo = datos.get("motivo");
  const cuando = datos.get("cuando");
  const comentario = datos.get("comentario").trim();

  // Validación: marcamos los campos vacíos obligatorios
  const faltan = [];
  [["tuNombre", tuNombre], ["mascota", mascota], ["motivo", motivo]].forEach(([id, valor]) => {
    const campo = document.getElementById(id).closest(".campo");
    campo.classList.toggle("con-error", !valor);
    if (!valor) faltan.push(id);
  });

  if (faltan.length) {
    errorBox.textContent = "Completá los campos marcados en rojo.";
    document.getElementById(faltan[0]).focus();
    return;
  }
  errorBox.textContent = "";

  const lineas = [
    `Hola! Soy ${tuNombre} y quiero pedir un turno.`,
    `🐾 Mascota: ${mascota} (${especie})`,
    `📋 Motivo: ${motivo}`,
    `🕒 Preferencia: ${cuando}`,
  ];
  if (comentario) lineas.push(`💬 ${comentario}`);

  // En la demo se muestra el cartel explicativo; en una web real, abre WhatsApp
  if (window.mostrarDemo) {
    window.mostrarDemo({
      tituloTexto: "Así le llega el turno a la veterinaria",
      explicacion: "En tu web, el formulario abre WhatsApp con tu número y todos los datos ordenados:",
      mensaje: lineas.join("\n"),
    });
    return;
  }
  window.open(linkWhatsApp(lineas.join("\n")), "_blank", "noopener");
});

// Al escribir, sacamos la marca de error de ese campo
form.addEventListener("input", (e) => {
  e.target.closest(".campo")?.classList.remove("con-error");
});

/* ---------------------------------------------------------
   3. Hora actual en Argentina + cartel abierto/cerrado
   --------------------------------------------------------- */
function ahoraEnArgentina() {
  const partes = new Intl.DateTimeFormat("en-US", {
    timeZone: ZONA_HORARIA, weekday: "short",
    hour: "2-digit", minute: "2-digit", hour12: false,
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

function actualizarEstado() {
  const cartel = document.getElementById("estado");
  const { dia, minutos } = ahoraEnArgentina();
  const hoy = HORARIOS[dia];

  if (hoy && minutos >= aMinutos(hoy.abre) && minutos < aMinutos(hoy.cierra)) {
    cartel.textContent = `Abierto ahora · hasta las ${hoy.cierra}`;
    cartel.className = "estado abierto";
    return;
  }

  if (hoy && minutos < aMinutos(hoy.abre)) {
    cartel.textContent = `Cerrado · hoy abre a las ${hoy.abre} (guardia activa)`;
  } else {
    for (let i = 1; i <= 7; i++) {
      const d = (dia + i) % 7;
      if (HORARIOS[d]) {
        const cuando = i === 1 ? "mañana" : `el ${NOMBRES_DIA[d].toLowerCase()}`;
        cartel.textContent = `Cerrado · abre ${cuando} a las ${HORARIOS[d].abre} (guardia activa)`;
        break;
      }
    }
  }
  cartel.className = "estado cerrado";
}

function armarTablaHorarios() {
  const { dia } = ahoraEnArgentina();
  document.getElementById("tablaHorarios").innerHTML = ORDEN_SEMANA.map((d) => {
    const h = HORARIOS[d];
    const texto = h ? `${h.abre} – ${h.cierra}` : "Solo guardia";
    return `<tr class="${d === dia ? "hoy" : ""}"><td>${NOMBRES_DIA[d]}</td><td>${texto}</td></tr>`;
  }).join("");
}

armarTablaHorarios();
actualizarEstado();
setInterval(actualizarEstado, 60 * 1000);

/* ---------------------------------------------------------
   4. Menú en celular
   --------------------------------------------------------- */
const boton = document.getElementById("navToggle");
const nav = document.getElementById("nav");

boton.addEventListener("click", () => {
  const abierto = nav.classList.toggle("abierto");
  boton.setAttribute("aria-expanded", abierto);
  boton.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
});
nav.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    nav.classList.remove("abierto");
    boton.setAttribute("aria-expanded", "false");
  })
);

/* ---------------------------------------------------------
   5. Detalles visuales
   --------------------------------------------------------- */
const header = document.getElementById("header");
window.addEventListener("scroll", () => {
  header.classList.toggle("con-sombra", window.scrollY > 10);
}, { passive: true });

const observer = new IntersectionObserver((entradas) => {
  entradas.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add("visible");
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".section .container").forEach((el) => {
  el.classList.add("revelar");
  observer.observe(el);
});
