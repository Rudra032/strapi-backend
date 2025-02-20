import React from 'react';
// @ts-ignore
import { Button } from '@strapi/design-system';
import { unstable_useContentManagerContext as useContentManagerContext } from '@strapi/strapi/admin';

const PreviewButton = ({env}) => {
  console.log('PreviewButton component rendered');

  const { form, contentType } = useContentManagerContext();
  const { values } = form;
 


  const handlePreview = () => {
    console.log('handlePreview function called');

    const slug = values.slug || '';
    const contentTypeSlug = contentType.apiID;
    // const frontendUrl =  process.env.FRONTEND_URL;
    // const previewSecret = process.env.NEXT_PUBLIC_PREVIEW_SECRET;
    // console.log('process.env.NEXT_PUBLIC_PREVfdIEW_SECRET',  env('FRONTEND_URL')); 

    const previewUrl = `http://localhost:3000/api/preview?secret=mySuperSecret123&slug=${slug}&contentType=${contentTypeSlug}`;
    console.log('Preview URL:', previewUrl); 
    window.open(previewUrl, '_blank');
  };

  return <Button onClick={handlePreview}>Preview</Button>;
};

export default {
  bootstrap(app) {
    app.getPlugin('content-manager').injectComponent('editView', 'right-links', {
      name: 'PreviewButton',
      Component: PreviewButton,
    });
  },
};