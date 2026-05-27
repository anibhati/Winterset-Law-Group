"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { FIRM } from "@/lib/constants";

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  caseNumber?: string;
  message: string;
}

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>();

  async function onSubmit(data: ContactForm) {
    setError("");
    // TODO: POST to /api/contact (implement email delivery via Nodemailer/Resend)
    try {
      await new Promise((r) => setTimeout(r, 800)); // placeholder delay
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please call us directly.");
    }
  }

  return (
    <>
      <section className="bg-navy-900 text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-gold-500 uppercase tracking-widest text-sm mb-3">Get In Touch</p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Contact Us</h1>
          <div className="h-1 w-16 bg-gold-500 rounded-full"></div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-serif font-bold text-navy-900 mb-6">Contact Our Office</h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              Whether you have questions about your debt, want to discuss payment options, or need to verify
              the legitimacy of a notice you received. Our team is ready to assist.
            </p>

            <div className="space-y-6">
              {[
                {
                  icon: "📞",
                  label: "Phone (Click to Call)",
                  value: FIRM.phone,
                  href: `tel:${FIRM.phone}`,
                },
                {
                  icon: "✉️",
                  label: "Email",
                  value: FIRM.email,
                  href: `mailto:${FIRM.email}`,
                },
                {
                  icon: "💬",
                  label: "Text",
                  value: `Text "${FIRM.smsKeyword}" to ${FIRM.smsNumber}`,
                  href: null,
                },
                {
                  icon: "🕐",
                  label: "Office Hours",
                  value: FIRM.hours,
                  href: null,
                },
              ].map(({ icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-navy-50 flex items-center justify-center flex-shrink-0 text-xl">
                    {icon}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
                    {href ? (
                      <a href={href} className="text-navy-900 font-medium hover:text-gold-600 transition-colors">
                        {value}
                      </a>
                    ) : (
                      <p className="text-navy-900 font-medium">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Verification note — important for FDCPA compliance */}
            <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-800 text-sm font-semibold mb-1">Verify Our Identity</p>
              <p className="text-amber-700 text-xs leading-relaxed">
                If you received a call or notice and want to verify it is from Winterset Law Group, please call us
                directly at {FIRM.phone} or email {FIRM.email}. Never provide personal information to an
                unverified caller.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="card">
            <h3 className="font-serif font-bold text-navy-900 text-xl mb-6">Send Us a Message</h3>

            {submitted ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">✅</div>
                <h4 className="font-serif font-bold text-navy-900 text-xl mb-2">Message Received</h4>
                <p className="text-gray-600">
                  Thank you for reaching out. A member of our team will be in touch within one business day.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      className="input-field"
                      placeholder="Jane Smith"
                      {...register("name", { required: "Name is required" })}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="phone">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      className="input-field"
                      placeholder="(614) 555-0100"
                      {...register("phone")}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="input-field"
                    placeholder="you@example.com"
                    {...register("email", { required: "Email is required" })}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="caseNumber">
                    Case / Account Number (optional)
                  </label>
                  <input
                    id="caseNumber"
                    className="input-field"
                    placeholder="WLG-XXXXXXXX"
                    {...register("caseNumber")}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="message">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    className="input-field resize-none"
                    placeholder="Please describe how we can help you..."
                    {...register("message", { required: "Message is required" })}
                  />
                  {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                </div>

                {error && <p className="text-red-600 text-sm">{error}</p>}

                <p className="text-gray-400 text-xs">
                  Do not include sensitive financial information in this form. A team member will contact you
                  through a secure channel to discuss account specifics.
                </p>

                <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
