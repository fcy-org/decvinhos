import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import logo from "@/assets/logo-rio-piranhas.png";

declare function fbq(...args: unknown[]): void;

// ─── Helpers ─────────────────────────────────────────────────────────────────

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
    let w = len - 7;
    for (let i = 0; i < len; i++) {
      sum += parseInt(s[i]) * w--;
      if (w < 2) w = 9;
    }
    const r = sum % 11;
    return r < 2 ? 0 : 11 - r;
  };
  return calc(12) === parseInt(s[12]) && calc(13) === parseInt(s[13]);
}

// ─── Constants ───────────────────────────────────────────────────────────────

const SHEETS_URL =
  "https://script.google.com/macros/s/AKfycbxu9fubUQJAekmnmEbvEfuXofW7PEAJ18unuUwyxz-oQ56rF513JSuTihPqq3we77F4Fg/exec";
const CRM_URL = "https://salesyscrm.vercel.app/api/public/leads";
const LEAD_CAPTURE_KEY = "braveo-principal-pixel-001";
const WHATSAPP_NUMBER = "558694271798";

// ─── Schema ──────────────────────────────────────────────────────────────────

const formSchema = z.object({
  nome: z.string().trim().min(2, "Digite seu nome").max(100),
  telefone: z.string().trim().min(10, "WhatsApp inválido").max(20),
  cnpj: z.string().trim().refine(validarCNPJ, { message: "CNPJ inválido" }),
  estado: z.enum(["MA", "PI"], { errorMap: () => ({ message: "Selecione MA ou PI" }) }),
});

type FormData = z.infer<typeof formSchema>;

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

function getFbclid() {
  const p = new URLSearchParams(window.location.search);
  return p.get("fbclid") || "";
}

// ─── Component ───────────────────────────────────────────────────────────────

const HeroSection = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const SDK_SRC = "https://scripts.converteai.net/lib/js/smartplayer-wc/v4/sdk.js";
    if (!document.querySelector(`script[src="${SDK_SRC}"]`)) {
      const script = document.createElement("script");
      script.src = SDK_SRC;
      script.async = true;
      document.head.appendChild(script);
    }
    if (iframeRef.current) {
      const search = location.search || "?";
      const vl = encodeURIComponent(location.href);
      iframeRef.current.src = `https://scripts.converteai.net/0b256e8c-1ea0-49a1-a6c2-4aa9d6840568/players/69c6ee157141a7eb85a52811/v4/embed.html${search}&vl=${vl}`;
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name } = e.target;
    const value =
      name === "cnpj" ? formatarCNPJ(e.target.value)
      : name === "telefone" ? formatarTelefone(e.target.value)
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

    // 1. Meta Pixel — evento Lead
    try {
      fbq("track", "Lead");
    } catch (_) {
      // pixel não carregado em dev
    }

    const fbclid = getFbclid();

    // 2. Envia para o CRM
    try {
      const crmResponse = await fetch(CRM_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          leadCaptureKey: LEAD_CAPTURE_KEY,
          name: data.nome,
          phone: data.telefone.replace(/\D/g, ""),
          document: data.cnpj.replace(/\D/g, ""),
          documentType: "cnpj",
          state: data.estado,
          utm_source: utms.utm_source,
          utm_medium: utms.utm_medium,
          utm_campaign: utms.utm_campaign,
          utm_content: utms.utm_content,
          utm_term: utms.utm_term,
          fbclid,
        }),
      });

      const crmData = await crmResponse.json().catch(() => null);

      if (!crmResponse.ok) {
        console.error("CRM lead capture failed", {
          status: crmResponse.status,
          response: crmData,
        });
      } else if (crmData?.duplicate) {
        console.warn("CRM lead already exists", crmData);
      } else {
        console.info("CRM lead created successfully", crmData);
      }
    } catch (error) {
      console.error("CRM lead capture request error", error);
    }

    // 3. Envia para o Google Sheets
    // Usa mode: 'no-cors' + Content-Type: 'text/plain' para evitar preflight
    // (Apps Script não suporta preflight CORS)
    fetch(SHEETS_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({
        nome: data.nome,
        telefone: data.telefone,
        documento: data.cnpj.replace(/\D/g, ""),
        tipoDocumento: "cnpj",
        estado: data.estado,
        fbclid,
        ...utms,
      }),
    }).catch(() => {
      // falha silenciosa — não bloqueia o lead
    });

    // 4. Redireciona para WhatsApp
    const msg = encodeURIComponent(
      `🍷 *Quero conhecer a condição especial de vinhos!*\n\n` +
        `👤 Nome: ${data.nome}\n` +
        `📱 Telefone: ${data.telefone}\n` +
        `📍 Estado: ${data.estado}\n` +
        `📋 CNPJ: ${data.cnpj}`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
    setIsSubmitting(false);
  };

  const inputClass =
    "w-full bg-blue-medium border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary font-body text-sm md:text-base";

  return (
    <section id="formulario" className="bg-background py-10 md:py-16">
      <div className="container max-w-3xl">

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-8"
        >
          <img src={logo} alt="Rio Piranhas Distribuidora" className="h-12 md:h-16" />
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-4"
        >
          <span className="inline-block bg-primary text-primary-foreground font-display text-xs md:text-sm font-bold px-4 py-2 rounded-sm uppercase tracking-wider">
            🍷 Distribuidora exclusiva — MA e PI
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-2xl sm:text-3xl md:text-5xl font-display font-extrabold uppercase text-center leading-tight mb-4"
        >
          Venda vinho com{" "}
          <span className="text-primary">margem real</span>{" "}
          no seu negócio
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center text-muted-foreground text-sm md:text-base mb-8 max-w-xl mx-auto"
        >
          Assista ao vídeo e descubra como bares, restaurantes e adegas no MA e PI
          estão lucrando mais comprando direto da distribuidora.
        </motion.p>

        {/* Vídeo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
          className="w-full rounded-xl overflow-hidden shadow-2xl shadow-black/40 border border-border mb-8"
        >
          <div style={{ position: "relative", paddingTop: "56.25%" }}>
            <iframe
              ref={iframeRef}
              id="ifr_69c6ee157141a7eb85a52811"
              allowFullScreen
              allow="autoplay; fullscreen"
              referrerPolicy="origin"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: "none",
              }}
            />
          </div>
        </motion.div>

        {/* Formulário */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <div className="text-center mb-6">
            <span className="inline-block bg-primary text-primary-foreground font-display text-xs font-bold px-4 py-2 rounded-sm mb-3 uppercase">
              🔥 Vagas limitadas por região
            </span>
            <h2 className="text-xl sm:text-2xl font-display font-extrabold uppercase">
              Preencha e fale com a gente <span className="text-primary">agora</span>
            </h2>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-card border border-border rounded-xl p-6 md:p-8 space-y-4"
          >
            {/* Nome */}
            <div>
              <input
                type="text"
                name="nome"
                placeholder="Seu nome completo"
                className={inputClass}
                onChange={handleChange}
                maxLength={100}
              />
              {errors.nome && (
                <p className="text-destructive text-sm mt-1">{errors.nome}</p>
              )}
            </div>

            {/* Telefone */}
            <div>
              <input
                type="tel"
                name="telefone"
                placeholder="(00) 00000-0000"
                className={inputClass}
                onChange={handleChange}
                value={formData.telefone ?? ""}
                maxLength={15}
              />
              {errors.telefone && (
                <p className="text-destructive text-sm mt-1">{errors.telefone}</p>
              )}
            </div>

            {/* CNPJ + Estado lado a lado */}
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <input
                  type="text"
                  name="cnpj"
                  placeholder="00.000.000/0000-00"
                  className={inputClass}
                  onChange={handleChange}
                  value={formData.cnpj ?? ""}
                  maxLength={18}
                />
                {errors.cnpj && (
                  <p className="text-destructive text-sm mt-1">{errors.cnpj}</p>
                )}
              </div>
              <div>
                <select
                  name="estado"
                  className={inputClass}
                  onChange={handleChange}
                  defaultValue=""
                >
                  <option value="" disabled>Estado</option>
                  <option value="PI">Piauí</option>
                  <option value="MA">Maranhão</option>
                </select>
                {errors.estado && (
                  <p className="text-destructive text-sm mt-1">{errors.estado}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-primary-foreground font-display text-lg md:text-xl font-bold uppercase py-4 rounded-lg hover:brightness-110 transition-all shadow-lg shadow-primary/30 disabled:opacity-50"
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

export default HeroSection;
