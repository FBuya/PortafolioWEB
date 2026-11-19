/* =========================================================
   Franco Buyatti — página de servicios
   ========================================================= */

// ⚠️ COMPLETÁ ESTOS DOS DATOS
// WhatsApp: código de país + 9 + área + número, sin "+", espacios ni guiones. Ej: "5491123456789"
const WHATSAPP = "1153332369";
// LinkedIn: la dirección completa de tu perfil
const LINKEDIN = "https://www.linkedin.com/in/francobuyatti";

/* ---------------------------------------------------------
   Links de WhatsApp (con mensaje precargado) y LinkedIn
   --------------------------------------------------------- */
document.querySelectorAll(".js-whatsapp").forEach((link) => {
  const mensaje = link.dataset.mensaje || "Hola Franco!";
  link.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
  link.target = "_blank";
  link.rel = "noopener";
});

document.querySelectorAll(".js-linkedin").forEach((link) => {
  link.href = LINKEDIN;
});

if (WHATSAPP.includes("X") || LINKEDIN.includes("TU-USUARIO")) {
  console.warn("Faltan completar WhatsApp y/o LinkedIn en script.js");
}

/* ---------------------------------------------------------
   Demo en vivo: cambiar entre barbería y veterinaria
   --------------------------------------------------------- */
const frame = document.getElementById("demoFrame");
const opciones = document.querySelectorAll(".selector__op");

opciones.forEach((boton) => {
  boton.addEventListener("click", () => {
    if (boton.getAttribute("aria-pressed") === "true") return;

    opciones.forEach((b) => b.setAttribute("aria-pressed", String(b === boton)));
    frame.classList.add("cargando");
    frame.title = boton.dataset.titulo;

    // Esperamos que termine el fundido antes de cambiar la página
    setTimeout(() => { frame.src = boton.dataset.src; }, 200);
  });
});

frame.addEventListener("load", () => frame.classList.remove("cargando"));

/* ---------------------------------------------------------
   Menú en celular
   --------------------------------------------------------- */
const menuBoton = document.getElementById("menuBoton");
const nav = document.getElementById("nav");

function cerrarMenu() {
  nav.classList.remove("abierto");
  menuBoton.setAttribute("aria-expanded", "false");
  menuBoton.setAttribute("aria-label", "Abrir menú");
}

menuBoton.addEventListener("click", () => {
  const abierto = nav.classList.toggle("abierto");
  menuBoton.setAttribute("aria-expanded", String(abierto));
  menuBoton.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
});

nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", cerrarMenu));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") cerrarMenu(); });
