'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useObject, useRouter, useForm, useEffect } from '@/hooks';
import { type ResultWithPayload, type Project } from '@/types';
import { Loader2, Send, Sparkles } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { updateResultById } from '@/services/results';
import { sendEmail } from '@/services/email';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { emailSchema } from '@/lib/zod-schemas';
import { Checkbox } from '@/components/ui/checkbox';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

export type Props = {
  isOpen: boolean;
  onClose: () => void;
  result: ResultWithPayload;
  project: Project;
};

const formSchema = z.object({
  selectedEmails: z.array(z.string().email({ message: 'Must be a valid email address' })),
  subject: z.string().min(10, {
    message: 'Subject can not be too short',
  }),
  content: z.string().min(10, {
    message: 'Content can not be too short',
  }),
});

type FormInputs = z.infer<typeof formSchema>;

export const EmailModal = ({ isOpen, onClose, result, project }: Props) => {
  const router = useRouter();

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
    ? (JSON.parse(result.lastMessage) as FormInputs)
    : { subject: '', content: '' };

  const vendorEmails = result.vendor.email
    ? result.vendor.email.split(',').map((s: string) => s.trim())
    : [];

  const form = useForm<FormInputs>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...lastMessage,
      selectedEmails: vendorEmails,
    },
  });

  const {
    register,
    setValue,
    handleSubmit,
    getValues,
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

  const handleSendNow = async (data: FormInputs) => {
    try {
      if (data.selectedEmails.length > 0) {
        await sendEmail({
          to: data.selectedEmails,
          subject: data.subject,
          content: data.content,
        });
      }

      // update the dispute count and disputed at status
      await updateResultById(result.id, {
        lastMessage: JSON.stringify(data),
        disputedAt: new Date(),
        disputeCount: result.disputeCount + 1,
      });

      onClose();
      router.refresh();
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  const handleSaveForLater = async () => {
    try {
      const inputData = getValues();

      await updateResultById(result.id, {
        lastMessage: JSON.stringify(inputData),
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

        <Form {...form}>
          <form onSubmit={handleSubmit(handleSendNow)} className="space-y-4">
            <div className="grid gap-4 py-4">
              {vendorEmails.map((email: string) => (
                <FormField
                  key={email}
                  control={form.control}
                  name="selectedEmails"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={email}
                        className="flex flex-row items-center space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(email)}
                            onCheckedChange={(checked: boolean) => {
                              return checked
                                ? field.onChange([...field.value, email])
                                : field.onChange(
                                    field.value?.filter(
                                      (value: string) => value !== email
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">{email}</FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}

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
                <Button variant="success" onClick={handleGenerate} disabled={isStreaming}>
                  {isStreaming ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}

                  {makeGenerateLabel()}
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleSaveForLater}
                    variant={isDirty ? 'info' : 'outline'}
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
        </Form>
      </DialogContent>
    </Dialog>
  );
};
