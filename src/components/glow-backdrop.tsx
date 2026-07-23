export function GlowBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute -top-32 -left-24 h-96 w-96 rounded-full blur-3xl opacity-60 animate-float-slow"
        style={{ background: "radial-gradient(circle, #00BFFF55 0%, transparent 70%)" }}
      />
      <div
        className="absolute top-40 -right-24 h-[28rem] w-[28rem] rounded-full blur-3xl opacity-60 animate-float-slower"
        style={{ background: "radial-gradient(circle, #00E5FF55 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full blur-3xl opacity-50 animate-float-slow"
        style={{ background: "radial-gradient(circle, #00BFFF44 0%, transparent 70%)" }}
      />
    </div>
  );
}
