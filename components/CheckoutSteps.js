import { Check } from "lucide-react";

const STEPS = ["Panier", "Coordonnées", "Confirmation"];

export default function CheckoutSteps({ current }) {
  return (
    <ol aria-label="Étapes de la commande" className="mb-7 flex items-center gap-2 text-sm">
      {STEPS.map((label, index) => (
        <li key={label} aria-current={index === current ? "step" : undefined} className="flex items-center gap-2">
          <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${index <= current ? "bg-brand text-white" : "bg-paper text-muted"}`}>
            {index < current ? <Check size={14} /> : index + 1}
          </span>
          <span className={index === current ? "font-semibold" : "hidden text-muted sm:inline"}>{label}</span>
          {index < STEPS.length - 1 && <span aria-hidden="true" className="h-px w-5 bg-line sm:w-10" />}
        </li>
      ))}
    </ol>
  );
}
