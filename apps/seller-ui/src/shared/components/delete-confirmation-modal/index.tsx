import { X } from "lucide-react"

const DeleteConfirmationModal = ({ product, onClose, onConfirm, onRestore } : any) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-[450px]">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-700 pb-3">
          <h3 className="text-xl text-white">Delete Product</h3>

            <button
                className="text-gray-400 hover:text-white"
                onClick={onClose}
            >
                <X size={22} />
            </button>
        </div>

        {/* Warning message */}
        <p className="mt-4 text-gray-400">
          Are you sure you want to delete {" "}
          <span className="font-semibold text-white">{product.title}</span> ?
          <br />
          This product will be moved to a **delete state** and
          <br />
          permanently removed **after 24 hours**. You can
          <br />
          recover it within this time.
        </p>


        {/* Action buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            className="bg-gray-600 hover:bg-gray-700 text-white rounded-md px-4 py-2 transition"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            onClick={!product.isDeleted ? onConfirm : onRestore }
            className={`${
                product.isDeleted 
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }  text-white rounded-md px-4 py-2 transition font-semibold`}
          >
            {!product.isDeleted ? "Delete" : "Restore" }
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmationModal