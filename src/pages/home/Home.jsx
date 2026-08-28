import { useEffect, useRef } from "react";
import "./Home.css";
import coneImg from "../../img/cone-img.png";
import home2 from "../../img/home2.png";
import home3 from "../../img/home3.jpg";
import home4 from "../../img/home4.png";
import home5 from "../../img/home5.png";
import { gsap, ScrollTrigger, SplitText } from "../../lib/gsap";

function Home() {
  const tagRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const actionsRef = useRef(null);
  const statsRef = useRef(null);
  const heroImgRef = useRef(null);
  const produtosRef = useRef(null);
  const produtosTitleRef = useRef(null);

  useEffect(() => {
    const tagSplit = SplitText.create(tagRef.current, {
      type: "words, chars",
      wordsClass: "hero-tag-word",
      charsClass: "hero-tag-char",
    });
    const titleSplit = SplitText.create(titleRef.current, {
      type: "words, chars",
      wordsClass: "hero-title-word",
      charsClass: "hero-title-char",
    });
    const descSplit = SplitText.create(descRef.current, {
      type: "words, chars",
      wordsClass: "hero-desc-word",
      charsClass: "hero-desc-char",
    });
    const actionsSplit = SplitText.create(actionsRef.current, {
      type: "words, chars",
      wordsClass: "hero-actions-word",
      charsClass: "hero-actions-char",
    });
    const statsSplit = SplitText.create(statsRef.current, {
      type: "words, chars",
      wordsClass: "hero-stats-word",
      charsClass: "hero-stats-char",
    });

    const tl = gsap.timeline({
      defaults: {
        opacity: 0,
        y: 40,
        duration: 0.35,
        ease: "power3.out",
        stagger: 0.014, // <- pausa entre o aparecimento de uma letra e a próxima
      },
      scrollTrigger: {
        trigger: tagRef.current,
        start: "top 85%",
        once: true,
      },
    });

    // Cada bloco só começa quando o anterior termina de aparecer por completo
    tl.from(tagSplit.chars, {})
      .from(titleSplit.chars, {})
      .from(descSplit.chars, {})
      .from(actionsSplit.chars, {})
      .from(statsSplit.chars, {});

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      tagSplit.revert();
      titleSplit.revert();
      descSplit.revert();
      actionsSplit.revert();
      statsSplit.revert();
    };
  }, []);

  useEffect(() => {
    const el = heroImgRef.current;
    const original = el.src;

    const photos = [home2, home3, home4, home5];
    const sequence = [...photos, original]; // depois da última foto, volta pra a original (a que já estava no site)

    const tl = gsap.timeline({ repeat: -1 });

    sequence.forEach((src) => {
      tl.to(el, { rotateY: "+=180", duration: 0.8, ease: "sine.inOut" })
        .call(() => { el.src = src; }) // troca acontece de costas pra câmera, invisível
        .to(el, { rotateY: "+=180", duration: 0.8, ease: "sine.inOut" })
        .to({}, { duration: 1.5 }); // pausa parada antes da próxima volta
    });

    return () => {
      tl.kill();
      el.src = original;
      gsap.set(el, { clearProps: "transform" });
    };
  }, []);

  useEffect(() => {
    const cards = produtosRef.current.querySelectorAll(".produto-card");

    gsap.set(cards, { opacity: 0, y: 60, filter: "blur(20px)" });

    const tween = gsap.to(cards, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 0.3,
      ease: "power3.out",
      stagger: 0.15, // <- pausa entre a animação de um card e a do próximo (em segundos)
      scrollTrigger: {
        start: 0,
        end: () => ScrollTrigger.maxScroll(window) * 0.5, // termina quando a página chega na metade do scroll total
        scrub: 1, // vincula o progresso ao scroll: desce anima pra frente, sobe anima pra trás, para onde parar a rolagem; o "1" suaviza (~1s pra alcançar a posição)
        invalidateOnRefresh: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(cards, { clearProps: "opacity,transform,filter" });
    };
  }, []);

  useEffect(() => {
    const split = SplitText.create(produtosTitleRef.current, {
      type: "words, chars",
      wordsClass: "produtos-title-word",
      charsClass: "produtos-title-char",
    });

    gsap.set(split.chars, { opacity: 0, y: 20 });

    const tween = gsap.to(split.chars, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: "power2.out",
      stagger: 0.03, // <- pausa entre o aparecimento de uma letra e a próxima
      scrollTrigger: {
        trigger: produtosTitleRef.current,
        start: "top 90%",
        end: "top 40%",
        scrub: 1, // acompanha a barra de rolagem, igual nos cards
        invalidateOnRefresh: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      split.revert();
    };
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="hero">

        {/* Blobs de gradiente — profundidade do fundo */}
        <div className="hero-glow hero-glow-1" />
        <div className="hero-glow hero-glow-2" />
        <div className="hero-glow hero-glow-3" />

        {/* Decorações de fundo */}
        <div className="hero-deco hero-deco-1" />
        <div className="hero-deco hero-deco-2" />
        <div className="hero-deco hero-deco-3" />
        <div className="hero-deco hero-deco-4" />
        <div className="hero-deco hero-deco-5" />
        <div className="hero-dots hero-dots-1" />
        <div className="hero-dots hero-dots-2" />
        <div className="hero-cross hero-cross-1">✦</div>
        <div className="hero-cross hero-cross-2">✦</div>
        <div className="hero-cross hero-cross-3">✦</div>
        <div className="hero-line-deco hero-line-deco-1" />
        <div className="hero-line-deco hero-line-deco-2" />
        <div className="bg-blob bg-blob--ring bg-blob--pulse hero-deco-left-4" />
        <div className="hero-cross hero-cross-4">✦</div>

        {/* Decorações de fundo — lado direito */}
        <div className="bg-blob bg-blob--fill bg-blob--drift hero-deco-right-1" />
        <div className="bg-blob bg-blob--ring bg-blob--pulse hero-deco-right-2" />
        <div className="bg-blob bg-blob--fill-dark bg-blob--drift hero-deco-right-3" />
        <div className="bg-blob bg-blob--ring bg-blob--pulse hero-deco-right-4" />
        <div className="bg-dots hero-dots-right-1" />
        <div className="bg-spark hero-spark-right-1">✦</div>
        <div className="bg-spark hero-spark-right-2">✦</div>

        <div className="hero-body">
          <div className="hero-content">

            <div className="hero-tag" ref={tagRef}>
              <span className="hero-tag-line" />
              Confeitaria Artesanal
            </div>

            <h1 className="hero-title" ref={titleRef}>
              Transformando ingredientes em{" "}
              <em>pequenos pedaços</em> de amor.
            </h1>

            <div className="hero-desc" ref={descRef}>
              <div className="hero-line" />
              <p>Pequenas criações feitas para transformar qualquer ocasião em algo especial</p>
            </div>

            <div className="hero-actions" ref={actionsRef}>
              <button className="btn-primary">Fazer Pedido</button>
            </div>

            <p className="hero-signature" ref={statsRef}>
              Mais de <strong>500 doces</strong> feitos à mão, um de cada vez —
              <span className="hero-signature-name"> com carinho, Petit de L'Amour</span>.
            </p>

          </div>

          <div className="hero-image-wrap">
            <div className="hero-image-border">
              <img
                ref={heroImgRef}
                src={coneImg}
                alt="Doce em destaque"
                className="hero-image"
              />
            </div>
          </div>

        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section className="differentials">
        <div className="differentials-track">
          <div className="differentials-content">
            <span>feitos à mão</span><span className="diff-diamond">♦</span>
            <span>doces, não sorvetes</span><span className="diff-diamond">♦</span>
            <span>massa de baunilha bourbon</span><span className="diff-diamond">♦</span>
            <span>manteiga de verdade</span><span className="diff-diamond">♦</span>
            <span>sem conservantes</span><span className="diff-diamond">♦</span>
          </div>
        </div>
      </section>

      {/* CONES */}
      <section className="produtos-grid" ref={produtosRef}>

        <div className="bg-blob bg-blob--fill bg-blob--drift produtos-deco-1" />
        <div className="bg-blob bg-blob--ring bg-blob--pulse produtos-deco-2" />
        <div className="bg-dots produtos-deco-3" />
        <div className="bg-spark produtos-deco-4">✦</div>

        <h2 className="produtos-title" ref={produtosTitleRef}>Conheça nossas especialidades:</h2>

        <div className="produto-card">

          <img src="/src/img/cones.png" alt="Cones Trufados" />
          <div className="produto-info">
            <h2>Cones Trufados</h2>
            <ul>
              <li><strong>Ouro Branco:</strong> Chocolate branco cremoso com pedacinhos do bombom mais amado do Brasil.</li>
              <li><strong>Ninho com Nutella:</strong> Sabor suave do leite em pó com a cremosidade da Nutella.</li>
              <li><strong>Cookies & Cream:</strong> Chocolate branco com pedaços crocantes de biscoito.</li>
            </ul>
            <button>Ver mais sabores</button>
          </div>
        </div>

        <div className="produto-card">
          <img src="/src/img/ovos.png" alt="Ovos de Páscoa" />
          <div className="produto-info">
            <h2>Ovos de Páscoa</h2>
            <ul>
              <li><strong>Brigadeiro Gourmet:</strong> Chocolate ao leite com recheio cremoso de brigadeiro artesanal.</li>
              <li><strong>Prestígio:</strong> Chocolate ao leite recheado com creme suave de coco.</li>
              <li><strong>Ninho com Morango:</strong> Leite em pó cremoso com pedaços de morango.</li>
            </ul>
            <button>Ver mais sabores</button>
          </div>
        </div>

        <div className="produto-card">
          <img src="/src/img/bolos.png" alt="Bolos" />
          <div className="produto-info">
            <h2>Nossos Bolos</h2>
            <ul>
              <li><strong>Chocolate com Brigadeiro:</strong> Massa fofinha com recheio cremoso de brigadeiro.</li>
              <li><strong>Ninho com Morango:</strong> Massa branca com creme de leite ninho e morango.</li>
              <li><strong>Cenoura com Chocolate:</strong> Clássico bolo de cenoura com cobertura de chocolate.</li>
            </ul>
            <button>Ver mais sabores</button>
          </div>
        </div>
      </section>

      <section className="differentials">
        <div className="differentials-track">
          <div className="differentials-content">
            <span>feitos à mão</span><span className="diff-diamond">♦</span>
            <span>doces, não sorvetes</span><span className="diff-diamond">♦</span>
            <span>massa de baunilha bourbon</span><span className="diff-diamond">♦</span>
            <span>manteiga de verdade</span><span className="diff-diamond">♦</span>
            <span>sem conservantes</span><span className="diff-diamond">♦</span>
          </div>
        </div>
      </section>

    </>
  );
}

export default Home;