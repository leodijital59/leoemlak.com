import * as React from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IconGripVertical, IconPhoto, IconStar, IconStarFilled, IconTrash, IconUpload } from "@tabler/icons-react";
import { Gallery, Item } from "react-photoswipe-gallery";
import type {DragEndEvent} from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import "photoswipe/dist/photoswipe.css";

// New file image (to be uploaded)
export interface ImageFile {
  id: string;
  file: File;
  preview: string;
  isMain: boolean;
  type: "new";
  width?: number;
  height?: number;
}

// Existing image (already on server)
export interface ExistingImage {
  id: string;
  url: string;
  isMain: boolean;
  order: number;
  type: "existing";
  width?: number;
  height?: number;
}

// Union type for both
export type ImageItem = ImageFile | ExistingImage;

interface ImageUploadProps {
  value: ImageItem[];
  onChange: (images: ImageItem[]) => void;
  maxFiles?: number;
  onDeleteExisting?: (id: string) => void;
}

interface SortableImageProps {
  image: ImageItem;
  onRemove: (id: string) => void;
  onSetMain: (id: string) => void;
}

function SortableImage({ image, onRemove, onSetMain }: SortableImageProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const imageSrc = image.type === "new" ? image.preview : image.url;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group aspect-square rounded-lg border-2 border-border overflow-hidden bg-muted",
        isDragging && "opacity-50 z-50",
        image.isMain && "border-primary"
      )}
    >
      <Item
        original={imageSrc}
        thumbnail={imageSrc}
        width={image.width || 1200}
        height={image.height || 900}
      >
        {({ ref: photoswipeRef, open }) => (
          <img
            ref={photoswipeRef}
            src={imageSrc}
            alt="Preview"
            className="w-full h-full object-cover cursor-pointer"
            onClick={open}
          />
        )}
      </Item>

      {/* Desktop Overlay controls (hover) */}
      <div className="hidden lg:flex absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center gap-2 pointer-events-none">
        <Button
          type="button"
          size="icon"
          variant="secondary"
          className="size-8 cursor-grab active:cursor-grabbing pointer-events-auto"
          {...attributes}
          {...listeners}
        >
          <IconGripVertical className="size-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant={image.isMain ? "default" : "secondary"}
          className="size-8 pointer-events-auto"
          onClick={() => onSetMain(image.id)}
          title={image.isMain ? "Ana resim" : "Ana resim yap"}
        >
          {image.isMain ? (
            <IconStarFilled className="size-4" />
          ) : (
            <IconStar className="size-4" />
          )}
        </Button>
        <Button
          type="button"
          size="icon"
          variant="destructive"
          className="size-8 pointer-events-auto"
          onClick={() => onRemove(image.id)}
        >
          <IconTrash className="size-4" />
        </Button>
      </div>

      {/* Mobile controls (bottom bar, always visible) */}
      <div className="lg:hidden absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-2 flex items-center justify-center gap-2">
        <Button
          type="button"
          size="icon"
          variant="secondary"
          className="size-8 cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <IconGripVertical className="size-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant={image.isMain ? "default" : "secondary"}
          className="size-8"
          onClick={() => onSetMain(image.id)}
          title={image.isMain ? "Ana resim" : "Ana resim yap"}
        >
          {image.isMain ? (
            <IconStarFilled className="size-4" />
          ) : (
            <IconStar className="size-4" />
          )}
        </Button>
        <Button
          type="button"
          size="icon"
          variant="destructive"
          className="size-8"
          onClick={() => onRemove(image.id)}
        >
          <IconTrash className="size-4" />
        </Button>
      </div>

      {/* Main image badge */}
      {image.isMain && (
        <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded z-10">
          Ana Resim
        </div>
      )}
    </div>
  );
}

export function ImageUpload({ value, onChange, maxFiles = 20, onDeleteExisting }: ImageUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = React.useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = value.findIndex((img) => img.id === active.id);
      const newIndex = value.findIndex((img) => img.id === over.id);
      onChange(arrayMove(value, oldIndex, newIndex));
    }
  };

  const handleFilesSelected = async (files: FileList | null) => {
    if (!files) return;

    const remainingSlots = maxFiles - value.length;
    const filesToAdd = Array.from(files).slice(0, remainingSlots);

    const newImagesPromises = filesToAdd.map((file, index) => {
      return new Promise<ImageFile>((resolve) => {
        const preview = URL.createObjectURL(file);
        const img = new Image();

        img.onload = () => {
          resolve({
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            file,
            preview,
            isMain: value.length === 0 && index === 0,
            type: "new" as const,
            width: img.naturalWidth,
            height: img.naturalHeight,
          });
        };

        img.onerror = () => {
          // If image fails to load, add without dimensions
          resolve({
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            file,
            preview,
            isMain: value.length === 0 && index === 0,
            type: "new" as const,
          });
        };

        img.src = preview;
      });
    });

    const newImages = await Promise.all(newImagesPromises);
    onChange([...value, ...newImages]);
  };

  const handleRemove = (id: string) => {
    const imageToRemove = value.find((img) => img.id === id);
    if (!imageToRemove) return;

    // Revoke object URL for new images
    if (imageToRemove.type === "new") {
      URL.revokeObjectURL(imageToRemove.preview);
    }

    // Notify parent about existing image deletion
    if (imageToRemove.type === "existing" && onDeleteExisting) {
      onDeleteExisting(id);
    }

    const newImages = value.filter((img) => img.id !== id);

    // If removed image was main and there are other images, set first as main
    if (imageToRemove.isMain && newImages.length > 0) {
      newImages[0] = { ...newImages[0], isMain: true };
    }

    onChange(newImages);
  };

  const handleSetMain = (id: string) => {
    onChange(
      value.map((img) => ({
        ...img,
        isMain: img.id === id,
      }))
    );
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFilesSelected(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  // Cleanup previews on unmount
  React.useEffect(() => {
    return () => {
      value.forEach((img) => {
        if (img.type === "new") {
          URL.revokeObjectURL(img.preview);
        }
      });
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragOver
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFilesSelected(e.target.files)}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-2">
          {isDragOver ? (
            <IconPhoto className="size-12 text-primary" />
          ) : (
            <IconUpload className="size-12 text-muted-foreground" />
          )}
          <div className="text-sm">
            <span className="font-medium text-primary">Dosya seçin</span>{" "}
            <span className="text-muted-foreground">veya sürükleyip bırakın</span>
          </div>
          <p className="text-xs text-muted-foreground">
            PNG, JPG, WEBP (maksimum {maxFiles} dosya)
          </p>
        </div>
      </div>

      {/* Image grid */}
      {value.length > 0 && (
        <Gallery
          options={{
            initialZoomLevel: 1,
            secondaryZoomLevel: 1.5,
            maxZoomLevel: 3,
            bgOpacity: 0.9,
            padding: { top: 20, bottom: 40, left: 20, right: 20 },
          }}
        >
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={value.map((img) => img.id)} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {value.map((image) => (
                  <SortableImage
                    key={image.id}
                    image={image}
                    onRemove={handleRemove}
                    onSetMain={handleSetMain}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </Gallery>
      )}

      {value.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {value.length} / {maxFiles} resim yüklendi. Sıralamak için sürükleyin.
        </p>
      )}
    </div>
  );
}
