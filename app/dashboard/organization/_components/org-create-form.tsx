'use client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface OrganizationFormType {
  name: string;
}

const OrganizationCreateForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<OrganizationFormType>({
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = async (data: OrganizationFormType) => {
    try {
      setLoading(true);
      // TODO: Add API call to create organization
      router.refresh();
      router.push('/dashboard/organizations');
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
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization Name</FormLabel>
              <FormControl>
                <Input
                  disabled={loading}
                  placeholder="Enter organization name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading}>
          Create Organization
        </Button>
      </form>
    </Form>
  );
};

export default OrganizationCreateForm;
