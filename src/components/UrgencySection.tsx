import { motion } from "framer-motion";
import { Shield, Clock, Award } from "lucide-react";

const guarantees = [
  {
    icon: Shield,
    title: "Sem risco",
    desc: "Faça um primeiro pedido e comprove",
  },
  {
    icon: Clock,
    title: "Atendimento rápido",
    desc: "Resposta em até 2 horas no WhatsApp",
  },
  {
    icon: Award,
    title: "Condição exclusiva",
    desc: "Preços especiais para novos parceiros",
  },
];

const UrgencySection = () => {
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
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-xl sm:text-2xl md:text-4xl font-display font-extrabold uppercase mb-8 leading-tight">
            Cada dia sem a{" "}
            <span className="text-primary">condição certa</span> é dinheiro que você{" "}
            <span className="text-destructive">deixa na mesa</span>
          </h2>

          <div className="grid sm:grid-cols-3 gap-6 my-8">
            {guarantees.map((g, i) => (
              <motion.div
                key={g.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center gap-3"
              >
                <g.icon className="w-10 h-10 text-primary" />
                <p className="font-display font-bold uppercase text-sm md:text-base">{g.title}</p>
                <p className="text-muted-foreground text-sm">{g.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35 }}
          >
            <button
              onClick={scrollToForm}
              className="w-full sm:w-auto bg-primary text-primary-foreground font-display text-base md:text-xl font-bold uppercase px-10 py-4 rounded-lg hover:brightness-110 transition-all shadow-lg shadow-primary/30 animate-pulse-cta"
            >
              FALAR COM A RIO PIRANHAS AGORA →
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default UrgencySection;
