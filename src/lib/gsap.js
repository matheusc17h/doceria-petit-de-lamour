import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

// No celular, mostrar/esconder a barra de endereço ao rolar dispara um resize
// que fazia o ScrollTrigger recalcular e o SplitText re-quebrar o texto já
// animado, embaralhando as letras. Isso ignora esse tipo de resize.
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger, SplitText };
