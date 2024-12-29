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
import { Textarea } from '@/components/ui/textarea';
import { updateResult } from '@/services/results';
import { Button } from '@/components/ui/button';
import { useRouter, useState } from '@/hooks';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { Send, Sparkles } from 'lucide-react';
import { fetcher } from '@/lib/utils';
import { readStreamableValue } from 'ai/rsc';
import { generateEmail } from '@/services/ai';

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

  const [generation, setGeneration] = useState<string>('');
  console.log('generation', generation);

  const lastMessage = result.lastMessage
    ? (JSON.parse(result.lastMessage) as EmailFormValues)
    : null;

  const form = useForm<EmailFormValues>({
    defaultValues: lastMessage
      ? lastMessage
      : {
          subject: '',
          content: '',
        },
  });

  const handleGenerate = async () => {
    try {
      setIsLoading(true);

      const { object } = await generateEmail({
        result: result.result,
        engineName: result.engineName,
        resultCategory: result.category || 'malicious',
        projectDomain: project.domain,
      });

      for await (const partialObject of readStreamableValue(object)) {
        if (partialObject) {
          setGeneration(JSON.stringify(partialObject.notifications, null, 2));
        }
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error generating email:', error);
      setIsLoading(false);
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
      return isLoading ? 'Regenerating...' : 'Regenerate';
    }

    return isLoading ? 'Generating...' : 'Generate';
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
              <Input placeholder="Subject" {...form.register('subject')} />
            </div>
            <div className="grid gap-2">
              <Textarea
                placeholder="Content"
                className="h-[200px]"
                {...form.register('content')}
              />
              {generation}
            </div>
          </div>

          <DialogFooter>
            <div className="flex w-full justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handleGenerate}
                disabled={isLoading}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                {makeGenerateLabel()}
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={form.handleSubmit(handleSaveForLater)}
                >
                  Save for later
                </Button>
                <Button type="submit">
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
