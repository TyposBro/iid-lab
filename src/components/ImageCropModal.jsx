import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import PropTypes from "prop-types";
import getCroppedImg from "@/utils/cropImage";

/**
 * Modal for cropping/zooming/repositioning an image before upload.
 *
 * @param {string} imageSrc - The image source to crop (data URL or object URL)
 * @param {number} aspect - Aspect ratio (e.g. 16/9, 1, 4/3). Defaults to 16/9.
 * @param {function} onCropComplete - Called with the cropped Blob when user confirms
 * @param {function} onCancel - Called when user cancels
 */
const ImageCropModal = ({ imageSrc, aspect = 16 / 9, onCropComplete, onCancel }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropChange = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;
    setIsProcessing(true);
    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropComplete(croppedBlob);
    } catch (err) {
      console.error("Crop failed:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-xl shadow-2xl w-[90vw] max-w-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Crop Image</h3>
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Crop Area */}
        <div className="relative w-full h-[50vh] bg-gray-900">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropChange}
          />
        </div>

        {/* Controls */}
        <div className="px-5 py-4 flex flex-col gap-3 border-t border-gray-200">
          {/* Zoom slider */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-600 w-12">Zoom</label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-grow accent-blue-600"
            />
            <span className="text-sm text-gray-500 w-10 text-right">{zoom.toFixed(1)}x</span>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onCancel}
              disabled={isProcessing}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isProcessing}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
            >
              {isProcessing ? "Cropping..." : "Confirm Crop"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

ImageCropModal.propTypes = {
  imageSrc: PropTypes.string.isRequired,
  aspect: PropTypes.number,
  onCropComplete: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ImageCropModal;
