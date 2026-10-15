import Cropper, { type Area } from 'react-easy-crop';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { getCroppedBlob } from '../lib/crop-image';

type AvatarCropDialogProps = {
  src: string; // object URL of the chosen file
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCropped: (file: File) => void; // the cropped square, ready to upload
  isUploading: boolean;
};

// Lets the user drag + zoom to frame a square before uploading, instead of uploading the raw file.
export function AvatarCropDialog({ src, open, onOpenChange, onCropped, isUploading }: AvatarCropDialogProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [areaPixels, setAreaPixels] = useState<Area | null>(null);
  const onCropComplete = useCallback((_area: Area, pixels: Area) => setAreaPixels(pixels), []);

  const apply = async () => {
    if (!areaPixels) return;
    try {
      const blob = await getCroppedBlob(src, areaPixels);
      onCropped(new File([blob], 'avatar.jpg', { type: 'image/jpeg' }));
    } catch (error) {
      toast.error("Couldn't crop the image", {
        description: error instanceof Error ? error.message : undefined,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crop your photo</DialogTitle>
          <DialogDescription>Drag to reposition, and use the slider to zoom.</DialogDescription>
        </DialogHeader>

        <div className="relative h-64 w-full overflow-hidden rounded-xl bg-ink">
          <Cropper
            image={src}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-ink-muted">Zoom</span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(event) => setZoom(Number(event.target.value))}
            aria-label="Zoom"
            className="h-1.5 w-full cursor-pointer accent-brand-line"
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={() => void apply()} disabled={isUploading}>
            {isUploading && <Spinner />}
            {isUploading ? 'Uploading…' : 'Save photo'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
