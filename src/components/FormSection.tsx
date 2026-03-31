import { motion } from "framer-motion";
import { useState } from "react";
import { z } from "zod";

declare function fbq(...args: unknown[]): void;

function formatarTelefone(value: string): string {
  const d = value.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 10) {
    return d.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2");
  }
  return d.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
}

function formatarCNPJ(value: string): string {
  const d = value.replace(/\D/g, "").slice(0, 14);
  return d
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2}\.\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{2}\.\d{3}\.\d{3})(\d)/, "$1/$2")
    .replace(/^(\d{2}\.\d{3}\.\d{3}\/\d{4})(\d)/, "$1-$2");
}

function validarCNPJ(cnpj: string): boolean {
  const s = cnpj.replace(/\D/g, "");
  if (s.length !== 14) return false;
  if (/^(\d)\1+$/.test(s)) return false;

  const calc = (len: number) => {
    let sum = 0;
    let weight = len - 7;
    for (let i = 0; i < len; i++) {
      sum += parseInt(s[i]) * weight--;
      if (weight < 2) weight = 9;
    }
    const rem = sum % 11;
    return rem < 2 ? 0 : 11 - rem;
  };

  return calc(12) === parseInt(s[12]) && calc(13) === parseInt(s[13]);
}

function getUTMs() {
  const p = new URLSearchParams(window.location.search);
  return {
    utm_source: p.get("utm_source") || "",
    utm_medium: p.get("utm_medium") || "",
    utm_campaign: p.get("utm_campaign") || "",
    utm_content: p.get("utm_content") || "",
    utm_term: p.get("utm_term") || "",
  };
}

const SHEETS_URL =
  "https://script.google.com/macros/s/AKfycbxu9fubUQJAekmnmEbvEfuXofW7PEAJ18unuUwyxz-oQ56rF513JSuTihPqq3we77F4Fg/exec";

const WHATSAPP_NUMBER = "558694271798";

const formSchema = z.object({
  nome: z.string().trim().min(2, "Digite seu nome").max(100),
  whatsapp: z.string().trim().min(10, "WhatsApp inválido").max(20),
  cidade: z.string().trim().min(2, "Digite sua cidade").max(100),
  estado: z.enum(["MA", "PI"], { errorMap: () => ({ message: "Selecione MA ou PI" }) }),
  tipo_negocio: z.string().trim().min(2, "Informe o tipo").max(100),
  cnpj: z
    .string()
    .trim()
    .refine(validarCNPJ, { message: "CNPJ inválido" }),
});

type FormData = z.infer<typeof formSchema>;

const FormSection = () => {
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target;
    const value =
      name === "cnpj" ? formatarCNPJ(e.target.value)
      : name === "whatsapp" ? formatarTelefone(e.target.value)
      : e.target.value;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = formSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      setIsSubmitting(false);
      return;
    }

    const data = result.data;
    const utms = getUTMs();

    // 1. Dispara evento Lead no Meta Pixel
    try {
      fbq("track", "Lead");
    } catch (_) {
      // pixel pode não estar carregado em dev
    }

    // 2. Envia para o Google Sheets (fire and forget)
    fetch(SHEETS_URL, {
      method: "POST",
      body: JSON.stringify({
        nome: data.nome,
        telefone: data.whatsapp,
        documento: data.cnpj.replace(/\D/g, ""),
        tipoDocumento: "cnpj",
        estado: data.estado,
        ...utms,
      }),
    }).catch(() => {
      // falha silenciosa — não bloqueia o lead
    });

    // 3. Redireciona para WhatsApp
    const msg = encodeURIComponent(
      `🍷 *Quero conhecer a condição especial de vinhos!*\n\n` +
        `👤 Nome: ${data.nome}\n` +
        `📱 WhatsApp: ${data.whatsapp}\n` +
        `📍 Cidade: ${data.cidade} - ${data.estado}\n` +
        `🏪 Tipo: ${data.tipo_negocio}\n` +
        `📋 CNPJ: ${data.cnpj}`
    );

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
    setIsSubmitting(false);
  };

  const inputClass =
    "w-full bg-blue-medium border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary font-body";

  return (
    <section id="formulario" className="py-16 md:py-24 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto"
        >
          <div className="text-center mb-8">
            <span className="inline-block bg-primary text-primary-foreground font-display text-sm font-bold px-4 py-2 rounded-sm mb-4 uppercase">
              🔥 Vagas limitadas por região
            </span>
            <h2 className="text-2xl md:text-3xl font-display font-extrabold uppercase mb-3">
              Preencha e fale com a gente <span className="text-primary">agora</span>
            </h2>
            <p className="text-muted-foreground">
              Em menos de 1 minuto você descobre a condição especial pro seu negócio.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 md:p-8 space-y-4">
            <div>
              <input
                type="text"
                name="nome"
                placeholder="Seu nome completo"
                className={inputClass}
                onChange={handleChange}
                maxLength={100}
              />
              {errors.nome && <p className="text-destructive text-sm mt-1">{errors.nome}</p>}
            </div>

            <div>
              <input
                type="tel"
                name="whatsapp"
                placeholder="(00) 00000-0000"
                className={inputClass}
                onChange={handleChange}
                value={formData.whatsapp ?? ""}
                maxLength={15}
              />
              {errors.whatsapp && <p className="text-destructive text-sm mt-1">{errors.whatsapp}</p>}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <input
                  type="text"
                  name="cidade"
                  placeholder="Sua cidade"
                  className={inputClass}
                  onChange={handleChange}
                  maxLength={100}
                />
                {errors.cidade && <p className="text-destructive text-sm mt-1">{errors.cidade}</p>}
              </div>
              <div>
                <select
                  name="estado"
                  className={inputClass}
                  onChange={handleChange}
                  defaultValue=""
                >
                  <option value="" disabled>UF</option>
                  <option value="MA">MA</option>
                  <option value="PI">PI</option>
                </select>
                {errors.estado && <p className="text-destructive text-sm mt-1">{errors.estado}</p>}
              </div>
            </div>

            <div>
              <input
                type="text"
                name="tipo_negocio"
                placeholder="Tipo do negócio (bar, restaurante, adega...)"
                className={inputClass}
                onChange={handleChange}
                maxLength={100}
              />
              {errors.tipo_negocio && <p className="text-destructive text-sm mt-1">{errors.tipo_negocio}</p>}
            </div>

            <div>
              <input
                type="text"
                name="cnpj"
                placeholder="00.000.000/0000-00"
                className={inputClass}
                onChange={handleChange}
                value={formData.cnpj ?? ""}
                maxLength={18}
              />
              {errors.cnpj && <p className="text-destructive text-sm mt-1">{errors.cnpj}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-primary-foreground font-display text-xl font-bold uppercase py-4 rounded-lg hover:brightness-110 transition-all shadow-lg shadow-primary/30 disabled:opacity-50"
            >
              {isSubmitting ? "ENVIANDO..." : "QUERO MINHA CONDIÇÃO ESPECIAL →"}
            </button>

            <p className="text-center text-muted-foreground text-xs">
              🔒 Seus dados estão seguros. Você será direcionado ao WhatsApp.
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default FormSection;
