"use client";

import AnimatedSection from "./AnimatedSection";
import SectionHeading from "./SectionHeading";
import { Mail, Github, ExternalLink, MapPin, Send } from "lucide-react";
import Collectible from "./game/Collectible";

export default function Contact() {
  return (
    <section id="contact" className="section-padding">
      <div className="max-w-4xl mx-auto">
        <SectionHeading
          label="Contact"
          title="Get in Touch"
          subtitle="Open to collaborations, research opportunities, and fully-funded graduate positions"
        />

        <AnimatedSection>
          <div className="glass p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-200 mb-6">
                  Let&apos;s Connect
                </h3>
                <div className="space-y-4">
                  <a
                    href="mailto:saadat.r.ahmed@gmail.com"
                    className="flex items-center gap-3 text-gray-400 hover:text-indigo-400 transition-colors group"
                  >
                    <div className="p-2.5 rounded-xl bg-white/[0.04] group-hover:bg-indigo-500/10 border border-white/[0.06] group-hover:border-indigo-500/20 transition-all">
                      <Mail size={16} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm">saadat.r.ahmed@gmail.com</p>
                    </div>
                  </a>

                  <a
                    href="https://github.com/saadat-r-ahmed"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-400 hover:text-indigo-400 transition-colors group"
                  >
                    <div className="p-2.5 rounded-xl bg-white/[0.04] group-hover:bg-indigo-500/10 border border-white/[0.06] group-hover:border-indigo-500/20 transition-all">
                      <Github size={16} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">GitHub</p>
                      <p className="text-sm">saadat-r-ahmed</p>
                    </div>
                  </a>

                  <a
                    href="https://cse.sds.bracu.ac.bd/faculty_profile/311/saadat_rafid_ahmed"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-400 hover:text-indigo-400 transition-colors group"
                  >
                    <div className="p-2.5 rounded-xl bg-white/[0.04] group-hover:bg-indigo-500/10 border border-white/[0.06] group-hover:border-indigo-500/20 transition-all">
                      <ExternalLink size={16} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Faculty Profile</p>
                      <p className="text-sm">BRAC University CSE</p>
                    </div>
                  </a>

                  <div className="flex items-center gap-3 text-gray-400">
                    <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                      <MapPin size={16} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="text-sm">Dhaka, Bangladesh</p>
                    </div>
                    <Collectible id="c_contact" className="ml-auto" />
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col justify-center">
                <div className="glass p-6 text-center">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-4">
                    <Send size={20} className="text-indigo-400" />
                  </div>
                  <h4 className="font-semibold text-gray-200 mb-2">
                    Seeking Graduate Opportunities
                  </h4>
                  <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                    Looking for fully-funded graduate positions to deepen
                    research in trustworthy AI and language technology for
                    underrepresented languages.
                  </p>
                  <a
                    href="mailto:saadat.r.ahmed@gmail.com?subject=Research%20Collaboration%20Inquiry"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-all duration-300 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/30 hover:-translate-y-0.5"
                  >
                    <Mail size={16} />
                    Send an Email
                  </a>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
