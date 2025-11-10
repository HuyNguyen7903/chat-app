export default function DeleteModal({ onCancel, onConfirm }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Xóa tin nhắn?</h3>
        <p>Bạn có chắc chắn muốn xóa tin nhắn này không?</p>
        <div className="modal-buttons">
          <button className="btn-cancel" onClick={onCancel}>
            Hủy
          </button>
          <button className="btn-confirm" onClick={onConfirm}>
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}
