import { type Project } from '@prisma/client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export type Props = {
  project: Project;
};

export function ProjectView({ project }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{project.domain}</CardTitle>
        <CardDescription>Project Details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label>Description</Label>
          <p className="text-sm text-muted-foreground">{project.description}</p>
        </div>
        <div className="grid gap-2">
          <Label>Created At</Label>
          <p className="text-sm text-muted-foreground">
            {new Date(project.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="grid gap-2">
          <Label>Last Updated</Label>
          <p className="text-sm text-muted-foreground">
            {new Date(project.updatedAt).toLocaleDateString()}
          </p>
        </div>
        <div className="grid gap-2">
          <Label>Schedule (CRON)</Label>
          <p className="text-sm text-muted-foreground">{project.cron}</p>
        </div>
      </CardContent>
    </Card>
  );
}
