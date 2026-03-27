import { motion } from "framer-motion";
import barImg from "@/assets/bar-context.jpg";

const NumbersSection = () => {
  return (
    <section className="py-14 md:py-20 bg-secondary relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <img src={barImg} alt="" className="w-full h-full object-cover" loading="lazy" width={1280} height={720} />
      </div>
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-xl sm:text-2xl md:text-4xl font-display font-extrabold uppercase mb-2">
            Faça as contas e veja o{" "}
            <span className="text-primary">quanto você está perdendo</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Sem Rio Piranhas */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card border border-destructive/40 rounded-xl p-6 md:p-8"
          >
            <h3 className="font-display text-lg font-bold uppercase text-destructive mb-6 text-center">
              ❌ Sem a Rio Piranhas
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-border pb-3">
                <span className="text-muted-foreground text-sm">Custo por garrafa</span>
                <span className="font-display text-2xl font-bold">R$25</span>
              </div>
              <div className="flex justify-between items-center border-b border-border pb-3">
                <span className="text-muted-foreground text-sm">Vende por</span>
                <span className="font-display text-2xl font-bold">R$45</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Margem</span>
                <span className="font-display text-2xl font-bold text-destructive">R$20</span>
              </div>
            </div>
          </motion.div>

          {/* Com Rio Piranhas */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card border-2 border-primary rounded-xl p-6 md:p-8 relative"
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground font-display text-xs font-bold px-4 py-1 rounded-sm uppercase whitespace-nowrap">
              Mais lucro
            </div>
            <h3 className="font-display text-lg font-bold uppercase text-primary mb-6 text-center">
              ✅ Com a Rio Piranhas
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-border pb-3">
                <span className="text-muted-foreground text-sm">Custo por garrafa</span>
                <span className="font-display text-2xl font-bold text-primary">R$15</span>
              </div>
              <div className="flex justify-between items-center border-b border-border pb-3">
                <span className="text-muted-foreground text-sm">Vende por</span>
                <span className="font-display text-2xl font-bold">R$45</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Margem</span>
                <span className="font-display text-2xl font-bold text-success">R$30</span>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-10 font-display text-lg sm:text-xl md:text-2xl font-bold uppercase text-primary px-4"
        >
          💰 São R$10 a mais por garrafa. Em 100 garrafas = R$1.000 a mais no seu bolso!
        </motion.p>
      </div>
    </section>
  );
};

export default NumbersSection;
