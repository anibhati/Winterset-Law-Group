import type { Metadata } from "next";
import { FIRM } from "@/lib/constants";

export const metadata: Metadata = { title: "About Us" };

export default function AboutPage() {
  return (
    <div className="py-16">
      {/* Page Header */}
      <section className="bg-navy-900 text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-gold-500 uppercase tracking-widest text-sm mb-3">Who We Are</p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">About Winterset Law Group</h1>
          <div className="h-1 w-16 bg-gold-500 rounded-full"></div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Mission */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-navy-900 mb-4">Our Mission</h2>
              <div className="gold-divider mb-6"></div>
              <p className="text-gray-700 leading-relaxed mb-4">
                At Winterset Law Group, we believe that navigating a debt obligation to the State of Ohio doesn&apos;t have to be an overwhelming or frightening experience. Our &ldquo;People First&rdquo; philosophy guides everything we do, from the way we explain your account to the flexible payment solutions we help you build.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We are dedicated to treating every individual with dignity and respect, providing clear and honest
                communication, and working toward resolutions that are fair and achievable. Our goal is not just to
                collect. It is to help you move forward.
              </p>
            </section>

            {/* History */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-navy-900 mb-4">Our History</h2>
              <div className="gold-divider mb-6"></div>
              <p className="text-gray-700 leading-relaxed mb-4">
                {FIRM.name} has served as Special Counsel to the Ohio Attorney General&apos;s Office since{" "}
                {FIRM.servingSince}. Under Ohio Revised Code 109.08, the Attorney General is authorized to appoint
                private attorneys as Special Counsel to represent the State in the collection of claims certified to
                the AG&apos;s Office for enforcement.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Over the decades, WLG has built a reputation for professionalism, fairness, and effectiveness,
                setting what we believe is the gold standard among Special Counsel firms in Ohio.
              </p>
            </section>

            {/* ORC 109.08 Explanation */}
            <section className="bg-gray-50 rounded-xl p-8 border-l-4 border-gold-500">
              <h3 className="font-serif font-bold text-navy-900 text-xl mb-3">
                Understanding ORC 109.08 &amp; Special Counsel
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed mb-3">
                Ohio Revised Code § 109.08 grants the Attorney General the authority to appoint Special Counsel,
                private law firms, to assist with collection of debts owed to the State of Ohio. These debts are
                first certified to the AG&apos;s Office by the originating state agency (such as the Department of
                Taxation or Department of Job and Family Services) before being assigned to Special Counsel for
                collection action.
              </p>
              <p className="text-gray-700 text-sm leading-relaxed">
                As Special Counsel, WLG acts on behalf of the State of Ohio under the direction and oversight of
                the Attorney General&apos;s Tax Division. We are authorized to negotiate payment arrangements, accept
                payments on behalf of the State, and pursue legal remedies as necessary.
              </p>
            </section>
          </div>

          {/* Sidebar: Partner Bio */}
          <aside>
            <div className="card sticky top-24">
              <div className="w-24 h-24 rounded-full bg-navy-100 mx-auto mb-4 flex items-center justify-center">
                {/* Replace with actual photo: <Image src="/images/stevens.jpg" alt="Christopher J. Stevens" ... /> */}
                <span className="text-4xl">⚖️</span>
              </div>
              <h3 className="font-serif font-bold text-navy-900 text-xl text-center mb-1">
                {FIRM.partner.name}
              </h3>
              <p className="text-gold-500 text-sm text-center mb-4">{FIRM.partner.title}</p>
              <div className="h-px bg-gray-100 mb-4"></div>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Licensed:</span>
                  <span>Ohio Bar</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Role:</span>
                  <span>Special Counsel, Ohio AG</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Since:</span>
                  <span>{FIRM.servingSince}</span>
                </div>
              </div>
              <div className="h-px bg-gray-100 my-4"></div>
              <p className="text-gray-600 text-xs leading-relaxed">
                {FIRM.partner.name} has led Winterset Law Group&apos;s representation of the State of Ohio since
                the firm&apos;s founding. He is committed to the firm&apos;s &ldquo;People First&rdquo; mission and brings
                decades of experience in Ohio debt resolution.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
