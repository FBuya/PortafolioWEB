/* =========================================================
   MODO DEMO
   En esta demo los números de WhatsApp y teléfono son inventados.
   En vez de abrir WhatsApp, cada botón muestra un cartel que explica
   cómo funcionaría en la web real, con el mensaje que le llegaría
   al negocio y un botón para escribirle a Franco.

   Para la web de un cliente real: borrar este archivo y la línea
   <script src="demo.js" ...> del index.html. Nada más.
   ========================================================= */
(() => {
  const WHATSAPP_FRANCO = "5491153332369";
  const rubro = document.currentScript?.dataset.rubro || "negocio";

  const css = `
    .demo-dialogo {
      width: min(92vw, 420px); padding: 1.6rem; border: 0; border-radius: 18px;
      background: var(--card, #fff); color: var(--texto, #1f2933);
      box-shadow: 0 30px 80px rgba(0,0,0,.45); font: inherit;
    }
    .demo-dialogo::backdrop { background: rgba(10, 12, 16, .6); }
    .demo-dialogo__etiqueta {
      display: inline-block; margin: 0 0 .8rem; padding: .2em .7em; border-radius: 999px;
      font-size: .78rem; font-weight: 700; background: #25d36622; color: #1a9e52;
    }
    .demo-dialogo__titulo { margin: 0 0 .5rem; font-size: 1.3rem; line-height: 1.2; }
    .demo-dialogo__texto { margin: 0 0 1rem; opacity: .8; font-size: .97rem; line-height: 1.5; }
    .demo-dialogo__burbuja {
      margin: 0 0 1.3rem; padding: .7rem .9rem; border-radius: 12px 12px 12px 4px;
      background: #dcf8c6; color: #1f2c33; font-size: .93rem; line-height: 1.45;
      white-space: pre-line;
    }
    .demo-dialogo__acciones { display: flex; flex-wrap: wrap; gap: .6rem; }
    .demo-dialogo__cta, .demo-dialogo__cerrar {
      flex: 1 1 auto; padding: .8em 1.1em; border-radius: 999px; font: inherit;
      font-weight: 700; font-size: .95rem; text-align: center; text-decoration: none; cursor: pointer;
    }
    .demo-dialogo__cta { background: #25d366; color: #fff; border: 0; }
    .demo-dialogo__cerrar { background: transparent; color: inherit; border: 1px solid currentColor; opacity: .75; }
  `;
  const estilo = document.createElement("style");
  estilo.textContent = css;
  document.head.appendChild(estilo);

  const dialogo = document.createElement("dialog");
  dialogo.className = "demo-dialogo";
  dialogo.innerHTML = `
    <p class="demo-dialogo__etiqueta">Esto es una demo</p>
    <h2 class="demo-dialogo__titulo"></h2>
    <p class="demo-dialogo__texto"></p>
    <div class="demo-dialogo__burbuja"></div>
    <div class="demo-dialogo__acciones">
      <a class="demo-dialogo__cta" target="_blank" rel="noopener">Quiero una web así</a>
      <button type="button" class="demo-dialogo__cerrar">Seguir mirando</button>
    </div>`;
  document.body.appendChild(dialogo);

  const titulo = dialogo.querySelector(".demo-dialogo__titulo");
  const texto = dialogo.querySelector(".demo-dialogo__texto");
  const burbuja = dialogo.querySelector(".demo-dialogo__burbuja");
  const cta = dialogo.querySelector(".demo-dialogo__cta");

  cta.href = `https://wa.me/${WHATSAPP_FRANCO}?text=${encodeURIComponent(
    `Hola Franco! Vi la demo de ${rubro} y quiero una web así para mi negocio.`
  )}`;

  function mostrarDemo({ tituloTexto, explicacion, mensaje }) {
    titulo.textContent = tituloTexto;
    texto.textContent = explicacion;
    burbuja.textContent = mensaje || "";
    burbuja.hidden = !mensaje;
    dialogo.showModal();
  }
  window.mostrarDemo = mostrarDemo; // lo usa el formulario de turnos, si hay

  // Interceptamos antes que el link se abra
  document.addEventListener("click", (e) => {
    const wa = e.target.closest(".js-whatsapp");
    const tel = e.target.closest(".js-telefono");
    if (wa) {
      e.preventDefault();
      let mensaje = "";
      try { mensaje = new URL(wa.href).searchParams.get("text") || ""; } catch {}
      mostrarDemo({
        tituloTexto: "Así le llega el mensaje al negocio",
        explicacion: "En tu web, este botón abre WhatsApp con tu número y el mensaje ya escrito. Tu cliente solo toca Enviar:",
        mensaje,
      });
    } else if (tel) {
      e.preventDefault();
      mostrarDemo({
        tituloTexto: "Llamada directa",
        explicacion: "En tu web, este botón llama a tu número con un solo toque desde el celular. Ideal para urgencias.",
      });
    }
  }, true);

  dialogo.querySelector(".demo-dialogo__cerrar").addEventListener("click", () => dialogo.close());
  // Tocar fuera del cartel también lo cierra
  dialogo.addEventListener("click", (e) => { if (e.target === dialogo) dialogo.close(); });
})();
