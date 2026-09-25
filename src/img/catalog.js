// Mapa nome-do-arquivo -> asset importado pelo Vite.
// O backend guarda só o nome (ex.: "cone-kinder.png"); aqui resolvemos
// para o caminho final com hash. Nome desconhecido cai no placeholder.

import coneKinder from "./cone-kinder.png";
import coneOvomaltine from "./cone-ovomaltine.png";
import coneOuroBranco from "./cone-ourob.png";
import coneFerrero from "./cone-ferrero1.png";
import bolo1 from "./bolo1.png";
import bolo2 from "./bolo2.png";
import bolo3 from "./bolo3.png";
import placeholder from "./logoreal.jpg";
// Fotos geradas por IA (mesmo estilo/fundo das fotos reais) pros sabores
// que ainda não tinham foto de verdade — trocar por foto real assim que
// tiver, é só substituir o arquivo e manter o mesmo nome.
import coneCookiesCream from "./cone-cookies-cream.png";
import conePrestigio from "./cone-prestigio.png";
import coneMaracuja from "./cone-maracuja.png";
import coneMorango from "./cone-morango.png";
import ovoBrigadeiro from "./ovo-brigadeiro.png";
import ovoPrestigio from "./ovo-prestigio.png";
import ovoNinhoMorango from "./ovo-ninho-morango.png";
import ovoKinder from "./ovo-kinder.png";
import boloBaunilha from "./bolo-baunilha.png";

const MAP = {
  "cone-kinder.png": coneKinder,
  "cone-ovomaltine.png": coneOvomaltine,
  "cone-ourob.png": coneOuroBranco,
  "cone-ferrero1.png": coneFerrero,
  "bolo1.png": bolo1,
  "bolo2.png": bolo2,
  "bolo3.png": bolo3,
  "logo2.png": placeholder,
  "cone-cookies-cream.png": coneCookiesCream,
  "cone-prestigio.png": conePrestigio,
  "cone-maracuja.png": coneMaracuja,
  "cone-morango.png": coneMorango,
  "ovo-brigadeiro.png": ovoBrigadeiro,
  "ovo-prestigio.png": ovoPrestigio,
  "ovo-ninho-morango.png": ovoNinhoMorango,
  "ovo-kinder.png": ovoKinder,
  "bolo-baunilha.png": boloBaunilha,
};

export function imageFor(name) {
  if (!name) return placeholder;
  // aceita tanto "cone-kinder.png" quanto "/img/cone-kinder.png" ou URL absoluta
  if (/^https?:\/\//i.test(name)) return name;
  const file = name.split("/").pop();
  return MAP[file] || placeholder;
}

export { placeholder };
