import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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

const services = [
  {
    icon: '◎',
    title: 'Estratégia Digital',
    subtitle: 'Planejamento com método, resultado com dados',
    items: [
      'Diagnóstico de presença digital e concorrência',
      'Planejamento de funis de conversão e jornada do cliente',
      'Estratégia de campanhas e mídia paga (Meta Ads, Google Ads)',
      'Dashboards de performance e KPIs acionáveis',
      'Consultoria mensal com acompanhamento tático',
    ],
  },
  {
    icon: '✦',
    title: 'Branding & Design',
    subtitle: 'Identidade que transmite autoridade',
    items: [
      'Criação de identidade visual completa',
      'Manual de marca e diretrizes de aplicação',
      'Design de materiais digitais e impressos',
      'Social media design — posts, stories, carrosséis',
      'Apresentações e propostas comerciais',
    ],
  },
  {
    icon: '⚙',
    title: 'Tecnologia & Automação',
    subtitle: 'Sistemas que eliminam o trabalho manual',
    items: [
      'Desenvolvimento de aplicações web e mobile (PWA)',
      'Automação de marketing e CRM',
      'Integrações entre plataformas (WhatsApp, e-mail, CRM)',
      'Chatbots e atendimento automatizado',
      'Relatórios automatizados e alertas inteligentes',
    ],
  },
  {
    icon: '◈',
    title: 'Presença Online',
    subtitle: 'Sua vitrine digital sempre impecável',
    items: [
      'Google Meu Negócio — setup e otimização',
      'Meta Business Suite — configuração e verificação',
      'SEO técnico e de conteúdo',
      'Gestão de avaliações e reputação online',
      'Blog e produção de conteúdo estratégico',
    ],
  },
];

const Servicos = () => {
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
            Serviços
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold text-cadarn-offwhite"
          >
            O que <WordJoia>construímos</WordJoia> para você
          </motion.h1>
        </div>
      </section>

      {/* Services detail */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="space-y-16">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeUp}
              custom={0}
            >
              <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 items-start">
                <div>
                  <span className="text-3xl text-cadarn-caramelo block mb-3">
                    {service.icon}
                  </span>
                  <h2 className="text-2xl font-bold text-cadarn-navy mb-2">
                    {service.title}
                  </h2>
                  <p className="text-cadarn-vinho/70 text-sm">
                    {service.subtitle}
                  </p>
                </div>

                <ul className="space-y-3">
                  {service.items.map((item, j) => (
                    <motion.li
                      key={j}
                      variants={fadeUp}
                      custom={j + 1}
                      className="flex items-start gap-3 text-cadarn-vinho/80"
                    >
                      <span className="text-cadarn-caramelo mt-1.5 text-xs">☐</span>
                      <span className="leading-relaxed">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {i < services.length - 1 && <GoldLine className="mt-16" />}
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-cadarn-navy paper-texture">
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-bold text-cadarn-offwhite mb-4">
            Cada projeto é <WordJoia>único</WordJoia>
          </h2>
          <p className="text-cadarn-offwhite/70 mb-8">
            Montamos pacotes sob medida para o momento e as necessidades do seu negócio.
          </p>
          <Link
            to="/contato"
            className="inline-flex items-center justify-center px-10 py-4 bg-cadarn-caramelo text-cadarn-offwhite font-semibold rounded-md hover:shadow-hero transition-all duration-200 active:scale-[0.97]"
          >
            Solicitar Proposta
          </Link>
        </div>
      </section>
    </>
  );
};

export default Servicos;
