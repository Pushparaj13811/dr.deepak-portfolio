import { useState } from "react";
import { Button } from "./Button";
import { Input } from "./Input";
import type { BlogImage } from "../../types";

interface ImageManagerProps {
  images: BlogImage[];
  onImagesChange: (images: BlogImage[]) => void;
  onInsertImage: (imageId: string) => void;
}

export function ImageManager({ images, onImagesChange, onInsertImage }: ImageManagerProps) {
  const [isUploading, setIsUploading] = useState(false);

  const generateId = () => {
    return `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    
    try {
      const newImages: BlogImage[] = [];
      
      for (const file of files) {
        if (file.type.startsWith('image/')) {
          const base64 = await convertToBase64(file);
          const newImage: BlogImage = {
            id: generateId(),
            name: file.name,
            base64: base64 as string,
            alt: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
            caption: ""
          };
          newImages.push(newImage);
        }
      }
      
      onImagesChange([...images, ...newImages]);
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setIsUploading(false);
      // Reset input
      event.target.value = '';
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const updateImage = (id: string, updates: Partial<BlogImage>) => {
    const updatedImages = images.map(img => 
      img.id === id ? { ...img, ...updates } : img
    );
    onImagesChange(updatedImages);
  };

  const removeImage = (id: string) => {
    const updatedImages = images.filter(img => img.id !== id);
    onImagesChange(updatedImages);
  };

  return (
    <div className="space-y-4">
      {/* Upload Section */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input
          type="file"
          id="image-upload"
          multiple
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
          disabled={isUploading}
        />
        <label
          htmlFor="image-upload"
          className={`cursor-pointer inline-flex flex-col items-center ${
            isUploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <span className="text-sm font-medium text-gray-700">
            {isUploading ? 'Uploading...' : 'Click to upload images'}
          </span>
          <span className="text-xs text-gray-500 mt-1">
            PNG, JPG, GIF up to 10MB each
          </span>
        </label>
      </div>

      {/* Images Grid */}
      {images.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-700">
            Uploaded Images ({images.length})
          </h4>
          <div className="grid gap-4">
            {images.map((image) => (
              <div key={image.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                <div className="flex gap-4">
                  {/* Image Preview */}
                  <div className="flex-shrink-0">
                    <img
                      src={image.base64}
                      alt={image.alt || image.name}
                      className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                  
                  {/* Image Details */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Alt Text
                      </label>
                      <Input
                        value={image.alt || ''}
                        onChange={(e) => updateImage(image.id, { alt: e.target.value })}
                        placeholder="Describe this image..."
                        className="text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Caption (optional)
                      </label>
                      <Input
                        value={image.caption || ''}
                        onChange={(e) => updateImage(image.id, { caption: e.target.value })}
                        placeholder="Image caption..."
                        className="text-sm"
                      />
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex-shrink-0 flex flex-col gap-2">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => onInsertImage(image.id)}
                      className="text-xs"
                    >
                      Insert
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeImage(image.id)}
                      className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
                
                {/* Copy Markdown */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Markdown:</span>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded flex-1 font-mono">
                      {`![${image.alt || image.name}]({{image:${image.id}}})`}
                    </code>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const markdown = `![${image.alt || image.name}]({{image:${image.id}}})`;
                        navigator.clipboard.writeText(markdown);
                      }}
                      className="text-xs"
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}