export default function Modal({ title, onClose, children, width = "max-w-md" }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className={`card w-full ${width} p-6`}>
        {title && <h2 className="mb-5 text-xl font-semibold text-ivory">{title}</h2>}
        {children}
      </div>
    </div>
  );
}
