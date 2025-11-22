import { SiteHeader } from "@/components/site-header";
import { AppverseFooter } from "@/components/appverse-footer";

export default function RevisionPolicyPage() {
  return (
    <>
      <SiteHeader />
      <section className="bg-[#08090A] text-[#F4F7F5] py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl border border-[#1F2329] bg-[#0F1113]/80 p-6 sm:p-10 shadow-xl animate-fade-in-up">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(0,140,226,0.10),transparent_55%)]" />
              <div className="relative space-y-12">
                <header className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tight text-[#008CE2]">Revision Policy</h1>
                  <p className="text-[#F4F7F5]/70 text-lg">
                    Our revision policy ensures transparency and fairness for all clients while maintaining the quality and efficiency of our work.
                  </p>
                </header>

                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-[#F4F7F5]">1. Included Revisions</h2>
                  <p className="text-[#F4F7F5]/80">
                    Each plan includes a set number of revisions as listed in its respective tier:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-[#F4F7F5]/70">
                    <li>Startup Plan: 2 revisions included</li>
                    <li>Pro Plan: 4 revisions included</li>
                    <li>Premium Plan: Unlimited revisions within the agreed project scope</li>
                  </ul>
                </section>

                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-[#F4F7F5]">2. Additional Revisions</h2>
                  <p className="text-[#F4F7F5]/80">
                    Any revisions beyond the included amount will be charged at the following hourly rates:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-[#F4F7F5]/70">
                    <li>Startup Plan: $35/hour</li>
                    <li>Pro Plan: $55/hour</li>
                    <li>Premium Plan: $60/hour</li>
                  </ul>
                </section>

                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-[#F4F7F5]">3. Scope of Revisions</h2>
                  <p className="text-[#F4F7F5]/80">
                    Revisions are meant to refine and adjust the agreed deliverables, not to expand the original scope of work. Significant changes or additions will require a new project agreement.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-[#F4F7F5]">4. Turnaround Time</h2>
                  <p className="text-[#F4F7F5]/80">
                    The turnaround time for revisions will depend on the complexity of the requested changes and current project workload.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-[#F4F7F5]">5. Contact Us</h2>
                  <p className="text-[#F4F7F5]/80">
                    For questions regarding our revision policy, please contact us at:
                  </p>
                  <p className="text-[#F4F7F5]/80">
                    Email: <a href="mailto:hello@pqrix.com" className="text-[#008CE2] underline hover:text-[#06B9D0] transition-colors duration-300">hello@pqrix.com</a>
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>
      </section>
      <AppverseFooter />
    </>
  );
}
