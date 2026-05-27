import type { Metadata } from "next";
import { FIRM } from "@/lib/constants";

export const metadata: Metadata = { title: "About Us" };

export default function AboutPage() {
  return (
    <div>
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
                A debt owed to the State of Ohio is rarely simple, and rarely welcome news. Our work is to make it clear and resolvable. The Winterset Law Group "People First" philosophy guides how we explain accounts, how we structure payment options, and how we treat every person who calls.
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
                Ohio Revised Code &sect; 109.08 grants the Attorney General the authority to appoint Special Counsel,
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

          {/* Sidebar: Team */}
          <aside className="space-y-6">
            {[
              { name: "Christopher J. Stevens", title: "Managing Partner", phone: "614.453.1203", email: "christopher.stevens@wintersetlawgroup.com" },
              { name: "Phil Higginbotham", title: null, phone: "614.453.1212", email: "phil.higginbotham@wintersetlawgroup.com" },
              { name: "Jake Luttmer", title: null, phone: "614.453.1205", email: "jake.luttmer@wintersetlawgroup.com" },
              { name: "Tyler Groomes", title: null, phone: "614-453-1200", email: "tyler.groomes@wintersetlawgroup.com" },
              { name: "Asmaa Aoudjit", title: null, phone: "614-453-1200", email: "asmaa.aoudjit@wintersetlawgroup.com" },
              { name: "Jack Stanovic", title: null, phone: "614-453-1200", email: "jack.stanovic@wintersetlawgroup.com" },
              { name: "Kaitlyn Mincey", title: null, phone: "614-453-1200", email: "kaitlyn.mincey@wintersetlawgroup.com" },
              { name: "Rafik Zanoun", title: null, phone: "614-453-1200", email: "rafik.zanoun@wintersetlawgroup.com" },
              { name: "Aniruddha Singh Bhati", title: null, phone: "614-453-1200", email: "ani.bhati@wintersetlawgroup.com" },
            ].map((member) => (
              <div key={member.name} className="card">
                <div className="w-14 h-14 rounded-full bg-navy-100 mx-auto mb-3 flex items-center justify-center">
                  <span className="text-2xl font-serif font-bold text-navy-900">
                    {member.name.charAt(0)}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-navy-900 text-base text-center mb-1">
                  {member.name}
                </h3>
                {member.title && (
                  <p className="text-gold-500 text-xs text-center mb-3">{member.title}</p>
                )}
                <div className="h-px bg-gray-100 mb-3 mt-3"></div>
                <div className="text-xs text-gray-600 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Phone:</span>
                    <span>{member.phone}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="font-medium text-gray-700 shrink-0">Email:</span>
                    <a href={`mailto:${member.email}`} className="text-gold-500 hover:underline truncate">
                      {member.email}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </aside>
        </div>
      </div>
    </div>
  );
}