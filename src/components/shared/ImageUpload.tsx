import { useState, useRef } from "react";
import { Button } from "./Button";

interface ImageUploadProps {
  label: string;
  value?: string;
  onChange: (base64: string) => void;
  onRemove?: () => void;
  className?: string;
}

export function ImageUpload({ label, value, onChange, onRemove, className }: ImageUploadProps) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (5MB for base64 storage)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB for base64 storage");
      return;
    }

    setError(null);
    setProcessing(true);

    try {
      const base64String = await convertToBase64(file);
      onChange(base64String);
    } catch (err) {
      setError("Failed to process image");
      console.error("Base64 conversion error:", err);
    } finally {
      setProcessing(false);
    }
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove();
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`space-y-2 ${className || ''}`}>
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      {value && (
        <div className="relative inline-block">
          <img
            src={value}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
          />
          {onRemove && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
            >
              ×
            </button>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
          disabled={processing}
        />
        {processing && (
          <div className="text-sm text-gray-500 flex items-center">
            Processing...
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      <p className="text-xs text-gray-500">Max file size: 5MB. Accepted formats: JPG, PNG, GIF, WebP. Images are stored as base64.</p>
    </div>
  );
}
