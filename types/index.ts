import { userIncludes, resultIncludes, tenantIncludes } from '@/lib/rich-includes';
import { getResultStats } from '@/services/results';
import { getProjects } from '@/services/projects';
import { Icons } from '@/components/icons';
import { Prisma } from '@prisma/client';
import { type ReactNode } from 'react';

export { type SearchParams } from 'nuqs/parsers';

// why it does not effect?
export * from '@prisma/client';

export type UserWithPayload = Prisma.UserGetPayload<{
  include: typeof userIncludes;
}>;

export type ResultWithPayload = Prisma.ResultGetPayload<{
  include: typeof resultIncludes;
}>;

export type TenantWithPayload = Prisma.TenantGetPayload<{
  include: typeof tenantIncludes;
}>;

export type Stats = Awaited<ReturnType<typeof getResultStats>>;

export type TriggerSchedule = Awaited<
  ReturnType<typeof getProjects>
>['schedules'][number];

export type EmailResponse = {
  subject: string;
  content: string;
};

/**
 * @T is the interface we want to reuse.
 * @R is the part we want to force.
 * The rest of T will be optional.
 */
export type OptionalExcept<T, R extends keyof T> = Partial<T> & Pick<T, R>;

export enum HttpMethod {
  CONNECT = 'CONNECT',
  DELETE = 'DELETE',
  GET = 'GET',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
  PATCH = 'PATCH',
  POST = 'POST',
  PUT = 'PUT',
  TRACE = 'TRACE',
}

export type LayoutProps = {
  children: ReactNode;
};

export interface NavItem {
  title: string;
  url: string;
  disabled?: boolean;
  external?: boolean;
  shortcut?: [string, string];
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
  isActive?: boolean;
  isAdminOnly?: boolean;
  items?: NavItem[];
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;

export type VTEngineName =
  | 'Bkav'
  | 'CRDF'
  | 'Cyan'
  | 'DNS8'
  | 'ESET'
  | 'Lumu'
  | 'Cyble'
  | 'Ermes'
  | 'IPsum'
  | 'VIPRE'
  | 'zvelo'
  | 'Abusix'
  | 'Dr.Web'
  | 'G-Data'
  | 'Lionic'
  | 'Sophos'
  | 'Acronis'
  | 'Blueliv'
  | 'Certego'
  | 'CyRadar'
  | 'Quttera'
  | 'Segasec'
  | 'Spam404'
  | 'URLhaus'
  | 'Webroot'
  | 'ZeroFox'
  | 'AlphaSOC'
  | 'AutoShun'
  | 'Emsisoft'
  | 'Fortinet'
  | 'Malwared'
  | 'Netcraft'
  | 'PREBYTES'
  | 'SOCRadar'
  | 'URLQuery'
  | 'VX Vault'
  | 'ViriBack'
  | 'ZeroCERT'
  | '0xSI_f33d'
  | 'Antiy-AVL'
  | 'CINS Army'
  | 'Cluster25'
  | 'GreenSnow'
  | 'Kaspersky'
  | 'OpenPhish'
  | 'PhishFort'
  | 'PhishLabs'
  | 'Phishtank'
  | 'Scantitan'
  | 'Seclookup'
  | 'Trustwave'
  | 'benkow.cc'
  | 'AlienVault'
  | 'Gridinsoft'
  | 'MalwareURL'
  | 'Quick Heal'
  | 'SafeToOpen'
  | 'ThreatHive'
  | 'Underworld'
  | 'ADMINUSLabs'
  | 'BitDefender'
  | 'Criminal IP'
  | 'ESTsecurity'
  | 'SecureBrain'
  | 'PrecisionSec'
  | 'SCUMWARE.org'
  | 'securolytics'
  | 'Chong Lua Dao'
  | 'MalwarePatrol'
  | 'StopForumSpam'
  | 'Threatsourcing'
  | 'EmergingThreats'
  | 'Sansec eComscan'
  | 'desenmascara.me'
  | 'Heimdal Security'
  | 'Juniper Networks'
  | 'Sucuri SiteCheck'
  | 'alphaMountain.ai'
  | 'Bfore.Ai PreCrime'
  | 'Phishing Database'
  | 'AILabs (MONITORAPP)'
  | 'CSIS Security Group'
  | 'Google Safebrowsing'
  | 'Yandex Safebrowsing'
  | 'Hunt.io Intelligence'
  | 'Snort IP sample list'
  | 'Xcitium Verdict Cloud'
  | 'CMC Threat Intelligence'
  | 'Forcepoint ThreatSeeker'
  | 'malwares.com URL checker'
  | 'Viettel Threat Intelligence'
  | 'ArcSight Threat Intelligence';

export type VTHostRecord = {
  ttl?: number;
  type?: string;
  value?: string;
  priority?: number;
};

export type VTResult = {
  method: string;
  result: 'clean' | 'unrated' | 'malicious' | 'suspicious' | 'phishing';
  category: 'undetected' | 'harmless' | 'malicious' | 'suspicious';
  engine_name: VTEngineName;
};

// NOTE: Learn more from this https://docs.virustotal.com/reference/domains-object
export type VTDomainResult = {
  data: {
    id: string;
    type?: string;
    links?: {
      self?: string;
    };
    attributes: {
      categories?: Record<string, never>;
      last_modification_date?: number;
      creation_date?: number;
      reputation?: number;
      last_https_certificate?: {
        cert_signature?: {
          signature_algorithm?: string;
          signature?: string;
        };
        extensions?: {
          key_usage?: string[];
          extended_key_usage?: string[];
          CA?: boolean;
          subject_alternative_name?: string[];
        };
        validity?: {
          not_after?: string;
          not_before?: string;
        };
        size?: number;
        version?: string;
        public_key?: {
          algorithm?: string;
          rsa?: {
            modulus?: string;
            exponent?: string;
            key_size?: number;
          };
        };
        thumbprint_sha256?: string;
        thumbprint?: string;
        serial_number?: string;
        issuer?: {
          CN?: string;
        };
        subject?: {
          CN?: string;
        };
      };
      last_https_certificate_date?: number;
      popularity_ranks?: Record<string, never>;
      tags?: string[];
      last_analysis_stats: {
        malicious?: number;
        suspicious?: number;
        undetected?: number;
        harmless?: number;
        timeout?: number;
      };
      last_analysis_results: Record<VTEngineName, VTResult>;
      tld?: string;
      jarm?: string;
      last_dns_records: Array<{
        type?: string;
        ttl?: number;
        value?: string;
        priority?: number;
        rname?: string;
        serial?: number;
        refresh?: number;
        retry?: number;
        expire?: number;
        minimum?: number;
      }>;
      last_dns_records_date?: number;
      whois?: string;
      total_votes?: {
        harmless?: number;
        malicious?: number;
      };
      last_analysis_date?: number;
      whois_date?: number;
      last_update_date?: number;
    };
  };
};

export type VTDomainError = {
  error: {
    code?: string;
    message?: string;
  };
};

export type VTDomainResponse = VTDomainResult | VTDomainError;
