import { useNavigate } from "react-router-dom";
import { Leaf } from "lucide-react";
import { motion } from "framer-motion";
import { BUT, MagneticButton } from "../components/primitives";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="grain relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-forest-950 px-6 text-center text-ivory-50">
      <div aria-hidden className="absolute -left-24 top-1/4 h-80 w-80 rounded-full bg-olive-500/15 blur-[110px]" />
      <div aria-hidden className="absolute -right-24 bottom-1/4 h-80 w-80 rounded-full bg-terra-500/12 blur-[110px]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        <p className="font-display text-[7rem] font-medium leading-none text-outline sm:text-[10rem]">
          404
        </p>
        <span className="my-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-olive-500/20 text-olive-300">
          <Leaf className="h-6 w-6" />
        </span>
        <h1 className="font-display text-3xl font-medium">This path leads to an empty field.</h1>
        <p className="mx-auto mt-3 max-w-sm text-[14px] leading-relaxed text-ivory-100/60">
          The page you're looking for has been moved, renamed, or was never planted.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <MagneticButton onClick={() => navigate("/")} className={BUT.terra}>
            Back to home
          </MagneticButton>
          <MagneticButton onClick={() => navigate("/shop")} className={BUT.ghost}>
            Browse the pantry
          </MagneticButton>
        </div>
      </motion.div>
    </div>
  );
}
