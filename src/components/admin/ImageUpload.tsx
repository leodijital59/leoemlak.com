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
import type {DragEndEvent} from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// New file image (to be uploaded)
export interface ImageFile {
  id: string;
  file: File;
  preview: string;
  isMain: boolean;
  type: "new";
}

// Existing image (already on server)
export interface ExistingImage {
  id: string;
  url: string;
  isMain: boolean;
  order: number;
  type: "existing";
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
      <img
        src={imageSrc}
        alt="Preview"
        className="w-full h-full object-cover"
      />

      {/* Overlay controls */}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
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
        <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
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

  const handleFilesSelected = (files: FileList | null) => {
    if (!files) return;

    const remainingSlots = maxFiles - value.length;
    const filesToAdd = Array.from(files).slice(0, remainingSlots);

    const newImages: ImageFile[] = filesToAdd.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      preview: URL.createObjectURL(file),
      isMain: value.length === 0 && filesToAdd.indexOf(file) === 0,
      type: "new" as const,
    }));

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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={value.map((img) => img.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
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
      )}

      {value.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {value.length} / {maxFiles} resim yüklendi. Sıralamak için sürükleyin.
        </p>
      )}
    </div>
  );
}
