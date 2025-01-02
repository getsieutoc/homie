'use client';

import { Button } from '../../../../components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../../components/ui/form';
import { Input } from '../../../../components/ui/input';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface ProfileFormProps {
  categories: string[];
  initialData: any | null;
}

interface ProfileFormType {
  name: string;
}

const ProfileCreateForm = ({ categories, initialData }: ProfileFormProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<ProfileFormType>({
    defaultValues: initialData || {
      name: '',
    },
  });

  const onSubmit = async (data: ProfileFormType) => {
    try {
      setLoading(true);
      // TODO: Add API call to create profile
      router.refresh();
      router.push('/dashboard/profiles');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>Profile Name</FormLabel>
              <FormControl>
                <Input disabled={loading} placeholder="Enter profile name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading}>
          Create Profile
        </Button>
      </form>
    </Form>
  );
};

export default ProfileCreateForm;
