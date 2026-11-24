import React from 'react';
import { Mail, ExternalLink } from 'lucide-react';
import { PageHeaderEditor } from '../common/PageHeaderEditor';
import { HeroSlide } from '../../types';

const DEFAULT_CONTACT_SLIDES: HeroSlide[] = [
  {
    title: 'Initiate a Project',
    description:
      'Begin a confidential conversation with our cosmetic product development studio in Pretoria.',
    media:
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=2000&q=80',
  },
  {
    title: 'Formulation Enquiries',
    description:
      'Discuss bespoke formula development, bench prototypes, sensory targets, and ingredient compatibility.',
    media:
      'https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=2000&q=80',
  },
  {
    title: 'Manufacturing Support',
    description:
      'Partner on commercial batch production, contract manufacturer liaison, and packaging component sourcing.',
    media:
      'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=2000&q=80',
  },
  {
    title: 'Regulatory & Testing',
    description:
      'Enquire about safety assessments, clinical pathways, stability testing, and compliance documentation.',
    media:
      'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=2000&q=80',
  },
  {
    title: 'Brand Consultation',
    description:
      'Strategic beauty brand advisory, product line conceptualization, and market readiness planning.',
    media:
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=2000&q=80',
  },
  {
    title: 'Direct Engagement',
    description:
      'Reach our team directly for bespoke partnerships, ongoing advisory, or private formulation work.',
    media:
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=2000&q=80',
  },
];

export const ContactManager: React.FC = () => {
  return (
    <div className="space-y-6 w-full max-w-[1440px] pb-16">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Mail className="w-4 h-4 text-purple-400" />
            <span>Contact Page Content & Header Editor</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage the Contact page hero header slider, partnership messaging, and consultation triggers.
          </p>
        </div>

        <a
          href="http://localhost:5173/contact"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-purple-300 border border-slate-700 transition-colors self-start sm:self-auto"
        >
          <span>Preview Live Contact Page</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Contact Page Header Slider Editor */}
      <PageHeaderEditor
        page="contact"
        pageLabel="Contact"
        pageRoute="/contact"
        defaultSlides={DEFAULT_CONTACT_SLIDES}
      />
    </div>
  );
};
