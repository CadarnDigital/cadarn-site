import { useState, useRef, useEffect } from 'react';

export interface ScanFormData {
  name: string;
  instagram: string;
  segment: string;
  whatsapp: string;
  isDecisionMaker: 'sim' | 'influencio' | 'nao';
}

interface ScanFormProps {
  onSubmit: (data: ScanFormData) => void;
}

interface FieldError {
  name?: string;
  instagram?: string;
  segment?: string;
  whatsapp?: string;
  isDecisionMaker?: string;
  lgpd?: string;
}

const SEGMENTS = [
  { value: 'imobiliaria', label: 'Imobiliária' },
  { value: 'clinica-estetica', label: 'Clínica de Estética' },
  { value: 'advocacia', label: 'Advocacia' },
  { value: 'arquitetura', label: 'Arquitetura' },
  { value: 'contabilidade', label: 'Contabilidade' },
  { value: 'outro', label: 'Outro' },
];

const DECISION_MAKER_OPTIONS = [
  { value: 'sim', label: 'Sim, sou o decisor' },
  { value: 'influencio', label: 'Influencio a decisão' },
  { value: 'nao', label: 'Não sou o decisor' },
];

const inputBase =
  'w-full border border-offwhite/20 bg-offwhite/5 px-4 py-3 font-body text-sm text-offwhite ' +
  'placeholder:text-offwhite/30 focus:border-caramelo focus:outline-none focus:ring-1 focus:ring-caramelo/50 ' +
  'transition-colors duration-200';

const selectBase =
  'w-full border border-offwhite/20 bg-navy px-4 py-3 font-body text-sm text-offwhite ' +
  'focus:border-caramelo focus:outline-none focus:ring-1 focus:ring-caramelo/50 ' +
  'transition-colors duration-200 appearance-none';

export const ScanForm = ({ onSubmit }: ScanFormProps) => {
  const [screen, setScreen] = useState<1 | 2>(1);
  const [transitioning, setTransitioning] = useState(false);
  const [visible, setVisible] = useState(true);
  const [errors, setErrors] = useState<FieldError>({});
  const [lgpdAccepted, setLgpdAccepted] = useState(false);

  const segmentRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (screen === 2 && !transitioning) {
      segmentRef.current?.focus();
    }
  }, [screen, transitioning]);

  const [formData, setFormData] = useState({
    name: '',
    instagram: '',
    segment: '',
    whatsapp: '',
    isDecisionMaker: '',
    honeypot: '',
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateScreen1 = (): boolean => {
    const newErrors: FieldError = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome completo obrigatório';
    }

    if (!formData.instagram.trim()) {
      newErrors.instagram = '@ do Instagram obrigatório';
    } else if (!formData.instagram.startsWith('@')) {
      newErrors.instagram = 'Deve começar com @';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateScreen2 = (): boolean => {
    const newErrors: FieldError = {};

    if (!formData.segment) {
      newErrors.segment = 'Selecione seu segmento';
    }

    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = 'WhatsApp obrigatório';
    }

    if (!formData.isDecisionMaker) {
      newErrors.isDecisionMaker = 'Selecione uma opção';
    }

    if (!lgpdAccepted) {
      newErrors.lgpd = 'Aceite a Política de Privacidade para continuar';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const transitionTo = (target: 1 | 2) => {
    setTransitioning(true);
    setVisible(false);
    setTimeout(() => {
      setScreen(target);
      setVisible(true);
      setTransitioning(false);
    }, 250);
  };

  const handleContinue = () => {
    if (!validateScreen1()) return;
    transitionTo(2);
  };

  const handleBack = () => {
    setErrors({});
    transitionTo(1);
  };

  const handleSubmit = () => {
    if (!validateScreen2()) return;

    // Honeypot check — if filled, silently "succeed"
    if (formData.honeypot) {
      onSubmit({
        name: formData.name.trim(),
        instagram: formData.instagram.trim(),
        segment: formData.segment,
        whatsapp: formData.whatsapp.trim(),
        isDecisionMaker: formData.isDecisionMaker as ScanFormData['isDecisionMaker'],
      });
      return;
    }

    // Dispatch custom event for external listeners
    const detail: ScanFormData & { honeypot: string } = {
      name: formData.name.trim(),
      instagram: formData.instagram.trim(),
      segment: formData.segment,
      whatsapp: formData.whatsapp.trim(),
      isDecisionMaker: formData.isDecisionMaker as ScanFormData['isDecisionMaker'],
      honeypot: formData.honeypot,
    };

    window.dispatchEvent(new CustomEvent('scan-form-submit', { detail }));

    onSubmit({
      name: detail.name,
      instagram: detail.instagram,
      segment: detail.segment,
      whatsapp: detail.whatsapp,
      isDecisionMaker: detail.isDecisionMaker,
    });
  };

  const errorStyle = 'border-status-red focus:border-status-red focus:ring-status-red';

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-navy px-4 py-12">
      {/* Header */}
      <div className="mb-10 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-caramelo/60">
          Etapa {screen} de 2
        </p>
        <h2 className="mt-3 font-headline text-2xl font-bold text-offwhite sm:text-3xl">
          {screen === 1 ? 'Vamos nos conhecer' : 'Quase lá'}
        </h2>
        <p className="mt-2 font-body text-sm text-offwhite/50">
          {screen === 1
            ? 'Precisamos de alguns dados para personalizar seu Scan.'
            : 'Mais alguns detalhes para o diagnóstico completo.'}
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-8 flex w-full max-w-md gap-2">
        <div className="h-0.5 flex-1 bg-caramelo" />
        <div className={`h-0.5 flex-1 transition-colors duration-300 ${screen === 2 ? 'bg-caramelo' : 'bg-offwhite/10'}`} />
      </div>

      {/* Form container */}
      <div
        role="form"
        aria-label="Formulário do Scan de Autoridade"
        className={`w-full max-w-md transition-opacity duration-250 ${visible && !transitioning ? 'opacity-100' : 'opacity-0'}`}
      >
        {/* Honeypot — invisible to users, visible to bots */}
        <div className="absolute -left-[9999px]" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input
            type="text"
            id="website"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={formData.honeypot}
            onChange={(e) => updateField('honeypot', e.target.value)}
          />
        </div>

        {screen === 1 && (
          <div className="space-y-6">
            {/* Nome */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block font-headline text-xs font-semibold uppercase tracking-wider text-caramelo"
              >
                Nome completo <span className="text-caramelo/60">*</span>
              </label>
              <input
                id="name"
                type="text"
                placeholder="Seu nome completo"
                required
                aria-required="true"
                aria-label="Nome completo"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                className={`${inputBase} ${errors.name ? errorStyle : ''}`}
              />
              {errors.name && (
                <p id="name-error" role="alert" className="text-xs text-status-red">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Instagram */}
            <div className="space-y-2">
              <label
                htmlFor="instagram"
                className="block font-headline text-xs font-semibold uppercase tracking-wider text-caramelo"
              >
                @ do Instagram <span className="text-caramelo/60">*</span>
              </label>
              <input
                id="instagram"
                type="text"
                placeholder="@seuperfil"
                required
                aria-required="true"
                aria-label="@ do Instagram"
                aria-invalid={!!errors.instagram}
                aria-describedby={errors.instagram ? 'instagram-error' : undefined}
                value={formData.instagram}
                onChange={(e) => updateField('instagram', e.target.value)}
                className={`${inputBase} ${errors.instagram ? errorStyle : ''}`}
              />
              {errors.instagram && (
                <p id="instagram-error" role="alert" className="text-xs text-status-red">
                  {errors.instagram}
                </p>
              )}
            </div>

            {/* Continue */}
            <button
              type="button"
              onClick={handleContinue}
              className="shimmer mt-4 w-full border border-caramelo bg-caramelo/20 px-6 py-4 font-headline text-sm font-bold uppercase tracking-widest text-caramelo transition-all duration-200 hover:bg-caramelo/30"
            >
              Continuar
            </button>
          </div>
        )}

        {screen === 2 && (
          <div className="space-y-6">
            {/* Segmento */}
            <div className="space-y-2">
              <label
                htmlFor="segment"
                className="block font-headline text-xs font-semibold uppercase tracking-wider text-caramelo"
              >
                Segmento <span className="text-caramelo/60">*</span>
              </label>
              <div className="relative">
                <select
                  ref={segmentRef}
                  id="segment"
                  required
                  aria-required="true"
                  aria-label="Segmento de atuação"
                  aria-invalid={!!errors.segment}
                  aria-describedby={errors.segment ? 'segment-error' : undefined}
                  value={formData.segment}
                  onChange={(e) => updateField('segment', e.target.value)}
                  className={`${selectBase} ${errors.segment ? errorStyle : ''}`}
                >
                  <option value="" disabled>
                    Selecione seu segmento...
                  </option>
                  {SEGMENTS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                  <svg
                    width="12"
                    height="8"
                    viewBox="0 0 12 8"
                    fill="none"
                    className="text-offwhite/40"
                  >
                    <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              {errors.segment && (
                <p id="segment-error" role="alert" className="text-xs text-status-red">
                  {errors.segment}
                </p>
              )}
            </div>

            {/* WhatsApp */}
            <div className="space-y-2">
              <label
                htmlFor="whatsapp"
                className="block font-headline text-xs font-semibold uppercase tracking-wider text-caramelo"
              >
                WhatsApp <span className="text-caramelo/60">*</span>
              </label>
              <input
                id="whatsapp"
                type="tel"
                placeholder="(00) 00000-0000"
                required
                aria-required="true"
                aria-label="WhatsApp"
                aria-invalid={!!errors.whatsapp}
                aria-describedby={errors.whatsapp ? 'whatsapp-error' : undefined}
                value={formData.whatsapp}
                onChange={(e) => updateField('whatsapp', e.target.value)}
                className={`${inputBase} ${errors.whatsapp ? errorStyle : ''}`}
              />
              {errors.whatsapp && (
                <p id="whatsapp-error" role="alert" className="text-xs text-status-red">
                  {errors.whatsapp}
                </p>
              )}
            </div>

            {/* Decisor */}
            <div className="space-y-2">
              <label
                htmlFor="isDecisionMaker"
                className="block font-headline text-xs font-semibold uppercase tracking-wider text-caramelo"
              >
                Você é o decisor? <span className="text-caramelo/60">*</span>
              </label>
              <div className="relative">
                <select
                  id="isDecisionMaker"
                  required
                  aria-required="true"
                  aria-label="Você é o decisor?"
                  aria-invalid={!!errors.isDecisionMaker}
                  aria-describedby={errors.isDecisionMaker ? 'decision-error' : undefined}
                  value={formData.isDecisionMaker}
                  onChange={(e) => updateField('isDecisionMaker', e.target.value)}
                  className={`${selectBase} ${errors.isDecisionMaker ? errorStyle : ''}`}
                >
                  <option value="" disabled>
                    Selecione...
                  </option>
                  {DECISION_MAKER_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                  <svg
                    width="12"
                    height="8"
                    viewBox="0 0 12 8"
                    fill="none"
                    className="text-offwhite/40"
                  >
                    <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              {errors.isDecisionMaker && (
                <p id="decision-error" role="alert" className="text-xs text-status-red">
                  {errors.isDecisionMaker}
                </p>
              )}
            </div>

            {/* LGPD checkbox */}
            <div className="space-y-2">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative mt-0.5 flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={lgpdAccepted}
                    onChange={(e) => {
                      setLgpdAccepted(e.target.checked);
                      if (e.target.checked) {
                        setErrors((prev) => ({ ...prev, lgpd: undefined }));
                      }
                    }}
                    aria-describedby={errors.lgpd ? 'lgpd-error' : undefined}
                    className="peer sr-only"
                  />
                  <div className="h-4 w-4 border border-offwhite/30 bg-offwhite/5 transition-colors peer-checked:border-caramelo peer-checked:bg-caramelo/20 peer-focus-visible:ring-1 peer-focus-visible:ring-caramelo/50" />
                  <svg
                    className="absolute inset-0 h-4 w-4 text-caramelo opacity-0 transition-opacity peer-checked:opacity-100"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path d="M4 8L7 11L12 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="font-body text-xs text-offwhite/50 leading-relaxed">
                  Ao prosseguir, concordo com a{' '}
                  <a
                    href="/privacidade"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-caramelo underline underline-offset-2 hover:text-caramelo/80 transition-colors"
                  >
                    Politica de Privacidade
                  </a>
                </span>
              </label>
              {errors.lgpd && (
                <p id="lgpd-error" role="alert" className="text-xs text-status-red">
                  {errors.lgpd}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={handleBack}
                className="flex-shrink-0 border border-offwhite/20 bg-transparent px-5 py-4 font-headline text-xs font-semibold uppercase tracking-widest text-offwhite/50 transition-all duration-200 hover:border-offwhite/40 hover:text-offwhite/80"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!lgpdAccepted}
                className="shimmer flex-1 border border-caramelo bg-caramelo/20 px-6 py-4 font-headline text-sm font-bold uppercase tracking-widest text-caramelo transition-all duration-200 hover:bg-caramelo/30 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Iniciar Scan
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer trust signal */}
      <p className="mt-10 max-w-sm text-center font-body text-xs text-offwhite/20">
        Seus dados ficam seguros. Usamos apenas para personalizar o diagnóstico.
      </p>
    </div>
  );
};

export default ScanForm;
