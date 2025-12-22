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

          <DocSection title="Audio System">
            <p className="text-gray-600 leading-relaxed mb-4">
              GRUMP features a modular audio engine (`services/audio`) that handles procedural sound generation, 
              file playback, and third-party integrations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
               <div className="bg-gray-50 p-4 rounded-xl">
                 <h4 className="font-semibold mb-2">Procedural Audio</h4>
                 <p className="text-sm text-gray-600">Real-time synthesis of sound effects (grumbles, chimes) using Web Audio API oscillators.</p>
               </div>
               <div className="bg-gray-50 p-4 rounded-xl">
                 <h4 className="font-semibold mb-2">Integrations</h4>
                 <p className="text-sm text-gray-600">Support for Spotify playback, Google Speech-to-Text, and browser-native Text-to-Speech.</p>
               </div>
            </div>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-xl font-mono text-sm overflow-x-auto">
              <code>
                {`// Example usage
import { audioManager } from '../services/audio';

// Play procedural success sound
audioManager.grump.success();

// Speak text
audioManager.voice.speak("I am very grumpy today.");`}
              </code>
            </div>
          </DocSection>

          <DocSection title="Procedural Animation Engine">
            <p className="text-gray-600 leading-relaxed mb-4">
              The enhanced procedural engine (`proceduralEngine.ts`) generates complex CSS keyframes based on intent.
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li><strong>Glitch:</strong> Cyberpunk clip-path distortion</li>
              <li><strong>Orbit:</strong> Multi-axis rotational physics</li>
              <li><strong>Typewriter:</strong> Stepped text reveal animations</li>
              <li><strong>Neon Pulse:</strong> Layered shadow glowing effects</li>
            </ul>
          </DocSection>

          <DocSection title="Output Capabilities">
            <p className="text-gray-600 leading-relaxed mb-4">
              G-Rump supports a massive array of export formats for web, mobile, games, and video.
            </p>
            
            <h4 className="font-semibold mb-3 text-gray-800">Export Formats</h4>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm text-left text-gray-600">
                <thead className="bg-gray-50 text-gray-900 font-semibold">
                  <tr>
                    <th className="p-3 rounded-tl-xl">Format</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 rounded-tr-xl">Use Case</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 border border-gray-100 rounded-b-xl">
                  <tr><td className="p-3 font-medium">CSS Animation</td><td className="p-3 text-green-600">✅ Ready</td><td className="p-3">Web, Interactive</td></tr>
                  <tr><td className="p-3 font-medium">SVG + SMIL</td><td className="p-3 text-green-600">✅ Ready</td><td className="p-3">Scalable Graphics</td></tr>
                  <tr><td className="p-3 font-medium">Canvas JS</td><td className="p-3 text-green-600">✅ Ready</td><td className="p-3">Web Games</td></tr>
                  <tr><td className="p-3 font-medium">Phaser 3</td><td className="p-3 text-green-600">✅ Ready</td><td className="p-3">Game Dev</td></tr>
                  <tr><td className="p-3 font-medium">MP4 / GIF</td><td className="p-3 text-yellow-600">🚧 In Progress</td><td className="p-3">Video / Social</td></tr>
                  <tr><td className="p-3 font-medium">Lottie JSON</td><td className="p-3 text-yellow-600">🚧 In Progress</td><td className="p-3">Mobile Apps</td></tr>
                </tbody>
              </table>
            </div>

            <h4 className="font-semibold mb-3 text-gray-800">Code Generation Targets</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                   <h5 className="font-bold text-gray-900">iOS / macOS 🍎</h5>
                   <span className="text-xs font-mono bg-white px-2 py-1 rounded border">Swift</span>
                </div>
                <p className="text-xs text-gray-600">Native performance, 120fps+ animations, SwiftUI integration.</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                   <h5 className="font-bold text-gray-900">Android 🤖</h5>
                   <span className="text-xs font-mono bg-white px-2 py-1 rounded border">Kotlin</span>
                </div>
                <p className="text-xs text-gray-600">OpenGL ES, Jetpack Compose, Coroutine-based async.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                   <h5 className="font-bold text-gray-900">Web 🌐</h5>
                   <span className="text-xs font-mono bg-white px-2 py-1 rounded border">TypeScript</span>
                </div>
                <p className="text-xs text-gray-600">Canvas (High Perf), SVG (Scalable), Three.js (3D).</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                   <h5 className="font-bold text-gray-900">Game Engines 🎮</h5>
                   <span className="text-xs font-mono bg-white px-2 py-1 rounded border">C# / C++</span>
                </div>
                <p className="text-xs text-gray-600">Unity (Animator), Unreal (Sequencer), Godot.</p>
              </div>
            </div>
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
