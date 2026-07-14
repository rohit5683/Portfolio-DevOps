"use client";
import React, { useState, useEffect } from "react";
import PinLock from "./PinLock";
import axios from "axios";

export default function EmergencyModal({ onClose }: { onClose: () => void }) {
  const [unlocked, setUnlocked] = useState(false);
  const [contacts, setContacts] = useState<any[]>([]);

  const handleUnlock = (secureContacts: any[]) => {
    setContacts(secureContacts);
    setUnlocked(true);
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-3xl animate-fade-in" style={{ touchAction: 'none' }}>
      <div className="absolute top-4 right-4 md:top-8 md:right-8 z-10">
        <button 
          onClick={onClose}
          className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all backdrop-blur-xl border border-white/10 shadow-xl"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {!unlocked ? (
        <div className="flex flex-col items-center w-full max-w-md animate-fade-in-up">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(239,68,68,0.3)]">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <PinLock onUnlock={handleUnlock} />
        </div>
      ) : (
        <div className="w-full max-w-md animate-fade-in-up">
          <div className="text-center mb-8">
             <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
               <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
             </div>
             <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">Emergency Contacts</h2>
             <p className="text-gray-400 text-sm">Tap any contact to call immediately.</p>
          </div>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {contacts.length === 0 ? (
              <div className="text-center text-gray-400 py-4">
                No emergency contacts found.
              </div>
            ) : (
              contacts.map((contact) => (
                <a 
                  key={contact._id}
                  href={`tel:${contact.phone.replace(/\\s+/g, '')}`}
                  className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 hover:border-blue-500/50 rounded-2xl transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                      <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 15.5c-1.2 0-2.4-.2-3.6-.6-.3-.1-.7 0-1 .2l-2.2 2.2c-2.8-1.4-5.1-3.8-6.6-6.6l2.2-2.2c.3-.3.4-.7.2-1-.4-1.2-.6-2.4-.6-3.6 0-.6-.4-1-1-1H4c-.6 0-1 .4-1 1 0 9.4 7.6 17 17 17 .6 0 1-.4 1-1v-3.5c0-.6-.4-1-1-1z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-white font-bold text-base md:text-lg">{contact.name}</div>
                      <div className="text-gray-400 text-xs md:text-sm flex items-center gap-2">
                         <span className="font-mono">{contact.phone}</span>
                         <span className="text-blue-500/50">•</span>
                         <span className="text-blue-400 font-medium">{contact.relation}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-white/20 group-hover:text-blue-400 transition-all group-hover:translate-x-1 duration-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </a>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
