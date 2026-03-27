import { motion } from "framer-motion";
import { Store, MapPin, Wine } from "lucide-react";

const criteria = [
  {
    icon: Store,
    title: "Tem CNPJ ativo",
    desc: "Bar, restaurante, adega, mercadinho ou comércio de bebidas.",
  },
  {
    icon: MapPin,
    title: "Está no MA ou PI",
    desc: "Atendemos todo o Maranhão e Piauí com entrega própria.",
  },
  {
    icon: Wine,
    title: "Quer vender vinho",
    desc: "Quer aumentar o ticket médio com vinho que gira rápido.",
  },
];

const FilterSection = () => {
  const scrollToForm = () => {
    document.getElementById("formulario")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-14 md:py-20 bg-secondary">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-xl sm:text-2xl md:text-4xl font-display font-extrabold uppercase mb-3">
            Essa condição é <span className="text-primary">pra você</span>?
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            Essa oferta é exclusiva para quem se encaixa nesses critérios:
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
          {criteria.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border-2 border-primary rounded-xl p-6 md:p-8 text-center"
            >
              <c.icon className="w-10 h-10 md:w-12 md:h-12 text-primary mx-auto mb-4" />
              <h3 className="font-display text-base md:text-lg font-bold uppercase mb-2">{c.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{c.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35 }}
          className="text-center mt-10"
        >
          <p className="text-muted-foreground mb-5 text-sm md:text-base">
            Se você se encaixa nos 3 critérios acima:
          </p>
          <button
            onClick={scrollToForm}
            className="w-full sm:w-auto bg-primary text-primary-foreground font-display text-base md:text-lg font-bold uppercase px-10 py-4 rounded-lg hover:brightness-110 transition-all shadow-lg shadow-primary/30 animate-pulse-cta"
          >
            SIM, QUERO A CONDIÇÃO ESPECIAL →
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default FilterSection;
