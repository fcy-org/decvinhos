import { motion } from "framer-motion";
import { Truck, Tag, Package, Clock } from "lucide-react";

const benefits = [
  { icon: Tag, title: "Preço de distribuidora", desc: "Sem intermediário. Você compra direto e paga menos." },
  { icon: Package, title: "Vinhos que giram", desc: "Rótulos campeões de venda em bares e restaurantes." },
  { icon: Truck, title: "Entrega no MA e PI", desc: "Logística própria para Maranhão e Piauí." },
  { icon: Clock, title: "Condição facilitada", desc: "Prazo, desconto progressivo e atendimento direto." },
];

const OpportunitySection = () => {
  return (
    <section className="py-14 md:py-20 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="inline-block bg-primary text-primary-foreground font-display text-xs md:text-sm font-bold px-4 py-2 rounded-sm mb-4 uppercase">
            Direto da Distribuidora
          </span>
          <h2 className="text-xl sm:text-2xl md:text-4xl font-display font-extrabold uppercase mb-4">
            A Rio Piranhas é o seu{" "}
            <span className="text-primary">atalho pro lucro</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Distribuidora especializada em vinhos de giro para bares, restaurantes,
            adegas e comércios no MA e PI.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border-2 border-primary/20 rounded-xl p-6 text-center hover:border-primary transition-colors duration-200"
            >
              <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-4">
                <b.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-base md:text-lg font-bold uppercase mb-2">{b.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OpportunitySection;
