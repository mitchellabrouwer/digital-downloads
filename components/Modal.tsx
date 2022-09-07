import React from "react";

export default function Modal({ buttonText, title, children }) {
  const [showModal, setShowModal] = React.useState(false);
  return (
    <>
      <button
        className="border p-2 text-sm font-bold uppercase"
        type="button"
        onClick={() => setShowModal(true)}
      >
        {buttonText}
      </button>
      {showModal ? (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
            <div className="relative my-6 mx-auto w-auto max-w-sm">
              {/* content */}
              <div className="relative flex w-full flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none">
                {/* header */}
                <div className="flex items-start justify-between rounded-t border-b border-solid border-slate-200 p-5">
                  <h3 className="text-3xl font-semibold">{title}</h3>
                  <button
                    type="button"
                    className="float-right ml-auto border-0 bg-transparent p-1 text-3xl font-semibold leading-none text-black outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="block h-6 w-6 bg-transparent text-2xl text-black outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/* body */}
                <div className="relative flex-auto p-2">{children}</div>
              </div>
            </div>
          </div>
          <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
        </>
      ) : null}
    </>
  );
}
