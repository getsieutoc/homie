'use client';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth, useEffect, useForm } from '@/hooks';
import { toast } from 'sonner';
import { z } from 'zod';
import { updateProfile } from '@/services/auth';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
});

type Inputs = z.infer<typeof formSchema>;

export const UpdateProfileForm = () => {
  const { session, user } = useAuth();

  const form = useForm<Inputs>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name ?? '',
    },
  });

  const {
    reset,
    formState: { isSubmitSuccessful, isSubmitting, isDirty },
  } = form;

  const onSubmit = async (values: Inputs) => {
    if (!session?.user) return;

    await updateProfile(session.user.id, values);

    toast.success('Profile updated', {
      description: 'Your profile has been successfully updated.',
    });
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        name: user?.name ?? '',
      });
    }
  }, [user, isSubmitSuccessful]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormDescription>This is your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={!isDirty || isSubmitting} type="submit">
          Update profile
        </Button>
      </form>
    </Form>
  );
};
