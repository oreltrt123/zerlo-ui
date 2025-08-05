import React from "react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <main 
    className="min-h-screen py-12 px-6"
    style={{
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    background: "linear-gradient(90deg, rgba(235, 247, 255, 1) 0%, rgba(214, 239, 255, 1) 35%, rgba(255, 255, 255, 1) 100%)",
      }}
    >
      <div className="max-w-3xl mx-auto bg-white rounded-lg p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">PRIVACY STATEMENT</h1>
        </div>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-900">What information do we collect?</h2>
          <p>
            We collect personal data that you provide to us, such as your name, email address, and other contact
            information, when you contact us through our website or by email. We also automatically collect certain
            information about your visit to our website, including your IP address, the date and time of your visit, the
            pages you visit, and the website you visited before our website.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-900">How do we use your information?</h2>
          <p>
            We use your personal data to respond to your inquiries, provide you with information about our services, and
            improve our website. We also use the information we automatically collect about your visit to our website to
            analyze trends, administer the site, track user movements, and gather demographic information.
          </p>
          <p className="mt-4">
            <strong className="text-gray-900">How do we share your information?</strong><br />
            We do not sell, trade, or rent your personal data to third parties. We may share your personal data with our
            service providers who help us operate our website and provide our services, but only to the extent necessary
            for them to perform their services for us. We may also disclose your personal data if we are required to do
            so by law, or if we believe in good faith that such disclosure is necessary to comply with legal obligations,
            respond to a legal claim, protect our rights or property, or protect the safety of others.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-900">Your rights</h2>
          <p>You have the right to access, correct, or delete your personal data.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-900">Updates to this policy</h2>
          <p>
            We may update our privacy statement from time to time. We will notify you of any changes by posting the new
            privacy statement on our website.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2 text-gray-900">Contact us</h2>
          <p>
            If you have any questions or concerns about our privacy statement or our processing of your personal data,
            please contact us at{" "}
            <Link href="mailto:zerlocontactus@gmail.com" className="text-[#0099FF] underline">
              zerlocontactus@gmail.com
            </Link>
            .
          </p>
        </section>
      </div>
    </main>
  );
};
