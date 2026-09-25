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
import coneCookiesCream from "./cone-cookies-cream.jpg";
import conePrestigio from "./cone-prestigio.jpg";
import coneMaracuja from "./cone-maracuja.jpg";
import coneMorango from "./cone-morango.jpg";
import ovoBrigadeiro from "./ovo-brigadeiro.jpg";
import ovoPrestigio from "./ovo-prestigio.jpg";
import ovoNinhoMorango from "./ovo-ninho-morango.jpg";
import ovoKinder from "./ovo-kinder.jpg";
import boloBaunilha from "./bolo-baunilha.jpg";

const MAP = {
  "cone-kinder.png": coneKinder,
  "cone-ovomaltine.png": coneOvomaltine,
  "cone-ourob.png": coneOuroBranco,
  "cone-ferrero1.png": coneFerrero,
  "bolo1.png": bolo1,
  "bolo2.png": bolo2,
  "bolo3.png": bolo3,
  "logo2.png": placeholder,
  "cone-cookies-cream.jpg": coneCookiesCream,
  "cone-prestigio.jpg": conePrestigio,
  "cone-maracuja.jpg": coneMaracuja,
  "cone-morango.jpg": coneMorango,
  "ovo-brigadeiro.jpg": ovoBrigadeiro,
  "ovo-prestigio.jpg": ovoPrestigio,
  "ovo-ninho-morango.jpg": ovoNinhoMorango,
  "ovo-kinder.jpg": ovoKinder,
  "bolo-baunilha.jpg": boloBaunilha,
};

export function imageFor(name) {
  if (!name) return placeholder;
  // aceita tanto "cone-kinder.png" quanto "/img/cone-kinder.png" ou URL absoluta
  if (/^https?:\/\//i.test(name)) return name;
  const file = name.split("/").pop();
  return MAP[file] || placeholder;
}

export { placeholder };
