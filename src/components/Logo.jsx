import React from 'react';

export default function Logo({ className = "h-10 w-10", showText = false }) {
  return (
    <div className="flex items-center gap-2.5 inline-flex select-none">
      <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M72 10 C72 10, 100 0, 128 10 C138 20, 130 68, 130 68 H70 C70 68, 62 20, 72 10 Z" fill="#386F53" />
        <path d="M70 132 H130 C130 132, 138 180, 128 190 C100 200, 72 190, 72 190 C62 180, 70 132, 70 132 Z" fill="#C1622D" />
        <path d="M10 72 C0 100, 10 128, 10 128 C20 138, 68 130, 68 130 V70 C68 70, 20 62, 10 72 Z" fill="#1F4A3D" />
        <path d="M132 70 V130 C132 130, 180 138, 190 128 C200 100, 190 72, 190 72 C180 62, 132 70, 132 70 Z" fill="#D68A55" />

        <rect x="70" y="70" width="60" height="60" fill="#16332A" rx="4" />

        <path d="M100 82 C100 82 86 102 86 110 C86 117.7 92.3 124 100 124 C107.7 124 114 117.7 114 110 C114 102 100 82 100 82 Z" fill="white" />
        <path d="M96 106 C96 103 98 100 101 98" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      </svg>
      {showText && (
        <span className="font-black text-slate-800 tracking-wider text-xl uppercase font-sans">
          FARMACIA
        </span>
      )}
    </div>
  );
}