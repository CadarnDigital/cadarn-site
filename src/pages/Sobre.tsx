import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import GoldLine from '@/components/GoldLine';
import WordJoia from '@/components/WordJoia';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: 'easeOut' },
  }),
};

const values = [
  {
    title: 'Autoridade Prática',
    description: 'Visual de revista, método tático dentro. Cada peça tem intenção clara e próxima ação.',
  },
  {
    title: 'Premium com Função',
    description: 'Sofisticação não é enfeite. É comunicação precisa que gera confiança e converte.',
  },
  {
    title: 'Método sobre Achismo',
    description: 'Dados, funis, checklists. Substituímos intuição por processo replicável.',
  },
  {
    title: 'Tecnologia como Alavanca',
    description: 'Automações, integrações e sistemas que multiplicam resultado sem multiplicar equipe.',
  },
];

const Sobre = () => {
  return (
    <>
      {/* Page header */}
      <section className="bg-cadarn-navy paper-texture">
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-cadarn-caramelo text-sm font-medium tracking-widest uppercase mb-3"
          >
            Sobre nós
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold text-cadarn-offwhite"
          >
            Quem está por trás da <WordJoia>estratégia</WordJoia>
          </motion.h1>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-3xl"
        >
          <motion.h2
            variants={fadeUp}
            custom={0}
            className="text-3xl font-bold text-cadarn-navy mb-6"
          >
            A Cadarn Martech
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={1}
            className="text-cadarn-vinho/80 text-lg leading-relaxed mb-6"
          >
            Nascemos da convicção de que o mercado precisa de algo diferente:
            uma agência que une a sofisticação visual de uma marca premium com
            a disciplina técnica de quem constrói sistemas.
          </motion.p>
          <motion.p
            variants={fadeUp}
            custom={2}
            className="text-cadarn-vinho/80 text-lg leading-relaxed mb-6"
          >
            Cadarn — do galês, <WordJoia>forte</WordJoia>, robusto — reflete
            nossa abordagem: construir presença digital que aguenta pressão,
            gera resultado e transmite a autoridade que seu negócio merece.
          </motion.p>
          <motion.p
            variants={fadeUp}
            custom={3}
            className="text-cadarn-vinho/80 text-lg leading-relaxed"
          >
            Combinamos marketing estratégico, design editorial e tecnologia
            de automação para entregar não apenas beleza — mas método, processo
            e retorno mensurável.
          </motion.p>
        </motion.div>
      </section>

      <GoldLine className="max-w-6xl mx-auto" />

      {/* Values */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="mb-12"
        >
          <motion.p
            variants={fadeUp}
            custom={0}
            className="text-cadarn-caramelo text-sm font-medium tracking-widest uppercase mb-3"
          >
            Princípios
          </motion.p>
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="text-3xl font-bold text-cadarn-navy"
          >
            O que nos <WordJoia>guia</WordJoia>
          </motion.h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {values.map((value, i) => (
            <motion.div
              key={value.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              variants={fadeUp}
              custom={i}
              className="p-8 border border-cadarn-border-light rounded-lg"
            >
              <h3 className="text-lg font-bold text-cadarn-navy mb-3">
                {value.title}
              </h3>
              <p className="text-cadarn-vinho/80 leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team teaser */}
      <section className="bg-cadarn-navy paper-texture">
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12"
          >
            <motion.div variants={fadeUp} custom={0}>
              <div className="p-8 border border-cadarn-caramelo/20 rounded-lg">
                <h3 className="text-xl font-bold text-cadarn-offwhite mb-2">
                  Fabiano
                </h3>
                <p className="text-cadarn-caramelo text-sm mb-4">
                  Estratégia & Tecnologia
                </p>
                <p className="text-cadarn-offwhite/70 leading-relaxed">
                  Visão estratégica e execução técnica. Responsável por
                  transformar objetivos de negócio em sistemas e processos
                  que funcionam.
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} custom={1}>
              <div className="p-8 border border-cadarn-caramelo/20 rounded-lg">
                <h3 className="text-xl font-bold text-cadarn-offwhite mb-2">
                  Samira
                </h3>
                <p className="text-cadarn-caramelo text-sm mb-4">
                  Design & Identidade Visual
                </p>
                <p className="text-cadarn-offwhite/70 leading-relaxed">
                  O olhar que transforma marcas em referência visual.
                  Responsável pela identidade, materiais e a estética
                  premium que define a Cadarn.
                </p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={2}
            className="text-center mt-16"
          >
            <Link
              to="/contato"
              className="inline-flex items-center justify-center px-10 py-4 bg-cadarn-caramelo text-cadarn-offwhite font-semibold rounded-md hover:shadow-hero transition-all duration-200 active:scale-[0.97]"
            >
              Vamos Conversar
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Sobre;
