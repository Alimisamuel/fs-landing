import React from "react";

const page = () => {
  return (
  <>
  <div className="">
      <div className="px-5 md:px-8 py-4 md:py-4">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Terms of Use
          </h1>
          <p className=" leading-relaxed">
            Welcome to the official website of House of Faith (“we,” “our,” or “us”).
            This website provides faith-based information, ministry updates, and an
            optional platform for visitors to make voluntary donations in support
            of our mission.
          </p>
          <p className=" leading-relaxed mt-3">
            By accessing or using this website, you agree to these Terms of Use.
          </p>
        </div>

        {/* Donations */}
        <Section title="1. Donations">
          <p>
            Donations made through the House of Faith website are voluntary
            contributions used to support our ministry, outreach, community
            programs, and operational needs.
          </p>
          <p>
            Donations are non-refundable, except in cases of proven duplicate
            charges or verified technical errors.
          </p>
          <p>
            Donations do not grant access to exclusive services, products, or
            any special privileges. This website does not sell products or offer
            subscription-based services.
          </p>
        </Section>

        {/* Services */}
        <Section title="2. House of Faith Services">
          <p>
            The House of Faith website provides informational, devotional, and
            ministry-related content for personal spiritual enrichment.
          </p>
          <p>
            All content provided is for personal and non-commercial use. You may
            not reproduce or distribute any material without written permission.
          </p>
          <p>
            Website content may be updated or modified at any time without prior
            notice.
          </p>
        </Section>

        {/* Conduct */}
        <Section title="3. Community Conduct">
          <p>
            Users must engage respectfully when interacting with any forms,
            messages, or communication channels on the website. Misuse or
            offensive behavior may lead to restricted access.
          </p>
          <p>
            You agree not to tamper with, hack, or disrupt the website or its
            features.
          </p>
        </Section>

        {/* Privacy */}
        <Section title="4. Privacy">
          <p>
            House of Faith values your privacy. Please review our Privacy Policy
            to understand how we collect, use, and protect your personal
            information.
          </p>
          <p>
            By using this website, you consent to receive essential
            communications, including donation confirmations or ministry-related
            updates.
          </p>
        </Section>

        {/* Donation Disclaimer */}
        <Section title="5. Donation Disclaimer">
          <p>
            Donations made to House of Faith are charitable contributions
            intended solely to support our ministry and community outreach
            programs.
          </p>
          <p>
            House of Faith does not guarantee any financial return, reward, or
            material benefit in exchange for donations. Donations are not
            investments and should not be treated as such.
          </p>
          <p>
            Donors acknowledge that they are giving freely and without
            expectation of compensation or special treatment.
          </p>
          <p>
            House of Faith is not responsible for donor errors, such as incorrect
            amounts or duplicate submissions made by the donor.
          </p>
          <p>
            Donation receipts may be issued electronically and may be used for
            personal record-keeping purposes. Tax deductibility depends on local
            laws and is the donor’s responsibility to verify.
          </p>
        </Section>

        {/* Liability */}
        <Section title="6. Warranties and Limitation of Liability">
          <p>
            This website is provided “as is” and “as available,” without
            warranties of any kind.
          </p>
          <p>
            House of Faith is not liable for indirect or consequential damages
            resulting from the use of, or inability to access, the website.
          </p>
        </Section>

        {/* Governing Law */}
        <Section title="7. Governing Law">
          <p>
            These Terms are governed by the laws of the Federal Republic of
            Nigeria. Disputes will be resolved exclusively in Nigerian courts.
          </p>
        </Section>

        {/* Changes */}
        <Section title="8. Changes to Terms of Use">
          <p>
            We may update these Terms from time to time. Continued use of the
            website indicates acceptance of the revised Terms.
          </p>
        </Section>

        {/* Footer */}
        <div className="mt-12 text-sm text-gray-400">
          Last Updated: {new Date().getFullYear()}
        </div>
      </div>
    </div>
  </>
  );
};

export default page;


const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="mb-10">
    <h2 className="text-xl md:text-2xl font-semibold text-white mb-3">
      {title}
    </h2>
    <div className="text-white leading-relaxed space-y-3 text-[15px]">
      {children}
    </div>
  </section>
);