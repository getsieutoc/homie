import { useState, useEffect } from 'react';
import { Organization } from '@/types';

export function useOrganizations() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [currentOrganization, setCurrentOrganization] = useState<string>();

  useEffect(() => {
    // Fetch organizations from your API
    const fetchOrganizations = async () => {
      // Implementation depends on your API
      const response = await fetch('/api/organizations');
      const data = await response.json();
      setOrganizations(data);
    };

    fetchOrganizations();
  }, []);

  const switchOrganization = async (orgId: string) => {
    // Implement organization switching logic
    setCurrentOrganization(orgId);
    // You might want to update this in your global state management solution
  };

  return {
    organizations,
    currentOrganization,
    switchOrganization,
  };
}
