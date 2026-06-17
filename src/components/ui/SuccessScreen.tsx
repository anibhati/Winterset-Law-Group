"use client";
import { motion } from "framer-motion";
import Link from "next/link";

interface SuccessScreenProps {
  title: string;
  message: string;
  linkHref: string;
  linkLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}

export default function SuccessScreen({ title, message, linkHref, linkLabel, secondaryHref, secondaryLabel }: SuccessScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
        className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6"
      >
        <motion.svg
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-10 h-10 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M5 13l4 4L19 7"
          />
        </motion.svg>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-xl font-serif font-bold text-navy-900 mb-2"
      >
        {title}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-gray-500 text-sm max-w-sm mb-8 leading-relaxed"
      >
        {message}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col gap-3 w-full max-w-xs"
      >
        <Link
          href={linkHref}
          className="bg-navy-900 hover:bg-navy-800 text-white font-bold py-3 rounded-xl text-sm transition-colors text-center"
        >
          {linkLabel}
        </Link>
        {secondaryHref && secondaryLabel && (
          <Link
            href={secondaryHref}
            className="border-2 border-gray-200 text-gray-600 font-semibold py-3 rounded-xl text-sm hover:border-gray-400 transition-colors text-center"
          >
            {secondaryLabel}
          </Link>
        )}
      </motion.div>
    </div>
  );
}
