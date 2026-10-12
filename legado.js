/*! legado-digital — tu plan de herencia digital · DataFlow Elegance · MIT
 *  Para dejar instrucciones claras sobre tus cuentas. NUNCA guardes contraseñas aquí.
 */
(function (g) {
  "use strict";
  var PALABRAS = /(contrase(ñ|n)a|password|passwd|pwd|\bpin\b|clave|seed|semilla|frase de recuperaci|mnemonic|private key|clave privada)\s*[:=]/i;

  /** Detecta si un texto parece contener una contraseña o un secreto (para avisar). */
  function pareceSecreto(txt) {
    var s = String(txt || "");
    if (PALABRAS.test(s)) return true;
    // 12/24 palabras en minúscula seguidas (frase semilla cripto)
    if (/^(\s*[a-z]{3,8}\s+){11,23}[a-z]{3,8}\s*$/.test(s)) return true;
    return s.split(/\s+/).some(function (w) {
      return w.length >= 10 && /[a-z]/.test(w) && /[A-Z]/.test(w) && /\d/.test(w) && /[^A-Za-z0-9]/.test(w) && !/^https?:/i.test(w);
    });
  }

  var ACCIONES = { cerrar: "Cerrar la cuenta", conservar: "Conservar / descargar contenido", memorial: "Convertir en cuenta conmemorativa", transferir: "Transferir a otra persona" };

  /** d = { titular, fecha, albacea:{nombre, contacto}, cuentas:[{servicio, usuario, accion, notas}], dispositivos, donde, mensaje } */
  function generar(d) {
    d = d || {};
    var avisos = [];
    var cuentas = (d.cuentas || []).filter(function (c) { return String(c.servicio || "").trim(); });
    cuentas.forEach(function (c) {
      ["servicio", "usuario", "notas"].forEach(function (k) {
        if (pareceSecreto(c[k])) avisos.push("La cuenta '" + c.servicio + "' parece contener una contraseña o secreto en '" + k + "'. Bórralo: indica solo DÓNDE se guarda (p. ej. 'en mi gestor de contraseñas').");
      });
    });
    ["dispositivos", "donde", "mensaje"].forEach(function (k) {
      if (pareceSecreto(d[k])) avisos.push("El campo '" + k + "' parece contener una contraseña o secreto. Bórralo.");
    });
    return {
      titular: d.titular || "", fecha: d.fecha || new Date().toISOString().slice(0, 10), albacea: d.albacea || {},
      cuentas: cuentas.map(function (c) { return { servicio: c.servicio, usuario: c.usuario || "", accion: ACCIONES[c.accion] || ACCIONES.cerrar, notas: c.notas || "" }; }),
      dispositivos: d.dispositivos || "", donde: d.donde || "", mensaje: d.mensaje || "",
      avisos: avisos, seguro: avisos.length === 0
    };
  }

  g.LegadoDigital = { generar: generar, pareceSecreto: pareceSecreto, ACCIONES: ACCIONES };
})(typeof window !== "undefined" ? window : globalThis);
