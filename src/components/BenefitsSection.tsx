import { motion } from "framer-motion";
import { Check } from "lucide-react";

const items = [
  "Preço direto de distribuidora (sem intermediário)",
  "Vinhos que vendem rápido no balcão",
  "Entrega em todo Maranhão e Piauí",
  "Condição de pagamento facilitada",
  "Atendimento direto via WhatsApp",
  "Suporte para montar seu mix de vinhos",
  "Desconto progressivo por volume",
  "Sem pedido mínimo abusivo",
];

const BenefitsSection = () => {
  const scrollToForm = () => {
    document.getElementById("formulario")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-14 md:py-20 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-xl sm:text-2xl md:text-4xl font-display font-extrabold uppercase">
            O que você <span className="text-primary">ganha</span> comprando com a Rio Piranhas
          </h2>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          {items.map((item, i) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="flex items-center gap-4 py-3 border-b border-border last:border-0"
            >
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-base md:text-lg font-medium">{item}</span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <button
            onClick={scrollToForm}
            className="w-full sm:w-auto bg-primary text-primary-foreground font-display text-base md:text-lg font-bold uppercase px-10 py-4 rounded-lg hover:brightness-110 transition-all shadow-lg shadow-primary/30"
          >
            QUERO ESSA CONDIÇÃO →
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default BenefitsSection;
