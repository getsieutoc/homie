import { AlertDialog, AlertDialogContent } from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <AlertDialog open>
      <AlertDialogContent className="flex items-center justify-center p-6">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p>Loading...</p>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
