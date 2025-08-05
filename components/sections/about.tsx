"use client";

import { motion } from "framer-motion";
import { XIcon } from "lucide-react";
import { Magnetic } from "@/components/ui/magnetic";
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContent,
  MorphingDialogClose,
  MorphingDialogContainer,
} from "@/components/ui/morphing-dialog";
import {
  PROJECTS,
  EMAIL,
  SOCIAL_LINKS,
} from "@/app/about/data";

const VARIANTS_CONTAINER = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const VARIANTS_SECTION = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const TRANSITION_SECTION = { duration: 0.3 };

type ProjectVideoProps = { src: string };

function ProjectVideo({ src }: ProjectVideoProps) {
  return (
    <MorphingDialog
      transition={{ type: "spring", bounce: 0, duration: 0.3 }}
    >
      <MorphingDialogTrigger>
        <video
          src={src}
          autoPlay
          loop
          muted
          className="aspect-video w-full cursor-zoom-in rounded-xl"
          playsInline
        />
      </MorphingDialogTrigger>

      <MorphingDialogContainer>
        <MorphingDialogContent className="relative aspect-video rounded-2xl bg-gray-50 p-1 ring-1 ring-gray-200 ring-inset">
          <video
            src={src}
            autoPlay
            loop
            muted
            className="aspect-video h-[50vh] w-full rounded-xl md:h-[70vh]"
            playsInline
          />
        </MorphingDialogContent>

        <MorphingDialogClose
          className="fixed top-6 right-6 rounded-full bg-white p-1 shadow-md hover:bg-gray-100"
          variants={{
            initial: { opacity: 0 },
            animate: { opacity: 1, transition: { delay: 0.3, duration: 0.1 } },
            exit: { opacity: 0, transition: { duration: 0 } },
          }}
        >
          <XIcon className="h-5 w-5 text-gray-600" />
        </MorphingDialogClose>
      </MorphingDialogContainer>
    </MorphingDialog>
  );
}

function MagneticSocialLink({ children, link }: { children: React.ReactNode; link: string }) {
  return (
    <Magnetic springOptions={{ bounce: 0 }} intensity={0.3}>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-900 transition-colors duration-200 hover:bg-gray-300"
      >
        {children}
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3"
        >
          <path
            d="M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4L6 4C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3L11.5 3C11.6326 3 11.7598 3.05268 11.8536 3.14645C11.9473 3.24022 12 3.36739 12 3.5L12 9.00001C12 9.27615 11.7761 9.50001 11.5 9.50001C11.2239 9.50001 11 9.27615 11 9.00001V4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z"
            fill="currentColor"
          />
        </svg>
      </a>
    </Magnetic>
  );
}

export default function AboutZerlo() {
  return (
    <motion.main
      className="mx-auto max-w-4xl space-y-20 px-6 py-12"
      variants={VARIANTS_CONTAINER}
      initial="hidden"
      animate="visible"
    >
      {/* Intro Section */}
      <motion.section variants={VARIANTS_SECTION} transition={TRANSITION_SECTION}>
        <h1 className="mb-6 text-4xl font-extrabold text-gray-900">
          About Zerlo — The Future of Website Building
        </h1>
        <p className="mb-6 text-lg text-gray-700 leading-relaxed">
          Zerlo is a revolutionary AI-powered website builder that empowers creators, entrepreneurs, and businesses to craft stunning, fully customizable websites effortlessly. Combining cutting-edge artificial intelligence with a powerful visual drag-and-drop canvas, Zerlo offers unmatched flexibility and ease of use — all without writing a single line of code.
        </p>
        <p className="mb-6 text-lg text-gray-700 leading-relaxed">
          Unlike traditional platforms like Wix, Primer, or even advanced tools like Webflow and Web Studio, Zerlo harnesses the power of AI to automate tedious tasks, suggest smart design improvements, optimize performance, and accelerate your workflow.
        </p>
        <p className="mb-6 text-lg text-gray-700 leading-relaxed">
          Whether you&apos;re building a portfolio, online store, blog, or complex multi-page site, Zerlo gives you the freedom to design exactly how you imagine — without constraints or technical roadblocks.
        </p>
      </motion.section>

      {/* Why Zerlo Section */}
      <motion.section variants={VARIANTS_SECTION} transition={TRANSITION_SECTION}>
        <h2 className="mb-4 text-3xl font-bold text-gray-900">Why Zerlo is Better Than Wix, Primer & Webflow</h2>

        <ul className="list-disc list-inside space-y-4 text-gray-700 text-lg leading-relaxed">
          <li><strong>AI-Driven Design:</strong> Zerlo intelligently assists you by generating content, optimizing layouts, and ensuring your website is both beautiful and highly performant.</li>
          <li><strong>True Visual Freedom:</strong> Unlike Wix and Primer&apos;s template lock-ins, Zerlo&apos;s canvas lets you customize every pixel with no restrictions.</li>
          <li><strong>Faster Workflow:</strong> The combination of AI suggestions and a fluid visual editor dramatically reduces build times compared to Webflow or Web Studio.</li>
          <li><strong>Optimized Performance:</strong> Zerlo generates clean, semantic code optimized for speed and SEO out of the box.</li>
          <li><strong>Responsive by Default:</strong> Your designs automatically adapt beautifully across all devices with minimal effort.</li>
          <li><strong>Seamless Integrations:</strong> Connect with popular tools and services effortlessly — from analytics to e-commerce.</li>
          <li><strong>Collaboration Ready:</strong> Zerlo makes teamwork easy with live editing, version control, and real-time previews.</li>
          <li><strong>Constant Innovation:</strong> Powered by state-of-the-art AI advancements, Zerlo continuously evolves to keep you ahead of the curve.</li>
        </ul>
      </motion.section>

      {/* How It Works Section */}
      <motion.section variants={VARIANTS_SECTION} transition={TRANSITION_SECTION}>
        <h2 className="mb-4 text-3xl font-bold text-gray-900">How Zerlo Works</h2>
        <p className="mb-4 text-gray-700 text-lg leading-relaxed">
          Zerlo&apos;s editor is a no-code visual environment that lets you drag, drop, and customize website elements with instant previews. The AI engine works behind the scenes to help you craft content, suggest design improvements, and optimize SEO.
        </p>
        <p className="mb-4 text-gray-700 text-lg leading-relaxed">
          Once your design is ready, Zerlo generates clean, production-ready HTML, CSS, and JavaScript that you can deploy instantly or export for further development.
        </p>
        <p className="mb-4 text-gray-700 text-lg leading-relaxed">
          All of this combines to create a website building experience that&apos;s faster, smarter, and more powerful than ever before.
        </p>
      </motion.section>

      {/* Projects Section with Video Demos */}
      <motion.section variants={VARIANTS_SECTION} transition={TRANSITION_SECTION}>
        <h2 className="mb-6 text-3xl font-bold text-gray-900">See Zerlo in Action</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {PROJECTS.map(({ name, video, link, description }) => (
            <div key={name} className="space-y-2">
              <ProjectVideo src={video} />
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xl font-semibold text-gray-900 hover:underline"
              >
                {name}
              </a>
              <p className="text-gray-700">{description}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section variants={VARIANTS_SECTION} transition={TRANSITION_SECTION}>
        <h2 className="mb-4 text-3xl font-bold text-gray-900">Get In Touch</h2>
        <p className="mb-4 text-gray-700 text-lg leading-relaxed">
          Interested in learning more or starting your project with Zerlo? Feel free to reach out!
        </p>
        <p className="mb-6 text-lg">
          Email us at{" "}
          <a href={`mailto:${EMAIL}`} className="underline text-blue-600 hover:text-blue-800">
            {EMAIL}
          </a>
        </p>

        <div className="flex flex-wrap gap-3">
          {SOCIAL_LINKS.map(({ label, link }) => (
            <MagneticSocialLink key={label} link={link}>
              {label}
            </MagneticSocialLink>
          ))}
        </div>
      </motion.section>
    </motion.main>
  );
}