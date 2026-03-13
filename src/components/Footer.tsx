"use client";

import { Github, Mail, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer role="contentinfo" className="border-t border-white/[0.06] py-8 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Saadat Rafid Ahmed. All rights
          reserved.
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/saadat-r-ahmed"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-gray-300 transition-colors"
            aria-label="GitHub profile"
          >
            <Github size={16} />
          </a>
          <a
            href="mailto:saadat.r.ahmed@gmail.com"
            className="text-gray-500 hover:text-gray-300 transition-colors"
            aria-label="Send email"
          >
            <Mail size={16} />
          </a>
          <a
            href="https://cse.sds.bracu.ac.bd/faculty_profile/311/saadat_rafid_ahmed"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-gray-300 transition-colors"
            aria-label="Faculty profile at BRAC University"
          >
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </footer>
  );
}
