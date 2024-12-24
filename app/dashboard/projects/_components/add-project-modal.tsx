'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { zodResolver } from '@hookform/resolvers/zod';
import { upsertProject } from '@/services/projects';
import { checkDomain } from '@/services/virustotal';
import { upsertResults } from '@/services/results';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { useForm } from '@/hooks';
import { useState } from 'react';
import * as z from 'zod';

const cleanDomain = (domain: string) => {
  return domain.replace(/^https?:\/\//, '').trim();
};

const formSchema = z.object({
  domain: z
    .string()
    .min(3, {
      message: 'Domain name must be at least 2 characters.',
    })
    .transform(cleanDomain),
});

type FormInputs = z.infer<typeof formSchema>;

export function AddProjectModal() {
  const [open, setOpen] = useState(false);

  const defaultValues = {
    domain: '',
  };

  const form = useForm<FormInputs>({
    resolver: zodResolver(formSchema),
    values: defaultValues,
  });

  const onSubmit = async (inputs: FormInputs) => {
    const project = await upsertProject(inputs);

    if (project) {
      setOpen(false);
      form.reset();

      const vtResponse = await checkDomain(project.domain);

      const analysisResults = Object.values(
        vtResponse.data.attributes.last_analysis_results
      );

      await upsertResults({
        results: analysisResults,
        projectId: project.id,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="default" className="text-xs md:text-sm">
          <Plus className="mr-2 h-4 w-4" /> Add New Project
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Project</DialogTitle>
        </DialogHeader>
        <Card className="mx-auto w-full border-0 shadow-none">
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="domain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Domain Name (without protocol)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter domain name without http or https"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(cleanDomain(value));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit">Create Project</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
