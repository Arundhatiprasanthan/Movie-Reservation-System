import Modal from "./Modal.jsx";

export default function ConfirmDialog({ title, message, confirmLabel = "Remove", onConfirm, onCancel, busy }) {
  return (
    <Modal title={title} onClose={onCancel} width="max-w-sm">
      <p className="text-sm text-muted">{message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <button className="btn-secondary" onClick={onCancel} disabled={busy}>
          Cancel
        </button>
        <button
          className="btn-primary bg-red-500/90 hover:bg-red-500"
          onClick={onConfirm}
          disabled={busy}
        >
          {busy ? "Removing…" : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
