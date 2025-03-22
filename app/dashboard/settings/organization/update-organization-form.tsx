'use client';

import { updateOrganization } from '@/actions/organization';
import { TenantWithPayload } from '@/types';
import { useEffect, useForm } from '@/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { z } from 'zod';

const formSchema = z.object({
  name: z.string().min(1, 'Organization name is required'),
});

type Inputs = z.infer<typeof formSchema>;

type Props = {
  data: TenantWithPayload;
};

export function UpdateOrganizationForm({ data }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data.name,
    },
  });

  useEffect(() => {
    reset({
      name: data.name,
    });
  }, [data]);

  const onSubmit = async (values: Inputs) => {
    try {
      await updateOrganization(data.id, values);
    } catch (error) {
      console.error('Error updating organization');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="name">Organization Name</Label>
        <div className="flex gap-2">
          <Input
            id="name"
            {...register('name')}
            placeholder="Enter organization name"
            className="flex-1"
          />
          <Button type="submit" className="shrink-0">
            Save
          </Button>
        </div>
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>
    </form>
  );
}
