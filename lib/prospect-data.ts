import fallbackData from '@/data/fallback.json';

export interface ProspectData {
  biz_name: string;
  biz_pitch?: string;
  industry?: string;
  contact_email?: string;
  contact_phone?: string;
  website?: string;
  address?: string;
  city?: string;
  country?: string;
}

export async function getProspectData(slug: string): Promise<ProspectData | null> {
  // Don't fetch data for the generic home slug
  if (slug === 'home') {
    return {
      biz_name: '',
      biz_pitch: 'Erleben Sie die Zukunft der Business-Automatisierung mit unseren KI-gestützten Lösungen.',
      industry: 'Technology',
    };
  }

  try {
    // Try to fetch from N8N API if URL is configured
    const n8nUrl = process.env.NEXT_PUBLIC_N8N_PROSPECT_URL;
    
    if (n8nUrl) {
      const response = await fetch(`${n8nUrl}?slug=${encodeURIComponent(slug)}`, {
        cache: 'no-store', // Don't cache for dynamic data
      });
      
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    }
  } catch (error) {
    console.warn('Failed to fetch prospect data from N8N:', error);
  }
  
  // Fallback to local data
  try {
    // Find prospect by slug in fallback data
    const prospects = fallbackData as Array<ProspectData & { slug: string }>;
    const prospect = prospects.find((p) => p.slug === slug);
    
    if (prospect) {
      return prospect;
    }
    
    // Return a generic prospect for any slug
    return {
      biz_name: slug.charAt(0).toUpperCase() + slug.slice(1).replace(/[-_]/g, ' '),
      biz_pitch: `Welcome to ${slug}! Experience our AI-powered booking system.`,
      industry: 'Service Business',
    };
    
  } catch (error) {
    console.error('Failed to read fallback data:', error);
    
    // Ultimate fallback
    return {
      biz_name: slug.charAt(0).toUpperCase() + slug.slice(1).replace(/[-_]/g, ' '),
      biz_pitch: 'Experience our AI-powered booking system.',
      industry: 'Service Business',
    };
  }
}