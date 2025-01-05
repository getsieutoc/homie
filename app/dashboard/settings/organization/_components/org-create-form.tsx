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
import { Modal } from '@/components/ui/modal';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

interface OrganizationFormType {
  name: string;
}

interface OrganizationCreateFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrganizationCreateForm: React.FC<OrganizationCreateFormProps> = ({
  isOpen,
  onClose,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
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
    <Modal
      title="Create Organization"
      description="Add a new organization to manage your projects"
      isOpen={isOpen}
      onClose={onClose}
    >
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
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              Create Organization
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
};
