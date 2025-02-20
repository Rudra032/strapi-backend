const getPreviewPathname = (uid, { locale, document }) => {
  const { slug } = document;

  switch (uid) {
    case "api::page.page":
      switch (slug) {
        case "homepage":
          return `/${locale}`;
        case "pricing":
        case "contact":
        case "faq":
          return `/${slug}`;
        default:
          return `/${slug}`;
      }
    case "api::product.product":
      return slug ? `/products/${slug}` : "/products";
    case "api::article.article":
      return slug ? `/blog/${slug}` : "/blog";
    default:
      return null;
  }
};

module.exports = ({ env }) => ({
  
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
  frontendUrl: env('FRONTEND_URL'),
  previewSecret: env('NEXT_PUBLIC_PREVIEW_SECRET'),
  preview: {
    enabled: true,
    config: {
      allowedOrigins: [env("FRONTEND_URL")],
      async handler(uid, { documentId, locale, status }) {
        console.log('Preview handler called with:', { uid, documentId, locale, status }, 
         
        );
        console.log('FRONTEND_URL:', env('FRONTEND_URL'));
        console.log('NEXT_PUBLIC_PREVIEW_SECRET:', env('NEXT_PUBLIC_PREVIEW_SECRET'));
        if (!documentId) {
          console.error('documentId is undefined');
          return null;
        }

        try {
          const document = await strapi.documents(uid).findOne({ documentId });
          console.log('Fetched document:', document);

          if (!document) {
            console.error('Document not found');
            return null;
          }

          const pathname = getPreviewPathname(uid, { locale, document });

          if (!pathname) {
            console.error('Preview pathname not generated');
            return null;
          }

          const urlSearchParams = new URLSearchParams({
            url: pathname,
            secret: env("NEXT_PUBLIC_PREVIEW_SECRET"),
            status,
          });

          return `${env("FRONTEND_URL")}/api/preview?${urlSearchParams}`;
        } catch (error) {
          console.error('Error in preview handler:', error);
          return null;
        }
      },
    },
  },
});