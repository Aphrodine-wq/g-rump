import React from 'react';
import { motion } from 'framer-motion';
import { GrumpConfig } from '../config/GrumpConfig';

const DocSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="mb-12">
    <h2 className="text-2xl font-bold mb-4 text-gray-900">{title}</h2>
    <div className="bg-white p-6 rounded-3xl shadow-soft">
      {children}
    </div>
  </div>
);

export const GrumpDocs: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-[#F5F5F7] p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <button 
            onClick={onBack}
            className="mr-4 p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all"
          >
            ←
          </button>
          <h1 className="text-4xl font-black text-gray-900">GRUMP Documentation</h1>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <DocSection title="Core Philosophy">
            <p className="text-gray-600 leading-relaxed mb-4">
              GRUMP is designed with a "White Minimalism" aesthetic, strictly adhering to iOS Apple Arcade standards. 
              The interface prioritizes content and motion over chrome and borders.
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>No borders, only soft shadows (`shadow-soft`)</li>
              <li>120fps fluid animations</li>
              <li>High contrast typography</li>
              <li>Glassmorphism for floating elements</li>
            </ul>
          </DocSection>

          <DocSection title="Configuration Variables">
            <p className="text-gray-600 mb-6">
              GRUMP's behavior and appearance are controlled by a centralized configuration object.
            </p>
            
            <div className="grid gap-6">
              {Object.entries(GrumpConfig).map(([category, settings]) => (
                <div key={category} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                  <h3 className="text-lg font-semibold capitalize mb-3 text-gray-800">{category}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(settings).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                        <span className="text-gray-600 font-mono text-sm">{key}</span>
                        <span className="text-gray-900 font-medium font-mono text-sm">
                          {String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </DocSection>

          <DocSection title="Animation System">
            <p className="text-gray-600 leading-relaxed mb-4">
              The animation engine (`grump2.js`) runs on a decoupled loop using delta-timing to ensure 
              consistent performance across 60hz, 120hz, and 144hz displays.
            </p>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-xl font-mono text-sm overflow-x-auto">
              <code>
                {`// Example usage
import { animationApi } from '../services/animationApi';

const anim = await animationApi.createAnimation({
  prompt: "Make him angry",
  style: "css"
});`}
              </code>
            </div>
          </DocSection>
        </motion.div>
      </div>
    </div>
  );
};
