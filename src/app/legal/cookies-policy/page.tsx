import React from 'react'




const page = () => {
  return (
    <div className="!text-white">
      <div className="mx-auto px-5 md:px-8 py-4 md:py-4">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Cookies Policy
          </h1>
          <p className=" leading-relaxed">
            At Faithstream, we value your privacy and are committed to being
            transparent about how we use cookies and similar technologies on
            our website and mobile platforms. This Cookies Policy explains what
            cookies are, how we use them, and how you can manage your
            preferences.
          </p>
        </div>

        {/* What are cookies */}
        <Section title="What Are Cookies?">
          <p>
            Cookies are small text files placed on your device when you visit
            our website or use our app. They help us remember your preferences,
            enhance your viewing experience, and understand how our platform is
            used.
          </p>
        </Section>

        {/* How we use cookies */}
        <Section title="How We Use Cookies">
          <p>We use cookies for the following purposes:</p>

          {/* Essential */}
          <div className="mt-4">
            <h3 className="font-semibold mb-2">
              1. Essential Cookies
            </h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Secure login and account authentication</li>
              <li>Subscription management</li>
              <li>Video streaming functionality</li>
              <li>Secure payment processing</li>
            </ul>
            <p className="mt-2 ">
              Without these cookies, certain services may not be available.
            </p>
          </div>

          {/* Performance */}
          <div className="mt-6">
            <h3 className="font-semibold mb-2">
              2. Performance Cookies
            </h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Monitor streaming performance</li>
              <li>Improve navigation and page load speed</li>
              <li>Identify and fix technical issues</li>
            </ul>
          </div>

          {/* Functional */}
          <div className="mt-6">
            <h3 className="font-semibold mb-2">
              3. Functional Cookies
            </h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Language settings</li>
              <li>Recently watched content</li>
              <li>
                Preferred categories (sermons, worship, devotionals, Christian
                movies)
              </li>
            </ul>
          </div>

          {/* Ads */}
          <div className="mt-6">
            <h3 className="font-semibold mb-2">
              4. Advertising & Analytics Cookies
            </h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Measure effectiveness of campaigns</li>
              <li>Show relevant content recommendations</li>
              <li>Understand audience engagement trends</li>
            </ul>
            <p className="mt-2">
              We may use trusted analytics services to better understand how
              users engage with Faithstream.
            </p>
          </div>
        </Section>

        {/* Third party */}
        <Section title="Third-Party Cookies">
          <p>
            We may allow trusted third-party service providers such as analytics
            platforms, payment processors, or content delivery partners to place
            cookies on your device to support secure streaming, platform
            performance, and service improvement.
          </p>
        </Section>

        {/* Manage */}
        <Section title="Managing Your Cookie Preferences">
          <p>
            You can accept, reject, or modify your cookie preferences at any
            time through your browser settings or in-app settings (where
            available). Disabling certain cookies may affect streaming quality,
            personalization features, or account functionality.
          </p>
        </Section>

        {/* Changes */}
        <Section title="Changes to This Policy">
          <p>
            We may update this Cookies Policy periodically to reflect changes in
            technology, legal requirements, or our services. Any updates will be
            posted on this page with a revised “Last Updated” date.
          </p>
        </Section>

        {/* Contact */}
        <Section title="Contact Us">
          <p>If you have any questions about this Cookies Policy, contact us:</p>

          <div className="mt-3 bg-gray-300 border rounded-xl text-black p-4">
            <p className="font-medium">Faithstream Support</p>
            <p className="">support@ahouseoffaith.com</p>
          </div>
        </Section>

        {/* Footer */}
        <div className="mt-12 text-sm text-gray-400">
          Last Updated: {new Date().getFullYear()}
        </div>
      </div>
    </div>
  )
}

export default page


const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="mb-8 text-white">
    <h2 className="text-xl md:text-2xl font-semibold mb-3">
      {title}
    </h2>
    <div className=" leading-relaxed space-y-3 text-[15px]">
      {children}
    </div>
  </section>
);
