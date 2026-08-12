import Modal from "./Modal.jsx";
import "./ConfirmDialog.css";

export default function ConfirmDialog({ title, message, confirmLabel = "Confirm", onConfirm, onCancel, busy }) {
  return (
    <Modal title={title} onClose={onCancel}>
      <p className="confirm-message">{message}</p>
      <div className="confirm-actions">
        <button className="confirm-cancel-btn" onClick={onCancel} disabled={busy}>
          Cancel
        </button>
        <button className="confirm-ok-btn" onClick={onConfirm} disabled={busy}>
          {busy ? "Processing…" : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
