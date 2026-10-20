import React from 'react';

interface AnimatedBackgroundProps {
  subtle?: boolean;
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ subtle = false }) => {
  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none select-none z-0"
      aria-hidden="true"
    >
      {/* Deep base atmosphere gradients */}
      <div className="absolute inset-0 bg-[#102C24]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(23,70,56,0.5),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_75%,rgba(200,169,107,0.06),transparent_50%)]" />

      {/* Layer A: Left to Right horizontal drift */}
      <div
        className={`absolute top-[8%] left-[-15%] w-[160%] whitespace-nowrap animate-annur-right text-[12vw] font-serif font-bold tracking-widest uppercase transition-opacity duration-1000 ${
          subtle ? 'opacity-[0.02] text-[#A5B7A0]' : 'opacity-[0.045] text-[#C8A96B]'
        }`}
        style={{ letterSpacing: '0.22em' }}
      >
        ANNUR TEA &nbsp;·&nbsp; PREMIER HARVEST &nbsp;·&nbsp; ANNUR TEA &nbsp;·&nbsp; ARTISANAL
      </div>

      {/* Layer B: Right to Left horizontal drift */}
      <div
        className={`absolute top-[48%] left-[-20%] w-[180%] whitespace-nowrap animate-annur-left text-[15vw] font-serif font-semibold tracking-widest uppercase transition-opacity duration-1000 ${
          subtle ? 'opacity-[0.02] text-[#174638]' : 'opacity-[0.038] text-[#A5B7A0]'
        }`}
        style={{ letterSpacing: '0.28em' }}
      >
        THE ART OF EXCEPTIONAL TEA &nbsp;·&nbsp; ANNUR TEA &nbsp;·&nbsp; ESTATE BLENDS
      </div>

      {/* Layer C: Vertical Downward drift */}
      <div
        className={`hidden lg:block absolute left-[3%] top-[-10%] h-[160%] animate-annur-down text-[8vw] font-serif font-light tracking-widest uppercase transition-opacity duration-1000 ${
          subtle ? 'opacity-[0.015]' : 'opacity-[0.035]'
        } text-[#C8A96B] [writing-mode:vertical-rl]`}
        style={{ letterSpacing: '0.35em' }}
      >
        ANNUR TEA &nbsp;·&nbsp; SILK ROAD &nbsp;·&nbsp; SINGLE ORIGIN
      </div>

      {/* Layer D: Vertical Upward drift */}
      <div
        className={`hidden lg:block absolute right-[4%] bottom-[-10%] h-[160%] animate-annur-up text-[7.5vw] font-serif font-light tracking-widest uppercase transition-opacity duration-1000 ${
          subtle ? 'opacity-[0.015]' : 'opacity-[0.03]'
        } text-[#A5B7A0] [writing-mode:vertical-rl]`}
        style={{ letterSpacing: '0.32em' }}
      >
        PURE BOTANICAL PURITY &nbsp;·&nbsp; HIGHLAND ESTATE &nbsp;·&nbsp; ANNUR TEA
      </div>

      {/* Gentle Floating Botanical Leaves / Motes */}
      {!subtle && (
        <div className="absolute inset-0">
          {/* Leaf 1 */}
          <div className="absolute top-[22%] left-[14%] animate-botanical-1 opacity-20 text-[#A5B7A0]">
            <svg width="42" height="42" viewBox="0 0 42 42" fill="currentColor">
              <path d="M21 2C10 12 6 24 12 34C18 42 32 40 38 30C42 18 34 8 21 2ZM21 8C27 15 28 22 25 28C22 33 16 33 13 29C9 23 13 14 21 8Z" opacity="0.8"/>
            </svg>
          </div>

          {/* Leaf 2 */}
          <div className="absolute top-[68%] right-[16%] animate-botanical-2 opacity-15 text-[#C8A96B]">
            <svg width="34" height="34" viewBox="0 0 42 42" fill="currentColor">
              <path d="M21 2C10 12 6 24 12 34C18 42 32 40 38 30C42 18 34 8 21 2Z" opacity="0.6"/>
            </svg>
          </div>

          {/* Leaf 3 */}
          <div className="absolute top-[82%] left-[32%] animate-botanical-1 opacity-10 text-[#A5B7A0]">
            <svg width="26" height="26" viewBox="0 0 42 42" fill="currentColor">
              <path d="M21 2C10 12 6 24 12 34C18 42 32 40 38 30C42 18 34 8 21 2Z" opacity="0.5"/>
            </svg>
          </div>

          {/* Ambient soft glow orb */}
          <div className="absolute top-[35%] right-[25%] w-[420px] h-[420px] rounded-full bg-[radial-gradient(circle,rgba(23,70,56,0.3)_0%,transparent_70%)] blur-2xl" />
        </div>
      )}

      {/* Subtle fine mesh pattern overlay for tactile luxury finish */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #C8A96B 1px, transparent 0)`,
          backgroundSize: '48px 48px',
        }}
      />
    </div>
  );
};
