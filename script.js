let currentUser = null;
let usuariosRegistrados = [];
let usuariosBloqueados = [];
let conductoresRegistrados = [];
let watchIdsConductores = {};
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
let guidRutaLayerGroup = null;
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
let paradaGuiaActual = null;

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
  if (currentUser) {
    localStorage.setItem('ruta110_current_user', JSON.stringify(currentUser));
  } else {
    localStorage.removeItem('ruta110_current_user');
  }

  if (window.FirebaseDB && window.FirebaseSDK) {
    try {
      const { doc, setDoc } = window.FirebaseSDK;
      usuariosRegistrados.forEach(u => {
        const id = u.telefono ? String(u.telefono) : ('usr_' + Math.random());
        setDoc(doc(window.FirebaseDB, "usuarios", id), u, { merge: true });
      });
      usuariosBloqueados.forEach(b => {
        const id = b.telefono ? String(b.telefono) : ('blq_' + Math.random());
        setDoc(doc(window.FirebaseDB, "bloqueados", id), b, { merge: true });
      });
    } catch (e) {
      console.warn("Error guardando usuarios en Firebase:", e);
    }
  }
}

function guardarConductores() {
  localStorage.setItem('ruta110_conductores', JSON.stringify(conductoresRegistrados));

  if (window.FirebaseDB && window.FirebaseSDK) {
    try {
      const { doc, setDoc } = window.FirebaseSDK;
      conductoresRegistrados.forEach(c => {
        const id = c.id ? String(c.id) : (c.nombre ? c.nombre.replace(/\s+/g, '_') : ('cond_' + Math.random()));
        setDoc(doc(window.FirebaseDB, "conductores", id), c, { merge: true });
      });
    } catch (e) {
      console.warn("Error guardando conductores en Firebase:", e);
    }
  }
}

function guardarUbicaciones() {
  localStorage.setItem('ruta110_ubicaciones_final', JSON.stringify(ubicacionesUsuarios));

  if (window.FirebaseDB && window.FirebaseSDK) {
    try {
      const { doc, setDoc } = window.FirebaseSDK;
      Object.keys(ubicacionesUsuarios).forEach(tel => {
        setDoc(doc(window.FirebaseDB, "ubicaciones", String(tel)), {
          telefono: tel,
          ...ubicacionesUsuarios[tel],
          updatedAt: Date.now()
        }, { merge: true });
      });
    } catch (e) {
      console.warn("Error guardando ubicaciones en Firebase:", e);
    }
  }
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
  const cond = localStorage.getItem('ruta110_conductores');
  if (cond) conductoresRegistrados = JSON.parse(cond);
  if (!conductoresRegistrados || conductoresRegistrados.length === 0) {
    conductoresRegistrados = [
      { id: 'cond_1', nombre: 'Carlos Mendoza', identidad: '001-120585-0021K', unidad: '110-U01', placa: 'M 245-891', telefono: '8876-5432' },
      { id: 'cond_2', nombre: 'Roberto Gómez', identidad: '001-230988-0044B', unidad: '110-U02', placa: 'M 198-432', telefono: '8765-4321' },
      { id: 'cond_3', nombre: 'Manuel Silva', identidad: '001-140280-0012L', unidad: '110-U03', placa: 'M 312-765', telefono: '8654-3210' },
      { id: 'cond_4', nombre: 'Franklin Morales', identidad: '001-050692-0033M', unidad: '110-U04', placa: 'M 104-582', telefono: '8943-2109' }
    ];
    guardarConductores();
  }
  const sonidoOn = localStorage.getItem('ruta110_sonido_on');
  sonidoHabilitado = sonidoOn !== 'false';

  // Cargar usuario activo persistido
  const cur = localStorage.getItem('ruta110_current_user');
  if (cur) {
    const tempUser = JSON.parse(cur);
    const exists = usuariosRegistrados.find(usr => usr.telefono === tempUser.telefono);
    if (exists) {
      currentUser = exists;
    } else {
      currentUser = null;
    }
  } else {
    currentUser = null;
  }

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
    mostrarMensaje({ perfil: "Sistema", mensaje: ` "${currentUser.alias}" ha sido BLOQUEADO. Motivo: ${palabra}`, timestamp: Date.now(), alias: "Sistema", esAdvertencia: true });
    return false;
  }
  const nuevoMensaje = { 
    id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    perfil: "Pasajero", 
    mensaje: texto, 
    timestamp: Date.now(), 
    telefono: currentUser.telefono, 
    alias: currentUser.alias 
  };
  
  // Guardar y mostrar en memoria local
  mensajesLocales.push(nuevoMensaje);
  mostrarMensaje(nuevoMensaje);

  // Enviar a Firebase Firestore si está disponible
  if (window.FirebaseDB && window.FirebaseSDK) {
    const { collection, addDoc } = window.FirebaseSDK;
    addDoc(collection(window.FirebaseDB, "mensajes"), nuevoMensaje).then(() => {
      console.log("✅ Mensaje enviado a Firestore con éxito");
    }).catch(err => {
      console.error("❌ Error al guardar en Firebase Firestore:", err);
      mostrarMensaje({
        perfil: "Sistema",
        mensaje: `⚠️ Error de envío en Firebase: ${err.message}. (Si dice 'permission-denied', activa 'Modo de Prueba' en las Reglas de Firestore Database).`,
        timestamp: Date.now(),
        alias: "Sistema",
        esAdvertencia: true
      });
    });
  }
  return true;
}

let loadedMsgIds = new Set();
let firebaseSyncIniciado = false;

function initFirebaseSync() {
  if (firebaseSyncIniciado) return;
  if (!window.FirebaseDB || !window.FirebaseSDK) {
    return;
  }
  firebaseSyncIniciado = true;
  console.log("📡 Conectando Chat a Firebase Firestore...");
  try {
    const { collection, onSnapshot } = window.FirebaseSDK;
    const mensajesRef = collection(window.FirebaseDB, "mensajes");

    // 1. Escuchar Chat
    onSnapshot(mensajesRef, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const msgData = change.doc.data();
          const msgId = change.doc.id || msgData.id;
          if (msgId && !loadedMsgIds.has(msgId)) {
            loadedMsgIds.add(msgId);
            const yaExiste = mensajesLocales.some(m => 
              m.id === msgData.id || 
              (m.timestamp === msgData.timestamp && m.alias === msgData.alias && m.mensaje === msgData.mensaje)
            );
            if (!yaExiste) {
              mensajesLocales.push(msgData);
              mostrarMensaje(msgData);
            }
          }
        }
      });
    }, (error) => {
      console.error("❌ Error de Firestore Chat:", error);
    });

    // 2. Escuchar Usuarios registrados (para Panel Admin)
    onSnapshot(collection(window.FirebaseDB, "usuarios"), (snapshot) => {
      let actualizado = false;
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        const idx = usuariosRegistrados.findIndex(u => String(u.telefono) === String(data.telefono));
        if (idx >= 0) {
          usuariosRegistrados[idx] = { ...usuariosRegistrados[idx], ...data };
        } else {
          usuariosRegistrados.push(data);
          actualizado = true;
        }
      });
      if (actualizado) {
        actualizarListaUsuarios();
        if (typeof actualizarAdminDatos === 'function') actualizarAdminDatos();
      }
    });

    // 3. Escuchar Conductores registrados (para Panel Admin)
    onSnapshot(collection(window.FirebaseDB, "conductores"), (snapshot) => {
      let actualizado = false;
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        const idx = conductoresRegistrados.findIndex(c => String(c.id || c.nombre) === String(data.id || data.nombre));
        if (idx >= 0) {
          conductoresRegistrados[idx] = { ...conductoresRegistrados[idx], ...data };
        } else {
          conductoresRegistrados.push(data);
          actualizado = true;
        }
      });
      if (actualizado) {
        if (typeof actualizarTodosLosMarcadores === 'function') actualizarTodosLosMarcadores();
        if (typeof actualizarAdminDatos === 'function') actualizarAdminDatos();
      }
    });

    // 4. Escuchar Usuarios Bloqueados
    onSnapshot(collection(window.FirebaseDB, "bloqueados"), (snapshot) => {
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        if (!usuariosBloqueados.some(b => String(b.telefono) === String(data.telefono))) {
          usuariosBloqueados.push(data);
        }
      });
      if (typeof actualizarAdminDatos === 'function') actualizarAdminDatos();
    });
  } catch (err) {
    console.error("❌ Excepción inicializando Firebase Sync:", err);
  }
}

window.addEventListener('firebaseReady', initFirebaseSync);

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
    iconAnchor: [30, 44],
    popupAnchor: [0, -45]
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
  guardarUsuarios();
  actualizarInterfazUsuario();
  actualizarListaUsuarios();

  if (guidRutaPolyline && map) {
    map.removeLayer(guidRutaPolyline);
    guidRutaPolyline = null;
  }

  // Actualizar todos los marcadores en el mapa y cambiar íconos/popups
  actualizarTodosLosMarcadores();

  // Mostrar ubicación guardada en el mapa si existe
  const savedLoc = ubicacionesUsuarios[usuario.telefono];
  if (savedLoc) {
    userLocation = savedLoc;
    map.setView([userLocation.lat, userLocation.lng], 15);

    const gpsDisplay = document.getElementById('gpsStatusDisplay');
    if (gpsDisplay) {
      gpsDisplay.innerHTML = `GPS activo`;
      gpsDisplay.className = 'gps-status gps-active';
    }
    const estadoGPS = document.getElementById('estadoGPS');
    if (estadoGPS) estadoGPS.innerHTML = 'GPS: Activo';
  } else {
    userLocation = null;

    const gpsDisplay = document.getElementById('gpsStatusDisplay');
    if (gpsDisplay) {
      gpsDisplay.innerHTML = `📡 GPS: Inactivo`;
      gpsDisplay.className = 'gps-status gps-inactive';
    }
    const estadoGPS = document.getElementById('estadoGPS');
    if (estadoGPS) estadoGPS.innerHTML = ' GPS: Inactivo';
  }

  actualizarNotificacionProximidad();
  document.getElementById('cambiarUsuarioModal')?.classList.remove('active');
};

function actualizarInterfazUsuario() {
  const btnRegistro = document.getElementById('btnRegistroNuevo');
  const btnRegresar = document.getElementById('btnRegresarCuenta');

  if (currentUser) {
    document.getElementById('userStatus').innerHTML = `🟢 ${currentUser.alias}`;
    document.getElementById('userAliasDisplay').innerHTML = `🔒 Teléfono privado`;
    document.getElementById('userBlockStatus').innerHTML = estaBloqueado(currentUser.telefono)
      ? '<span style="color:#ef4444;">⛔ BLOQUEADO</span>'
      : '';

    if (btnRegistro) btnRegistro.style.display = 'none';
    if (btnRegresar) btnRegresar.style.display = 'block';
  } else {
    document.getElementById('userStatus').innerHTML = `🔴 No registrado`;
    document.getElementById('userAliasDisplay').innerHTML = ``;
    document.getElementById('userBlockStatus').innerHTML = ``;

    if (btnRegistro) btnRegistro.style.display = 'block';
    if (btnRegresar) btnRegresar.style.display = 'none';
  }
}

function cerrarSesionUsuario() {
  currentUser = null;
  guardarUsuarios();
  if (watchId) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }
  if (userMarker && map) {
    map.removeLayer(userMarker);
    userMarker = null;
  }

  actualizarInterfazUsuario();
  actualizarListaUsuarios();
  actualizarTodosLosMarcadores();

  if (guidRutaPolyline && map) {
    map.removeLayer(guidRutaPolyline);
    guidRutaPolyline = null;
  }

  const gpsDisplay = document.getElementById('gpsStatusDisplay');
  if (gpsDisplay) {
    gpsDisplay.innerHTML = `📡 GPS: Inactivo`;
    gpsDisplay.className = 'gps-status gps-inactive';
  }
  const estadoGPS = document.getElementById('estadoGPS');
  if (estadoGPS) estadoGPS.innerHTML = ' GPS: Inactivo';

  log(" Sesión cerrada.");
}

function actualizarTodosLosMarcadores() {
  if (!map) return;

  // 1. Eliminar marcadores huérfanos de pasajeros y de conductores (desactivados o eliminados)
  Object.keys(markersUsuarios).forEach(key => {
    if (key.startsWith('driver_')) {
      const condId = key.replace('driver_', '');
      const cond = conductoresRegistrados.find(c => c.id === condId);
      const gpsActivo = !!watchIdsConductores[condId];
      if (!cond || !ubicacionesUsuarios[cond.telefono] || !gpsActivo) {
        map.removeLayer(markersUsuarios[key]);
        delete markersUsuarios[key];
      }
    } else {
      // Pasajero
      const tel = key;
      if (!usuariosRegistrados.some(u => u.telefono === tel) || !ubicacionesUsuarios[tel]) {
        map.removeLayer(markersUsuarios[tel]);
        delete markersUsuarios[tel];
      }
    }
  });

  // 2. Dibujar o actualizar marcadores para todos los usuarios con ubicación
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

      // Actualizar referencia del marcador del usuario activo
      if (esActivo) {
        userMarker = markersUsuarios[u.telefono];
      }
    }
  });

  // 3. Dibujar o actualizar marcadores para todos los conductores con ubicación y GPS activo
  conductoresRegistrados.forEach(c => {
    const loc = ubicacionesUsuarios[c.telefono];
    const gpsActivo = !!watchIdsConductores[c.id];
    if (loc && gpsActivo) {
      const markerKey = `driver_${c.id}`;
      const popupText = `
        <div class="driver-popup" style="color:#f0f9ff; background:#1a1f3a; padding: 5px; border-radius: 8px; font-family: 'Inter', sans-serif;">
          <div style="display:flex; gap:10px; align-items:center; min-width: 180px;">
            ${c.foto ? `<img src="${c.foto}" style="width:40px; height:40px; border-radius:50%; object-fit:cover; border:2px solid #ef4444;">` : `<div style="width:40px; height:40px; border-radius:50%; background:#2d3748; display:flex; align-items:center; justify-content:center;"><i class="fas fa-user-tie" style="color:#ef4444; font-size:1.5rem;"></i></div>`}
            <div>
              <strong style="color:#00d2ff; font-size:0.80rem;">Conductor: ${c.nombre}</strong><br>
              <span style="font-size:0.65rem; color:#9ca3af;">📞 Tel: ${c.telefono}</span>
            </div>
          </div>
          <div style="margin-top:6px; border-top:1px solid #2d3748; padding-top:4px; font-size:0.65rem;">
            Unidad: <b>${c.unidad}</b><br>
            Placa: <b>${c.placa}</b><br>
            🪪 ID: <b>${c.identidad}</b>
          </div>
        </div>
      `;

      if (markersUsuarios[markerKey]) {
        markersUsuarios[markerKey].setLatLng([loc.lat, loc.lng]);
        markersUsuarios[markerKey].setPopupContent(popupText);
        markersUsuarios[markerKey].setIcon(crearIconoConductor(c));
      } else {
        const marker = L.marker([loc.lat, loc.lng], {
          icon: crearIconoConductor(c)
        }).addTo(map);
        marker.bindPopup(popupText);
        markersUsuarios[markerKey] = marker;
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

function centrarRuta() {
  if (!map) return;
  if (rutaPolyline) {
    map.fitBounds(rutaPolyline.getBounds(), { padding: [40, 40] });
  } else if (paradasRuta110.length > 0) {
    const coords = paradasRuta110.map(p => [p.lat, p.lng]);
    map.fitBounds(L.latLngBounds(coords), { padding: [40, 40] });
  }
}

function cargarParadasEnMapa() {
  paradasMarkers = [];
  paradasRuta110.forEach((p, idx) => {
    const marker = L.marker([p.lat, p.lng], { icon: crearIconoParada(false) }).addTo(map);
    marker.bindPopup(`
      <div style="text-align:center; padding: 2px;">
        <b style="color:#0284c7;">Parada ${p.id}:</b> ${p.nombre}<br>
        <button onclick="guiarHaciaParada(paradasRuta110[${idx}], true)" class="btn btn-primary" style="margin-top:6px; font-size:0.68rem; padding:4px 10px; width:100%; border-radius:14px; background:#6200ea;">
          <i class="fas fa-walking"></i> Guiar por calles
        </button>
      </div>
    `);
    paradasMarkers[idx] = marker;
  });

  // Trazado exacto que une las paradas de la Ruta 110
  const rutaCoords = paradasRuta110.map(p => [p.lat, p.lng]);
  if (rutaPolyline && map.hasLayer(rutaPolyline)) {
    map.removeLayer(rutaPolyline);
  }
  rutaPolyline = L.polyline(rutaCoords, {
    color: '#00d2ff',
    weight: 5,
    opacity: 0.9,
    dashArray: '8, 10',
    lineCap: 'round',
    lineJoin: 'round'
  });

  if (mostrarRuta) {
    rutaPolyline.addTo(map);
  }

  // Ajustar en segundo plano para que siga las curvas de las calles reales de Managua
  cargarTrazadoCallesRuta();
}

async function cargarTrazadoCallesRuta() {
  try {
    const batchSize = 15;
    let allRoadCoords = [];
    
    for (let i = 0; i < paradasRuta110.length - 1; i += (batchSize - 1)) {
      const slice = paradasRuta110.slice(i, i + batchSize);
      if (slice.length < 2) break;
      const coordsStr = slice.map(p => `${p.lng},${p.lat}`).join(';');
      const url = `https://router.project-osrm.org/route/v1/driving/${coordsStr}?overview=full&geometries=geojson&continue_straight=true`;
      
      const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
      if (res.ok) {
        const data = await res.json();
        if (data.code === 'Ok' && data.routes && data.routes[0]?.geometry?.coordinates) {
          const latlngs = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
          allRoadCoords.push(...latlngs);
        }
      }
    }

    if (allRoadCoords.length > 0 && rutaPolyline) {
      rutaPolyline.setLatLngs(allRoadCoords);
    }
  } catch (err) {
    console.warn("Trazado básico de paradas activo:", err);
  }
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
        marker.bindTooltip(`${parada.nombre}`, {
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
        log(`Llegó a: ${parada.nombre}`);
        const noti = document.getElementById('notificacion');
        if (noti && !userLocation) noti.innerHTML = ` Simulación activa`;
        break;
      }
    }
  });
}

function obtenerConductorPorUnidad(busNombre) {
  if (!conductoresRegistrados || conductoresRegistrados.length === 0) return null;
  const nombreNormalizado = String(busNombre).trim().toLowerCase();
  const numUnidadLimpio = String(busNombre).replace(/[^0-9]/g, '');

  return conductoresRegistrados.find(c => {
    if (!c.unidad) return false;
    const condUnidad = String(c.unidad).trim().toLowerCase();
    if (condUnidad === nombreNormalizado) return true;
    const condNumLimpio = String(c.unidad).replace(/[^0-9]/g, '');
    if (condNumLimpio && numUnidadLimpio && (parseInt(condNumLimpio, 10) === parseInt(numUnidadLimpio, 10))) return true;
    return false;
  }) || null;
}

function generarPopupBus(bus, idx) {
  const busNombre = bus.nombre || getBusNombre(idx);
  const conductor = obtenerConductorPorUnidad(busNombre);
  const siguiente = (bus.indexRuta + 1) % circuitoCompleto.length;
  const proxParada = circuitoCompleto[siguiente];
  const paradaNombre = proxParada ? proxParada.nombre : "En recorrido";
  const distancia = proxParada ? calcularDistancia(bus.lat, bus.lng, proxParada.lat, proxParada.lng) : 0;
  const distanciaTexto = distancia < 500 ? `${Math.round(distancia)} m` : `${(distancia / 1000).toFixed(1)} km`;

  let conductorHTML = '';
  if (conductor) {
    conductorHTML = `
      <div style="display:flex; gap:10px; align-items:center; margin-bottom:10px; padding-bottom:10px; border-bottom:1px solid rgba(255,255,255,0.12);">
        ${conductor.foto ? 
          `<img src="${conductor.foto}" style="width:48px; height:48px; border-radius:50%; object-fit:cover; border:2px solid #00d2ff; box-shadow:0 2px 10px rgba(0,210,255,0.35);">` : 
          `<div style="width:48px; height:48px; border-radius:50%; background:linear-gradient(135deg, #1e293b, #334155); display:flex; align-items:center; justify-content:center; border:2px solid #00d2ff; box-shadow:0 2px 10px rgba(0,210,255,0.3);"><i class="fas fa-user-tie" style="color:#00d2ff; font-size:1.35rem;"></i></div>`
        }
        <div>
          <div style="font-size:0.62rem; color:#94a3b8; text-transform:uppercase; letter-spacing:0.5px; font-weight:700;">Conductor Asignado</div>
          <div style="font-size:0.88rem; font-weight:700; color:#ffffff; line-height:1.2;">${conductor.nombre}</div>
          <div style="font-size:0.72rem; color:#38bdf8; margin-top:3px; display:flex; align-items:center; gap:4px;">
            <i class="fas fa-phone-alt"></i> <a href="tel:${conductor.telefono}" style="color:#38bdf8; text-decoration:none; font-weight:600;">${conductor.telefono}</a>
          </div>
        </div>
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; font-size:0.68rem; margin-bottom:8px;">
        <div style="background:rgba(255,255,255,0.06); padding:5px 8px; border-radius:6px;">
          <span style="color:#94a3b8; display:block; font-size:0.60rem;">🏷️ Placa</span>
          <b style="color:#f8fafc; font-size:0.72rem;">${conductor.placa || 'N/A'}</b>
        </div>
        <div style="background:rgba(255,255,255,0.06); padding:5px 8px; border-radius:6px;">
          <span style="color:#94a3b8; display:block; font-size:0.60rem;">🪪 ID / Cédula</span>
          <b style="color:#f8fafc; font-size:0.72rem;">${conductor.identidad || 'N/A'}</b>
        </div>
      </div>
    `;
  } else {
    conductorHTML = `
      <div style="background:rgba(239,68,68,0.1); border:1px dashed rgba(239,68,68,0.4); border-radius:8px; padding:10px; text-align:center; margin-bottom:10px;">
        <div style="color:#fca5a5; font-size:0.76rem; font-weight:700;"><i class="fas fa-user-slash"></i> Sin conductor asignado</div>
        <div style="color:#94a3b8; font-size:0.62rem; margin-top:3px;">Asigna un conductor a <b>${busNombre}</b> desde el panel de Administración.</div>
      </div>
    `;
  }

  return `
    <div class="custom-bus-popup-content" style="color:#f8fafc; font-family:'Inter', sans-serif; min-width:220px; max-width:270px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <span style="background:linear-gradient(135deg, #00d2ff, #0072ff); color:#ffffff; font-weight:800; font-size:0.78rem; padding:3px 9px; border-radius:12px; display:inline-flex; align-items:center; gap:5px; box-shadow:0 2px 8px rgba(0,210,255,0.35);">
          <i class="fas fa-bus"></i> ${busNombre}
        </span>
        <span style="font-size:0.65rem; color:#10b981; font-weight:700; background:rgba(16,185,129,0.15); padding:2px 7px; border-radius:10px; border:1px solid rgba(16,185,129,0.3);">
          <i class="fas fa-circle" style="font-size:0.45rem;"></i> En Ruta 110
        </span>
      </div>
      ${conductorHTML}
      <div style="background:rgba(0,0,0,0.3); border-radius:8px; padding:7px 9px; font-size:0.68rem; color:#cbd5e1; border:1px solid rgba(255,255,255,0.06);">
        <div style="display:flex; justify-content:space-between; margin-bottom:2px;">
          <span><i class="fas fa-map-marker-alt" style="color:#ef4444;"></i> <b>Próximo punto:</b></span>
          <span style="color:#38bdf8; font-weight:600;">${distanciaTexto}</span>
        </div>
        <div style="color:#f1f5f9; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${paradaNombre}</div>
      </div>
    </div>
  `;
}

window.enfocarYMostrarBus = function(idx) {
  if (!arregloBuses || !arregloBuses[idx]) return;
  const bus = arregloBuses[idx];
  map.setView([bus.lat, bus.lng], Math.max(map.getZoom(), 16), { animate: true });
  setTimeout(() => {
    if (bus.marker) {
      bus.marker.openPopup();
    }
  }, 300);
};

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

  marker.bindPopup(() => generarPopupBus(bus, idx), {
    className: 'bus-leaflet-popup',
    closeButton: true,
    autoPan: true
  });

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
  actualizarNotificacionProximidad();
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
  if (noti && !userLocation) noti.innerHTML = ` Simulación activa con ${cantidad} unidades`;
  if (userLocation) actualizarNotificacionProximidad();
  log(` Simulación iniciada con ${cantidad} buses`);
}

function detenerSimulacion() {
  simActive = false;
  if (simInterval) clearInterval(simInterval);
  simInterval = null;
  const noti = document.getElementById('notificacion');
  if (noti) {
    if (userLocation) {
      actualizarNotificacionProximidad();
    } else {
      noti.innerHTML = '⏹ Simulación detenida';
      noti.style.background = '#2d3748';
      noti.style.color = '#ffffff';
    }
  }
  log('⏹ Simulación detenida');
}

let paradaSeleccionadaId = null;

function normalizarTexto(txt) {
  return (txt || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}

function cargarParadasEnLista(filtro = '') {
  const lista = document.getElementById('listaParadas');
  const counterEl = document.getElementById('paradasCounter');
  const btnClear = document.getElementById('btnLimpiarBuscarParada');
  if (!lista) return;

  const rawQuery = (filtro || '').trim();
  const query = normalizarTexto(rawQuery);

  if (btnClear) {
    btnClear.style.display = rawQuery.length > 0 ? 'flex' : 'none';
  }

  const paradasFiltradas = paradasRuta110.filter(p => {
    if (!query) return true;
    const nombreNorm = normalizarTexto(p.nombre);
    const idStr = String(p.id);
    return nombreNorm.includes(query) || idStr === query || (`parada ${idStr}`).includes(query);
  });

  if (counterEl) {
    counterEl.textContent = query ? `${paradasFiltradas.length}/${paradasRuta110.length}` : `${paradasRuta110.length}`;
  }

  if (paradasFiltradas.length === 0) {
    lista.innerHTML = `
      <div style="padding: 16px 8px; text-align: center; color: #94a3b8; font-size: 0.68rem;">
        <i class="fas fa-search-location" style="font-size: 1.3rem; color: #64748b; display: block; margin-bottom: 6px;"></i>
        <span>No se encontraron paradas para "<b>${rawQuery.replace(/</g, '&lt;')}</b>"</span>
      </div>
    `;
    return;
  }

  lista.innerHTML = paradasFiltradas.map(p => {
    let nombreHTML = p.nombre;
    if (query) {
      const nombreNorm = normalizarTexto(p.nombre);
      const startIdx = nombreNorm.indexOf(query);
      if (startIdx !== -1) {
        const matched = p.nombre.substr(startIdx, rawQuery.length);
        nombreHTML = p.nombre.substring(0, startIdx) + `<mark class="search-highlight">${matched}</mark>` + p.nombre.substring(startIdx + rawQuery.length);
      }
    }

    const esSeleccionada = paradaSeleccionadaId === p.id;

    return `
      <div class="parada-item ${esSeleccionada ? 'selected-parada' : ''}" onclick="seleccionarParadaGuia(${p.id})">
        <div style="display:flex; justify-content:space-between; align-items:center; width:100%; gap: 6px;">
          <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;"><b>${p.id}.</b> ${nombreHTML}</span>
          <button type="button" class="btn-parada-guiar" onclick="event.stopPropagation(); guiarParadaDirecto(${p.id})" title="Trazar ruta hacia esta parada">
            <i class="fas fa-walking"></i> Guiar
          </button>
        </div>
      </div>
    `;
  }).join('');
}

window.seleccionarParadaGuia = function (id) {
  const parada = paradasRuta110.find(p => p.id === id);
  if (!parada) return;
  paradaSeleccionadaId = id;
  const idx = paradasRuta110.findIndex(p => p.id === id);

  // Actualizar clase activa en la lista
  document.querySelectorAll('.parada-item').forEach(el => el.classList.remove('selected-parada'));
  const items = document.querySelectorAll('.parada-item');
  items.forEach(it => {
    if (it.getAttribute('onclick')?.includes(`(${id})`)) {
      it.classList.add('selected-parada');
    }
  });

  if (map) {
    map.flyTo([parada.lat, parada.lng], 16, { duration: 0.8 });
    if (paradasMarkers[idx]) {
      setTimeout(() => {
        paradasMarkers[idx].openPopup();
      }, 400);
    }
  }

  if (userLocation) {
    guiarHaciaParada(parada, true);
    log(`🚶 Guía trazada por calles hacia parada: ${parada.nombre}`);
  } else {
    log(`📍 Parada seleccionada: ${parada.nombre}`);
  }
};

window.guiarParadaDirecto = function (id) {
  const parada = paradasRuta110.find(p => p.id === id);
  if (!parada) return;
  paradaSeleccionadaId = id;
  const idx = paradasRuta110.findIndex(p => p.id === id);

  if (map) {
    map.flyTo([parada.lat, parada.lng], 16, { duration: 0.8 });
    if (paradasMarkers[idx]) {
      setTimeout(() => {
        paradasMarkers[idx].openPopup();
      }, 400);
    }
  }

  guiarHaciaParada(parada, true);
  log(`🚶 Guía trazada hacia parada: ${parada.nombre}`);
};

window.limpiarBuscadorParadas = function () {
  const input = document.getElementById('inputBuscarParada');
  if (input) {
    input.value = '';
    input.focus();
  }
  cargarParadasEnLista('');
};


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
    const msg = new SpeechSynthesisUtterance(paradaNombre);
    msg.voice = vozElegida || null;
    msg.lang = vozElegida?.lang || 'es-ES';
    msg.rate = 0.95;
    msg.pitch = 1;
    msg.volume = 0.85;
    setTimeout(() => speechSynthesis.speak(msg), 170);
  }
}

function obtenerCalleParada(nombre) {
  if (nombre.includes("Mayoreo") || nombre.includes("Howard") || nombre.includes("Mairena") || nombre.includes("Gutiérrez") || nombre.includes("contilito") || nombre.includes("UniPlaza")) {
    return "Por Pista Larreynaga Managua";
  }
  if (nombre.includes("Sabana Grande") || nombre.includes("Bismark") || nombre.includes("curva")) {
    return "Por Pista Sabana Grande Managua";
  }
  if (nombre.includes("Rubenia")) {
    return "Por Paso a Desnivel Rubenia Managua";
  }
  if (nombre.includes("Huembes") || nombre.includes("Jenny") || nombre.includes("Nicarao")) {
    return "Por Pista Solidaridad Managua";
  }
  if (nombre.includes("Altamira") || nombre.includes("Hospital Manolo Morales") || nombre.includes("Valle") || nombre.includes("Avon")) {
    return "Por Pista de La Resistencia Managua";
  }
  if (nombre.includes("UCA") || nombre.includes("ENEL") || nombre.includes("Periodista") || nombre.includes("Julio Martínez") || nombre.includes("Zumen") || nombre.includes("Nejapa") || nombre.includes("7 Sur") || nombre.includes("Piedrecitas") || nombre.includes("Embajada")) {
    return "Por Pista Juan Pablo II Managua";
  }
  if (nombre.includes("Miraflores") || nombre.includes("Murillo") || nombre.includes("Seminario") || nombre.includes("UCEM") || nombre.includes("INVUR") || nombre.includes("SOS")) {
    return "Por Calle Miraflores Managua";
  }
  return "Por Pista Sabana Grande Managua";
}

let coordenadasRutaActiva = [];
let navegacionEnVivoActiva = false;
let intervaloNavegacion = null;
let modoGuiaActual = 'carretera'; // 'carretera', 'peatonal', 'bus'

function crearIconoBanderaCuadros() {
  return L.divIcon({
    html: `
      <div class="gm-flag-pin-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 42" width="32" height="42">
          <defs>
            <filter id="gmShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="3" stdDeviation="2.5" flood-color="#000000" flood-opacity="0.45"/>
            </filter>
            <pattern id="flagChecker" width="6" height="6" patternUnits="userSpaceOnUse">
              <rect width="3" height="3" fill="#111827"/>
              <rect x="3" width="3" height="3" fill="#ffffff"/>
              <rect y="3" width="3" height="3" fill="#ffffff"/>
              <rect x="3" y="3" width="3" height="3" fill="#111827"/>
            </pattern>
          </defs>
          <path d="M 16 2 C 8.27 2, 2 8.27, 2 16 C 2 25.5, 16 40, 16 40 C 16 40, 30 25.5, 30 16 C 30 8.27, 23.73 2, 16 2 Z" fill="#ffffff" stroke="#1e293b" stroke-width="1.2" filter="url(#gmShadow)" />
          <circle cx="16" cy="16" r="10" fill="url(#flagChecker)" stroke="#0f172a" stroke-width="1.2"/>
        </svg>
      </div>
    `,
    className: '',
    iconSize: [32, 42],
    iconAnchor: [16, 40],
    popupAnchor: [0, -38]
  });
}

function crearIconoUsuarioPulsante() {
  return L.divIcon({
    html: `
      <div class="gm-user-pulse-marker">
        <div class="gm-pulse-ring"></div>
        <div class="gm-user-dot"></div>
      </div>
    `,
    className: '',
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
}

function crearIconoBadgeRuta(mins, distMts, modo = 'carretera') {
  const distTxt = distMts < 1000 ? `${Math.round(distMts)}m` : `${(distMts / 1000).toFixed(1)}km`;
  
  if (modo === 'carretera') {
    return L.divIcon({
      html: `
        <div class="gm-route-eta-badge">
          <div class="gm-eta-time">${mins} min</div>
          <div class="gm-eta-sub">Carretera</div>
          <div class="gm-eta-arrow"></div>
        </div>
      `,
      className: '',
      iconSize: [64, 42],
      iconAnchor: [32, 42]
    });
  }

  if (modo === 'bus') {
    return L.divIcon({
      html: `
        <div class="gm-route-eta-badge" style="background:#0284c7;">
          <div class="gm-eta-time">${mins} min</div>
          <div class="gm-eta-sub">Bus 110</div>
          <div class="gm-eta-arrow" style="border-top-color:#0284c7;"></div>
        </div>
      `,
      className: '',
      iconSize: [64, 42],
      iconAnchor: [32, 42]
    });
  }

  // Peatonal / A pie
  return L.divIcon({
    html: `
      <div class="gm-walking-badge">
        <div class="gm-walking-badge-top">
          <i class="fas fa-walking"></i> <span>${mins} min</span>
        </div>
        <div class="gm-walking-badge-dist">${distTxt}</div>
        <div class="gm-walking-badge-arrow"></div>
      </div>
    `,
    className: '',
    iconSize: [72, 48],
    iconAnchor: [36, 48]
  });
}

function cambiarModoGuia(nuevoModo) {
  modoGuiaActual = nuevoModo;

  const btnCarretera = document.getElementById('gmModeCarretera');
  const btnPeatonal = document.getElementById('gmModePeatonal');
  const btnBus = document.getElementById('gmModeBus');

  if (btnCarretera) btnCarretera.classList.toggle('active', nuevoModo === 'carretera');
  if (btnPeatonal) btnPeatonal.classList.toggle('active', nuevoModo === 'peatonal');
  if (btnBus) btnBus.classList.toggle('active', nuevoModo === 'bus');

  const subEl = document.getElementById('gmCardSub');
  if (subEl) {
    if (nuevoModo === 'carretera') subEl.textContent = "Mejor ruta por carretera, Tráfico habitual";
    else if (nuevoModo === 'peatonal') subEl.textContent = "Ruta a pie por la acera más rápida";
    else if (nuevoModo === 'bus') subEl.textContent = "Trayecto oficial de la Ruta 110";
  }

  if (paradaGuiaActual) {
    guiarHaciaParada(paradaGuiaActual, false);
  }
}
window.cambiarModoGuia = cambiarModoGuia;

function cerrarGuiaRuta() {
  detenerNavegacionEnVivo();

  if (guidRutaLayerGroup && map) {
    map.removeLayer(guidRutaLayerGroup);
    guidRutaLayerGroup = null;
  }
  if (guidRutaPolyline && map) {
    map.removeLayer(guidRutaPolyline);
    guidRutaPolyline = null;
  }
  paradaGuiaActual = null;
  coordenadasRutaActiva = [];

  const topNav = document.getElementById('gmNavTopBar');
  if (topNav) topNav.style.display = 'none';

  const bottomCard = document.getElementById('gmNavBottomCard');
  if (bottomCard) bottomCard.style.display = 'none';

  const resCont = document.getElementById('resultadoCercano');
  if (resCont) resCont.style.display = 'none';

  const menuEvitar = document.getElementById('gmEvitarMenu');
  if (menuEvitar) menuEvitar.style.display = 'none';

  log(' Guía de ruta cerrada');
}
window.cerrarGuiaRuta = cerrarGuiaRuta;

/**
 * Inicia la navegación GPS / paso a paso interactiva directamente dentro de la aplicación.
 */
function iniciarNavegacionEnVivo() {
  if (!paradaGuiaActual || !coordenadasRutaActiva || coordenadasRutaActiva.length < 2) {
    alert("Selecciona primero una parada para iniciar la navegación.");
    return;
  }

  navegacionEnVivoActiva = true;

  // Cerrar cualquier popup abierto en el mapa para no tapar al usuario
  if (map) map.closePopup();

  // Ocultar tarjetas de vista previa y mostrar únicamente el HUD limpio de navegación
  const topNav = document.getElementById('gmNavTopBar');
  if (topNav) topNav.style.display = 'none';

  const bottomCard = document.getElementById('gmNavBottomCard');
  if (bottomCard) bottomCard.style.display = 'none';

  const resCont = document.getElementById('resultadoCercano');
  if (resCont) resCont.style.display = 'none';

  // Minimizar panel de telemetría para despejar el mapa
  const telemetryContent = document.getElementById('telemetryContent');
  const toggleIcon = document.getElementById('toggleIcon');
  if (telemetryContent) telemetryContent.style.display = 'none';
  if (toggleIcon) toggleIcon.className = 'fas fa-chevron-down';

  const hud = document.getElementById('gmNavigationHUD');
  if (hud) hud.style.display = 'flex';

  const calleNombre = obtenerCalleParada(paradaGuiaActual.nombre);
  const destNombre = paradaGuiaActual.nombre;

  // Actualizar textos del HUD
  const elManeuver = document.getElementById('gmHudManeuver');
  if (elManeuver) {
    elManeuver.textContent = modoGuiaActual === 'carretera'
      ? `Avanza por la carretera hacia ${destNombre}`
      : (modoGuiaActual === 'bus' ? `En trayecto hacia ${destNombre}` : `Camina recto hacia ${destNombre}`);
  }

  const elStreet = document.getElementById('gmHudStreet');
  if (elStreet) elStreet.textContent = calleNombre;

  const totalPuntos = coordenadasRutaActiva.length;
  const pInicio = coordenadasRutaActiva[0];
  const pFin = coordenadasRutaActiva[totalPuntos - 1];
  const distTotal = calcularDistancia(pInicio[0], pInicio[1], pFin[0], pFin[1]);
  const factorVelocidad = modoGuiaActual === 'carretera' ? 300 : (modoGuiaActual === 'bus' ? 250 : 80);
  const minsTotal = Math.max(1, Math.round(distTotal / factorVelocidad));

  // Hora estimada de llegada (ETA)
  const ahora = new Date();
  ahora.setMinutes(ahora.getMinutes() + minsTotal);
  const horaEta = ahora.toLocaleTimeString('es-NI', { hour: '2-digit', minute: '2-digit', hour12: true });

  const elTime = document.getElementById('gmHudTime');
  if (elTime) elTime.textContent = `${minsTotal} min`;

  const elDist = document.getElementById('gmHudDist');
  if (elDist) elDist.textContent = distTotal < 1000 ? `${Math.round(distTotal)} m` : `${(distTotal / 1000).toFixed(1)} km`;

  const elEta = document.getElementById('gmHudEta');
  if (elEta) elEta.textContent = horaEta;

  // Voz de guiado
  if ('speechSynthesis' in window && sonidoHabilitado) {
    speechSynthesis.cancel();
    const modoTexto = modoGuiaActual === 'carretera' ? 'por la carretera' : (modoGuiaActual === 'bus' ? 'en bus' : 'a pie');
    const msg = new SpeechSynthesisUtterance(`Iniciando navegación ${modoTexto} hacia ${destNombre}. Avanza por ${calleNombre}.`);
    msg.lang = 'es-ES';
    msg.rate = 0.95;
    setTimeout(() => speechSynthesis.speak(msg), 150);
  }

  // Centrar y acercar el mapa en modo navegación
  map.setView(pInicio, 17);

  // Iniciar animación y seguimiento paso a paso en vivo
  if (intervaloNavegacion) clearInterval(intervaloNavegacion);

  let puntoActualIdx = 0;
  intervaloNavegacion = setInterval(() => {
    if (!navegacionEnVivoActiva) {
      clearInterval(intervaloNavegacion);
      return;
    }

    if (puntoActualIdx < totalPuntos) {
      const pos = coordenadasRutaActiva[puntoActualIdx];
      
      // Actualizar posición del usuario
      userLocation = { lat: pos[0], lng: pos[1] };
      if (userMarker) userMarker.setLatLng(pos);
      map.panTo(pos, { animate: true, duration: 0.6 });

      // Calcular distancia restante al destino
      const distRestante = calcularDistancia(pos[0], pos[1], pFin[0], pFin[1]);
      const minsRestantes = Math.max(1, Math.round(distRestante / factorVelocidad));

      if (elDist) elDist.textContent = distRestante < 1000 ? `${Math.round(distRestante)} m` : `${(distRestante / 1000).toFixed(1)} km`;
      if (elTime) elTime.textContent = `${minsRestantes} min`;

      puntoActualIdx++;
    } else {
      // Llegada al destino
      clearInterval(intervaloNavegacion);
      intervaloNavegacion = null;
      if (elManeuver) elManeuver.textContent = `¡Has llegado a tu parada!`;
      if (elDist) elDist.textContent = `0 m`;
      if (elTime) elTime.textContent = `0 min`;

      if ('speechSynthesis' in window && sonidoHabilitado) {
        const msgFin = new SpeechSynthesisUtterance(`¡Has llegado a tu destino: ${destNombre}!`);
        msgFin.lang = 'es-ES';
        speechSynthesis.speak(msgFin);
      }

      setTimeout(() => {
        detenerNavegacionEnVivo();
      }, 3000);
    }
  }, 1200);

  log(`🚗 Navegación (${modoGuiaActual}) en vivo iniciada hacia ${destNombre}`);
}
window.iniciarNavegacionEnVivo = iniciarNavegacionEnVivo;

function detenerNavegacionEnVivo() {
  navegacionEnVivoActiva = false;
  if (intervaloNavegacion) {
    clearInterval(intervaloNavegacion);
    intervaloNavegacion = null;
  }

  const hud = document.getElementById('gmNavigationHUD');
  if (hud) hud.style.display = 'none';

  const topNav = document.getElementById('gmNavTopBar');
  if (topNav && paradaGuiaActual) topNav.style.display = 'flex';

  const bottomCard = document.getElementById('gmNavBottomCard');
  if (bottomCard && paradaGuiaActual) bottomCard.style.display = 'block';

  if (guidRutaPolyline && map) {
    map.fitBounds(guidRutaPolyline.getBounds(), { padding: [60, 60] });
  }

  log(` Navegación en vivo detenida`);
}
window.detenerNavegacionEnVivo = detenerNavegacionEnVivo;

function densificarCoordenadas(puntos, pasoMetros = 10) {
  if (!puntos || puntos.length < 2) return puntos || [];
  const res = [puntos[0]];
  for (let i = 0; i < puntos.length - 1; i++) {
    const p1 = puntos[i];
    const p2 = puntos[i + 1];
    const dist = calcularDistancia(p1[0], p1[1], p2[0], p2[1]);
    const numPasos = Math.max(1, Math.floor(dist / pasoMetros));
    for (let j = 1; j <= numPasos; j++) {
      const f = j / numPasos;
      res.push([
        p1[0] + (p2[0] - p1[0]) * f,
        p1[1] + (p2[1] - p1[1]) * f
      ]);
    }
  }
  return res;
}

/**
 * Traza una ruta en el mapa siguiendo con precisión milimétrica el trazado real de las calles o carretera usando OSRM.
 * @param {Object|Array} origen - Coordenadas de inicio: {lat, lng} o [lat, lng]
 * @param {Object|Array} destino - Coordenadas de destino: {lat, lng} o [lat, lng]
 * @param {Object} [opciones] - Configuración opcional (modo, fitBounds, destinoNombre)
 * @returns {Promise<{polyline: L.Polyline, coordinates: Array, distance: number, duration: number}>}
 */
async function dibujarRutaSegunCalles(origen, destino, opciones = {}) {
  if (!map || !origen || !destino) {
    console.warn("dibujarRutaSegunCalles: mapa o coordenadas no disponibles");
    return null;
  }

  const origLat = Array.isArray(origen) ? origen[0] : (origen.lat ?? origen.latitude);
  const origLng = Array.isArray(origen) ? origen[1] : (origen.lng ?? origen.longitude);
  const destLat = Array.isArray(destino) ? destino[0] : (destino.lat ?? destino.latitude);
  const destLng = Array.isArray(destino) ? destino[1] : (destino.lng ?? destino.longitude);

  if (origLat == null || origLng == null || destLat == null || destLng == null) {
    console.error("Coordenadas inválidas para dibujarRutaSegunCalles:", origen, destino);
    return null;
  }

  const modo = opciones.modo || modoGuiaActual || 'carretera';
  const fitBounds = opciones.fitBounds !== false;
  let coordinates = [];
  let distanceMeters = 0;
  let durationSeconds = 0;

  const directDist = calcularDistancia(origLat, origLng, destLat, destLng);
  const profile = (modo === 'peatonal') ? 'foot' : 'driving';
  const osrmService = (modo === 'peatonal') ? 'routed-foot' : 'routed-car';

  // Endpoints OSRM para seguir las calles y carreteras de OpenStreetMap
  const urls = [
    `https://router.project-osrm.org/route/v1/${profile}/${origLng},${origLat};${destLng},${destLat}?overview=full&geometries=geojson&steps=true&continue_straight=true`,
    `https://routing.openstreetmap.de/${osrmService}/route/v1/${profile}/${origLng},${origLat};${destLng},${destLat}?overview=full&geometries=geojson&steps=true`,
    `https://router.project-osrm.org/route/v1/driving/${origLng},${origLat};${destLng},${destLat}?overview=full&geometries=geojson&steps=true`
  ];

  let routeFound = false;
  for (const url of urls) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(6000) });
      if (!response.ok) continue;
      const data = await response.json();
      if (data.code === 'Ok' && data.routes && data.routes.length > 0 && data.routes[0].geometry?.coordinates?.length > 1) {
        const route = data.routes[0];
        distanceMeters = route.distance || directDist;
        durationSeconds = route.duration || (distanceMeters / (modo === 'carretera' ? 300 : (modo === 'bus' ? 250 : 80))) * 60;
        // OSRM devuelve [lng, lat], Leaflet requiere [lat, lng]
        coordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
        routeFound = true;
        break;
      }
    } catch (e) {
      console.warn("Error consultando OSRM:", url, e);
    }
  }

  // Fallback seguro en caso de falta de conexión a internet
  if (!routeFound || coordinates.length === 0) {
    distanceMeters = directDist;
    durationSeconds = (directDist / (modo === 'carretera' ? 300 : (modo === 'bus' ? 250 : 80))) * 60;
    coordinates = [
      [origLat, origLng],
      [destLat, destLng]
    ];
  }

  // Limpiar capas guía anteriores
  if (guidRutaLayerGroup && map.hasLayer(guidRutaLayerGroup)) {
    map.removeLayer(guidRutaLayerGroup);
  }
  guidRutaLayerGroup = L.layerGroup();

  let lineCore = null;

  if (modo === 'carretera') {
    // 1. Trazado base blanco (borde nítido como en Google Maps)
    const lineCasing = L.polyline(coordinates, {
      color: '#ffffff',
      weight: 10,
      opacity: 0.95,
      lineCap: 'round',
      lineJoin: 'round'
    });
    guidRutaLayerGroup.addLayer(lineCasing);

    // 2. Trazado morado vibrante siguiendo la carretera
    lineCore = L.polyline(coordinates, {
      color: '#6200ea',
      weight: 7,
      opacity: 1,
      lineCap: 'round',
      lineJoin: 'round',
      className: 'gm-route-line-purple'
    });
  } else if (modo === 'bus') {
    // Trazado en bus de la Ruta 110
    const lineCasing = L.polyline(coordinates, {
      color: '#ffffff',
      weight: 9,
      opacity: 0.9,
      lineCap: 'round',
      lineJoin: 'round'
    });
    guidRutaLayerGroup.addLayer(lineCasing);

    lineCore = L.polyline(coordinates, {
      color: '#00d2ff',
      weight: 6,
      opacity: 1,
      dashArray: '8, 10',
      lineCap: 'round',
      lineJoin: 'round'
    });
  } else {
    // Modo A pie / Peatonal (círculos punteados azules con cruce por acera e intersecciones)
    const lineCasing = L.polyline(coordinates, {
      color: '#93c5fd',
      weight: 9,
      opacity: 0.55,
      lineCap: 'round',
      lineJoin: 'round'
    });
    guidRutaLayerGroup.addLayer(lineCasing);

    lineCore = L.polyline(coordinates, {
      color: '#2563eb',
      weight: 7,
      opacity: 1,
      dashArray: '0, 14',
      lineCap: 'round',
      lineJoin: 'round',
      className: 'gm-walking-dotted-line'
    });
  }

  guidRutaLayerGroup.addLayer(lineCore);
  guidRutaPolyline = lineCore;
  
  // Guardar puntos densificados para que la animación recorra exactamente cada punto y curva de la calle
  coordenadasRutaActiva = densificarCoordenadas(coordinates, 8);

  // Marcador de inicio (Punto GPS azul con halo pulsante)
  const userMarkerGuide = L.marker([origLat, origLng], {
    icon: crearIconoUsuarioPulsante(),
    zIndexOffset: 1000
  });
  guidRutaLayerGroup.addLayer(userMarkerGuide);

  // Marcador de destino (Bandera a cuadros de meta)
  const destMarker = L.marker([destLat, destLng], {
    icon: crearIconoBanderaCuadros(),
    zIndexOffset: 1001
  });
  if (opciones.destinoNombre) {
    destMarker.bindPopup(`<b>🏁 Destino:</b> ${opciones.destinoNombre}`);
  }
  guidRutaLayerGroup.addLayer(destMarker);

  // Badge flotante en la ruta con tiempo y distancia según el modo elegido
  const factorMins = modo === 'carretera' ? 300 : (modo === 'bus' ? 250 : 80);
  const mins = Math.max(1, Math.round(distanceMeters / factorMins));
  if (coordinates.length >= 2) {
    const midIdx = Math.floor(coordinates.length * 0.45);
    const midPoint = coordinates[midIdx];
    const badgeMarker = L.marker(midPoint, {
      icon: crearIconoBadgeRuta(mins, distanceMeters, modo),
      zIndexOffset: 999
    });
    guidRutaLayerGroup.addLayer(badgeMarker);
  }

  guidRutaLayerGroup.addTo(map);

  // Ajustar la vista al recorrido
  if (fitBounds && coordinates.length > 0) {
    const bounds = L.latLngBounds(coordinates);
    map.fitBounds(bounds, { padding: [60, 60] });
  }

  return {
    polyline: guidRutaPolyline,
    layerGroup: guidRutaLayerGroup,
    coordinates: coordinates,
    distance: distanceMeters,
    duration: durationSeconds
  };
}
window.dibujarRutaSegunCalles = dibujarRutaSegunCalles;

async function guiarHaciaParada(parada, fitBounds = true) {
  if (!parada) return null;
  
  // Usar ubicación GPS real si existe, o la parada anterior en la ruta que ya está en la carretera
  let locOrigen = userLocation;
  if (!locOrigen) {
    const idx = paradasRuta110.findIndex(p => p.id === parada.id);
    if (idx > 0) {
      locOrigen = { lat: paradasRuta110[idx - 1].lat, lng: paradasRuta110[idx - 1].lng };
    } else if (idx === 0 && paradasRuta110.length > 1) {
      locOrigen = { lat: paradasRuta110[1].lat, lng: paradasRuta110[1].lng };
    } else {
      locOrigen = { lat: parada.lat, lng: parada.lng };
    }
  }

  paradaGuiaActual = parada;
  const res = await dibujarRutaSegunCalles(locOrigen, parada, {
    modo: modoGuiaActual,
    fitBounds: fitBounds,
    destinoNombre: parada.nombre
  });

  const distMetros = res && res.distance > 0 ? res.distance : calcularDistancia(locOrigen.lat, locOrigen.lng, parada.lat, parada.lng);
  const factorMins = modoGuiaActual === 'carretera' ? 300 : (modoGuiaActual === 'bus' ? 250 : 80);
  const mins = Math.max(1, Math.round(distMetros / factorMins));
  const distKmTxt = distMetros < 1000 ? `${Math.round(distMetros)} m` : `${(distMetros / 1000).toFixed(1)} km`;
  const distMtsTxt = distMetros < 1000 ? `${Math.round(distMetros)} metros` : `${(distMetros / 1000).toFixed(1)} kilómetros`;
  const calleNombre = obtenerCalleParada(parada.nombre);

  // Si estamos en navegación en vivo, mantener ocultas las tarjetas secundarias
  if (navegacionEnVivoActiva) {
    return res;
  }

  // Actualizar Barra Superior Flotante
  const topNav = document.getElementById('gmNavTopBar');
  const destName = document.getElementById('gmDestinoNombre');
  if (topNav && destName) {
    destName.textContent = parada.nombre;
    topNav.style.display = 'flex';
  }

  // Actualizar Tarjeta Inferior Flotante
  const bottomCard = document.getElementById('gmNavBottomCard');
  const gmTime = document.getElementById('gmCardTime');
  const gmDist = document.getElementById('gmCardDist');
  const gmStreet = document.getElementById('gmCardStreet');
  if (bottomCard) {
    if (gmTime) gmTime.textContent = `${mins} min`;
    if (gmDist) gmDist.textContent = distKmTxt;
    if (gmStreet) gmStreet.textContent = calleNombre;
    bottomCard.style.display = 'block';
  }

  // Sincronizar tarjeta en la barra lateral
  const elRouteTime = document.getElementById('routeTime');
  if (elRouteTime) elRouteTime.textContent = `${mins} min`;

  const elRouteDistance = document.getElementById('routeDistance');
  if (elRouteDistance) elRouteDistance.textContent = distKmTxt;

  const elRouteStreet = document.getElementById('routeStreet');
  if (elRouteStreet) elRouteStreet.textContent = calleNombre;

  const elParadaNombre = document.getElementById('paradaNombre');
  if (elParadaNombre) elParadaNombre.innerHTML = `<strong>${parada.nombre}</strong>`;

  const elParadaDistancia = document.getElementById('paradaDistancia');
  if (elParadaDistancia) elParadaDistancia.textContent = distMtsTxt;

  const resCont = document.getElementById('resultadoCercano');
  if (resCont) resCont.style.display = 'block';

  return res;
}
window.guiarHaciaParada = guiarHaciaParada;

async function buscarInfoCompleta() {
  if (!simActive || arregloBuses.length === 0) {
    alert(' Inicia primero la simulación para encontrar buses activos');
    return;
  }

  const locOrigen = userLocation || {
    lat: 12.1350,
    lng: -86.1950
  };

  let busCercano = null;
  let distanciaMinimaBus = Infinity;
  arregloBuses.forEach((bus, idx) => {
    const d = calcularDistancia(locOrigen.lat, locOrigen.lng, bus.lat, bus.lng);
    if (d < distanciaMinimaBus) {
      distanciaMinimaBus = d;
      busCercano = { bus: getBusNombre(idx), distancia: d, idx, lat: bus.lat, lng: bus.lng };
    }
  });

  let paradaCercana = null;
  let distanciaMinimaParada = Infinity;
  paradasRuta110.forEach(parada => {
    const d = calcularDistancia(locOrigen.lat, locOrigen.lng, parada.lat, parada.lng);
    if (d < distanciaMinimaParada) {
      distanciaMinimaParada = d;
      paradaCercana = { nombre: parada.nombre, lat: parada.lat, lng: parada.lng, distancia: d };
    }
  });

  if (!paradaCercana) return;

  const distanciaBusTexto = busCercano && busCercano.distancia < 1000 ? `${Math.round(busCercano.distancia)} metros` : `${((busCercano?.distancia || 0) / 1000).toFixed(1)} kilómetros`;
  const minutosBus = Math.max(1, Math.round((busCercano?.distancia || 500) / 300));
  const tiempoBusTexto = `${minutosBus} minutos aprox.`;

  // Activar guía visual por calles hacia la parada más cercana
  await guiarHaciaParada(paradaCercana, true);

  // Actualizar información del bus más cercano y sugerencia
  if (busCercano) {
    const cercBusEl = document.getElementById('cercanoBus');
    if (cercBusEl) cercBusEl.innerHTML = `<strong>${busCercano.bus}</strong> (el más cercano a ti)`;
    const cercTiempoEl = document.getElementById('cercanoTiempo');
    if (cercTiempoEl) cercTiempoEl.innerHTML = `${tiempoBusTexto} de viaje estimado`;
  }
  
  const sugEl = document.getElementById('sugerencia');
  if (sugEl) sugEl.innerHTML = `<i class="fas fa-lightbulb"></i> Puedes esperar en "${paradaCercana.nombre}".`;

  const noti = document.getElementById('notificacion');
  if (noti) noti.innerHTML = `🎯 Bus: ${busCercano?.bus || 'Ruta 110'} | Parada: ${paradaCercana.nombre}`;
  log(`🎯 Bus más cercano: ${busCercano?.bus || '110'} | Guía por calles activada hacia ${paradaCercana.nombre}`);
}

function actualizarNotificacionProximidad() {
  const noti = document.getElementById('notificacion');
  if (!noti) return;

  if (!userLocation) {
    noti.innerHTML = `ℹ️ Activa GPS`;
    noti.style.background = '#2d3748';
    noti.style.color = '#ffffff';
    return;
  }

  if (!simActive || arregloBuses.length === 0) {
    noti.innerHTML = `⏹ Simulación inactiva`;
    noti.style.background = '#2d3748';
    noti.style.color = '#ffffff';
    return;
  }

  // 1. Encontrar la parada más cercana a la ubicación del usuario
  let paradaUsuario = null;
  let distMinParada = Infinity;
  paradasRuta110.forEach(p => {
    const d = calcularDistancia(userLocation.lat, userLocation.lng, p.lat, p.lng);
    if (d < distMinParada) {
      distMinParada = d;
      paradaUsuario = p;
    }
  });

  if (!paradaUsuario) {
    noti.innerHTML = `📍 GPS Activo | Buscando paradas...`;
    noti.style.background = '#2d3748';
    noti.style.color = '#ffffff';
    return;
  }

  // 2. Encontrar el bus más cercano a la parada del usuario
  let busCercano = null;
  let distMinBus = Infinity;
  arregloBuses.forEach((bus, idx) => {
    const d = calcularDistancia(bus.lat, bus.lng, paradaUsuario.lat, paradaUsuario.lng);
    if (d < distMinBus) {
      distMinBus = d;
      busCercano = { nombre: bus.nombre || getBusNombre(idx), distancia: d };
    }
  });

  if (!busCercano) {
    noti.innerHTML = `📍 Parada: ${paradaUsuario.nombre} | Buscando buses...`;
    noti.style.background = '#2d3748';
    noti.style.color = '#ffffff';
    return;
  }

  const distBusTexto = busCercano.distancia < 1000
    ? `${Math.round(busCercano.distancia)} m`
    : `${(busCercano.distancia / 1000).toFixed(1)} km`;

  // 3. Actualizar el contenido y estilo según la distancia
  if (busCercano.distancia < 150) {
    noti.innerHTML = `🚨 ¡${busCercano.nombre} llegando a tu parada (${paradaUsuario.nombre})!`;
    noti.style.background = '#ef4444'; // Rojo llamativo
    noti.style.color = '#ffffff';
  } else if (busCercano.distancia < 500) {
    noti.innerHTML = ` ${busCercano.nombre} está cerca de tu parada (${paradaUsuario.nombre}) - a ${distBusTexto}`;
    noti.style.background = '#10b981'; // Verde llamativo
    noti.style.color = '#ffffff';
  } else {
    noti.innerHTML = ` ${busCercano.nombre} a ${distBusTexto} de tu parada (${paradaUsuario.nombre})`;
    noti.style.background = '#2d3748'; // Gris por defecto
    noti.style.color = '#ffffff';
  }
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
    const cond = obtenerConductorPorUnidad(busNombre);
    const condHTML = cond 
      ? `<div class="unidad-conductor-tag"><i class="fas fa-user-tie" style="color:#00d2ff;"></i> <span><b>${cond.nombre}</b></span></div>` 
      : `<div class="unidad-conductor-tag sin-asignar"><i class="fas fa-user-slash"></i> <span>Sin conductor</span></div>`;

    html += `<div class="unidad-card clickable" onclick="enfocarYMostrarBus(${idx})" title="Clic para ver conductor y ubicar en el mapa">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
        <div class="unidad-nombre"><i class="fas fa-bus"></i> ${busNombre}</div>
        <span class="btn-ver-unidad"><i class="fas fa-id-badge"></i> Ver Conductor</span>
      </div>
      ${condHTML}
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
      log(" Compartir ubicación cancelado por el usuario.");
      return;
    }
  }

  const gpsDisplay = document.getElementById('gpsStatusDisplay');
  if (gpsDisplay) {
    gpsDisplay.innerHTML = `⏳ GPS: Buscando señal...`;
    gpsDisplay.className = 'gps-status gps-searching';
  }
  const estadoGPS = document.getElementById('estadoGPS');
  if (estadoGPS) estadoGPS.innerHTML = '⏳ GPS: Buscando...';

  log('📍 Solicitando GPS...');
  if (watchId) navigator.geolocation.clearWatch(watchId);

  function iniciarLocalizacion(altaPrecision) {
    navigator.geolocation.getCurrentPosition((pos) => {
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

      if (gpsDisplay) {
        gpsDisplay.innerHTML = `📍 GPS activo`;
        gpsDisplay.className = 'gps-status gps-active';
      }
      if (estadoGPS) estadoGPS.innerHTML = '📍 GPS: Activo';
      actualizarNotificacionProximidad();

      // Comenzar seguimiento continuo de movimiento
      watchId = navigator.geolocation.watchPosition((watchPos) => {
        userLocation = { lat: watchPos.coords.latitude, lng: watchPos.coords.longitude };
        ubicacionesUsuarios[currentUser.telefono] = userLocation;
        guardarUbicaciones();
        if (document.getElementById('adminPanel')?.classList.contains('active') && typeof actualizarAdminDatos === 'function') {
          actualizarAdminDatos();
        }
        actualizarTodosLosMarcadores();

        if (gpsDisplay) {
          gpsDisplay.innerHTML = `📍 GPS activo`;
          gpsDisplay.className = 'gps-status gps-active';
        }
        if (estadoGPS) estadoGPS.innerHTML = '📍 GPS: Activo';
        actualizarNotificacionProximidad();

        // Actualizar la línea de guía por calles en tiempo real mientras camina
        if (paradaGuiaActual) {
          guiarHaciaParada(paradaGuiaActual, false);
        }
      }, (e) => {
        log(`❌ GPS Watch error: ${e.message}`);
      }, { enableHighAccuracy: altaPrecision, timeout: 10000 });


    }, (err) => {
      log(`❌ GPS error inicial (altaPrecision=${altaPrecision}): ${err.message}`);
      if (altaPrecision) {
        log('⚠️ Intentando con precisión estándar (fallback)...');
        iniciarLocalizacion(false);
      } else {
        alert('Permiso de ubicación denegado o error de GPS.');
        if (gpsDisplay) {
          gpsDisplay.innerHTML = `📡 GPS: Inactivo`;
          gpsDisplay.className = 'gps-status gps-inactive';
        }
        if (estadoGPS) estadoGPS.innerHTML = '📍 GPS: Inactivo';
      }
    }, { enableHighAccuracy: altaPrecision, timeout: 10000 });
  }

  iniciarLocalizacion(true);
}

function centrarEnMiUbicacion() {
  if (userLocation) {
    map.setView([userLocation.lat, userLocation.lng], 16);
    log('🎯 Centrado');
  } else {
    alert('Activa GPS');
  }
}

function cerrarYRestablecerRegistro() {
  document.getElementById('registerModal')?.classList.remove('active');

  const err = document.getElementById('registerError');
  if (err) err.textContent = '';

  const success = document.getElementById('registerSuccess');
  if (success) {
    success.textContent = '';
    success.style.display = 'none';
  }

  const ua = document.getElementById('userAlias');
  if (ua) {
    ua.value = '';
    ua.style.display = 'block';
  }

  const pn = document.getElementById('phoneNumber');
  if (pn) {
    pn.value = '';
    pn.style.display = 'block';
  }

  const registerBtn = document.getElementById('registerBtn');
  if (registerBtn) {
    registerBtn.style.display = 'block';
  }

  const cancelBtn = document.getElementById('cancelarRegistroBtn');
  if (cancelBtn) {
    cancelBtn.textContent = 'REGRESAR';
  }
}

function validarTelefono(telefono) {
  // Eliminar guiones, espacios, paréntesis, etc.
  const limpio = telefono.replace(/[\s\-\(\)]/g, '');
  
  // Formato local de Nicaragua: 8 dígitos empezando con 2, 5, 7, 8
  const regexNicaLocal = /^[2578]\d{7}$/;
  
  // Formato internacional de Nicaragua: +505 o 505 seguido de 8 dígitos empezando con 2, 5, 7, 8
  const regexNicaInt = /^(?:\+?505)?[2578]\d{7}$/;
  
  // Formato internacional general: empieza con + y tiene de 7 a 15 dígitos
  const regexIntGeneral = /^\+[1-9]\d{6,14}$/;

  if (regexNicaLocal.test(limpio)) {
    return { valido: true, formateado: '+505' + limpio };
  }
  if (regexNicaInt.test(limpio)) {
    const prefijo = limpio.startsWith('+') ? '' : '+';
    return { valido: true, formateado: prefijo + limpio };
  }
  if (regexIntGeneral.test(limpio)) {
    return { valido: true, formateado: limpio };
  }
  return { valido: false };
}

function registrarNuevoUsuario() {
  const alias = document.getElementById('userAlias')?.value.trim();
  const telefonoRaw = document.getElementById('phoneNumber')?.value.trim();
  const error = document.getElementById('registerError');
  const registerBtn = document.getElementById('registerBtn');

  if (!alias || !telefonoRaw) {
    if (error) error.textContent = 'Completa alias y número.';
    return;
  }

  // Validar teléfono
  const resultadoTel = validarTelefono(telefonoRaw);
  if (!resultadoTel.valido) {
    if (error) {
      error.textContent = 'Número inválido. Usa 8 dígitos (ej: 88888888) o formato con prefijo internacional (ej: +50588888888).';
    }
    return;
  }
  const telefono = resultadoTel.formateado;

  if (usuariosRegistrados.some(u => u.telefono === telefono)) {
    if (error) error.textContent = 'Ese número ya existe.';
    return;
  }

  if (error) error.textContent = '';
  
  // Deshabilitar botón de registro y mostrar estado de obtención de ubicación
  if (registerBtn) {
    registerBtn.disabled = true;
    registerBtn.textContent = 'OBTENIENDO UBICACIÓN...';
  }

  // Solicitar ubicación GPS antes de completar el registro
  if (!navigator.geolocation) {
    if (error) error.textContent = 'Tu navegador no soporta geolocalización. No se puede completar el registro.';
    if (registerBtn) {
      registerBtn.disabled = false;
      registerBtn.textContent = 'REGISTRARSE';
    }
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      // Éxito: tenemos ubicación del usuario
      userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      ubicacionesUsuarios[telefono] = userLocation;

      const nuevo = { alias, telefono };
      usuariosRegistrados.push(nuevo);
      currentUser = nuevo;

      guardarUsuarios();
      guardarUbicaciones();

      if (document.getElementById('adminPanel')?.classList.contains('active') && typeof actualizarAdminDatos === 'function') {
        actualizarAdminDatos();
      }

      actualizarListaUsuarios();
      actualizarInterfazUsuario();
      actualizarTodosLosMarcadores();

      // Iniciar el watchPosition continuo
      activarGPSReal(true);

      // Mostrar interfaz de éxito en el modal de registro
      const success = document.getElementById('registerSuccess');
      if (success) {
        success.innerHTML = `¡Registro Exitoso!<br><span style="font-size:0.65rem; font-weight:normal; color:#cbd5e1;">Tu ubicación ha sido asociada y compartida correctamente.</span>`;
        success.style.display = 'block';
      }

      const ua = document.getElementById('userAlias');
      if (ua) ua.style.display = 'none';

      const pn = document.getElementById('phoneNumber');
      if (pn) pn.style.display = 'none';

      if (registerBtn) {
        registerBtn.style.display = 'none';
        registerBtn.disabled = false;
        registerBtn.textContent = 'REGISTRARSE';
      }

      const cancelBtn = document.getElementById('cancelarRegistroBtn');
      if (cancelBtn) {
        cancelBtn.textContent = 'REGRESAR AL MAPA';
      }
    },
    (err) => {
      // Error al obtener la ubicación
      console.error("Error de geolocalización durante el registro:", err);
      if (error) {
        error.textContent = 'Es obligatorio permitir el acceso a tu ubicación GPS para poder registrarte. Por favor actívala en tu navegador e intenta de nuevo.';
      }
      if (registerBtn) {
        registerBtn.disabled = false;
        registerBtn.textContent = 'REGISTRARSE';
      }
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
}

function abrirAdmin() {
  document.getElementById('loginAdminModal')?.classList.add('active');
}

function cerrarAdmin() {
  document.getElementById('adminPanel')?.classList.remove('active');
}

function cerrarLoginAdmin() {
  document.getElementById('loginAdminModal')?.classList.remove('active');
  const pass = document.getElementById('adminPassword');
  if (pass) pass.value = '';
  const err = document.getElementById('loginError');
  if (err) err.textContent = '';
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
        <button class="admin-tab-btn" id="btn-tab-conductores" onclick="switchAdminTab('conductores')"><i class="fas fa-id-card"></i> Registro de Conductores</button>
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

      <!-- PESTAÑA: REGISTRO DE CONDUCTORES -->
      <div id="tab-conductores" class="admin-tab-content">
        <div class="admin-card">
          <div class="admin-card-title"><i class="fas fa-user-plus"></i> Registrar Nuevo Conductor</div>
          <form id="form-registro-conductor" onsubmit="event.preventDefault(); registrarConductor();">
            <div class="admin-grid-two-cols">
              <div class="admin-input-group">
                <label for="cond-nombre">Nombre Completo del Conductor</label>
                <input type="text" id="cond-nombre" required placeholder="Ej. Juan Pérez">
              </div>
              <div class="admin-input-group">
                <label for="cond-identidad">Número de Identidad</label>
                <input type="text" id="cond-identidad" required placeholder="Ej. 001-121290-0002A">
              </div>
            </div>
            
            <div class="admin-grid-two-cols" style="margin-top: 10px;">
              <div class="admin-input-group">
                <label for="cond-unidad">Número de Unidad</label>
                <input type="text" id="cond-unidad" required placeholder="Ej. 110-U01">
              </div>
              <div class="admin-input-group">
                <label for="cond-placa">Número de Placa del Bus</label>
                <input type="text" id="cond-placa" required placeholder="Ej. M 12345">
              </div>
            </div>
            
            <div class="admin-grid-two-cols" style="margin-top: 10px;">
              <div class="admin-input-group">
                <label for="cond-telefono">Número de Teléfono</label>
                <input type="tel" id="cond-telefono" required placeholder="Ej. 88888888">
              </div>
              <div class="admin-input-group">
                <label>Foto Actual del Conductor</label>
                <div style="display: flex; gap: 15px; align-items: center;">
                  <input type="file" id="cond-foto" accept="image/*" style="display: none;" onchange="previewConductorFoto(event)">
                  <button type="button" class="admin-btn admin-btn-secondary" onclick="document.getElementById('cond-foto').click()"><i class="fas fa-upload"></i> Subir Foto</button>
                  <div id="cond-foto-preview-container" class="cond-photo-preview-circle">
                    <i class="fas fa-user" id="cond-foto-placeholder" style="color: #9ca3af; font-size: 1.5rem;"></i>
                    <img id="cond-foto-preview" style="display: none; width: 100%; height: 100%; object-fit: cover;">
                  </div>
                </div>
              </div>
            </div>

            
            <button type="submit" class="admin-btn admin-btn-primary" style="margin-top: 15px;"><i class="fas fa-save"></i> Registrar Conductor</button>
          </form>
        </div>

        <div class="admin-card">
          <div class="admin-card-title"><i class="fas fa-address-book"></i> Conductores Registrados</div>
          <div class="admin-list-container" id="admin-lista-conductores" style="max-height: 400px; overflow-y: auto;">
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
            <div style="display:flex; gap:6px; align-items:center;">
              ${bloqueado
            ? `<button class="admin-btn admin-btn-secondary" style="padding:4px 8px;" onclick="desbloquearUsuarioAdmin('${u.telefono.replace(/'/g, "\\'")}')">Desbloquear</button>`
            : `<button class="admin-btn admin-btn-danger" style="padding:4px 8px;" onclick="bloquearUsuarioAdmin('${u.telefono.replace(/'/g, "\\'")}', 'Baneo manual del Administrador')">Bloquear</button>`
          }
              <button class="admin-btn admin-btn-danger" style="padding:4px 8px; background:#b91c1c;" onclick="eliminarUsuarioAdmin('${u.telefono.replace(/'/g, "\\'")}')"><i class="fas fa-trash-alt"></i> Eliminar</button>
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

  const condList = document.getElementById('admin-lista-conductores');
  if (condList) {
    if (conductoresRegistrados.length === 0) {
      condList.innerHTML = '<div style="padding:15px; text-align:center; color:#9ca3af;">No hay conductores registrados</div>';
    } else {
      condList.innerHTML = conductoresRegistrados.map(c => {
        const fotoHTML = c.foto
          ? `<img src="${c.foto}" style="width:50px; height:50px; border-radius:50%; object-fit:cover; border:1px solid #2d3748;">`
          : `<div style="width:50px; height:50px; border-radius:50%; background:#2d3748; display:flex; align-items:center; justify-content:center;"><i class="fas fa-user" style="color:#9ca3af; font-size:1.2rem;"></i></div>`;

        const gpsActivo = !!watchIdsConductores[c.id];
        const gpsBadgeHTML = gpsActivo
          ? `<span class="admin-badge admin-badge-active" style="margin-left: 5px;">📡 GPS Activo</span>`
          : `<span class="admin-badge admin-badge-blocked" style="background: rgba(107, 114, 128, 0.2); color: #9ca3af; margin-left: 5px;">📡 GPS Inactivo</span>`;

        const gpsBtnHTML = gpsActivo
          ? `<button class="admin-btn admin-btn-secondary" style="padding:4px 8px;" onclick="activarGPSConductor('${c.id}')"><i class="fas fa-satellite-dish"></i> Apagar GPS</button>`
          : `<button class="admin-btn admin-btn-success" style="padding:4px 8px; background:#10b981;" onclick="activarGPSConductor('${c.id}')"><i class="fas fa-satellite-dish"></i> Activar GPS</button>`;

        return `
          <div class="admin-list-item" style="padding: 12px 15px;">
            <div style="display:flex; gap:12px; align-items:center;">
              ${fotoHTML}
              <div class="user-details">
                <div style="display:flex; align-items:center; flex-wrap:wrap;">
                  <strong style="font-size: 0.85rem; color: #f0f9ff;">${c.nombre}</strong>
                  ${gpsBadgeHTML}
                </div>
                <span class="user-meta" style="font-size: 0.65rem;">📞 Tel: ${c.telefono} | 🪪 ID: ${c.identidad} | 🚌 Unidad: ${c.unidad} | 🏷️ Placa: ${c.placa}</span>
              </div>
            </div>
            <div style="display:flex; gap:6px;">
              ${gpsBtnHTML}
              <button class="admin-btn admin-btn-danger" style="padding:4px 8px; background:#b91c1c;" onclick="eliminarConductorAdmin('${c.id}')"><i class="fas fa-trash-alt"></i> Eliminar</button>
            </div>
          </div>
        `;
      }).join('');
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

window.eliminarUsuarioAdmin = function (telefono) {
  const user = usuariosRegistrados.find(u => u.telefono === telefono);
  const alias = user ? user.alias : 'Usuario Desconocido';
  if (confirm(`¿Estás seguro de que deseas eliminar al usuario "${alias}" (${telefono})?`)) {
    if (currentUser && currentUser.telefono === telefono) {
      cerrarSesionUsuario();
    }

    usuariosRegistrados = usuariosRegistrados.filter(u => u.telefono !== telefono);
    usuariosBloqueados = usuariosBloqueados.filter(b => b.telefono !== telefono);
    delete ubicacionesUsuarios[telefono];

    if (markersUsuarios[telefono]) {
      if (map) map.removeLayer(markersUsuarios[telefono]);
      delete markersUsuarios[telefono];
    }

    guardarUsuarios();
    guardarUbicaciones();

    const infoMsg = { perfil: "Central", mensaje: `❌ El usuario "${alias}" ha sido eliminado por la administración.`, timestamp: Date.now(), alias: "Central" };
    mensajesLocales.push(infoMsg);
    mostrarMensaje(infoMsg);

    log(`🗑️ Usuario ${alias} (${telefono}) eliminado por el administrador.`);

    actualizarAdminDatos();
    actualizarListaUsuarios();
    actualizarTodosLosMarcadores();
  }
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
    Object.values(watchIdsConductores).forEach(id => navigator.geolocation.clearWatch(id));
    watchIdsConductores = {};


    Object.values(markersUsuarios).forEach(m => map.removeLayer(m));
    markersUsuarios = {};
    userMarker = null;
    if (guidRutaPolyline && map) {
      map.removeLayer(guidRutaPolyline);
      guidRutaPolyline = null;
    }

    actualizarInterfazUsuario();

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
  log(' Reporte de recorridos exportado a Excel');
};

window.limpiarHistorialRecorridos = function () {
  if (confirm('¿Estás seguro de que deseas limpiar todo el historial de recorridos?')) {
    historialRecorridos = [];
    guardarHistorial();
    actualizarAdminDatos();
    log(' Historial de recorridos limpiado');
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

function limpiarChatLocal() {
  const confirmar = confirm("¿Deseas limpiar el historial del chat localmente en tu pantalla?");
  if (!confirmar) return;

  const chatDisplay = document.getElementById('chatDisplay');
  if (chatDisplay) {
    chatDisplay.innerHTML = `<div class="msg admin"><b>🚌 Central:</b> ¡Bienvenido! Pantalla de chat limpiada.</div>`;
  }
  mensajesLocales = [
    { perfil: "Central", mensaje: "¡Bienvenido! Usa el botón para ver bus y parada más cercanos.", timestamp: Date.now(), alias: "Central" }
  ];
  loadedMsgIds.clear();
}

function bindEventos() {
  const mapaEventos = {
    sendBtn: handleSendMessage,
    btnLimpiarChat: limpiarChatLocal,
    btnRegistroNuevo: () => document.getElementById('registerModal')?.classList.add('active'),
    registerBtn: registrarNuevoUsuario,
    cancelarRegistroBtn: cerrarYRestablecerRegistro,
    btnRegresarCuenta: cerrarSesionUsuario,
    btnCambiarUsuario: abrirCambioUsuario,
    cancelarCambioBtn: () => document.getElementById('cambiarUsuarioModal')?.classList.remove('active'),
    btnActivarGPS: activarGPSReal,
    btnCentrarGPS: centrarEnMiUbicacion,
    btnBusCercano: buscarInfoCompleta,
    btnSalirMasTarde: () => alert("Horarios estimados: Los buses de la Ruta 110 pasan con una frecuencia regular de cada 10 a 15 minutos en esta parada."),
    btnIrAhora: iniciarNavegacionEnVivo,
    gmBtnSalirTarde: () => alert("Horarios estimados: Los buses de la Ruta 110 pasan con una frecuencia regular de cada 10 a 15 minutos en esta parada."),
    gmBtnIrAhora: iniciarNavegacionEnVivo,
    gmBtnDetenerNav: detenerNavegacionEnVivo,
    gmBtnBack: cerrarGuiaRuta,
    gmBtnCloseCard: cerrarGuiaRuta,
    gmModeCarretera: () => cambiarModoGuia('carretera'),
    gmModePeatonal: () => cambiarModoGuia('peatonal'),
    gmModeBus: () => cambiarModoGuia('bus'),
    gmBtnEvitar: (e) => {
      e.stopPropagation();
      const menu = document.getElementById('gmEvitarMenu');
      if (menu) menu.style.display = menu.style.display === 'none' ? 'flex' : 'none';
    },
    btnIniciarSimulacion: () => {
      iniciarSimulacionConCantidad();
      if (simInterval) clearInterval(simInterval);
      simInterval = setInterval(moverBuses, 1200);
      actualizarNotificacionProximidad();
    },
    btnDetenerSimulacion: detenerSimulacion,
    btnVerRuta: centrarRuta,
    toggleRutaBtn: toggleRuta,
    openAdminBtn: abrirAdmin,
    btnSonidoOn: activarSonido,
    btnSonidoOff: desactivarSonido,
    loginAdminSubmit: loginAdmin,
    cancelarAdminBtn: cerrarLoginAdmin,
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

  const inputBuscarParada = document.getElementById('inputBuscarParada');
  if (inputBuscarParada) {
    inputBuscarParada.addEventListener('input', (e) => {
      cargarParadasEnLista(e.target.value);
    });
    inputBuscarParada.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        window.limpiarBuscadorParadas();
      } else if (e.key === 'Enter') {
        const primeraParada = document.querySelector('.parada-item');
        if (primeraParada) {
          primeraParada.click();
        }
      }
    });
  }

  const btnLimpiar = document.getElementById('btnLimpiarBuscarParada');
  if (btnLimpiar) {
    btnLimpiar.addEventListener('click', window.limpiarBuscadorParadas);
  }

  document.addEventListener('click', (e) => {
    const evitarWrap = document.querySelector('.gm-evitar-wrapper');
    const evitarMenu = document.getElementById('gmEvitarMenu');
    if (evitarMenu && evitarWrap && !evitarWrap.contains(e.target)) {
      evitarMenu.style.display = 'none';
    }
  });
}

window.previewConductorFoto = function (event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const preview = document.getElementById('cond-foto-preview');
      const placeholder = document.getElementById('cond-foto-placeholder');
      if (preview && placeholder) {
        preview.src = e.target.result;
        preview.style.display = 'block';
        placeholder.style.display = 'none';
      }
    };
    reader.readAsDataURL(file);
  }
};

window.registrarConductor = function () {
  const nombre = document.getElementById('cond-nombre')?.value.trim();
  const identidad = document.getElementById('cond-identidad')?.value.trim();
  const unidad = document.getElementById('cond-unidad')?.value.trim();
  const placa = document.getElementById('cond-placa')?.value.trim();
  const telefono = document.getElementById('cond-telefono')?.value.trim();
  const preview = document.getElementById('cond-foto-preview');

  if (!nombre || !identidad || !unidad || !placa || !telefono) {
    alert('Por favor complete todos los datos.');
    return;
  }

  let foto = '';
  if (preview && preview.style.display === 'block') {
    foto = preview.src; // base64 string
  }

  const nuevoConductor = {
    id: Date.now().toString(),
    nombre,
    identidad,
    unidad,
    placa,
    telefono,
    foto
  };

  conductoresRegistrados.push(nuevoConductor);
  guardarConductores();

  // Limpiar formulario
  document.getElementById('form-registro-conductor')?.reset();
  if (preview) {
    preview.src = '';
    preview.style.display = 'none';
  }
  const placeholder = document.getElementById('cond-foto-placeholder');
  if (placeholder) {
    placeholder.style.display = 'block';
  }

  actualizarAdminDatos();
  alert('Conductor registrado con éxito.');
};

window.eliminarConductorAdmin = function (id) {
  if (confirm('¿Estás seguro de que deseas eliminar este conductor?')) {
    const cond = conductoresRegistrados.find(c => c.id === id);
    if (cond) {
      if (watchIdsConductores[id]) {
        navigator.geolocation.clearWatch(watchIdsConductores[id]);
        delete watchIdsConductores[id];
      }
      delete ubicacionesUsuarios[cond.telefono];
      guardarUbicaciones();
    }

    conductoresRegistrados = conductoresRegistrados.filter(c => c.id !== id);
    guardarConductores();
    actualizarAdminDatos();
    actualizarTodosLosMarcadores();
  }
};

function crearIconoConductor(c) {
  const fotoHTML = c.foto
    ? `<img src="${c.foto}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover; border: 2px solid #ef4444;">`
    : `<div style="width: 32px; height: 32px; border-radius: 50%; background: #ef4444; display: flex; align-items: center; justify-content: center;"><i class="fas fa-user-tie" style="color: white; font-size: 1rem;"></i></div>`;

  return L.divIcon({
    html: `
      <div class="driver-marker-wrapper" style="display: flex; flex-direction: column; align-items: center; background: transparent;">
        <div class="driver-label" style="background: #ef4444; color: white; font-size: 8px; font-weight: 800; padding: 2px 6px; border-radius: 10px; margin-bottom: 2px; white-space: nowrap; border: 1px solid #1a1f3a; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${c.unidad}</div>
        <div class="driver-avatar" style="width: 36px; height: 36px; border-radius: 50%; background: #1a1f3a; border: 2px solid #ef4444; box-shadow: 0 3px 6px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; overflow: hidden; transform: translateY(-2px);">${fotoHTML}</div>
      </div>
    `,
    className: '',
    iconSize: [40, 50],
    iconAnchor: [20, 45],
    popupAnchor: [0, -45]
  });
}

window.activarGPSConductor = function (id) {
  const cond = conductoresRegistrados.find(c => c.id === id);
  if (!cond) return;

  if (watchIdsConductores[id]) {
    navigator.geolocation.clearWatch(watchIdsConductores[id]);
    delete watchIdsConductores[id];
    delete ubicacionesUsuarios[cond.telefono];
    guardarUbicaciones();
    actualizarTodosLosMarcadores();
    actualizarAdminDatos();
    log(`📡 GPS Desactivado para conductor ${cond.nombre}`);
    return;
  }

  if (!navigator.geolocation) {
    alert('GPS no soportado en este dispositivo.');
    return;
  }

  log(`📡 Iniciando GPS para conductor ${cond.nombre}...`);

  watchIdsConductores[id] = navigator.geolocation.watchPosition((pos) => {
    const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    ubicacionesUsuarios[cond.telefono] = loc;
    guardarUbicaciones();
    actualizarTodosLosMarcadores();
    actualizarAdminDatos();
  }, (err) => {
    log(`❌ Error GPS conductor ${cond.nombre}: ${err.message}`);
  }, { enableHighAccuracy: true, timeout: 10000 });

  actualizarAdminDatos();
};


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
  actualizarInterfazUsuario();
  bindEventos();
  initFirebaseSync();

  if (currentUser) {
    setTimeout(() => {
      activarGPSReal(true);
    }, 400);
  }

  // Configurar paneles colapsables en la barra lateral
  document.querySelectorAll('.sidebar .panel h3').forEach(header => {
    header.addEventListener('click', () => {
      header.parentElement.classList.toggle('collapsed');
    });
  });

  // Colapsar paneles por defecto en móvil (excepto Chat)
  if (window.innerWidth < 768) {
    document.querySelectorAll('.sidebar .panel').forEach(panel => {
      const h3 = panel.querySelector('h3');
      if (h3) {
        const isChat = h3.textContent.toLowerCase().includes('chat');
        if (!isChat) {
          panel.classList.add('collapsed');
        }
      }
    });
  }

  // Inicializar reloj en tiempo real
  function actualizarReloj() {
    const relojEl = document.getElementById('reloj');
    if (relojEl) {
      relojEl.textContent = new Date().toLocaleTimeString('es-NI', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    }
  }
  actualizarReloj();
  setInterval(actualizarReloj, 1000);

  setTimeout(() => {
    if (map) {
      map.invalidateSize();
      centrarRuta();
    }
  }, 200);
}

document.addEventListener('DOMContentLoaded', initApp);