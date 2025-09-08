"use client";
import "@/styles/button.css"

export default function NewsLetter() {
  return (
    <main
    style={{
      backgroundSize: "100% auto", // full width, auto height
      backgroundPosition: "center -130px", // move image down
      backgroundRepeat: "no-repeat",
      backgroundImage: 'url("/assets/images/bg.jpg")'
    }}
    className="min-h-screen text-black flex flex-col items-center px-6 py-12"
    >
    <div className="relative top-[50px]">
        {/* Header */}
      <header className="w-full max-w-4xl mb-12 text-center">
        <h1 className="text-4xl font-sans font-light italic">Security <span className="bg-[#0099ff34] px-2.5 py-0.5 rounded-xl text-lg"><span className="relative left-[-2px]">Beta</span></span></h1>
          {/* <p className="text-gray-900 text-lg leading-relaxed font-sans font-light italic">
          Protect your projects with our new security system
        </p> */}
      </header>

      {/* Content */}
      <div className="w-full max-w-4xl space-y-10 text-left">
        <section>
          <h2 className="text-3xl font-sans font-light italic mb-4">
            Building Games with Security
          </h2>
          <p className="text-gray-900 text-lg font-light leading-relaxed">
            At our core, we believe that security is not just an optional feature—it is a foundation.
            In todays world, security plays a critical role across every field, from protecting sensitive
            corporate projects to safeguarding creative works such as films, games, and software. Many of
            the worlds leading companies have succeeded by building their products and operations in secure
            environments, ensuring their ideas and intellectual property remain protected until they are ready to be shared.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-sans font-light italic mb-4">
            What Beta Security Means
          </h2>
          <p className="text-gray-900 text-lg font-light leading-relaxed">
            With Beta Security, you can activate protection for your projects by securing your chat with a
            password of your choice. Passwords must be at least six words long, and the longer and more
            complex they are, the harder they will be to crack. Our vision is to achieve a level of protection
            where your projects remain fully secure, even in the unlikely event of an attempted hack.
          </p>
          <p className="text-gray-900 text-lg font-light leading-relaxed mt-4">
            Just as platforms like Google implement step-by-step authentication to safeguard user accounts,
            we are working towards a similar standard for game creation. Currently in beta, this feature allows
            users to experiment with a step-by-step learning system designed to strengthen security measures,
            with more refinements on the way.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-sans font-light italic mb-4">
            Why It Matters
          </h2>
          <p className="text-gray-900 text-lg font-light leading-relaxed">
            If you are working on a new game today, the last thing you want is for your ideas to fall into
            the wrong hands. With Beta Security enabled, unauthorized access becomes significantly harder.
            Even if someone attempts to breach your account, they will face multiple layers of defense before
            even coming close to your project.
          </p>
          <p className="text-gray-900 text-lg font-light leading-relaxed">
            Our mission is clear: before we provide you with the tools to build amazing games with AI, we
            first ensure that the environment you build in is safe. By securing your information, we give you
            the confidence to create freely without fear of losing control over your work.
          </p>
        </section>

        <section>
          <p className="text-gray-900 text-lg font-light leading-relaxed">
            If youd like to try it, or if youve already explored our Beta Security program, know that your
            projects are encrypted and waiting for you in a secure environment. This is only the beginning—we
            are constantly working to make our platform safer, stronger, and more reliable for every creator.
          </p>
        </section>

        {/* Start button */}
        <div className="mt-10 text-center">
          <button
            onClick={() => (window.location.href = "/chat")}
            className="cursor-pointer px-8 py-4 bg-[#0099ffb2] hover:bg-[#0099ffbe] text-white rounded-full text-lg font-semibold transition-all duration-300 r2552esf25_252trewt3erblueFontDocs"
          >
            Start Using Security
          </button>
        </div>
      </div>
    </div>
  </main>
  );
}
