let currentUser = null;
let usuariosRegistrados = [];
let usuariosBloqueados = [];
let watchId = null;
let map = null;
let userMarker = null;
let userLocation = null;
let markersUsuarios = {};
let simInterval = null;
let arregloBuses = [];
let simActive = false;
let ubicacionesUsuarios = {};
let paradasMarkers = [];
let rutaPolyline = null;
let guidRutaPolyline = null;
let velocidadFactor = 1;
let busActivoParada = null;
let audioContext = null;
let sonidoHabilitado = true;
let ultimaParadaAnunciada = null;
let ultimoAnuncioTS = 0;
let vozElegida = null;
let vocesDisponibles = [];
let mostrarRuta = true;
let historialRecorridos = [];

let mensajesLocales = [
  { perfil: "Central", mensaje: "¡Bienvenido! Usa el botón para ver bus y parada más cercanos.", timestamp: Date.now(), alias: "Central" }
];

const palabrasProhibidas = [
  "puto", "puta", "mierda", "coño", "carajo", "idiota", "estupido", "estúpido",
  "imbecil", "imbécil", "tarado", "tonto", "tonta", "gilipollas", "capullo",
  "cabron", "cabrón", "hijueputa", "malparido", "malparida", "basura", "escoria",
  "verga", "pendejo", "pendeja", "chinga", "chingada", "culero", "culera",
  "maricon", "maricón", "marica", "joto", "zorra", "perra", "maldito", "maldita",
  "odio", "odioso", "asesino", "matar", "muerte", "muere", "suicidio"
];

const paradasRuta110 = [
  { id: 1, nombre: "El Seminario", lat: 12.144758240336207, lng: -86.30414664284905 },
  { id: 2, nombre: "Barrio Miraflores", lat: 12.145168412775143, lng: -86.30194285365719 },
  { id: 3, nombre: "Taller Murillo", lat: 12.145167069030702, lng: -86.29943055015394 },
  { id: 4, nombre: "UCEM", lat: 12.141344151932993, lng: -86.29943584148924 },
  { id: 5, nombre: "INVUR", lat: 12.138987753464049, lng: -86.30004243183025 },
  { id: 6, nombre: "Aldea SOS", lat: 12.13816842161414, lng: -86.30449502474752 },
  { id: 7, nombre: "Embajada USA", lat: 12.131289749819201, lng: -86.31010688848664 },
  { id: 8, nombre: "Piedrecitas", lat: 12.126377392282791, lng: -86.31167566219536 },
  { id: 9, nombre: "7 Sur Oeste", lat: 12.122956532819893, lng: -86.31207075116235 },
  { id: 10, nombre: "CC Nejapa", lat: 12.124359442793743, lng: -86.30503688244205 },
  { id: 11, nombre: "El Zumen Norte", lat: 12.125880407024507, lng: -86.29545087905004 },
  { id: 12, nombre: "Julio Martínez", lat: 12.12614010311282, lng: -86.28965201342601 },
  { id: 13, nombre: "Rotonda El Periodista", lat: 12.125531057380595, lng: -86.2848262998251 },
  { id: 14, nombre: "ENEL Central", lat: 12.124422091410283, lng: -86.2767945596889 },
  { id: 15, nombre: "UCA", lat: 12.125854887328936, lng: -86.27267096420088 },
  { id: 16, nombre: "Metrocentro", lat: 12.12973947167698, lng: -86.26491994882227 },
  { id: 17, nombre: "Colonia Máximo Jerez", lat: 12.130822760692984, lng: -86.25737980889933 },
  { id: 18, nombre: "Sinsa Altamira", lat: 12.124336823815812, lng: -86.25322145761479 },
  { id: 19, nombre: "Clinica del valle", lat: 12.122751307674211, lng: -86.25251292399596 },
  { id: 20, nombre: "Avon altamira", lat: 12.118246447366335, lng: -86.25235404654164 },
  { id: 21, nombre: "Altamira", lat: 12.117648986377132, lng: -86.25167254371325 },
  { id: 22, nombre: "CC Managua", lat: 12.11837736170104, lng: -86.24928620927827 },
  { id: 23, nombre: "Hospital Manolo Morales", lat: 12.12105162082489, lng: -86.24577075510507 },
  { id: 24, nombre: "Mercado Huembes", lat: 12.12378, lng: -86.2424 },
  { id: 25, nombre: "Ferretería Jenny", lat: 12.12667411883397, lng: -86.23921803063993 },
  { id: 26, nombre: "Nicarao", lat: 12.128374672529908, lng: -86.23486917275213 },
  { id: 27, nombre: "Rubenia", lat: 12.130137755977001, lng: -86.22948713587142 },
  { id: 28, nombre: "Pista La Sabana", lat: 12.12933200947939, lng: -86.22515563246796 },
  { id: 29, nombre: "1 Mayo", lat: 12.12916069293902, lng: -86.22287470901342 },
  { id: 30, nombre: "UniPlaza Rubenia", lat: 12.128762375119045, lng: -86.21827823431535 },
  { id: 31, nombre: "El contilito", lat: 12.131716725017323, lng: -86.21736930180396 },
  { id: 32, nombre: "Laureano Mairena", lat: 12.137363562769915, lng: -86.21673345595816 },
  { id: 33, nombre: "Villa Miguel Gutiérrez", lat: 12.140825998891987, lng: -86.2145159901385 },
  { id: 34, nombre: "Bloquera Howard", lat: 12.139518535094572, lng: -86.20605119358049 },
  { id: 35, nombre: "Semafaros del Mayoreo", lat: 12.134763337745252, lng: -86.19880293616269 },
  { id: 36, nombre: "Mercado Mayoreo", lat: 12.133191475704334, lng: -86.1921867917534 },
  { id: 37, nombre: "la curva", lat: 12.13440074385323, lng: -86.18259665797314 },
  { id: 38, nombre: "Pista sabana Grande", lat: 12.120465218812937, lng: -86.16936556775399 },
  { id: 39, nombre: "Terminal Bismark Martinez", lat: 12.105863178301652, lng: -86.16743445460162 },
];

let circuitoCompleto = [...paradasRuta110];
for (let i = paradasRuta110.length - 2; i > 0; i--) {
  circuitoCompleto.push({ ...paradasRuta110[i], nombre: paradasRuta110[i].nombre + " (Regreso)" });
}

function easeInOutQuad(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }
function getBusNombre(idx) { return `110-U${(idx + 1).toString().padStart(2, '0')}`; }

function detectarPalabrasProhibidas(texto) {
  const t = texto.toLowerCase();
  for (const p of palabrasProhibidas) if (t.includes(p)) return p;
  return null;
}

function estaBloqueado(telefono) { return usuariosBloqueados.some(b => b.telefono === telefono); }

function guardarUsuarios() {
  localStorage.setItem('ruta110_usuarios_final', JSON.stringify(usuariosRegistrados));
  localStorage.setItem('ruta110_bloqueados_final', JSON.stringify(usuariosBloqueados));
}

function guardarUbicaciones() {
  localStorage.setItem('ruta110_ubicaciones_final', JSON.stringify(ubicacionesUsuarios));
}

function guardarHistorial() {
  localStorage.setItem('ruta110_historial_recorridos', JSON.stringify(historialRecorridos));
}

function cargarDatos() {
  const u = localStorage.getItem('ruta110_usuarios_final');
  if (u) usuariosRegistrados = JSON.parse(u);
  const b = localStorage.getItem('ruta110_bloqueados_final');
  if (b) usuariosBloqueados = JSON.parse(b);
  const loc = localStorage.getItem('ruta110_ubicaciones_final');
  if (loc) ubicacionesUsuarios = JSON.parse(loc);
  const hist = localStorage.getItem('ruta110_historial_recorridos');
  if (hist) historialRecorridos = JSON.parse(hist);
  const sonidoOn = localStorage.getItem('ruta110_sonido_on');
  sonidoHabilitado = sonidoOn !== 'false';
  actualizarListaUsuarios();
}

function log(msg) {
  const c = document.getElementById('consola');
  if (!c) return;
  c.innerHTML = `${new Date().toLocaleTimeString()} | ${msg}<br>` + c.innerHTML;
}

function mostrarMensaje(m) {
  const chatDisplay = document.getElementById('chatDisplay');
  if (!chatDisplay) return;
  const div = document.createElement('div');
  if (m.esAdvertencia) {
    div.className = "msg warning";
    div.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${m.mensaje}`;
  } else {
    div.className = m.perfil === "Central" ? "msg admin" : "msg user";
    div.innerHTML = `<b>${m.perfil === "Central" ? "🚌 CENTRAL" : `👤 ${m.alias}`}:</b> ${m.mensaje}<br><small>${new Date(m.timestamp).toLocaleTimeString()}</small>`;
  }
  chatDisplay.appendChild(div);
  chatDisplay.scrollTop = chatDisplay.scrollHeight;
  if (document.getElementById('adminPanel')?.classList.contains('active') && typeof actualizarAdminDatos === 'function') {
    actualizarAdminDatos();
  }
}

function enviarMensaje(texto) {
  if (!currentUser) { alert('Regístrate'); return false; }
  if (estaBloqueado(currentUser.telefono)) {
    mostrarMensaje({ perfil: "Sistema", mensaje: "⛔ Estás bloqueado.", timestamp: Date.now(), alias: "Sistema", esAdvertencia: true });
    return false;
  }
  const palabra = detectarPalabrasProhibidas(texto);
  if (palabra) {
    usuariosBloqueados.push({ telefono: currentUser.telefono, alias: currentUser.alias, motivo: `Palabra prohibida: "${palabra}"`, fecha: Date.now() });
    guardarUsuarios();
    mostrarMensaje({ perfil: "Sistema", mensaje: `⚠️ "${currentUser.alias}" ha sido BLOQUEADO. Motivo: ${palabra}`, timestamp: Date.now(), alias: "Sistema", esAdvertencia: true });
    return false;
  }
  const nuevoMensaje = { perfil: "Pasajero", mensaje: texto, timestamp: Date.now(), telefono: currentUser.telefono, alias: currentUser.alias };
  mensajesLocales.push(nuevoMensaje);
  mostrarMensaje(nuevoMensaje);
  return true;
}

function handleSendMessage() {
  const input = document.getElementById('chatInput');
  const txt = input ? input.value.trim() : '';
  if (txt) {
    enviarMensaje(txt);
    input.value = '';
  }
}

function calcularDistancia(lat1, lng1, lat2, lng2) {
  const R = 6371e3;
  const φ1 = lat1 * Math.PI / 180, φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function calcularAngulo(from, to) {
  const y = Math.sin((to.lng - from.lng) * Math.PI / 180) * Math.cos(to.lat * Math.PI / 180);
  const x = Math.cos(from.lat * Math.PI / 180) * Math.sin(to.lat * Math.PI / 180) -
    Math.sin(from.lat * Math.PI / 180) * Math.cos(to.lat * Math.PI / 180) * Math.cos((to.lng - from.lng) * Math.PI / 180);
  return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
}

function crearIconoBus(idx) {
  return L.divIcon({
    html: `<div class="bus-wrapper"><div class="bus-label-top">${getBusNombre(idx)}</div><div class="bus-body"></div></div>`,
    className: '',
    iconSize: [60, 68],
    iconAnchor: [30, 44]
  });
}

function crearIconoParada(esVerde = false) {
  return L.divIcon({
    html: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 32" class="marker-pin-svg">
        <defs>
          <linearGradient id="pinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#ff4b4b" />
            <stop offset="100%" stop-color="#cc0000" />
          </linearGradient>
          <linearGradient id="pinGreenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#10b981" />
            <stop offset="100%" stop-color="#059669" />
          </linearGradient>
        </defs>
        <ellipse cx="12" cy="30" rx="6" ry="2" fill="#000000" opacity="0.3" />
        <path class="pin-balloon" d="M 12 2 C 6.48 2, 2 6.48, 2 12 C 2 19.5, 12 30, 12 30 C 12 30, 22 19.5, 22 12 C 22 6.48, 17.52 2, 12 2 Z" />
        <circle cx="12" cy="12" r="4" fill="#ffffff" />
      </svg>
    `,
    className: `pin-parada-container ${esVerde ? 'pin-verde' : ''}`,
    iconSize: [24, 32],
    iconAnchor: [12, 30],
    popupAnchor: [0, -30]
  });
}

function actualizarListaUsuarios() {
  const listaDiv = document.getElementById('listaUsuarios');
  if (!listaDiv) return;
  if (usuariosRegistrados.length === 0) {
    listaDiv.innerHTML = '<div style="padding:8px; text-align:center;">No hay usuarios</div>';
    return;
  }
  listaDiv.innerHTML = usuariosRegistrados.map(user => {
    const esActual = currentUser && currentUser.telefono === user.telefono;
    const bloqueado = estaBloqueado(user.telefono);
    return `<div class="usuario-item" onclick="cambiarAUsuario('${user.telefono.replace(/'/g, "\\'")}')">
      <span>👤 ${user.alias} ${bloqueado ? '<span class="bloqueado-badge">BLOQ</span>' : ''}</span>
      ${esActual ? '<span style="background:#10b981; padding:2px 6px; border-radius:10px;">ACT</span>' : ''}
    </div>`;
  }).join('');
}

window.cambiarAUsuario = function (telefono) {
  const usuario = usuariosRegistrados.find(u => u.telefono === telefono);
  if (!usuario) return;
  if (watchId) { navigator.geolocation.clearWatch(watchId); watchId = null; }
  currentUser = usuario;

  if (guidRutaPolyline && map) {
    map.removeLayer(guidRutaPolyline);
    guidRutaPolyline = null;
  }
  document.getElementById('userStatus').innerHTML = `🟢 ${usuario.alias}`;
  document.getElementById('userAliasDisplay').innerHTML = `🔒 Teléfono privado`;
  document.getElementById('userBlockStatus').innerHTML = estaBloqueado(usuario.telefono)
    ? '<span style="color:#ef4444;">⛔ BLOQUEADO</span>'
    : '';
  actualizarListaUsuarios();

  // Actualizar todos los marcadores en el mapa y cambiar íconos/popups
  actualizarTodosLosMarcadores();

  // Mostrar ubicación guardada en el mapa si existe
  const savedLoc = ubicacionesUsuarios[usuario.telefono];
  if (savedLoc) {
    userLocation = savedLoc;
    map.setView([userLocation.lat, userLocation.lng], 15);

    const gpsDisplay = document.getElementById('gpsStatusDisplay');
    if (gpsDisplay) {
      gpsDisplay.innerHTML = `📍 GPS activo`;
      gpsDisplay.className = 'gps-status gps-active';
    }
    const estadoGPS = document.getElementById('estadoGPS');
    if (estadoGPS) estadoGPS.innerHTML = '📍 GPS: Activo';
  } else {
    userLocation = null;

    const gpsDisplay = document.getElementById('gpsStatusDisplay');
    if (gpsDisplay) {
      gpsDisplay.innerHTML = `📡 GPS: Inactivo`;
      gpsDisplay.className = 'gps-status gps-inactive';
    }
    const estadoGPS = document.getElementById('estadoGPS');
    if (estadoGPS) estadoGPS.innerHTML = '📍 GPS: Inactivo';
  }

  document.getElementById('cambiarUsuarioModal')?.classList.remove('active');
};

function actualizarTodosLosMarcadores() {
  if (!map) return;

  // Eliminar marcadores de usuarios que ya no existen o no tienen ubicación
  Object.keys(markersUsuarios).forEach(tel => {
    if (!usuariosRegistrados.some(u => u.telefono === tel) || !ubicacionesUsuarios[tel]) {
      map.removeLayer(markersUsuarios[tel]);
      delete markersUsuarios[tel];
    }
  });

  // Dibujar o actualizar marcadores para todos los usuarios con ubicación
  usuariosRegistrados.forEach(u => {
    const loc = ubicacionesUsuarios[u.telefono];
    if (loc) {
      const esActivo = currentUser && currentUser.telefono === u.telefono;
      const popupText = `<b>Ubicación compartida</b><br>👤 Alias: ${u.alias}`;

      if (markersUsuarios[u.telefono]) {
        // Actualizar posición, ícono y contenido del popup
        markersUsuarios[u.telefono].setLatLng([loc.lat, loc.lng]);
        markersUsuarios[u.telefono].setPopupContent(popupText);
        markersUsuarios[u.telefono].setIcon(L.divIcon({
          html: esActivo ? '📍' : '👤',
          iconSize: [24, 24],
          className: esActivo ? 'marker-activo' : 'marker-usuario'
        }));
      } else {
        // Crear nuevo marcador
        const marker = L.marker([loc.lat, loc.lng], {
          icon: L.divIcon({
            html: esActivo ? '📍' : '👤',
            iconSize: [24, 24],
            className: esActivo ? 'marker-activo' : 'marker-usuario'
          })
        }).addTo(map);
        marker.bindPopup(popupText);
        markersUsuarios[u.telefono] = marker;
      }

      // Si es el usuario activo, abrir popup y actualizar referencia
      if (esActivo) {
        markersUsuarios[u.telefono].openPopup();
        userMarker = markersUsuarios[u.telefono];
      }
    }
  });
}

function cargarListaUsuariosCambio() {
  const cont = document.getElementById('listaUsuariosCambio');
  if (!cont) return;
  if (usuariosRegistrados.length === 0) {
    cont.innerHTML = '<div style="padding:8px; font-size:0.75rem;">No hay usuarios registrados</div>';
    return;
  }
  cont.innerHTML = usuariosRegistrados.map(u => {
    const bloqueado = estaBloqueado(u.telefono);
    return `<div class="usuario-item" onclick="cambiarAUsuario('${u.telefono.replace(/'/g, "\\'")}')">
      <span>👤 ${u.alias} ${bloqueado ? '<span class="bloqueado-badge">BLOQ</span>' : ''}</span>
      <span style="font-size:0.6rem; color:#9ca3af;">${u.telefono}</span>
    </div>`;
  }).join('');
}

function abrirCambioUsuario() {
  cargarListaUsuariosCambio();
  document.getElementById('cambiarUsuarioModal')?.classList.add('active');
}

function cargarParadasEnMapa() {
  paradasMarkers = [];
  paradasRuta110.forEach((p, idx) => {
    const marker = L.marker([p.lat, p.lng], { icon: crearIconoParada(false) }).addTo(map);
    marker.bindPopup(p.nombre);
    paradasMarkers[idx] = marker;
  });
  const rutaCoords = paradasRuta110.map(p => [p.lat, p.lng]);
  rutaPolyline = L.polyline(rutaCoords, {
    color: '#00d2ff',
    weight: 5,
    opacity: 0.85,
    dashArray: '8,10',
    lineCap: 'round'
  }).addTo(map);
}

function actualizarGlobosPorBuses() {
  if (!paradasMarkers.length || !arregloBuses.length) return;
  arregloBuses.forEach((bus, idxBus) => {
    for (let i = 0; i < paradasRuta110.length; i++) {
      const parada = paradasRuta110[i];
      const dist = calcularDistancia(bus.lat, bus.lng, parada.lat, parada.lng);
      if (dist < 120) {
        const marker = paradasMarkers[i];
        if (!marker) continue;
        const el = marker.getElement();
        if (el) el.classList.add('pin-verde');
        if (marker.getTooltip()) marker.closeTooltip();
        marker.bindTooltip(`🚌 ${getBusNombre(idxBus)} llegó a ${parada.nombre}`, {
          permanent: false,
          direction: 'top',
          className: 'tooltip-parada',
          interactive: false
        });
        marker.openTooltip();
        setTimeout(() => {
          if (marker.getTooltip()) marker.closeTooltip();
          if (el) el.classList.remove('pin-verde');
        }, 2000);
        reproducirSonidoParada(parada.nombre);
        log(`🚌 ${getBusNombre(idxBus)} llegó a ${parada.nombre}`);
        const noti = document.getElementById('notificacion');
        if (noti) noti.innerHTML = `🚌 Simulación activa`;
        break;
      }
    }
  });
}

function crearBus(idx, pos, rutaIndex) {
  const marker = L.marker([pos.lat, pos.lng], { icon: crearIconoBus(idx) }).addTo(map);
  const siguiente = circuitoCompleto[(rutaIndex + 1) % circuitoCompleto.length];
  const angulo = calcularAngulo(pos, siguiente);

  const idxFinIda = paradasRuta110.length - 1;
  const tipoInicial = (rutaIndex < idxFinIda) ? "Ida" : "Vuelta";
  const origenNombreInicial = circuitoCompleto[rutaIndex]?.nombre || "";

  const bus = {
    nombre: getBusNombre(idx),
    marker,
    lat: pos.lat,
    lng: pos.lng,
    indexRuta: rutaIndex,
    animando: false,
    angulo: angulo,
    tracking: {
      tipo: tipoInicial,
      inicioTS: Date.now(),
      origenNombre: origenNombreInicial
    }
  };

  setTimeout(() => {
    const el = marker.getElement();
    if (el) {
      const body = el.querySelector('.bus-body');
      if (body) body.style.transform = `rotate(${angulo}deg)`;
    }
  }, 50);

  return bus;
}

function actualizarRotacionBus(bus, from, to) {
  const angulo = calcularAngulo(from, to);
  bus.angulo = angulo;
  const el = bus.marker.getElement();
  if (el) {
    const body = el.querySelector('.bus-body');
    if (body) body.style.transform = `rotate(${angulo}deg)`;
  }
}

function animarBus(bus, from, to, duracion = 1400) {
  const inicio = performance.now();
  bus.animando = true;
  actualizarRotacionBus(bus, from, to);

  function frame(now) {
    const p = Math.min((now - inicio) / (duracion / velocidadFactor), 1);
    const t = easeInOutQuad(p);
    const lat = from.lat + (to.lat - from.lat) * t;
    const lng = from.lng + (to.lng - from.lng) * t;
    bus.lat = lat;
    bus.lng = lng;
    bus.marker.setLatLng([lat, lng]);

    // Mantener la rotación en cada frame de la animación
    const el = bus.marker.getElement();
    if (el) {
      const body = el.querySelector('.bus-body');
      if (body) body.style.transform = `rotate(${bus.angulo}deg)`;
    }

    if (p < 1) {
      requestAnimationFrame(frame);
    } else {
      bus.indexRuta = (bus.indexRuta + 1) % circuitoCompleto.length;
      bus.animando = false;
      if (typeof verificarTrackingLeg === 'function') {
        verificarTrackingLeg(bus);
      }
    }
  }

  requestAnimationFrame(frame);
}

function moverBuses() {
  if (!simActive) return;
  arregloBuses.forEach((bus, idx) => {
    if (bus.animando) return;
    const actual = circuitoCompleto[bus.indexRuta];
    const siguiente = circuitoCompleto[(bus.indexRuta + 1) % circuitoCompleto.length];
    animarBus(bus, actual, siguiente, 1500);
  });
  actualizarTelemetria();
  actualizarGlobosPorBuses();
}

function iniciarSimulacionConCantidad() {
  const cantidad = parseInt(document.getElementById('cantidadBusesSelect')?.value || '0');
  if (simActive) detenerSimulacion();
  if (cantidad === 0) {
    actualizarTelemetria();
    return;
  }
  velocidadFactor = parseFloat(document.getElementById('velocidadSelect')?.value || '1');
  arregloBuses.forEach(b => { if (map && map.hasLayer(b.marker)) map.removeLayer(b.marker); });
  arregloBuses = [];
  for (let i = 0; i < cantidad; i++) {
    const idxInicial = Math.floor((circuitoCompleto.length / cantidad) * i);
    const pos = circuitoCompleto[idxInicial];
    arregloBuses.push(crearBus(i, pos, idxInicial));
  }
  simActive = true;
  actualizarTelemetria();
  const noti = document.getElementById('notificacion');
  if (noti) noti.innerHTML = `🚌 Simulación activa con ${cantidad} unidades`;
  log(`▶ Simulación iniciada con ${cantidad} buses`);
}

function detenerSimulacion() {
  simActive = false;
  if (simInterval) clearInterval(simInterval);
  simInterval = null;
  const noti = document.getElementById('notificacion');
  if (noti) noti.innerHTML = '⏹ Simulación detenida';
  log('⏹ Simulación detenida');
}

function cargarParadasEnLista() {
  const lista = document.getElementById('listaParadas');
  if (!lista) return;
  lista.innerHTML = paradasRuta110.map(p => `<div class="parada-item" onclick="map.setView([${p.lat}, ${p.lng}], 16)">${p.id}. ${p.nombre}</div>`).join('');
}

function reproducirSonidoParada(paradaNombre) {
  if (!sonidoHabilitado) return;
  const ahora = Date.now();
  if (ultimaParadaAnunciada === paradaNombre && ahora - ultimoAnuncioTS < 8000) return;
  ultimaParadaAnunciada = paradaNombre;
  ultimoAnuncioTS = ahora;

  if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(780, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(420, audioContext.currentTime + 0.16);

  gainNode.gain.setValueAtTime(0.25, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.16);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.16);

  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(`parada: ${paradaNombre}`);
    msg.voice = vozElegida || null;
    msg.lang = vozElegida?.lang || 'es-ES';
    msg.rate = 0.95;
    msg.pitch = 1;
    msg.volume = 0.85;
    setTimeout(() => speechSynthesis.speak(msg), 170);
  }
}

function buscarInfoCompleta() {
  if (!userLocation) { alert('⚠️ Primero activa tu GPS'); return; }
  if (!simActive || arregloBuses.length === 0) { alert('🚌 No hay buses en simulación'); return; }

  let busCercano = null;
  let distanciaMinimaBus = Infinity;
  arregloBuses.forEach((bus, idx) => {
    const d = calcularDistancia(userLocation.lat, userLocation.lng, bus.lat, bus.lng);
    if (d < distanciaMinimaBus) {
      distanciaMinimaBus = d;
      busCercano = { bus: getBusNombre(idx), distancia: d, idx, lat: bus.lat, lng: bus.lng };
    }
  });

  let paradaCercana = null;
  let distanciaMinimaParada = Infinity;
  paradasRuta110.forEach(parada => {
    const d = calcularDistancia(userLocation.lat, userLocation.lng, parada.lat, parada.lng);
    if (d < distanciaMinimaParada) {
      distanciaMinimaParada = d;
      paradaCercana = { nombre: parada.nombre, lat: parada.lat, lng: parada.lng, distancia: d };
    }
  });

  const distanciaBusTexto = busCercano.distancia < 1000 ? `${Math.round(busCercano.distancia)} metros` : `${(busCercano.distancia / 1000).toFixed(1)} kilómetros`;
  const minutosBus = Math.max(1, Math.round(busCercano.distancia / 300));
  const tiempoBusTexto = `${minutosBus} minutos aprox.`;
  const distanciaParadaTexto = paradaCercana.distancia < 1000 ? `${Math.round(paradaCercana.distancia)} metros` : `${(paradaCercana.distancia / 1000).toFixed(1)} kilómetros`;

  document.getElementById('cercanoBus').innerHTML = `<strong>${busCercano.bus}</strong> (el más cercano a ti)`;
  document.getElementById('cercanoDistancia').innerHTML = `${distanciaBusTexto} desde tu ubicación`;
  document.getElementById('cercanoTiempo').innerHTML = `${tiempoBusTexto} de viaje estimado`;
  document.getElementById('paradaNombre').innerHTML = `<strong>${paradaCercana.nombre}</strong>`;
  document.getElementById('paradaDistancia').innerHTML = `${distanciaParadaTexto} desde tu ubicación`;
  document.getElementById('sugerencia').innerHTML = `<i class="fas fa-lightbulb"></i> Puedes esperar en "${paradaCercana.nombre}".`;
  document.getElementById('resultadoCercano').style.display = 'block';
  const noti = document.getElementById('notificacion');
  if (noti) noti.innerHTML = `🎯 ${busCercano.bus} a ${distanciaBusTexto} | Parada: ${paradaCercana.nombre}`;
  log(`🎯 Bus más cercano: ${busCercano.bus}`);

  // Trazar línea de guía hacia la parada más cercana
  if (guidRutaPolyline && map) {
    map.removeLayer(guidRutaPolyline);
  }
  const caminoCoords = [
    [userLocation.lat, userLocation.lng],
    [paradaCercana.lat, paradaCercana.lng]
  ];
  guidRutaPolyline = L.polyline(caminoCoords, {
    color: '#8b5cf6', // Color morado
    weight: 4,
    opacity: 0.85,
    dashArray: '6, 8', // Estilo línea de puntos / camino
    lineCap: 'round'
  }).addTo(map);

  // Ajustar la vista del mapa para englobar al usuario y la parada cercana
  const bounds = L.latLngBounds(caminoCoords);
  map.fitBounds(bounds, { padding: [50, 50] });
}

function actualizarTelemetria() {
  const telemetryContent = document.getElementById('telemetryContent');
  if (!telemetryContent) return;
  if (!simActive || arregloBuses.length === 0) {
    telemetryContent.innerHTML = `<div style="text-align:center; padding:20px;"><i class="fas fa-bus"></i><br>Inicia simulación</div>`;
    return;
  }

  let html = '';
  arregloBuses.forEach((bus, idx) => {
    const busNombre = getBusNombre(idx);
    const siguiente = (bus.indexRuta + 1) % circuitoCompleto.length;
    const proxParada = circuitoCompleto[siguiente];
    const distancia = calcularDistancia(bus.lat, bus.lng, proxParada.lat, proxParada.lng);
    const distanciaTexto = distancia < 500 ? `📏 ${Math.round(distancia)}m` : `🔄 ${(distancia / 1000).toFixed(1)}km`;

    html += `<div class="unidad-card">
      <div class="unidad-nombre"><i class="fas fa-bus"></i> ${busNombre}</div>
      <div class="unidad-proxima"><i class="fas fa-map-marker-alt"></i> Próximo punto: ${proxParada.nombre}</div>
      <div class="unidad-distancia">${distanciaTexto}</div>
      <div class="unidad-estado estado-moviendo">🔵 En movimiento</div>
    </div>`;
  });
  telemetryContent.innerHTML = html;
}

function cargarVoces() {
  if (!('speechSynthesis' in window)) return;
  vocesDisponibles = speechSynthesis.getVoices();
  vozElegida = vocesDisponibles.find(v => v.lang === 'es-ES') || vocesDisponibles.find(v => v.lang && v.lang.startsWith('es')) || vocesDisponibles.find(v => v.default) || vocesDisponibles[0] || null;
}

if ('speechSynthesis' in window) {
  cargarVoces();
  if (speechSynthesis.onvoiceschanged !== undefined) speechSynthesis.onvoiceschanged = cargarVoces;
}

function activarGPSReal(ignorarConfirmacion) {
  if (!currentUser) { alert('Regístrate'); return; }
  if (!navigator.geolocation) { alert('GPS no soportado'); return; }

  if (ignorarConfirmacion !== true) {
    const deseaActivar = confirm("¿Deseas permitir que la aplicación acceda y comparta la ubicación para el número de teléfono " + currentUser.telefono + "?");
    if (!deseaActivar) {
      log("🚫 Compartir ubicación cancelado por el usuario.");
      return;
    }
  }

  log('📍 Solicitando GPS...');
  if (watchId) navigator.geolocation.clearWatch(watchId);

  navigator.geolocation.getCurrentPosition(() => {
    watchId = navigator.geolocation.watchPosition((pos) => {
      userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      ubicacionesUsuarios[currentUser.telefono] = userLocation;
      guardarUbicaciones();
      if (document.getElementById('adminPanel')?.classList.contains('active') && typeof actualizarAdminDatos === 'function') {
        actualizarAdminDatos();
      }

      actualizarTodosLosMarcadores();

      if (!window.ubicacionCentrada) {
        map.setView([userLocation.lat, userLocation.lng], 15);
        window.ubicacionCentrada = true;
      }

      const gpsDisplay = document.getElementById('gpsStatusDisplay');
      if (gpsDisplay) {
        gpsDisplay.innerHTML = `📍 GPS activo`;
        gpsDisplay.className = 'gps-status gps-active';
      }
      const estadoGPS = document.getElementById('estadoGPS');
      if (estadoGPS) estadoGPS.innerHTML = '📍 GPS: Activo';
    }, (e) => {
      log(`❌ GPS error: ${e.message}`);
    }, { enableHighAccuracy: true, timeout: 10000 });
  }, () => {
    alert('Permiso denegado');
  });
}

function centrarEnMiUbicacion() {
  if (userLocation) {
    map.setView([userLocation.lat, userLocation.lng], 16);
    log('🎯 Centrado');
  } else {
    alert('Activa GPS');
  }
}

function registrarNuevoUsuario() {
  const alias = document.getElementById('userAlias')?.value.trim();
  const telefono = document.getElementById('phoneNumber')?.value.trim();
  const error = document.getElementById('registerError');
  if (!alias || !telefono) {
    if (error) error.textContent = 'Completa alias y número.';
    return;
  }
  if (usuariosRegistrados.some(u => u.telefono === telefono)) {
    if (error) error.textContent = 'Ese número ya existe.';
    return;
  }
  const nuevo = { alias, telefono };
  usuariosRegistrados.push(nuevo);
  currentUser = nuevo;
  guardarUsuarios();
  if (document.getElementById('adminPanel')?.classList.contains('active') && typeof actualizarAdminDatos === 'function') {
    actualizarAdminDatos();
  }
  actualizarListaUsuarios();
  if (error) error.textContent = '';
  document.getElementById('registerModal')?.classList.remove('active');

  // Solicitar compartir ubicación
  setTimeout(() => {
    solicitarCompartirUbicacion();
  }, 300);
}

function solicitarCompartirUbicacion() {
  if (!currentUser) return;
  const deseaCompartir = confirm("¿Deseas compartir tu ubicación para el número de teléfono " + currentUser.telefono + "?");
  if (deseaCompartir) {
    activarGPSReal(true);
  } else {
    log("🚫 Compartir ubicación cancelado por el usuario.");
  }
}

function abrirAdmin() {
  document.getElementById('loginAdminModal')?.classList.add('active');
}

function cerrarAdmin() {
  document.getElementById('adminPanel')?.classList.remove('active');
}

function loginAdmin() {
  const pass = document.getElementById('adminPassword')?.value || '';
  const err = document.getElementById('loginError');
  if (pass !== '1234') {
    if (err) err.textContent = 'Contraseña incorrecta.';
    return;
  }
  if (err) err.textContent = '';
  document.getElementById('loginAdminModal')?.classList.remove('active');
  document.getElementById('adminPanel')?.classList.add('active');
  mostrarAdminPanel();
}

window.mostrarAdminPanel = function () {
  const root = document.getElementById('adminRoot');
  if (!root) return;

  root.innerHTML = `
    <div class="admin-container">
      <div class="admin-header">
        <div class="admin-title"><i class="fas fa-shield-alt"></i> Panel de Administración de Operaciones</div>
      </div>
      
      <nav class="admin-nav">
        <button class="admin-tab-btn active" id="btn-tab-resumen" onclick="switchAdminTab('resumen')"><i class="fas fa-chart-pie"></i> Resumen</button>
        <button class="admin-tab-btn" id="btn-tab-moderacion" onclick="switchAdminTab('moderacion')"><i class="fas fa-comments"></i> Moderación de Chat</button>
        <button class="admin-tab-btn" id="btn-tab-simulacion" onclick="switchAdminTab('simulacion')"><i class="fas fa-bus"></i> Control de Simulación</button>
        <button class="admin-tab-btn" id="btn-tab-tiempos" onclick="switchAdminTab('tiempos')"><i class="fas fa-clock"></i> Tiempos y Recorridos</button>
      </nav>

      <!-- PESTAÑA: RESUMEN -->
      <div id="tab-resumen" class="admin-tab-content active">
        <div class="admin-stats-grid">
          <div class="admin-stat-card">
            <div>
              <div class="admin-stat-title">Pasajeros Registrados</div>
              <div class="admin-stat-value" id="stat-usuarios">0</div>
            </div>
            <i class="fas fa-users admin-stat-icon"></i>
          </div>
          <div class="admin-stat-card">
            <div>
              <div class="admin-stat-title">Usuarios Bloqueados</div>
              <div class="admin-stat-value" id="stat-bloqueados" style="color: #ef4444;">0</div>
            </div>
            <i class="fas fa-user-slash admin-stat-icon" style="color: #ef4444;"></i>
          </div>
          <div class="admin-stat-card">
            <div>
              <div class="admin-stat-title">Buses Activos</div>
              <div class="admin-stat-value" id="stat-buses">0</div>
            </div>
            <i class="fas fa-bus admin-stat-icon" style="color: #00d2ff;"></i>
          </div>
        </div>
        
        <div class="admin-card">
          <div class="admin-card-title"><i class="fas fa-users-cog"></i> Lista de Pasajeros Registrados</div>
          <div class="admin-list-container" id="admin-lista-pasajeros"></div>
          <button class="admin-btn admin-btn-danger" style="margin-top:12px;" onclick="eliminarTodosLosUsuarios()"><i class="fas fa-trash-alt"></i> Limpiar Todo el Registro</button>
        </div>
      </div>

      <!-- PESTAÑA: MODERACIÓN -->
      <div id="tab-moderacion" class="admin-tab-content">
        <div class="admin-grid-two-cols">
          <div class="admin-card">
            <div class="admin-card-title"><i class="fas fa-paper-plane"></i> Enviar Mensaje Central</div>
            <div class="admin-input-group">
              <label>Mensaje Oficial de la Central</label>
              <textarea id="admin-broadcast-msg" rows="3" placeholder="Escribe un mensaje oficial para todos los pasajeros..."></textarea>
            </div>
            <button class="admin-btn admin-btn-success" onclick="enviarAnuncioCentral()"><i class="fas fa-bullhorn"></i> Transmitir Mensaje</button>
          </div>
          
          <div class="admin-card">
            <div class="admin-card-title"><i class="fas fa-user-lock"></i> Lista de Usuarios Bloqueados</div>
            <div class="admin-list-container" id="admin-lista-bloqueados"></div>
          </div>
        </div>
        
        <div class="admin-card" style="margin-top:20px;">
          <div class="admin-card-title"><i class="fas fa-history"></i> Historial de Chat Reciente</div>
          <div class="admin-list-container" id="admin-historial-chat" style="max-height: 300px;"></div>
        </div>
      </div>

      <!-- PESTAÑA: SIMULACIÓN -->
      <div id="tab-simulacion" class="admin-tab-content">
        <div class="admin-card">
          <div class="admin-card-title"><i class="fas fa-tachometer-alt"></i> Control de Parámetros de Simulación</div>
          
          <div class="admin-input-group" style="margin-bottom: 20px;">
            <label>Velocidad de Simulación (Factor multiplicador: <span id="admin-val-velocidad">${velocidadFactor}</span>x)</label>
            <div class="admin-slider-container">
              <span>Lenta (0.1x)</span>
              <input type="range" class="admin-slider" id="admin-slider-velocidad" min="0.1" max="2" step="0.1" value="${velocidadFactor}" oninput="cambiarVelocidadSlider(this.value)">
              <span>Rápida (2.0x)</span>
            </div>
          </div>
          
          <div class="admin-grid-two-cols">
            <div class="admin-input-group">
              <label>Cantidad de Buses Activos</label>
              <select id="admin-cant-buses" onchange="cambiarCantidadBusesAdmin(this.value)">
                ${Array.from({ length: 11 }, (_, i) => `<option value="${i}" ${arregloBuses.length === i ? 'selected' : ''}>${i}</option>`).join('')}
              </select>
            </div>
            
            <div class="admin-input-group">
              <label>Estado de Simulación</label>
              <div style="display:flex; gap:10px;">
                <button class="admin-btn admin-btn-success" id="admin-btn-play" onclick="controlSimulacionBtn('play')"><i class="fas fa-play"></i> Iniciar</button>
                <button class="admin-btn admin-btn-danger" id="admin-btn-stop" onclick="controlSimulacionBtn('stop')"><i class="fas fa-stop"></i> Detener</button>
              </div>
            </div>
          </div>
        </div>

        <div class="admin-card">
          <div class="admin-card-title"><i class="fas fa-plus-circle"></i> Agregar Parada Dinámica a la Ruta</div>
          <div class="admin-grid-two-cols">
            <div class="admin-input-group">
              <label>Nombre de la Parada</label>
              <input type="text" id="admin-parada-nombre" placeholder="Ej. Centro de Convenciones">
            </div>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
              <div class="admin-input-group">
                <label>Latitud</label>
                <input type="number" id="admin-parada-lat" placeholder="Ej. 12.135" step="0.00001">
              </div>
              <div class="admin-input-group">
                <label>Longitud</label>
                <input type="number" id="admin-parada-lng" placeholder="Ej. -86.265" step="0.00001">
              </div>
            </div>
          </div>
          <button class="admin-btn admin-btn-primary" onclick="agregarParadaAdmin()"><i class="fas fa-plus"></i> Añadir Parada a la Ruta</button>
        </div>
      </div>

      <!-- PESTAÑA: TIEMPOS Y RECORRIDOS -->
      <div id="tab-tiempos" class="admin-tab-content">
        <div class="admin-card">
          <div class="admin-card-title" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
            <span><i class="fas fa-history"></i> Historial de Recorridos y Tiempos de Unidades</span>
            <div style="display:flex; gap:10px;">
              <button class="admin-btn admin-btn-success" onclick="exportarExcelRecorridos()"><i class="fas fa-file-excel"></i> Exportar a Excel</button>
              <button class="admin-btn admin-btn-danger" onclick="limpiarHistorialRecorridos()"><i class="fas fa-trash-alt"></i> Limpiar Historial</button>
            </div>
          </div>
          
          <div class="admin-list-container" id="admin-lista-recorridos" style="max-height: 400px; overflow-y: auto; padding: 10px;">
            <!-- Contenido dinámico -->
          </div>
        </div>
      </div>

    </div>
  `;

  actualizarAdminDatos();
};

window.switchAdminTab = function (tabName) {
  document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
  document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));

  document.getElementById(`tab-${tabName}`)?.classList.add('active');
  document.getElementById(`btn-tab-${tabName}`)?.classList.add('active');

  actualizarAdminDatos();
};

window.actualizarAdminDatos = function () {
  const statUsuarios = document.getElementById('stat-usuarios');
  const statBloqueados = document.getElementById('stat-bloqueados');
  const statBuses = document.getElementById('stat-buses');

  if (statUsuarios) statUsuarios.textContent = usuariosRegistrados.length;
  if (statBloqueados) statBloqueados.textContent = usuariosBloqueados.length;
  if (statBuses) statBuses.textContent = simActive ? arregloBuses.length : 0;

  const userList = document.getElementById('admin-lista-pasajeros');
  if (userList) {
    if (usuariosRegistrados.length === 0) {
      userList.innerHTML = '<div style="padding:15px; text-align:center; color:#9ca3af;">No hay usuarios registrados</div>';
    } else {
      userList.innerHTML = usuariosRegistrados.map(u => {
        const bloqueado = estaBloqueado(u.telefono);
        const uloc = ubicacionesUsuarios[u.telefono];
        const coordText = uloc ? `${uloc.lat.toFixed(5)}, ${uloc.lng.toFixed(5)}` : 'Sin señal GPS';
        return `
          <div class="admin-list-item">
            <div class="user-details">
              <strong>👤 ${u.alias}</strong>
              <span class="user-meta">📞 ${u.telefono} | 📍 ${coordText}</span>
            </div>
            <div>
              ${bloqueado
            ? `<button class="admin-btn admin-btn-secondary" style="padding:4px 8px;" onclick="desbloquearUsuarioAdmin('${u.telefono.replace(/'/g, "\\'")}')">Desbloquear</button>`
            : `<button class="admin-btn admin-btn-danger" style="padding:4px 8px;" onclick="bloquearUsuarioAdmin('${u.telefono.replace(/'/g, "\\'")}', 'Baneo manual del Administrador')">Bloquear</button>`
          }
            </div>
          </div>
        `;
      }).join('');
    }
  }

  const blockList = document.getElementById('admin-lista-bloqueados');
  if (blockList) {
    if (usuariosBloqueados.length === 0) {
      blockList.innerHTML = '<div style="padding:15px; text-align:center; color:#9ca3af;">No hay usuarios bloqueados</div>';
    } else {
      blockList.innerHTML = usuariosBloqueados.map(b => `
        <div class="admin-list-item">
          <div class="user-details">
            <strong style="color:#ef4444;">👤 ${b.alias}</strong>
            <span class="user-meta">📞 ${b.telefono}</span>
            <span class="user-meta" style="font-style:italic; color:#9ca3af;">Motivo: ${b.motivo || 'No especificado'}</span>
          </div>
          <button class="admin-btn admin-btn-secondary" style="padding:4px 8px;" onclick="desbloquearUsuarioAdmin('${b.telefono.replace(/'/g, "\\'")}')">Desbloquear</button>
        </div>
      `).join('');
    }
  }

  const chatHist = document.getElementById('admin-historial-chat');
  if (chatHist) {
    if (mensajesLocales.length === 0) {
      chatHist.innerHTML = '<div style="padding:15px; text-align:center; color:#9ca3af;">No hay mensajes en el chat</div>';
    } else {
      chatHist.innerHTML = mensajesLocales.map((m, idx) => {
        const timestampStr = new Date(m.timestamp).toLocaleTimeString();
        const esCentral = m.perfil === "Central";
        const bloqueado = m.telefono ? estaBloqueado(m.telefono) : false;

        return `
          <div class="admin-list-item" style="border-left: 3px solid ${esCentral ? '#10b981' : '#3b82f6'};">
            <div class="user-details">
              <div>
                <span class="admin-badge ${esCentral ? 'admin-badge-system' : 'admin-badge-active'}">${esCentral ? 'CENTRAL' : 'PASAJERO'}</span>
                <strong>${m.alias || m.perfil}</strong> <small style="color:#9ca3af; font-size:0.6rem;">${timestampStr}</small>
              </div>
              <div style="font-size:0.75rem; margin-top:2px;">${m.mensaje}</div>
            </div>
            <div>
              ${(!esCentral && m.telefono && !bloqueado)
            ? `<button class="admin-btn admin-btn-danger" style="padding:2px 6px; font-size:0.6rem;" onclick="bloquearUsuarioAdmin('${m.telefono.replace(/'/g, "\\'")}', 'Bloqueado desde chat')">Bloquear</button>`
            : ''
          }
            </div>
          </div>
        `;
      }).reverse().join('');
    }
  }

  const recorridosList = document.getElementById('admin-lista-recorridos');
  if (recorridosList) {
    if (historialRecorridos.length === 0) {
      recorridosList.innerHTML = '<div style="padding:15px; text-align:center; color:#9ca3af;">No hay recorridos registrados todavía. Inicia la simulación para empezar a cronometrar.</div>';
    } else {
      recorridosList.innerHTML = `
        <table class="admin-table" style="width:100%; border-collapse:collapse; text-align:left; font-size:0.7rem;">
          <thead>
            <tr style="border-bottom:1.5px solid #2d3748; color:#00d2ff;">
              <th style="padding:8px;">Unidad</th>
              <th style="padding:8px;">Sentido</th>
              <th style="padding:8px;">Origen</th>
              <th style="padding:8px;">Destino</th>
              <th style="padding:8px;">Inicio</th>
              <th style="padding:8px;">Fin</th>
              <th style="padding:8px;">Duración</th>
            </tr>
          </thead>
          <tbody>
            ${historialRecorridos.map(r => `
              <tr style="border-bottom:1px solid #2d3748;">
                <td style="padding:8px; font-weight:bold;"><i class="fas fa-bus"></i> ${r.unidad}</td>
                <td style="padding:8px;">
                  <span class="admin-badge ${r.tipo === 'Ida' ? 'admin-badge-system' : 'admin-badge-active'}" style="padding:2px 6px;">
                    ${r.tipo}
                  </span>
                </td>
                <td style="padding:8px;">${r.origen}</td>
                <td style="padding:8px;">${r.destino}</td>
                <td style="padding:8px; color:#9ca3af;">${r.inicio.split(', ')[1] || r.inicio}</td>
                <td style="padding:8px; color:#9ca3af;">${r.fin.split(', ')[1] || r.fin}</td>
                <td style="padding:8px; font-weight:bold; color:#10b981;">${r.duracionFormateada}</td>
              </tr>
            `).reverse().join('')}
          </tbody>
        </table>
      `;
    }
  }
};

window.bloquearUsuarioAdmin = function (telefono, motivo = 'Baneo manual') {
  const user = usuariosRegistrados.find(u => u.telefono === telefono);
  const alias = user ? user.alias : 'Usuario Desconocido';
  if (!usuariosBloqueados.some(b => b.telefono === telefono)) {
    usuariosBloqueados.push({ telefono, alias, motivo, fecha: Date.now() });
    guardarUsuarios();

    const alertMsg = { perfil: "Sistema", mensaje: `⚠️ "${alias}" ha sido BLOQUEADO por la administración.`, timestamp: Date.now(), alias: "Sistema", esAdvertencia: true };
    mensajesLocales.push(alertMsg);
    mostrarMensaje(alertMsg);

    log(`🔒 Usuario ${alias} (${telefono}) bloqueado por el administrador.`);

    if (currentUser && currentUser.telefono === telefono) {
      document.getElementById('userBlockStatus').innerHTML = '<span style="color:#ef4444;">⛔ BLOQUEADO</span>';
    }
  }
  actualizarAdminDatos();
  actualizarListaUsuarios();
};

window.desbloquearUsuarioAdmin = function (telefono) {
  const prevLength = usuariosBloqueados.length;
  usuariosBloqueados = usuariosBloqueados.filter(b => b.telefono !== telefono);
  if (usuariosBloqueados.length !== prevLength) {
    guardarUsuarios();
    const user = usuariosRegistrados.find(u => u.telefono === telefono);
    const alias = user ? user.alias : 'Usuario';

    const infoMsg = { perfil: "Central", mensaje: `✔️ "${alias}" ha sido desbloqueado por la administración.`, timestamp: Date.now(), alias: "Central" };
    mensajesLocales.push(infoMsg);
    mostrarMensaje(infoMsg);

    log(`🔓 Usuario ${alias} (${telefono}) desbloqueado por el administrador.`);

    if (currentUser && currentUser.telefono === telefono) {
      document.getElementById('userBlockStatus').innerHTML = '';
    }
  }
  actualizarAdminDatos();
  actualizarListaUsuarios();
};

window.enviarAnuncioCentral = function () {
  const textarea = document.getElementById('admin-broadcast-msg');
  const txt = textarea ? textarea.value.trim() : '';
  if (!txt) return;

  const anuncio = { perfil: "Central", mensaje: txt, timestamp: Date.now(), alias: "Central" };
  mensajesLocales.push(anuncio);
  mostrarMensaje(anuncio);

  if (textarea) textarea.value = '';
  log(`📣 Anuncio oficial de Central transmitido: "${txt}"`);
  actualizarAdminDatos();
};

window.eliminarTodosLosUsuarios = function () {
  if (confirm('¿Estás seguro de que deseas eliminar TODOS los usuarios y registros? Esto cerrará tu sesión actual.')) {
    usuariosRegistrados = [];
    usuariosBloqueados = [];
    ubicacionesUsuarios = {};
    guardarUsuarios();
    guardarUbicaciones();

    currentUser = null;
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      watchId = null;
    }

    Object.values(markersUsuarios).forEach(m => map.removeLayer(m));
    markersUsuarios = {};
    userMarker = null;
    if (guidRutaPolyline && map) {
      map.removeLayer(guidRutaPolyline);
      guidRutaPolyline = null;
    }

    document.getElementById('userStatus').innerHTML = `🔴 No registrado`;
    document.getElementById('userAliasDisplay').innerHTML = ``;
    document.getElementById('userBlockStatus').innerHTML = ``;

    const gpsDisplay = document.getElementById('gpsStatusDisplay');
    if (gpsDisplay) {
      gpsDisplay.innerHTML = `📡 GPS: Inactivo`;
      gpsDisplay.className = 'gps-status gps-inactive';
    }
    const estadoGPS = document.getElementById('estadoGPS');
    if (estadoGPS) estadoGPS.innerHTML = '📍 GPS: Inactivo';

    const chatDisplay = document.getElementById('chatDisplay');
    if (chatDisplay) {
      chatDisplay.innerHTML = `<div class="msg admin"><b>🚌 Central:</b> ¡Bienvenido!</div>`;
    }
    mensajesLocales = [
      { perfil: "Central", mensaje: "¡Bienvenido! Usa el botón para ver bus y parada más cercanos.", timestamp: Date.now(), alias: "Central" }
    ];

    log(`🧹 Base de datos de usuarios completamente reseteada por el administrador.`);

    cerrarAdmin();
    actualizarListaUsuarios();
    alert('Base de datos limpiada con éxito.');
  }
};

window.cambiarVelocidadSlider = function (val) {
  velocidadFactor = parseFloat(val);
  const valLabel = document.getElementById('admin-val-velocidad');
  if (valLabel) valLabel.textContent = val;

  const mainSelect = document.getElementById('velocidadSelect');
  if (mainSelect) {
    let found = false;
    for (let i = 0; i < mainSelect.options.length; i++) {
      if (Math.abs(parseFloat(mainSelect.options[i].value) - velocidadFactor) < 0.05) {
        mainSelect.selectedIndex = i;
        found = true;
        break;
      }
    }
    if (!found) {
      const opt = document.createElement('option');
      opt.value = val;
      opt.text = `Personalizada (${val}x)`;
      mainSelect.appendChild(opt);
      mainSelect.value = val;
    }
  }

  log(`⚡ Velocidad ajustada por slider de administrador a ${val}x`);
};

window.cambiarCantidadBusesAdmin = function (val) {
  const select = document.getElementById('cantidadBusesSelect');
  if (select) {
    select.value = val;
    iniciarSimulacionConCantidad();
    if (simActive) {
      if (simInterval) clearInterval(simInterval);
      simInterval = setInterval(moverBuses, 1200);
    }
    actualizarAdminDatos();
  }
};

window.controlSimulacionBtn = function (action) {
  if (action === 'play') {
    document.getElementById('btnIniciarSimulacion')?.click();
  } else {
    document.getElementById('btnDetenerSimulacion')?.click();
  }
  setTimeout(actualizarAdminDatos, 100);
};

window.agregarParadaAdmin = function () {
  const nameInput = document.getElementById('admin-parada-nombre');
  const latInput = document.getElementById('admin-parada-lat');
  const lngInput = document.getElementById('admin-parada-lng');

  const nombre = nameInput ? nameInput.value.trim() : '';
  const lat = latInput ? parseFloat(latInput.value) : NaN;
  const lng = lngInput ? parseFloat(lngInput.value) : NaN;

  if (!nombre || isNaN(lat) || isNaN(lng)) {
    alert('Por favor complete todos los datos de la nueva parada.');
    return;
  }

  const nuevaParada = {
    id: paradasRuta110.length + 1,
    nombre: nombre,
    lat: lat,
    lng: lng
  };

  paradasRuta110.push(nuevaParada);

  circuitoCompleto = [...paradasRuta110];
  for (let i = paradasRuta110.length - 2; i > 0; i--) {
    circuitoCompleto.push({ ...paradasRuta110[i], nombre: paradasRuta110[i].nombre + " (Regreso)" });
  }

  if (map) {
    const marker = L.marker([lat, lng], { icon: crearIconoParada(false) }).addTo(map);
    marker.bindPopup(nombre);
    paradasMarkers.push(marker);

    if (rutaPolyline) {
      map.removeLayer(rutaPolyline);
    }
    const rutaCoords = paradasRuta110.map(p => [p.lat, p.lng]);
    rutaPolyline = L.polyline(rutaCoords, {
      color: '#00d2ff',
      weight: 5,
      opacity: 0.85,
      dashArray: '8,10',
      lineCap: 'round'
    }).addTo(map);

    map.setView([lat, lng], 15);
  }

  if (nameInput) nameInput.value = '';
  if (latInput) latInput.value = '';
  if (lngInput) lngInput.value = '';

  cargarParadasEnLista();
  log(`📍 Nueva parada agregada por administrador: "${nombre}" en (${lat.toFixed(5)}, ${lng.toFixed(5)})`);
  alert(`Parada "${nombre}" agregada exitosamente a la ruta.`);

  if (simActive) {
    iniciarSimulacionConCantidad();
    if (simInterval) clearInterval(simInterval);
    simInterval = setInterval(moverBuses, 1200);
  }

  actualizarAdminDatos();
};

function activarSonido() {
  sonidoHabilitado = true;
  localStorage.setItem('ruta110_sonido_on', 'true');
}

function desactivarSonido() {
  sonidoHabilitado = false;
  localStorage.setItem('ruta110_sonido_on', 'false');
}

function formatearDuracion(segundos) {
  const m = Math.floor(segundos / 60);
  const s = segundos % 60;
  return `${m}m ${s}s`;
}

function verificarTrackingLeg(bus) {
  const ahora = Date.now();
  const idxFinIda = paradasRuta110.length - 1;

  if (bus.indexRuta === 0) {
    if (bus.tracking && bus.tracking.tipo === "Vuelta" && bus.tracking.inicioTS) {
      const duracionSegundos = Math.round((ahora - bus.tracking.inicioTS) / 1000);
      const recorrido = {
        unidad: bus.nombre || getBusNombre(bus.id || 0),
        tipo: "Vuelta",
        origen: bus.tracking.origenNombre || "Giro Reconciliación",
        destino: circuitoCompleto[0]?.nombre || "El Seminario",
        inicio: new Date(bus.tracking.inicioTS).toLocaleString('es-NI', { hour12: false }),
        fin: new Date(ahora).toLocaleString('es-NI', { hour12: false }),
        duracionSegundos: duracionSegundos,
        duracionFormateada: formatearDuracion(duracionSegundos)
      };
      historialRecorridos.push(recorrido);
      guardarHistorial();
      log(`⏱️ ${recorrido.unidad} completó Vuelta en ${recorrido.duracionFormateada}`);

      if (document.getElementById('adminPanel')?.classList.contains('active')) {
        actualizarAdminDatos();
      }
    }

    bus.tracking = {
      tipo: "Ida",
      inicioTS: ahora,
      origenNombre: circuitoCompleto[0]?.nombre || ""
    };
  } else if (bus.indexRuta === idxFinIda) {
    if (bus.tracking && bus.tracking.tipo === "Ida" && bus.tracking.inicioTS) {
      const duracionSegundos = Math.round((ahora - bus.tracking.inicioTS) / 1000);
      const recorrido = {
        unidad: bus.nombre || getBusNombre(bus.id || 0),
        tipo: "Ida",
        origen: bus.tracking.origenNombre || "El Seminario",
        destino: circuitoCompleto[idxFinIda]?.nombre || "Giro Reconciliación",
        inicio: new Date(bus.tracking.inicioTS).toLocaleString('es-NI', { hour12: false }),
        fin: new Date(ahora).toLocaleString('es-NI', { hour12: false }),
        duracionSegundos: duracionSegundos,
        duracionFormateada: formatearDuracion(duracionSegundos)
      };
      historialRecorridos.push(recorrido);
      guardarHistorial();
      log(`⏱️ ${recorrido.unidad} completó Ida en ${recorrido.duracionFormateada}`);

      if (document.getElementById('adminPanel')?.classList.contains('active')) {
        actualizarAdminDatos();
      }
    }

    bus.tracking = {
      tipo: "Vuelta",
      inicioTS: ahora,
      origenNombre: circuitoCompleto[idxFinIda]?.nombre || ""
    };
  }
}

window.exportarExcelRecorridos = function () {
  if (historialRecorridos.length === 0) {
    alert('No hay datos de recorrido para exportar.');
    return;
  }

  const data = historialRecorridos.map(r => ({
    'Unidad': r.unidad,
    'Sentido': r.tipo,
    'Origen': r.origen,
    'Destino': r.destino,
    'Fecha y Hora Inicio': r.inicio,
    'Fecha y Hora Fin': r.fin,
    'Duración (segundos)': r.duracionSegundos,
    'Duración Formateada': r.duracionFormateada
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const maxProps = [
    { wch: 12 },
    { wch: 12 },
    { wch: 25 },
    { wch: 25 },
    { wch: 22 },
    { wch: 22 },
    { wch: 18 },
    { wch: 20 }
  ];
  worksheet['!cols'] = maxProps;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Recorridos');

  XLSX.writeFile(workbook, `Reporte_Recorridos_Ruta110_${new Date().toISOString().slice(0, 10)}.xlsx`);
  log('📊 Reporte de recorridos exportado a Excel');
};

window.limpiarHistorialRecorridos = function () {
  if (confirm('¿Estás seguro de que deseas limpiar todo el historial de recorridos?')) {
    historialRecorridos = [];
    guardarHistorial();
    actualizarAdminDatos();
    log('🧹 Historial de recorridos limpiado');
  }
};

function toggleTelemetryPanel() {
  const content = document.getElementById('telemetryContent');
  const icon = document.getElementById('toggleIcon');
  if (!content) return;
  const hidden = content.style.display === 'none';
  content.style.display = hidden ? 'block' : 'none';
  if (icon) icon.className = hidden ? 'fas fa-chevron-up' : 'fas fa-chevron-down';
}



function centrarRuta() {
  if (map) map.fitBounds(L.latLngBounds(paradasRuta110.map(p => [p.lat, p.lng])));
}

function toggleRuta() {
  mostrarRuta = !mostrarRuta;
  if (rutaPolyline) {
    if (mostrarRuta) map.addLayer(rutaPolyline);
    else map.removeLayer(rutaPolyline);
  }
  const btn = document.getElementById('toggleRutaBtn');
  if (btn) {
    btn.innerHTML = mostrarRuta
      ? '<i class="fas fa-eye"></i> Ruta ON'
      : '<i class="fas fa-eye-slash"></i> Ruta OFF';
  }
}

function bindEventos() {
  const mapaEventos = {
    sendBtn: handleSendMessage,
    btnRegistroNuevo: () => document.getElementById('registerModal')?.classList.add('active'),
    registerBtn: registrarNuevoUsuario,
    btnCambiarUsuario: abrirCambioUsuario,
    cancelarCambioBtn: () => document.getElementById('cambiarUsuarioModal')?.classList.remove('active'),
    btnActivarGPS: activarGPSReal,
    btnCentrarGPS: centrarEnMiUbicacion,
    btnBusCercano: buscarInfoCompleta,
    btnIniciarSimulacion: () => {
      iniciarSimulacionConCantidad();
      if (simInterval) clearInterval(simInterval);
      simInterval = setInterval(moverBuses, 1200);
    },
    btnDetenerSimulacion: detenerSimulacion,
    btnVerRuta: centrarRuta,
    toggleRutaBtn: toggleRuta,
    openAdminBtn: abrirAdmin,
    btnSonidoOn: activarSonido,
    btnSonidoOff: desactivarSonido,
    loginAdminSubmit: loginAdmin,
    closeAdminBtn: cerrarAdmin,
    toggleTelemetry: toggleTelemetryPanel
  };

  Object.entries(mapaEventos).forEach(([id, fn]) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', fn);
  });

  const chatInput = document.getElementById('chatInput');
  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSendMessage();
    });
  }
}

function initApp() {
  map = L.map('map').setView([12.138, -86.28], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap'
  }).addTo(map);

  cargarDatos();
  cargarParadasEnMapa();
  cargarParadasEnLista();
  actualizarListaUsuarios();
  actualizarTodosLosMarcadores();
  bindEventos();

  setTimeout(() => {
    if (map) {
      map.invalidateSize();
      centrarRuta();
    }
  }, 200);
}

document.addEventListener('DOMContentLoaded', initApp);