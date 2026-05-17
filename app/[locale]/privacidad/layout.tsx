export default function PrivacidadLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position:"relative", zIndex:9999, background:"#080604", minHeight:"100vh" }}>
      {children}
    </div>
  );
}
