import { useState } from 'react';
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

interface FormData {
  nome: string;
  email: string;
  telefone: string;
  empresa: string;
  mensagem: string;
}

const Contato = () => {
  const [form, setForm] = useState<FormData>({
    nome: '',
    email: '',
    telefone: '',
    empresa: '',
    mensagem: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integrar com backend/API quando disponível
    setSubmitted(true);
  };

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
            Contato
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold text-cadarn-offwhite"
          >
            Vamos construir <WordJoia>juntos</WordJoia>
          </motion.h1>
        </div>
      </section>

      {/* Contact content */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-16">
          {/* Info */}
          <motion.div
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeUp} custom={0}>
              <h2 className="text-2xl font-bold text-cadarn-navy mb-6">
                Informações
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-cadarn-caramelo tracking-wider uppercase mb-2">
                    E-mail
                  </h3>
                  <a
                    href="mailto:contato@cadarnmartech.com.br"
                    className="text-cadarn-vinho hover:text-cadarn-navy transition-colors"
                  >
                    contato@cadarnmartech.com.br
                  </a>
                </div>

                <GoldLine />

                <div>
                  <h3 className="text-sm font-semibold text-cadarn-caramelo tracking-wider uppercase mb-2">
                    Localização
                  </h3>
                  <p className="text-cadarn-vinho/80">
                    São Paulo, Brasil
                  </p>
                </div>

                <GoldLine />

                <div>
                  <h3 className="text-sm font-semibold text-cadarn-caramelo tracking-wider uppercase mb-2">
                    Horário
                  </h3>
                  <p className="text-cadarn-vinho/80">
                    Segunda a sexta, 9h — 18h
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial="hidden"
            animate="visible"
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-12 border border-cadarn-caramelo/30 rounded-lg text-center"
              >
                <span className="text-4xl text-cadarn-caramelo block mb-4">
                  ✓
                </span>
                <h3 className="text-2xl font-bold text-cadarn-navy mb-3">
                  Mensagem enviada
                </h3>
                <p className="text-cadarn-vinho/70">
                  Obrigado pelo contato! Retornaremos em até 24 horas úteis.
                </p>
              </motion.div>
            ) : (
              <motion.form
                onSubmit={handleSubmit}
                variants={fadeUp}
                custom={1}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="nome"
                      className="block text-sm font-medium text-cadarn-navy mb-2"
                    >
                      Nome *
                    </label>
                    <input
                      type="text"
                      id="nome"
                      name="nome"
                      required
                      value={form.nome}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border border-cadarn-border-light rounded-md text-cadarn-vinho placeholder:text-cadarn-caramelo/50 focus:outline-none focus:ring-2 focus:ring-cadarn-navy transition-colors"
                      placeholder="Seu nome"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-cadarn-navy mb-2"
                    >
                      E-mail *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border border-cadarn-border-light rounded-md text-cadarn-vinho placeholder:text-cadarn-caramelo/50 focus:outline-none focus:ring-2 focus:ring-cadarn-navy transition-colors"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="telefone"
                      className="block text-sm font-medium text-cadarn-navy mb-2"
                    >
                      Telefone
                    </label>
                    <input
                      type="tel"
                      id="telefone"
                      name="telefone"
                      value={form.telefone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border border-cadarn-border-light rounded-md text-cadarn-vinho placeholder:text-cadarn-caramelo/50 focus:outline-none focus:ring-2 focus:ring-cadarn-navy transition-colors"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="empresa"
                      className="block text-sm font-medium text-cadarn-navy mb-2"
                    >
                      Empresa
                    </label>
                    <input
                      type="text"
                      id="empresa"
                      name="empresa"
                      value={form.empresa}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border border-cadarn-border-light rounded-md text-cadarn-vinho placeholder:text-cadarn-caramelo/50 focus:outline-none focus:ring-2 focus:ring-cadarn-navy transition-colors"
                      placeholder="Nome da empresa"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="mensagem"
                    className="block text-sm font-medium text-cadarn-navy mb-2"
                  >
                    Mensagem *
                  </label>
                  <textarea
                    id="mensagem"
                    name="mensagem"
                    required
                    rows={5}
                    value={form.mensagem}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-cadarn-border-light rounded-md text-cadarn-vinho placeholder:text-cadarn-caramelo/50 focus:outline-none focus:ring-2 focus:ring-cadarn-navy transition-colors resize-none"
                    placeholder="Conte sobre seu projeto, desafio ou objetivo..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-10 py-4 bg-cadarn-navy text-cadarn-offwhite font-semibold rounded-md hover:shadow-hero transition-all duration-200 active:scale-[0.97]"
                >
                  Enviar Mensagem
                </button>
              </motion.form>
            )}
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Contato;
