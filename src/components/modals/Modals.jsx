import React from "react";

const Modals = ({
  id,
  title,
  buttonName,
  color,
  children,
  onClick,
  onClose,
  closeBtn,
}) => {
  return (
    <>
      <div className="modal fade" id={id}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
            </div>
            <div className="modal-body">{children}</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                id={closeBtn}
                onClick={(e) => clearTaskName()}
              >
                Cancel
              </button>
              <button
                onClick={onClick} // Call the onClick function when the button is clicked
                type="button"
                className={"btn btn-" + color}
              >
                {buttonName}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modals;
