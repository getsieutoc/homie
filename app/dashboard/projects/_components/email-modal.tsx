'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { type Result, type Project, HttpMethod } from '@/types';
import { useObject, useRouter, useState, useForm, useEffect } from '@/hooks';
import { Textarea } from '@/components/ui/textarea';
import { updateResult } from '@/services/results';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Send, Sparkles } from 'lucide-react';
import { emailSchema } from '@/lib/schemas';
import { fetcher } from '@/lib/utils';

export type Props = {
  isOpen: boolean;
  onClose: () => void;
  result: Result;
  project: Project;
};

export type EmailFormValues = {
  subject: string;
  content: string;
};

export const EmailModal = ({ isOpen, onClose, result, project }: Props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    object,
    submit,
    isLoading: isStreaming,
  } = useObject({
    id: project.id,
    api: '/api/ai/email',
    schema: emailSchema,
  });

  const lastMessage = result.lastMessage
    ? (JSON.parse(result.lastMessage) as EmailFormValues)
    : null;

  const form = useForm<EmailFormValues>({
    defaultValues: lastMessage ? lastMessage : { subject: '', content: '' },
  });

  const {
    register,
    setValue,
    handleSubmit,
    formState: { isDirty },
  } = form;

  useEffect(() => {
    if (object && isStreaming) {
      setValue('subject', object.subject ?? '', { shouldDirty: true });
      setValue('content', object.content ?? '', { shouldDirty: true });
    }
  }, [object, isStreaming]);

  const handleGenerate = async () => {
    try {
      submit({
        result: result.result,
        engineName: result.engineName,
        resultCategory: result.category || 'malicious',
        projectDomain: project.domain,
      });
    } catch (error) {
      console.error('Error generating email:', error);
    }
  };

  const handleSendNow = async (data: EmailFormValues) => {
    try {
      const vendorResponse = await fetcher(
        `/api/vendors/search?name=${result.engineName}`,
        {
          method: HttpMethod.GET,
        }
      );

      if (vendorResponse.email) {
        console.log('Sending email to:', vendorResponse.email);
      }

      await updateResult({
        projectId: result.projectId,
        engineName: result.engineName,
        lastMessage: JSON.stringify(data),
      });

      onClose();
      router.refresh();
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  const handleSaveForLater = async (data: EmailFormValues) => {
    try {
      await updateResult({
        projectId: result.projectId,
        engineName: result.engineName,
        lastMessage: JSON.stringify(data),
      });

      onClose();
      router.refresh();
    } catch (error) {
      console.error('Error saving email:', error);
    }
  };

  const makeGenerateLabel = () => {
    if (lastMessage) {
      return isStreaming ? 'Regenerating...' : 'Regenerate';
    }

    return isStreaming ? 'Generating...' : 'Generate';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Send Dispute Email</DialogTitle>
          <DialogDescription>
            Generate and customize your email response
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSendNow)} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Input placeholder="Subject" {...register('subject')} />
            </div>
            <div className="grid gap-2">
              <Textarea
                placeholder="Content"
                className="h-[200px]"
                {...register('content')}
              />
            </div>
          </div>

          <DialogFooter>
            <div className="flex w-full justify-between">
              <Button variant="outline" onClick={handleGenerate} disabled={isStreaming}>
                {isStreaming ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}

                {makeGenerateLabel()}
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  onClick={handleSubmit(handleSaveForLater)}
                  variant={isDirty ? 'success' : 'outline'}
                  disabled={!isDirty}
                >
                  Save for later
                </Button>
                <Button disabled={!isDirty} type="submit">
                  <Send className="mr-2 h-4 w-4" /> Send Now
                </Button>
              </div>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
