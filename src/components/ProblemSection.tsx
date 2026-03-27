import { motion } from "framer-motion";
import { DollarSign, TrendingDown, XCircle } from "lucide-react";

const problems = [
  {
    icon: DollarSign,
    title: "Compra caro demais",
    description: "Paga preço de varejo e tenta revender. A margem some antes de chegar no caixa.",
  },
  {
    icon: TrendingDown,
    title: "Produto encalha",
    description: "Compra vinho errado, que não gira. O dinheiro fica parado na prateleira.",
  },
  {
    icon: XCircle,
    title: "Sem fornecedor confiável",
    description: "Depende de representante que some, não entrega no prazo e não dá condição.",
  },
];

const ProblemSection = () => {
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
            Você reconhece algum desses{" "}
            <span className="text-primary">problemas</span>?
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            Se sim, você está perdendo dinheiro todo mês.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {problems.map((problem, i) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="bg-card border border-border rounded-xl p-6 md:p-8 flex flex-col gap-4"
            >
              <div className="w-12 h-12 rounded-lg bg-destructive/20 flex items-center justify-center flex-shrink-0">
                <problem.icon className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold uppercase mb-2">{problem.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{problem.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-10"
        >
          <p className="text-primary font-display text-lg sm:text-xl md:text-2xl font-bold uppercase">
            💸 Enquanto você paga caro, seu concorrente já compra direto.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ProblemSection;
