import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import GoldLine from '@/components/GoldLine';
import WordJoia from '@/components/WordJoia';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: 'easeOut' },
  }),
};

const services = [
  {
    icon: '◎',
    title: 'Estratégia Digital',
    description: 'Planejamento de funis, campanhas e posicionamento online com foco em resultado mensurável.',
  },
  {
    icon: '✦',
    title: 'Branding & Design',
    description: 'Identidade visual, materiais e presença de marca que transmitem autoridade e sofisticação.',
  },
  {
    icon: '⚙',
    title: 'Tecnologia & Automação',
    description: 'Sistemas, integrações e automações de marketing que eliminam trabalho manual e escalam.',
  },
  {
    icon: '◈',
    title: 'Presença Online',
    description: 'Google Meu Negócio, Meta Business, SEO e gestão completa da sua vitrine digital.',
  },
];

const Home = () => {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-cadarn-navy paper-texture overflow-hidden">
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 md:py-36">
          <motion.div
            initial="hidden"
            animate="visible"
            className="max-w-2xl"
          >
            <motion.p
              variants={fadeUp}
              custom={0}
              className="text-cadarn-caramelo text-sm font-medium tracking-widest uppercase mb-4"
            >
              Marketing & Tecnologia
            </motion.p>
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-cadarn-offwhite leading-tight mb-6"
            >
              Beleza com{' '}
              <WordJoia>estratégia</WordJoia>
              <br />
              <span className="text-cadarn-offwhite">é lucro.</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-cadarn-offwhite/80 text-lg md:text-xl leading-relaxed mb-10"
            >
              Unimos design sofisticado, tecnologia prática e método tático
              para transformar a presença digital do seu negócio em resultado real.
            </motion.p>
            <motion.div
              variants={fadeUp}
              custom={3}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                to="/contato"
                className="inline-flex items-center justify-center px-8 py-4 bg-cadarn-caramelo text-cadarn-offwhite font-semibold rounded-md hover:shadow-hero transition-all duration-200 active:scale-[0.97]"
              >
                Fale Conosco
              </Link>
              <Link
                to="/servicos"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-cadarn-caramelo/40 text-cadarn-offwhite font-semibold rounded-md hover:border-cadarn-caramelo transition-all duration-200"
              >
                Nossos Serviços
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-cadarn-offwhite to-transparent" />
      </section>

      {/* Services overview */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="text-center mb-16"
        >
          <motion.p
            variants={fadeUp}
            custom={0}
            className="text-cadarn-caramelo text-sm font-medium tracking-widest uppercase mb-3"
          >
            O que fazemos
          </motion.p>
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="text-3xl md:text-4xl font-bold text-cadarn-navy"
          >
            Método tático, resultado <WordJoia>real</WordJoia>
          </motion.h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              variants={fadeUp}
              custom={i}
              className="group p-8 rounded-lg border border-cadarn-border-light bg-cadarn-offwhite hover:shadow-card-hover hover:border-cadarn-caramelo/40 transition-all duration-300"
            >
              <span className="text-2xl text-cadarn-caramelo mb-4 block">
                {service.icon}
              </span>
              <h3 className="text-xl font-bold text-cadarn-navy mb-3">
                {service.title}
              </h3>
              <p className="text-cadarn-vinho/80 leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/servicos"
            className="inline-flex items-center gap-2 text-cadarn-navy font-semibold hover:text-cadarn-caramelo transition-colors"
          >
            Ver todos os serviços
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </section>

      <GoldLine className="max-w-6xl mx-auto" />

      {/* About teaser */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        >
          <motion.div variants={fadeUp} custom={0}>
            <p className="text-cadarn-caramelo text-sm font-medium tracking-widest uppercase mb-3">
              Sobre nós
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-cadarn-navy mb-6">
              Autoridade prática,{' '}
              <WordJoia>sofisticação</WordJoia> funcional
            </h2>
            <p className="text-cadarn-vinho/80 leading-relaxed mb-4">
              A Cadarn Martech nasceu da convicção de que marketing de verdade
              une beleza e método. Não fazemos enfeites — construímos sistemas
              que geram resultado.
            </p>
            <p className="text-cadarn-vinho/80 leading-relaxed mb-8">
              Cada projeto é tratado com a mesma exigência de uma marca de luxo:
              poucos elementos, muito impacto, execução impecável.
            </p>
            <Link
              to="/sobre"
              className="inline-flex items-center gap-2 text-cadarn-navy font-semibold hover:text-cadarn-caramelo transition-colors"
            >
              Conheça nossa história
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </motion.div>

          <motion.div
            variants={fadeUp}
            custom={1}
            className="flex justify-center"
          >
            <div className="w-full max-w-sm aspect-square bg-cadarn-navy rounded-lg flex items-center justify-center paper-texture">
              <img
                src="/logo.png"
                alt="Cadarn Martech"
                className="w-32 h-32 object-contain relative z-10 opacity-80"
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="bg-cadarn-navy paper-texture">
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="text-3xl md:text-4xl font-bold text-cadarn-offwhite mb-6"
            >
              Pronto para transformar sua presença <WordJoia>digital</WordJoia>?
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="text-cadarn-offwhite/70 text-lg mb-10 max-w-2xl mx-auto"
            >
              Vamos conversar sobre como levar seu negócio ao próximo nível
              com estratégia, design e tecnologia.
            </motion.p>
            <motion.div variants={fadeUp} custom={2}>
              <Link
                to="/contato"
                className="inline-flex items-center justify-center px-10 py-4 bg-cadarn-caramelo text-cadarn-offwhite font-semibold rounded-md hover:shadow-hero transition-all duration-200 active:scale-[0.97]"
              >
                Iniciar Conversa
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Home;
