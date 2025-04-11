import { useEffect } from 'react';

function SEO({ title, description, schemaData }) {
  useEffect(() => {
    // Update document title
    if (title) {
      document.title = title;
    }
    
    // Update meta description
    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.name = 'description';
        document.head.appendChild(metaDescription);
      }
      metaDescription.content = description;
    }
    
    // Add schema.org JSON-LD
    if (schemaData) {
      let schemaScript = document.querySelector('#schema-script');
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.id = 'schema-script';
        schemaScript.type = 'application/ld+json';
        document.head.appendChild(schemaScript);
      }
      schemaScript.textContent = JSON.stringify(schemaData);
    }
    
    // Cleanup function
    return () => {
      if (schemaData) {
        const schemaScript = document.querySelector('#schema-script');
        if (schemaScript) {
          schemaScript.remove();
        }
      }
    };
  }, [title, description, schemaData]);
  
  return null; // This component doesn't render anything
}

export default SEO;