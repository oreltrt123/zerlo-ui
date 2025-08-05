import Navbar from "@/components/navbar";
import Footer from "@/components/sections/footer";
import Image from "next/image"; // Import Image from next/image

export default function Features() {
  return (
    <div>
      <Navbar />
      <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="p-8 bg-[#8888881A] rounded-2xl">
            <div className="max-w-md text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full sm:w-16 sm:h-16">
                <Image
                  className="w-8 h-8 sm:w-12 sm:h-12"
                  src="/assets/images/features/instant-game-creation.png"
                  alt="Instant Game Creation"
                  width={48} // Specify width (12 * 4 for sm, adjust as needed)
                  height={48} // Specify height (12 * 4 for sm, adjust as needed)
                />
              </div>
              <h6 className="mb-2 font-semibold leading-5">Instant Game Creation</h6>
              <p className="mb-3 text-sm text-gray-900">
                Zerlo harnesses AI to generate fully functional games in seconds, turning your ideas into playable experiences with unmatched speed.
              </p>
            </div>
          </div>
          <div className="p-8 bg-[#8888881A] rounded-2xl">
            <div className="max-w-md text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full sm:w-16 sm:h-16">
                <Image
                  className="w-8 h-8 sm:w-12 sm:h-12"
                  src="/assets/images/features/customizable-game-templates.png"
                  alt="Customizable Game Templates"
                  width={48}
                  height={48}
                />
              </div>
              <h6 className="mb-2 font-semibold leading-5">Customizable Game Templates</h6>
              <p className="mb-3 text-sm text-gray-900">
                Choose from a variety of pre-designed templates to kickstart your game development, tailoring every detail to match your vision.
              </p>
            </div>
          </div>
          <div className="p-8 bg-[#8888881A] rounded-2xl">
            <div className="max-w-md text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full sm:w-16 sm:h-16">
                <Image
                  className="w-8 h-8 sm:w-12 sm:h-12"
                  src="/assets/images/features/ai-driven-design.png"
                  alt="AI-Driven Design Assistance"
                  width={48}
                  height={48}
                />
              </div>
              <h6 className="mb-2 font-semibold leading-5">AI-Driven Design Assistance</h6>
              <p className="mb-3 text-sm text-gray-900">
                Our intelligent AI suggests assets, mechanics, and visuals, streamlining the creative process for developers of all skill levels.
              </p>
            </div>
          </div>
          <div className="p-8 bg-[#8888881A] rounded-2xl">
            <div className="max-w-md text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full sm:w-16 sm:h-16">
                <Image
                  className="w-8 h-8 sm:w-12 sm:h-12"
                  src="/assets/images/features/cross-platform.png"
                  alt="Cross-Platform Compatibility"
                  width={48}
                  height={48}
                />
              </div>
              <h6 className="mb-2 font-semibold leading-5">Cross-Platform Compatibility</h6>
              <p className="mb-3 text-sm text-gray-900">
                Build games that run seamlessly on web, mobile, and desktop, ensuring your creations reach players on any device.
              </p>
            </div>
          </div>
          <div className="p-8 bg-[#8888881A] rounded-2xl">
            <div className="max-w-md text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full sm:w-16 sm:h-16">
                <Image
                  className="w-8 h-8 sm:w-12 sm:h-12"
                  src="/assets/images/features/real-time-collaboration.png"
                  alt="Real-Time Collaboration"
                  width={48}
                  height={48}
                />
              </div>
              <h6 className="mb-2 font-semibold leading-5">Real-Time Collaboration</h6>
              <p className="mb-3 text-sm text-gray-900">
                Work with your team in real-time to refine game elements, share ideas, and iterate quickly within Zerlo’s collaborative environment.
              </p>
            </div>
          </div>
          <div className="p-8 bg-[#8888881A] rounded-2xl">
            <div className="max-w-md text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full sm:w-16 sm:h-16">
                <Image
                  className="w-8 h-8 sm:w-12 sm:h-12"
                  src="/assets/images/features/instant-prototyping.png"
                  alt="Instant Prototyping"
                  width={48}
                  height={48}
                />
              </div>
              <h6 className="mb-2 font-semibold leading-5">Instant Prototyping</h6>
              <p className="mb-3 text-sm text-gray-900">
                Test your game concepts instantly with Zerlo’s prototyping tools, allowing you to iterate and refine without delays.
              </p>
            </div>
          </div>
          <div className="p-8 bg-[#8888881A] rounded-2xl">
            <div className="max-w-md text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full sm:w-16 sm:h-16">
                <Image
                  className="w-8 h-8 sm:w-12 sm:h-12"
                  src="/assets/images/features/dynamic-asset-generation.png"
                  alt="Dynamic Asset Generation"
                  width={48}
                  height={48}
                />
              </div>
              <h6 className="mb-2 font-semibold leading-5">Dynamic Asset Generation</h6>
              <p className="mb-3 text-sm text-gray-900">
                Zerlo’s AI creates custom sprites, backgrounds, and sound effects on-demand, tailored to your game’s unique style and theme.
              </p>
            </div>
          </div>
          <div className="p-8 bg-[#8888881A] rounded-2xl">
            <div className="max-w-md text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full sm:w-16 sm:h-16">
                <Image
                  className="w-8 h-8 sm:w-12 sm:h-12"
                  src="/assets/images/features/intuitive-visual-editor.png"
                  alt="Intuitive Visual Editor"
                  width={48}
                  height={48}
                />
              </div>
              <h6 className="mb-2 font-semibold leading-5">Intuitive Visual Editor</h6>
              <p className="mb-3 text-sm text-gray-900">
                Drag-and-drop interface lets you design levels and mechanics effortlessly, no coding experience required.
              </p>
            </div>
          </div>
          <div className="p-8 bg-[#8888881A] rounded-2xl">
            <div className="max-w-md text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full sm:w-16 sm:h-16">
                <Image
                  className="w-8 h-8 sm:w-12 sm:h-12"
                  src="/assets/images/features/automated-bug-testing.png"
                  alt="Automated Bug Testing"
                  width={48}
                  height={48}
                />
              </div>
              <h6 className="mb-2 font-semibold leading-5">Automated Bug Testing</h6>
              <p className="mb-3 text-sm text-gray-900">
                Zerlo’s AI scans your game for bugs and performance issues, ensuring a polished experience before launch.
              </p>
            </div>
          </div>
          <div className="p-8 bg-[#8888881A] rounded-2xl">
            <div className="max-w-md text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full sm:w-16 sm:h-16">
                <Image
                  className="w-8 h-8 sm:w-12 sm:h-12"
                  src="/assets/images/features/one-click-publishing.png"
                  alt="One-Click Publishing"
                  width={48}
                  height={48}
                />
              </div>
              <h6 className="mb-2 font-semibold leading-5">One-Click Publishing</h6>
              <p className="mb-3 text-sm text-gray-900">
                Share your finished games instantly to the Zerlo platform or export them for distribution with a single click.
              </p>
            </div>
          </div>
          <div className="p-8 bg-[#8888881A] rounded-2xl">
            <div className="max-w-md text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full sm:w-16 sm:h-16">
                <Image
                  className="w-8 h-8 sm:w-12 sm:h-12"
                  src="/assets/images/features/community-feedback.png"
                  alt="Community Feedback Integration"
                  width={48}
                  height={48}
                />
              </div>
              <h6 className="mb-2 font-semibold leading-5">Community Feedback Integration</h6>
              <p className="mb-3 text-sm text-gray-900">
                Gather player feedback directly through Zerlo’s platform to iterate and improve your games based on real user insights.
              </p>
            </div>
          </div>
          <div className="p-8 bg-[#8888881A] rounded-2xl">
            <div className="max-w-md text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full sm:w-16 sm:h-16">
                <Image
                  className="w-8 h-8 sm:w-12 sm:h-12"
                  src="/assets/images/features/scalable-game-logic.png"
                  alt="Scalable Game Logic"
                  width={48}
                  height={48}
                />
              </div>
              <h6 className="mb-2 font-semibold leading-5">Scalable Game Logic</h6>
              <p className="mb-3 text-sm text-gray-900">
                Zerlo’s AI adapts game logic to support simple prototypes or complex systems, scaling with your project’s ambition.
              </p>
            </div>
          </div>
          <div className="p-8 bg-[#8888881A] rounded-2xl">
            <div className="max-w-md text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full sm:w-16 sm:h-16">
                <Image
                  className="w-8 h-8 sm:w-12 sm:h-12"
                  src="/assets/images/features/multiplayer-support.png"
                  alt="Multiplayer Support"
                  width={48}
                  height={48}
                />
              </div>
              <h6 className="mb-2 font-semibold leading-5">Multiplayer Support</h6>
              <p className="mb-3 text-sm text-gray-900">
                Easily integrate multiplayer features, enabling competitive or cooperative gameplay with minimal setup.
              </p>
            </div>
          </div>
          <div className="p-8 bg-[#8888881A] rounded-2xl">
            <div className="max-w-md text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full sm:w-16 sm:h-16">
                <Image
                  className="w-8 h-8 sm:w-12 sm:h-12"
                  src="/assets/images/features/analytics-dashboard.png"
                  alt="Analytics Dashboard"
                  width={48}
                  height={48}
                />
              </div>
              <h6 className="mb-2 font-semibold leading-5">Analytics Dashboard</h6>
              <p className="mb-3 text-sm text-gray-900">
                Track player engagement and performance metrics through Zerlo’s built-in analytics to optimize your game’s success.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}